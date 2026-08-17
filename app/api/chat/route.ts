import Anthropic from "@anthropic-ai/sdk";
import { cannedAnswer } from "@/lib/chat-fallback";
import { defaultLocale, isLocale, ui, type Locale } from "@/lib/i18n";
import { systemPrompt } from "@/lib/portfolio-context";

export const runtime = "nodejs";

const MODEL = "claude-opus-5";
/** Visitor messages allowed per window, per IP. */
const RATE_LIMIT = 10;
const WINDOW_MS = 60 * 60 * 1000;
/** Longest single question we'll accept. */
const MAX_INPUT_CHARS = 1500;
/** Turns of history sent to the model (user + assistant combined). */
const MAX_HISTORY = 12;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

/**
 * In-memory limiter. Per-instance and cleared on redeploy — enough to stop a
 * bored visitor from burning tokens, not a security control. Swap in Redis or
 * Vercel KV if this ever needs to hold across instances.
 */
const hits = new Map<string, { count: number; resetAt: number }>();

function rateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = hits.get(ip);

  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    // Opportunistic sweep so the map can't grow without bound.
    if (hits.size > 5000) {
      for (const [key, value] of hits) if (now > value.resetAt) hits.delete(key);
    }
    return { allowed: true, remaining: RATE_LIMIT - 1 };
  }

  if (entry.count >= RATE_LIMIT) return { allowed: false, remaining: 0 };

  entry.count += 1;
  return { allowed: true, remaining: RATE_LIMIT - entry.count };
}

function clientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

function textStream(text: string, remaining: number): Response {
  return new Response(text, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-RateLimit-Remaining": String(remaining),
    },
  });
}

const apiKey = process.env.ANTHROPIC_API_KEY;
if (!apiKey) {
  console.warn(
    "[chat] ANTHROPIC_API_KEY is not set — the assistant will serve canned answers.",
  );
}

const client = apiKey ? new Anthropic({ apiKey }) : null;

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
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

  const messages: ChatMessage[] = [];
  for (const item of raw) {
    const role = (item as ChatMessage)?.role;
    const content = (item as ChatMessage)?.content;
    if ((role !== "user" && role !== "assistant") || typeof content !== "string") {
      return Response.json({ error: "Malformed message." }, { status: 400 });
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
  if (last.content.length > MAX_INPUT_CHARS) {
    return Response.json(
      { error: strings.tooLong(MAX_INPUT_CHARS) },
      { status: 413 },
    );
  }

  const { allowed, remaining } = rateLimit(clientIp(req));
  if (!allowed) {
    return Response.json(
      { error: strings.rateLimited },
      { status: 429, headers: { "X-RateLimit-Remaining": "0" } },
    );
  }

  // No key configured: serve the keyword-matched answer instead of failing.
  if (!client) {
    return textStream(cannedAnswer(last.content, locale), remaining);
  }

  // Keep only the most recent turns; the brief carries the facts, not the history.
  const history = messages.slice(-MAX_HISTORY);

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const modelStream = client.messages.stream({
          model: MODEL,
          max_tokens: 2048,
          // Adaptive thinking stays on (the default on this model); `low` effort
          // keeps a short factual answer from turning into a long deliberation.
          output_config: { effort: "low" },
          system: [
            {
              type: "text",
              text: systemPrompt(locale),
              // The brief is identical on every request, so cache it.
              cache_control: { type: "ephemeral" },
            },
          ],
          messages: history,
        });

        for await (const event of modelStream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }

        const final = await modelStream.finalMessage();
        if (final.stop_reason === "refusal") {
          controller.enqueue(encoder.encode(strings.refused));
        }
      } catch (error) {
        console.error("[chat] stream failed", error);
        controller.enqueue(encoder.encode(strings.failed));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-RateLimit-Remaining": String(remaining),
    },
  });
}
