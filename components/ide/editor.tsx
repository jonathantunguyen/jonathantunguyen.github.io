"use client";

import { useEffect, useRef, useState } from "react";
import { AboutPane } from "@/components/panes/about-pane";
import { ContactPane } from "@/components/panes/contact-pane";
import { ExperiencePane } from "@/components/panes/experience-pane";
import { HomePane } from "@/components/panes/home-pane";
import { MeetingPane } from "@/components/panes/meeting-pane";
import { ProjectsPane } from "@/components/panes/projects-pane";
import { ReadmePane } from "@/components/panes/readme-pane";
import { SkillsPane } from "@/components/panes/skills-pane";
import { TabBar } from "@/components/ide/tab-bar";
import { useIde } from "@/lib/ide-store";
import { useUi } from "@/lib/locale-context";

/** Panes take `active` so a pane can defer work until it's the visible one. */
const panes: Record<string, React.ComponentType<{ active?: boolean }>> = {
  home: HomePane,
  about: AboutPane,
  projects: ProjectsPane,
  skills: SkillsPane,
  experience: ExperiencePane,
  contact: ContactPane,
  meeting: MeetingPane,
  readme: ReadmePane,
};

/** Line height the gutter counts in — matches the panes' base `leading`. */
const LINE = 24;

/**
 * The gutter that makes the editor read as an editor.
 *
 * Numbers are spaced on a fixed rhythm rather than mapped to real text lines:
 * measuring every wrapped line of every heading would be a lot of machinery for
 * a decorative column. It's `aria-hidden` and never focusable, so nothing about
 * the content's meaning depends on it.
 */
function Gutter({
  contentRef,
}: {
  contentRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [lines, setLines] = useState(0);

  useEffect(() => {
    const node = contentRef.current;
    if (!node) return;

    const measure = () => setLines(Math.ceil(node.offsetHeight / LINE));
    measure();

    // Content height changes when the tab changes, a disclosure opens, or the
    // pane reflows — all three show up as a resize on the content wrapper.
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [contentRef]);

  return (
    <div
      aria-hidden
      className="border-border text-muted-foreground/35 hidden shrink-0 border-r pt-8 text-right font-mono text-xs leading-6 select-none sm:block sm:w-12 sm:pt-10"
    >
      {Array.from({ length: lines }, (_, i) => (
        <div key={i} className="pr-2">
          {i + 1}
        </div>
      ))}
    </div>
  );
}

/** Shown when every tab is closed, the way an editor shows its logo. */
function Watermark() {
  const setQuickOpenOpen = useIde((s) => s.setQuickOpenOpen);
  const ui = useUi();

  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
      <p className="text-muted-foreground/50 font-heading text-5xl">{"{ }"}</p>
      <p className="text-muted-foreground font-sans text-sm">
        {ui.editor.noFile}
      </p>
      <button
        type="button"
        onClick={() => setQuickOpenOpen(true)}
        className="text-brand hover:underline focus-visible:ring-ring rounded font-sans text-sm focus-visible:ring-2 focus-visible:outline-none"
      >
        {ui.editor.goToFile}
        <kbd className="border-border bg-chrome text-muted-foreground ml-2 rounded border px-1.5 py-0.5 font-mono text-xs">
          Ctrl P
        </kbd>
      </button>
    </div>
  );
}

export function Editor() {
  const activeFile = useIde((s) => s.activeFile);
  const scrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [atEnd, setAtEnd] = useState(true);

  // Fade at the bottom edge whenever there's more below — the stat row used to
  // sit clipped at the fold with nothing to say so.
  useEffect(() => {
    const node = scrollRef.current;
    if (!node) return;

    const update = () =>
      setAtEnd(node.scrollTop + node.clientHeight >= node.scrollHeight - 8);
    update();

    node.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(node);
    for (const child of Array.from(node.children)) observer.observe(child);
    return () => {
      node.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, [activeFile]);

  return (
    <main className="bg-editor flex min-w-0 flex-1 flex-col">
      <TabBar />
      <div className="relative flex min-h-0 flex-1">
        <div ref={scrollRef} className="min-w-0 flex-1 overflow-y-auto">
          {activeFile ? (
            <div className="flex min-h-full">
              <Gutter contentRef={contentRef} />
              <div ref={contentRef} className="min-w-0 flex-1">
                {/*
                 * Every pane is rendered and the inactive ones are hidden with
                 * CSS rather than unmounted, so a crawler fetching the page
                 * sees the projects, experience and skills content instead of
                 * only the hero.
                 */}
                {Object.entries(panes).map(([id, Component]) => (
                  <div key={id} hidden={id !== activeFile}>
                    <Component active={id === activeFile} />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <Watermark />
          )}
        </div>
        {!atEnd && (
          <div
            aria-hidden
            className="from-editor pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t to-transparent"
          />
        )}
      </div>
    </main>
  );
}
