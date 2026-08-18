/**
 * The models behind the assistant, behind one interface.
 *
 * Server-only — imported by `app/api/chat/route.ts`. Both providers get the
 * same brief from `lib/portfolio-context.ts` and both yield plain text chunks,
 * so the route never learns which one answered.
 *
 * Gemini is the default. Set `CHAT_PROVIDER=anthropic` to switch. Whichever is
 * chosen, a missing key falls back to the other rather than failing the
 * request, and if neither is configured the route serves the keyword index in
 * `lib/chat-fallback.ts`.
 */

import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenAI, ThinkingLevel, type ThinkingConfig } from "@google/genai";
import { ui, type Locale } from "@/lib/i18n";
import { systemPrompt } from "@/lib/portfolio-context";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export const providerIds = ["gemini", "anthropic"] as const;
export type ProviderId = (typeof providerIds)[number];

export const defaultProvider: ProviderId = "gemini";

/** Answers are short and factual; this is a ceiling, not a target. */
const MAX_TOKENS = 2048;

const GEMINI_MODEL = process.env.GEMINI_MODEL?.trim() || "gemini-3.7-flash";
const ANTHROPIC_MODEL =
  process.env.ANTHROPIC_MODEL?.trim() || "claude-opus-5";

interface StreamArgs {
  locale: Locale;
  history: ChatMessage[];
}

export interface ChatProvider {
  id: ProviderId;
  model: string;
  /**
   * Yields the answer as it arrives. A refusal or safety block yields the
   * locale's refusal line instead of throwing, so the visitor sees a sentence
   * rather than an empty bubble.
   */
  stream(args: StreamArgs): AsyncGenerator<string, void, void>;
}

/* ------------------------------------------------------------------ *
 * Gemini
 * ------------------------------------------------------------------ */

/**
 * Thinking is configured differently per model family, and sending the wrong
 * field is a 400 — so only send one when the model is recognised. `*-latest`
 * aliases and anything unknown keep the model's own default.
 */
function geminiThinking(model: string): ThinkingConfig | undefined {
  if (model.startsWith("gemini-3")) return { thinkingLevel: ThinkingLevel.LOW };
  if (model.startsWith("gemini-2.5-flash")) return { thinkingBudget: 0 };
  return undefined;
}

const blockedFinishReasons = new Set([
  "SAFETY",
  "BLOCKLIST",
  "PROHIBITED_CONTENT",
  "SPII",
  "RECITATION",
]);

function geminiProvider(apiKey: string): ChatProvider {
  const client = new GoogleGenAI({ apiKey });

  return {
    id: "gemini",
    model: GEMINI_MODEL,
    async *stream({ locale, history }) {
      const response = await client.models.generateContentStream({
        model: GEMINI_MODEL,
        // Gemini names the assistant turn "model"; everything else matches.
        contents: history.map(({ role, content }) => ({
          role: role === "assistant" ? "model" : "user",
          parts: [{ text: content }],
        })),
        config: {
          systemInstruction: systemPrompt(locale),
          maxOutputTokens: MAX_TOKENS,
          thinkingConfig: geminiThinking(GEMINI_MODEL),
        },
      });

      let produced = false;
      let blocked = false;

      for await (const chunk of response) {
        if (chunk.promptFeedback?.blockReason) blocked = true;

        const finishReason = chunk.candidates?.[0]?.finishReason;
        if (finishReason && blockedFinishReasons.has(finishReason)) {
          blocked = true;
        }

        const text = chunk.text;
        if (text) {
          produced = true;
          yield text;
        }
      }

      // Only speak up if the block cost us the answer; a trailing safety flag
      // after a complete reply isn't worth contradicting.
      if (blocked && !produced) yield ui(locale).assistant.refused;
    },
  };
}

/* ------------------------------------------------------------------ *
 * Claude
 * ------------------------------------------------------------------ */

function anthropicProvider(apiKey: string): ChatProvider {
  const client = new Anthropic({ apiKey });

  return {
    id: "anthropic",
    model: ANTHROPIC_MODEL,
    async *stream({ locale, history }) {
      const modelStream = client.messages.stream({
        model: ANTHROPIC_MODEL,
        max_tokens: MAX_TOKENS,
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
          yield event.delta.text;
        }
      }

      const final = await modelStream.finalMessage();
      if (final.stop_reason === "refusal") yield ui(locale).assistant.refused;
    },
  };
}

/* ------------------------------------------------------------------ *
 * Selection
 * ------------------------------------------------------------------ */

function isProviderId(value: unknown): value is ProviderId {
  return (
    typeof value === "string" &&
    (providerIds as readonly string[]).includes(value)
  );
}

const keys: Record<ProviderId, string | undefined> = {
  gemini: process.env.GEMINI_API_KEY?.trim(),
  anthropic: process.env.ANTHROPIC_API_KEY?.trim(),
};

const factories: Record<ProviderId, (apiKey: string) => ChatProvider> = {
  gemini: geminiProvider,
  anthropic: anthropicProvider,
};

const envName: Record<ProviderId, string> = {
  gemini: "GEMINI_API_KEY",
  anthropic: "ANTHROPIC_API_KEY",
};

/**
 * Picks a provider once, at module load. Returns null when no key is
 * configured, which is the route's signal to serve canned answers.
 */
function selectProvider(): ChatProvider | null {
  const requested = process.env.CHAT_PROVIDER?.trim().toLowerCase();
  if (requested && !isProviderId(requested)) {
    console.warn(
      `[chat] CHAT_PROVIDER="${requested}" is not one of ${providerIds.join(", ")} — using ${defaultProvider}.`,
    );
  }

  const preferred = isProviderId(requested) ? requested : defaultProvider;
  const order: ProviderId[] = [
    preferred,
    ...providerIds.filter((id) => id !== preferred),
  ];

  for (const id of order) {
    const key = keys[id];
    if (!key) continue;
    if (id !== preferred) {
      console.warn(
        `[chat] ${envName[preferred]} is not set — falling back to ${id}.`,
      );
    }
    const provider = factories[id](key);
    console.info(`[chat] using ${provider.id} (${provider.model}).`);
    return provider;
  }

  console.warn(
    `[chat] no provider key set (${providerIds.map((id) => envName[id]).join(" or ")}) — the assistant will serve canned answers.`,
  );
  return null;
}

export const provider = selectProvider();
