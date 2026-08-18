"use client";

import { useEffect, useRef } from "react";
import { ActivityBar } from "@/components/ide/activity-bar";
import { CopilotPanel } from "@/components/ide/copilot-panel";
import { Editor } from "@/components/ide/editor";
import { Explorer } from "@/components/ide/explorer";
import { QuickOpen } from "@/components/ide/quick-open";
import { StatusBar } from "@/components/ide/status-bar";
import { TitleBar } from "@/components/ide/title-bar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import { getFile } from "@/lib/files";
import { useIde } from "@/lib/ide-store";
import { useUi } from "@/lib/locale-context";
import { appliedTheme, useThemeStore } from "@/lib/theme-store";

/** Ctrl/⌘ + P / B / J / K, matching the shortcuts listed in the readme. */
function useShortcuts() {
  const togglePanel = useIde((s) => s.togglePanel);
  const setQuickOpenOpen = useIde((s) => s.setQuickOpenOpen);
  const toggleQuick = useIde((s) => s.quickOpenOpen);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey)) return;
      const key = event.key.toLowerCase();
      if (key === "p") {
        event.preventDefault();
        setQuickOpenOpen(!toggleQuick);
      } else if (key === "o" && event.shiftKey) {
        // Go to Symbol — jumps within the files, not between them.
        event.preventDefault();
        setQuickOpenOpen(true, true);
      } else if (key === "b") {
        event.preventDefault();
        togglePanel("explorer");
      } else if (key === "j") {
        event.preventDefault();
        togglePanel("copilot");
      } else if (key === "k") {
        event.preventDefault();
        toggleTheme();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [setQuickOpenOpen, toggleTheme, togglePanel, toggleQuick]);
}

/**
 * Syncs the theme store with the class the inline script already put on
 * `<html>` before paint. The locale needs no equivalent — it comes from the
 * route, so server and client agree by construction.
 */
function usePreferences() {
  useEffect(() => {
    useThemeStore.setState({ theme: appliedTheme() });
  }, []);
}

/**
 * Keeps `#skills`-style hashes in sync with the active tab, so a pane can be
 * linked to directly and the back button moves between panes.
 */
function useHashSync() {
  const activeFile = useIde((s) => s.activeFile);
  const openFile = useIde((s) => s.openFile);

  // Open whatever the incoming URL asked for, then follow later hash changes.
  useEffect(() => {
    const applyHash = () => {
      const id = window.location.hash.replace(/^#/, "");
      if (id && getFile(id)?.kind === "pane") openFile(id);
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, [openFile]);

  // Reflect tab changes back into the URL without adding history entries.
  // Comparing against the previous value (rather than skipping the first run)
  // keeps this from overwriting an incoming hash before it's been applied.
  const previous = useRef(activeFile);
  useEffect(() => {
    if (activeFile === previous.current) return;
    previous.current = activeFile;
    if (!activeFile) return;
    if (window.location.hash === `#${activeFile}`) return;
    window.history.replaceState(null, "", `#${activeFile}`);
  }, [activeFile]);
}

export function IdeShell() {
  const explorerOpen = useIde((s) => s.explorerOpen);
  const copilotOpen = useIde((s) => s.copilotOpen);
  const mobilePanel = useIde((s) => s.mobilePanel);
  const closeMobilePanel = useIde((s) => s.closeMobilePanel);
  const togglePanel = useIde((s) => s.togglePanel);
  const ui = useUi();

  useShortcuts();
  useHashSync();
  usePreferences();

  return (
    <div className="flex h-full min-h-0 flex-col">
      <TitleBar />

      <div className="flex min-h-0 flex-1">
        <ActivityBar />

        {/* Desktop explorer. Below `lg` it lives in a slide-over instead. */}
        {explorerOpen && (
          <aside className="border-border hidden w-56 shrink-0 border-r lg:block">
            <Explorer />
          </aside>
        )}

        <Editor />

        {/* Desktop assistant. */}
        {copilotOpen && (
          <aside className="border-border hidden w-[22rem] shrink-0 border-l lg:block xl:w-[26rem]">
            <CopilotPanel onClose={() => togglePanel("copilot")} />
          </aside>
        )}
      </div>

      <StatusBar />

      <QuickOpen />

      {/* Small-screen slide-overs. */}
      <Sheet
        open={mobilePanel === "explorer"}
        onOpenChange={(open) => !open && closeMobilePanel()}
      >
        <SheetContent
          side="left"
          showCloseButton={false}
          className="bg-sidebar w-64 gap-0 p-0"
        >
          <SheetTitle className="sr-only">{ui.chrome.explorer}</SheetTitle>
          <SheetDescription className="sr-only">
            {ui.quickOpen.description}
          </SheetDescription>
          <Explorer />
        </SheetContent>
      </Sheet>

      <Sheet
        open={mobilePanel === "copilot"}
        onOpenChange={(open) => !open && closeMobilePanel()}
      >
        <SheetContent
          side="right"
          showCloseButton={false}
          className="bg-sidebar w-full gap-0 p-0 sm:max-w-md"
        >
          <SheetTitle className="sr-only">{ui.chrome.assistant}</SheetTitle>
          <SheetDescription className="sr-only">
            {ui.assistant.greetingBody}
          </SheetDescription>
          <CopilotPanel onClose={closeMobilePanel} />
        </SheetContent>
      </Sheet>
    </div>
  );
}
