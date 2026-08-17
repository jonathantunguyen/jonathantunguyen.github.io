"use client";

import { PanelLeft, PanelRight, Search, Sparkles } from "lucide-react";
import { MenuBar } from "@/components/ide/menu-bar";
import { useIde } from "@/lib/ide-store";
import { workspaceName } from "@/data/profile";
import { otherLocalePath, useLocale, useUi } from "@/lib/locale-context";

export function TitleBar() {
  const togglePanel = useIde((s) => s.togglePanel);
  const setQuickOpenOpen = useIde((s) => s.setQuickOpenOpen);
  const ui = useUi();
  const locale = useLocale();

  return (
    <header className="border-border bg-chrome flex h-9 shrink-0 items-center gap-3 border-b px-3">
      {/* Window controls — decorative. */}
      <div aria-hidden className="hidden items-center gap-2 sm:flex">
        <span className="size-3 rounded-full bg-[#ff5f57]" />
        <span className="size-3 rounded-full bg-[#febc2e]" />
        <span className="size-3 rounded-full bg-[#28c840]" />
      </div>

      {/* Panel toggles — the only chrome controls that matter on small screens. */}
      <div className="flex items-center gap-1 sm:hidden">
        <button
          type="button"
          onClick={() => togglePanel("explorer")}
          className="text-muted-foreground hover:bg-hover hover:text-foreground focus-visible:ring-ring rounded p-1.5 focus-visible:ring-2 focus-visible:outline-none"
          aria-label={ui.chrome.toggleExplorer}
        >
          <PanelLeft className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => togglePanel("copilot")}
          className="text-muted-foreground hover:bg-hover hover:text-foreground focus-visible:ring-ring rounded p-1.5 focus-visible:ring-2 focus-visible:outline-none"
          aria-label={ui.chrome.toggleAssistant}
        >
          <PanelRight className="size-4" />
        </button>
      </div>

      <MenuBar />

      <button
        type="button"
        onClick={() => togglePanel("copilot")}
        className="text-muted-foreground hover:text-foreground focus-visible:ring-ring hidden items-center gap-1 rounded text-xs focus-visible:ring-2 focus-visible:outline-none md:flex"
      >
        <Sparkles className="size-3" />
        {ui.chrome.assistant}
      </button>

      {/* Quick-open trigger, styled like the VS Code command centre. */}
      <button
        type="button"
        onClick={() => setQuickOpenOpen(true)}
        className="border-border bg-editor/70 text-muted-foreground hover:border-brand/40 hover:text-foreground focus-visible:ring-ring mx-auto flex h-6 max-w-md flex-1 items-center justify-center gap-2 rounded-md border px-3 text-xs focus-visible:ring-2 focus-visible:outline-none"
      >
        <Search className="text-brand size-3" />
        <span className="truncate">
          {workspaceName} <span className="text-muted-foreground/60">:</span>{" "}
          portfolio
        </span>
        <kbd className="border-border bg-chrome text-muted-foreground/80 ml-1 hidden rounded border px-1 text-[10px] sm:inline">
          Ctrl
        </kbd>
        <kbd className="border-border bg-chrome text-muted-foreground/80 hidden rounded border px-1 text-[10px] sm:inline">
          P
        </kbd>
      </button>

      {/* Language switch. Duplicated from the status bar on purpose: top-right
          is where visitors look for one, and a status-bar icon is too quiet. */}
      <a
        href={otherLocalePath(locale)}
        hrefLang={locale === "en" ? "fr" : "en"}
        onClick={(event) => {
          const hash = window.location.hash;
          if (hash) {
            event.preventDefault();
            window.location.href = otherLocalePath(locale, hash);
          }
        }}
        title={ui.chrome.switchLanguage}
        className="border-border text-muted-foreground hover:border-brand/40 hover:text-foreground focus-visible:ring-ring shrink-0 rounded border px-1.5 py-0.5 text-[10px] tracking-wide focus-visible:ring-2 focus-visible:outline-none"
      >
        {ui.chrome.languageSwitch}
      </a>
    </header>
  );
}
