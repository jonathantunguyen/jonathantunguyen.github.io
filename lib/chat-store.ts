"use client";

import { create } from "zustand";
import { cannedAnswer } from "@/lib/chat-fallback";
import { ui, type Locale } from "@/lib/i18n";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

/**
 * Where to send questions.
 *
 * This branch ships a server, so it defaults to the app's own route. Override
 * it to call a chat API hosted elsewhere — that's how the static `master`
 * branch can borrow this one's endpoint. Set it to an empty string to force the
 * offline keyword index in `lib/chat-fallback.ts`.
 */
// Trailing slash is deliberate: `trailingSlash: true` makes Next 308-redirect
// "/api/chat" to "/api/chat/", so omitting it costs a round trip on every
// message and breaks any client that does not follow redirects.
const endpoint = process.env.NEXT_PUBLIC_CHAT_ENDPOINT ?? "/api/chat/";

export const hasChatEndpoint = Boolean(endpoint);

/** Mirrors RATE_LIMIT in the chat route; only meaningful when one exists. */
const CLIENT_LIMIT = 10;

interface ChatState {
  messages: ChatMessage[];
  /** True from submit until the answer is complete. */
  streaming: boolean;
  /** Pre-flight failures (rate limit, bad request) shown above the composer. */
  error: string | null;
  /** Server's remaining-message count; null when there's no server. */
  remaining: number | null;

  send: (question: string, locale: Locale) => Promise<void>;
  reset: () => void;
}

let nextId = 0;
const makeId = () => `m${nextId++}`;

export const useChat = create<ChatState>((set, get) => ({
  messages: [],
  streaming: false,
  error: null,
  remaining: null,

  reset: () => set({ messages: [], error: null, streaming: false }),

  send: async (question, locale) => {
    const text = question.trim();
    if (!text || get().streaming) return;

    const userMessage: ChatMessage = {
      id: makeId(),
      role: "user",
      content: text,
    };
    const replyId = makeId();

    // Optimistically render the question and an empty reply to stream into.
    const history = [...get().messages, userMessage];
    set({
      messages: [...history, { id: replyId, role: "assistant", content: "" }],
      streaming: true,
      error: null,
    });

    const appendToReply = (chunk: string) =>
      set((state) => ({
        messages: state.messages.map((m) =>
          m.id === replyId ? { ...m, content: m.content + chunk } : m,
        ),
      }));

    const strings = ui(locale).assistant;

    // Static build: answer locally, revealed a few words at a time so the panel
    // behaves the way it does against a real model.
    if (!endpoint) {
      const answer = cannedAnswer(text, locale);
      const words = answer.split(" ");
      for (let i = 0; i < words.length; i += 3) {
        await new Promise((resolve) => setTimeout(resolve, 45));
        appendToReply((i === 0 ? "" : " ") + words.slice(i, i + 3).join(" "));
      }
      set({ streaming: false });
      return;
    }

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale,
          messages: history.map(({ role, content }) => ({ role, content })),
        }),
      });

      const remainingHeader = response.headers.get("X-RateLimit-Remaining");
      if (remainingHeader !== null) {
        set({ remaining: Number(remainingHeader) });
      }

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        // Drop the empty placeholder — there's nothing to stream into it.
        set((state) => ({
          messages: state.messages.filter((m) => m.id !== replyId),
          error: payload?.error ?? strings.unavailable,
          streaming: false,
          remaining: response.status === 429 ? 0 : state.remaining,
        }));
        return;
      }

      if (!response.body) {
        appendToReply(await response.text());
        set({ streaming: false });
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        appendToReply(decoder.decode(value, { stream: true }));
      }
      set({ streaming: false });
    } catch {
      set((state) => ({
        messages: state.messages.filter((m) => m.id !== replyId),
        error: strings.unreachable,
        streaming: false,
      }));
    }
  },
}));

export { CLIENT_LIMIT };
