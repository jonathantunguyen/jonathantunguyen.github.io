"use client";

import { useMemo, useState } from "react";
import { Braces, CornerDownLeft, GraduationCap, Sparkles, Wrench } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { FileIcon } from "@/components/icon-map";
import { files } from "@/lib/files";
import { useIde } from "@/lib/ide-store";
import { usePick, useUi } from "@/lib/locale-context";
import { buildSymbols, type SymbolKind } from "@/lib/symbols";
import { cn } from "@/lib/utils";

const symbolIcons: Record<SymbolKind, React.ComponentType<{ className?: string }>> = {
  role: Braces,
  project: Sparkles,
  skills: Wrench,
  education: GraduationCap,
};

/**
 * The palette's own state lives here rather than in `QuickOpen` so that it
 * mounts fresh on every open — no effect needed to clear the last search.
 *
 * Two modes, as in a real editor: files, and symbols within them. `@` switches
 * to symbols mid-search the way ⌘P → @ does in VS Code, and Ctrl/⌘+Shift+O
 * opens straight into it.
 */
function Palette({
  onClose,
  symbolMode,
}: {
  onClose: () => void;
  symbolMode: boolean;
}) {
  const openFile = useIde((s) => s.openFile);
  const ui = useUi();
  const pick = usePick();
  const [query, setQuery] = useState(symbolMode ? "@" : "");
  const [cursor, setCursor] = useState(0);

  const symbols = useMemo(() => buildSymbols(pick), [pick]);

  const inSymbolMode = query.startsWith("@");
  const term = (inSymbolMode ? query.slice(1) : query).trim().toLowerCase();

  const fileMatches = useMemo(() => {
    if (inSymbolMode) return [];
    if (!term) return files;
    return files.filter(
      (f) =>
        f.name.toLowerCase().includes(term) ||
        f.label.toLowerCase().includes(term) ||
        f.path.join("/").toLowerCase().includes(term),
    );
  }, [inSymbolMode, term]);

  const symbolMatches = useMemo(() => {
    if (!inSymbolMode) return [];
    if (!term) return symbols;
    return symbols.filter(
      (s) =>
        s.name.toLowerCase().includes(term) ||
        s.detail.toLowerCase().includes(term),
    );
  }, [inSymbolMode, symbols, term]);

  const count = inSymbolMode ? symbolMatches.length : fileMatches.length;

  const choose = (index: number) => {
    if (inSymbolMode) {
      const symbol = symbolMatches[index];
      if (!symbol) return;
      openFile(symbol.fileId);
      onClose();
      // The pane is already mounted (inactive panes are hidden, not unmounted),
      // so one frame is enough for it to become visible and be scrollable.
      requestAnimationFrame(() => {
        document
          .getElementById(symbol.anchor)
          ?.scrollIntoView({ block: "start", behavior: "smooth" });
      });
      return;
    }

    const file = fileMatches[index];
    if (!file) return;
    if (file.kind === "download") {
      window.open(file.href, "_blank", "noopener");
      onClose();
      return;
    }
    openFile(file.id);
  };

  return (
    <>
      <input
        autoFocus
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setCursor(0);
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setCursor((c) => Math.min(c + 1, count - 1));
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setCursor((c) => Math.max(c - 1, 0));
          } else if (e.key === "Enter") {
            e.preventDefault();
            choose(cursor);
          }
        }}
        placeholder={ui.quickOpen.placeholder}
        aria-label={
          inSymbolMode ? ui.quickOpen.symbolTitle : ui.quickOpen.title
        }
        className="border-border placeholder:text-muted-foreground/70 w-full border-b bg-transparent px-4 py-3 font-mono text-sm outline-none"
      />

      <ul className="max-h-72 overflow-y-auto py-1">
        {count === 0 && (
          <li className="text-muted-foreground px-4 py-3 font-sans text-xs">
            {ui.quickOpen.empty}
          </li>
        )}

        {!inSymbolMode &&
          fileMatches.map((file, i) => (
            <li key={file.id}>
              <button
                type="button"
                onMouseEnter={() => setCursor(i)}
                onClick={() => choose(i)}
                className={cn(
                  "flex w-full items-center gap-2 px-4 py-2 text-left font-mono text-[13px]",
                  i === cursor
                    ? "bg-hover text-foreground"
                    : "text-muted-foreground",
                )}
              >
                <FileIcon ext={file.ext} />
                <span>{file.name}</span>
                {file.path.length > 0 && (
                  <span className="text-muted-foreground/60 truncate text-xs">
                    {file.path.join("/")}
                  </span>
                )}
                {i === cursor && (
                  <CornerDownLeft
                    className="text-muted-foreground ml-auto size-3.5 shrink-0"
                    aria-hidden
                  />
                )}
              </button>
            </li>
          ))}

        {inSymbolMode &&
          symbolMatches.map((symbol, i) => {
            const Icon = symbolIcons[symbol.kind];
            return (
              <li key={symbol.anchor}>
                <button
                  type="button"
                  onMouseEnter={() => setCursor(i)}
                  onClick={() => choose(i)}
                  className={cn(
                    "flex w-full items-center gap-2 px-4 py-2 text-left font-mono text-[13px]",
                    i === cursor
                      ? "bg-hover text-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  <Icon className="text-brand-2 size-3.5 shrink-0" />
                  <span className="truncate">{symbol.name}</span>
                  <span className="text-muted-foreground/60 truncate text-xs">
                    {symbol.detail}
                  </span>
                  {i === cursor && (
                    <CornerDownLeft
                      className="text-muted-foreground ml-auto size-3.5 shrink-0"
                      aria-hidden
                    />
                  )}
                </button>
              </li>
            );
          })}
      </ul>

      <p className="border-border text-muted-foreground/70 border-t px-4 py-2 font-sans text-[11px]">
        {ui.quickOpen.symbolHint}
      </p>
    </>
  );
}

/** Ctrl/⌘+P file switcher, and Ctrl/⌘+Shift+O for symbols. */
export function QuickOpen() {
  const open = useIde((s) => s.quickOpenOpen);
  const setOpen = useIde((s) => s.setQuickOpenOpen);
  const symbolMode = useIde((s) => s.quickOpenSymbols);
  const ui = useUi();

  // onOpenChange is wrapped rather than passed directly: Base UI hands it event
  // details as a second argument, which setQuickOpenOpen would read as the
  // symbol-mode flag.
  return (
    <Dialog open={open} onOpenChange={(next) => setOpen(next)}>
      <DialogContent
        showCloseButton={false}
        className="bg-chrome border-border top-24 max-w-lg translate-y-0 gap-0 border p-0 sm:max-w-lg"
      >
        <DialogTitle className="sr-only">
          {symbolMode ? ui.quickOpen.symbolTitle : ui.quickOpen.title}
        </DialogTitle>
        <DialogDescription className="sr-only">
          {ui.quickOpen.description}
        </DialogDescription>
        {open && (
          <Palette onClose={() => setOpen(false)} symbolMode={symbolMode} />
        )}
      </DialogContent>
    </Dialog>
  );
}
