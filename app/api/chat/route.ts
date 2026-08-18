import { cannedAnswer } from "@/lib/chat-fallback";
import { defaultLocale, isLocale, ui, type Locale } from "@/lib/i18n";
import { provider, type ChatMessage } from "@/lib/chat-providers";
import {
  clientIp,
  dailyUsage,
  MAX_BODY_BYTES,
  MAX_HISTORY,
  MAX_INPUT_CHARS,
  MAX_TOTAL_CHARS,
  originAllowed,
  rateLimit,
  RATE_LIMIT,
  withinDailyBudget,
} from "@/lib/chat-guards";

export const runtime = "nodejs";

/** Shared by both answer paths, so neither drifts from the other. */
function answerHeaders(remaining: number): HeadersInit {
  return {
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": "no-store",
    // Answers are per-visitor; nothing should cache or index them.
    "X-Robots-Tag": "noindex",
    "X-RateLimit-Remaining": String(remaining),
    "X-RateLimit-Limit": String(RATE_LIMIT),
  };
}

function textStream(text: string, remaining: number): Response {
  return new Response(text, { headers: answerHeaders(remaining) });
}

/**
 * Checks run cheapest-first, so a hostile request is turned away before it
 * costs anything: headers, then body size, then parsing, then the counters,
 * and only then a model call.
 */
export async function POST(req: Request) {
  if (!originAllowed(req)) {
    return Response.json({ error: "Forbidden." }, { status: 403 });
  }

  // Bound the body before reading it. Content-Length is a hint a client can
  // lie about, so the decoded length is checked as well.
  const declared = Number(req.headers.get("content-length") ?? 0);
  if (declared > MAX_BODY_BYTES) {
    return Response.json({ error: "Request too large." }, { status: 413 });
  }

  const rawBody = await req.text();
  if (rawBody.length > MAX_BODY_BYTES) {
    return Response.json({ error: "Request too large." }, { status: 413 });
  }

  let body: unknown;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  // The visitor's language decides the brief, the model's reply language and
  // every error string below.
  const rawLocale = (body as { locale?: unknown })?.locale;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const strings = ui(locale).assistant;

  const raw = (body as { messages?: unknown })?.messages;
  if (!Array.isArray(raw) || raw.length === 0) {
    return Response.json({ error: "No messages provided." }, { status: 400 });
  }
  if (raw.length > 200) {
    return Response.json({ error: "Too many messages." }, { status: 413 });
  }

  const messages: ChatMessage[] = [];
  for (const item of raw) {
    const role = (item as ChatMessage)?.role;
    const content = (item as ChatMessage)?.content;
    if (
      (role !== "user" && role !== "assistant") ||
      typeof content !== "string"
    ) {
      return Response.json({ error: "Malformed message." }, { status: 400 });
    }
    // Every message is capped, not just the newest. The client supplies the
    // whole history, so capping only the last one bounds nothing.
    if (content.length > MAX_INPUT_CHARS) {
      return Response.json(
        { error: strings.tooLong(MAX_INPUT_CHARS) },
        { status: 413 },
      );
    }
    const trimmed = content.trim();
    if (trimmed) messages.push({ role, content: trimmed });
  }

  const last = messages.at(-1);
  if (!last || last.role !== "user") {
    return Response.json(
      { error: "The last message must be from the visitor." },
      { status: 400 },
    );
  }

  // Keep only the most recent turns; the brief carries the facts, not the
  // history. Trim first, then bound the total, so a long-but-legitimate
  // conversation is truncated rather than refused.
  const history = messages.slice(-MAX_HISTORY);
  const totalChars = history.reduce((sum, m) => sum + m.content.length, 0);
  if (totalChars > MAX_TOTAL_CHARS) {
    return Response.json(
      { error: strings.tooLong(MAX_INPUT_CHARS) },
      { status: 413 },
    );
  }

  // Site-wide ceiling first: a flood spread across addresses would otherwise
  // pass the per-IP check every time.
  if (!withinDailyBudget()) {
    const { used, limit } = dailyUsage();
    console.warn(`[chat] daily budget spent (${used}/${limit}) — refusing.`);
    return Response.json({ error: strings.busy }, { status: 503 });
  }

  const { allowed, remaining } = rateLimit(clientIp(req));
  if (!allowed) {
    return Response.json(
      { error: strings.rateLimited },
      { status: 429, headers: { "X-RateLimit-Remaining": "0" } },
    );
  }

  // No provider configured: serve the keyword-matched answer instead of failing.
  if (!provider) {
    return textStream(cannedAnswer(last.content, locale), remaining);
  }
  // Pinned to a local so the narrowing survives into the stream callback.
  const model = provider;

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        // `req.signal` aborts when the visitor closes the tab or navigates
        // away. Without it the model keeps generating — and billing — into a
        // response nobody is reading.
        for await (const chunk of model.stream({
          locale,
          history,
          signal: req.signal,
        })) {
          controller.enqueue(encoder.encode(chunk));
        }
      } catch (error) {
        if (req.signal.aborted) {
          // Visitor left; not an error worth logging or answering.
        } else {
          console.error(`[chat] ${model.id} stream failed`, error);
          controller.enqueue(encoder.encode(strings.failed));
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, { headers: answerHeaders(remaining) });
}
