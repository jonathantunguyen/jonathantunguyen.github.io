"use client";

import { ChevronDown } from "lucide-react";
import { FileIcon } from "@/components/icon-map";
import { workspaceName } from "@/data/profile";
import { files } from "@/lib/files";
import { useIde } from "@/lib/ide-store";
import { useUi } from "@/lib/locale-context";
import { cn } from "@/lib/utils";

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
