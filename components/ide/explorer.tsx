"use client";

import { useEffect, useState } from "react";
import { ChevronDown, X } from "lucide-react";
import { FileIcon } from "@/components/icon-map";
import { workspaceName } from "@/data/profile";
import { files } from "@/lib/files";
import { useIde } from "@/lib/ide-store";
import { useUi } from "@/lib/locale-context";
import { cn } from "@/lib/utils";

const HINT_KEY = "portfolio-explorer-hint";

/**
 * One-time nudge that the explorer entries are the site's sections.
 *
 * The whole interaction model currently has to be inferred, and a visitor who
 * doesn't infer it sees a single page. Reads localStorage in an effect rather
 * than during render so the server and first client paint agree.
 */
function ExplorerHint() {
  const [show, setShow] = useState(false);
  const ui = useUi();

  // Read on the frame after mount rather than in the effect body: reading during
  // render would disagree with the server HTML, and setting state synchronously
  // in an effect is a cascading render.
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try {
        if (!window.localStorage.getItem(HINT_KEY)) setShow(true);
      } catch {
        // Private mode or blocked storage: skip the hint rather than break.
      }
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const dismiss = () => {
    setShow(false);
    try {
      window.localStorage.setItem(HINT_KEY, "seen");
    } catch {
      // Nothing to do — it just shows again next visit.
    }
  };

  if (!show) return null;

  return (
    <div className="border-border text-muted-foreground m-2 flex items-start gap-2 border border-dashed px-2.5 py-2 font-sans text-xs leading-relaxed">
      <p className="min-w-0">
        {ui.chrome.explorerHint}{" "}
        <kbd className="border-border bg-chrome rounded border px-1 py-0.5 font-mono text-[10px]">
          Ctrl P
        </kbd>{" "}
        {ui.chrome.explorerHintKeys}
      </p>
      <button
        type="button"
        onClick={dismiss}
        aria-label={ui.chrome.dismissHint}
        className="hover:text-foreground focus-visible:ring-ring -mr-0.5 shrink-0 rounded p-0.5 focus-visible:ring-2 focus-visible:outline-none"
      >
        <X className="size-3" aria-hidden />
      </button>
    </div>
  );
}

export function Explorer() {
  const activeFile = useIde((s) => s.activeFile);
  const openFile = useIde((s) => s.openFile);
  const ui = useUi();

  return (
    <div className="bg-sidebar flex h-full min-h-0 flex-col">
      <div className="text-muted-foreground flex h-9 shrink-0 items-center gap-1 px-4 text-[11px] font-semibold tracking-[0.18em] uppercase">
        {ui.chrome.explorer}
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto pb-2">
        <ExplorerHint />

        <div className="text-foreground/90 flex items-center gap-1 px-2 py-1 text-xs font-semibold">
          <ChevronDown className="size-3.5 shrink-0" aria-hidden />
          <span className="truncate">{workspaceName}</span>
        </div>

        <ul className="mt-0.5">
          {files.map((file) => {
            const isActive = file.id === activeFile;
            const shared =
              "group flex w-full items-center gap-2 py-[5px] pr-3 pl-7 text-left text-[13px] focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset";

            return (
              <li key={file.id}>
                {file.kind === "download" ? (
                  <a
                    href={file.href}
                    download
                    className={cn(
                      shared,
                      "text-muted-foreground hover:bg-hover hover:text-foreground",
                    )}
                  >
                    <FileIcon ext={file.ext} />
                    <span className="truncate">{file.name}</span>
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={() => openFile(file.id)}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      shared,
                      isActive
                        ? "bg-hover text-foreground"
                        : "text-muted-foreground hover:bg-hover/60 hover:text-foreground",
                    )}
                  >
                    <FileIcon ext={file.ext} />
                    <span className="truncate">{file.name}</span>
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
