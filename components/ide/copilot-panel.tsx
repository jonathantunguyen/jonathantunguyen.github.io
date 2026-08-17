"use client";

import { useState } from "react";
import { RotateCcw, SendHorizontal, Sparkles, X } from "lucide-react";
import {
  Message,
  MessageContent,
  MessageHeader,
} from "@/components/ui/message";
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import { Button } from "@/components/ui/button";
import { profile } from "@/data/profile";
import { CLIENT_LIMIT, useChat } from "@/lib/chat-store";
import { useIde } from "@/lib/ide-store";
import { useLocale, useUi } from "@/lib/locale-context";
import type { Dictionary } from "@/lib/i18n";

function Greeting({
  ui,
  onPick,
}: {
  ui: Dictionary;
  onPick: (prompt: string) => void;
}) {
  return (
    <div className="flex flex-col items-center px-4 pt-8 text-center">
      <span className="bg-brand-2/15 ring-brand-2/30 flex size-14 items-center justify-center rounded-full ring-1">
        <Sparkles className="text-brand-2 size-6" aria-hidden />
      </span>
      <h2 className="font-sans mt-4 text-base font-semibold">
        {ui.assistant.greetingTitle}
      </h2>
      <p className="text-muted-foreground font-sans mt-2 text-sm">
        {ui.assistant.greetingBody}
      </p>

      <ul className="mt-6 grid w-full gap-2 sm:grid-cols-2">
        {ui.assistant.prompts.map((prompt) => (
          <li key={prompt}>
            <button
              type="button"
              onClick={() => onPick(prompt)}
              className="border-border hover:border-brand-2/50 hover:bg-hover focus-visible:ring-ring font-sans flex h-full w-full items-start gap-2 rounded-md border px-3 py-2.5 text-left text-xs focus-visible:ring-2 focus-visible:outline-none"
            >
              <Sparkles
                className="text-brand-2 mt-0.5 size-3 shrink-0"
                aria-hidden
              />
              {prompt}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function CopilotPanel({ onClose }: { onClose: () => void }) {
  const [draft, setDraft] = useState("");
  const messages = useChat((s) => s.messages);
  const streaming = useChat((s) => s.streaming);
  const error = useChat((s) => s.error);
  const remaining = useChat((s) => s.remaining);
  const send = useChat((s) => s.send);
  const reset = useChat((s) => s.reset);
  const openFile = useIde((s) => s.openFile);
  const ui = useUi();
  const locale = useLocale();

  const submit = (text: string) => {
    if (!text.trim() || streaming) return;
    setDraft("");
    void send(text, locale);
  };

  const outOfMessages = remaining === 0;

  return (
    <div className="bg-sidebar flex h-full min-h-0 flex-col">
      {/* Header */}
      <div className="border-border flex h-9 shrink-0 items-center gap-2 border-b px-3">
        <Sparkles className="text-brand-2 size-4 shrink-0" aria-hidden />
        <h2 className="font-sans truncate text-xs font-semibold">
          {ui.chrome.assistant}
        </h2>
        <div className="ml-auto flex items-center gap-0.5">
          {messages.length > 0 && (
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={reset}
              aria-label={ui.assistant.newConversation}
            >
              <RotateCcw />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={onClose}
            aria-label={ui.assistant.closePanel}
          >
            <X />
          </Button>
        </div>
      </div>

      {/* What the assistant can see — the honest version of a "workspace" chip. */}
      <div className="border-border text-muted-foreground flex shrink-0 items-center gap-2 border-b px-3 py-2 text-[10px] tracking-[0.18em] uppercase">
        {ui.assistant.context}
        <button
          type="button"
          onClick={() => openFile("readme")}
          className="border-brand-2/40 text-brand-2 hover:bg-brand-2/10 focus-visible:ring-ring rounded-full border px-2 py-0.5 text-[10px] tracking-normal normal-case focus-visible:ring-2 focus-visible:outline-none"
        >
          {ui.assistant.contextValue}
        </button>
      </div>

      {/* Conversation */}
      <div className="min-h-0 flex-1">
        {messages.length === 0 ? (
          <div className="h-full overflow-y-auto pb-4">
            <Greeting ui={ui} onPick={submit} />
          </div>
        ) : (
          <MessageScrollerProvider>
            <MessageScroller>
              <MessageScrollerViewport>
                <MessageScrollerContent className="gap-4 px-3 py-4">
                  {messages.map((message, i) => (
                    <MessageScrollerItem
                      key={message.id}
                      scrollAnchor={i === messages.length - 1}
                    >
                      <Message
                        align={message.role === "user" ? "end" : "start"}
                      >
                        <MessageContent>
                          {message.role === "assistant" && (
                            <MessageHeader className="font-sans">
                              {ui.assistant.role}
                            </MessageHeader>
                          )}
                          <Bubble
                            variant={
                              message.role === "user" ? "default" : "muted"
                            }
                            align={message.role === "user" ? "end" : "start"}
                          >
                            <BubbleContent className="font-sans text-sm leading-relaxed whitespace-pre-wrap">
                              {message.content ||
                                (streaming ? (
                                  <span className="text-muted-foreground">
                                    {ui.assistant.thinking}
                                    <span className="caret">…</span>
                                  </span>
                                ) : null)}
                            </BubbleContent>
                          </Bubble>
                        </MessageContent>
                      </Message>
                    </MessageScrollerItem>
                  ))}
                </MessageScrollerContent>
              </MessageScrollerViewport>
              <MessageScrollerButton />
            </MessageScroller>
          </MessageScrollerProvider>
        )}
      </div>

      {/* Composer */}
      <div className="border-border shrink-0 border-t p-3">
        {error && (
          <p
            role="alert"
            className="text-destructive font-sans mb-2 text-xs leading-relaxed"
          >
            {error}
          </p>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit(draft);
          }}
          className="border-border focus-within:border-brand-2/50 flex flex-col gap-2 rounded-md border p-2"
        >
          <label htmlFor="copilot-input" className="sr-only">
            {ui.assistant.label}
          </label>
          <textarea
            id="copilot-input"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit(draft);
              }
            }}
            rows={2}
            maxLength={1500}
            disabled={outOfMessages}
            placeholder={
              outOfMessages
                ? ui.assistant.limitPlaceholder(profile.email)
                : ui.assistant.placeholder
            }
            className="placeholder:text-muted-foreground/70 font-sans max-h-32 min-h-10 w-full resize-none bg-transparent text-sm outline-none disabled:opacity-60"
          />
          <div className="flex items-center justify-between gap-2">
            <span className="text-muted-foreground font-sans text-[10px]">
              {remaining === null
                ? ui.assistant.perHour(CLIENT_LIMIT)
                : ui.assistant.left(remaining, CLIENT_LIMIT)}
            </span>
            <Button
              type="submit"
              size="icon-sm"
              disabled={streaming || !draft.trim() || outOfMessages}
              aria-label={ui.assistant.send}
            >
              <SendHorizontal />
            </Button>
          </div>
        </form>

        <p className="text-muted-foreground/70 font-sans mt-2 text-[10px] leading-relaxed">
          {ui.assistant.disclaimer}
        </p>
      </div>
    </div>
  );
}
