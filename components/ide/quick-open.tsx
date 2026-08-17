"use client";

import { useMemo, useState } from "react";
import { CornerDownLeft } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { FileIcon } from "@/components/icon-map";
import { files } from "@/lib/files";
import { useIde } from "@/lib/ide-store";
import { useUi } from "@/lib/locale-context";
import { cn } from "@/lib/utils";

/**
 * The palette's own state lives here rather than in `QuickOpen` so that it
 * mounts fresh on every open — no effect needed to clear the last search.
 */
function Palette({ onClose }: { onClose: () => void }) {
  const openFile = useIde((s) => s.openFile);
  const ui = useUi();
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return files;
    return files.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        f.label.toLowerCase().includes(q) ||
        f.path.join("/").toLowerCase().includes(q),
    );
  }, [query]);

  const choose = (index: number) => {
    const file = matches[index];
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
            setCursor((c) => Math.min(c + 1, matches.length - 1));
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setCursor((c) => Math.max(c - 1, 0));
          } else if (e.key === "Enter") {
            e.preventDefault();
            choose(cursor);
          }
        }}
        placeholder={ui.quickOpen.placeholder}
        aria-label={ui.quickOpen.title}
        className="border-border placeholder:text-muted-foreground/70 w-full border-b bg-transparent px-4 py-3 text-sm outline-none"
      />

      <ul className="max-h-72 overflow-y-auto py-1">
        {matches.length === 0 && (
          <li className="text-muted-foreground px-4 py-3 text-xs">
            {ui.quickOpen.empty}
          </li>
        )}
        {matches.map((file, i) => (
          <li key={file.id}>
            <button
              type="button"
              onMouseEnter={() => setCursor(i)}
              onClick={() => choose(i)}
              className={cn(
                "flex w-full items-center gap-2 px-4 py-2 text-left text-[13px]",
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
      </ul>
    </>
  );
}

/** Ctrl/⌘+P file switcher. */
export function QuickOpen() {
  const open = useIde((s) => s.quickOpenOpen);
  const setOpen = useIde((s) => s.setQuickOpenOpen);
  const ui = useUi();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        showCloseButton={false}
        className="bg-chrome border-border top-24 max-w-lg translate-y-0 gap-0 border p-0 sm:max-w-lg"
      >
        <DialogTitle className="sr-only">{ui.quickOpen.title}</DialogTitle>
        <DialogDescription className="sr-only">
          {ui.quickOpen.description}
        </DialogDescription>
        {open && <Palette onClose={() => setOpen(false)} />}
      </DialogContent>
    </Dialog>
  );
}
