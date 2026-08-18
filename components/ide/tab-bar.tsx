"use client";

import { ChevronRight, Download, Mail, X } from "lucide-react";
import { FileIcon } from "@/components/icon-map";
import { profile, workspaceName } from "@/data/profile";
import { breadcrumb, getFile } from "@/lib/files";
import { useIde } from "@/lib/ide-store";
import { useUi } from "@/lib/locale-context";
import { cn } from "@/lib/utils";

export function TabBar() {
  const openTabs = useIde((s) => s.openTabs);
  const activeFile = useIde((s) => s.activeFile);
  const setActive = useIde((s) => s.setActive);
  const closeTab = useIde((s) => s.closeTab);
  const ui = useUi();

  const active = activeFile ? getFile(activeFile) : undefined;

  return (
    <div className="shrink-0">
      <div
        role="tablist"
        aria-label={ui.chrome.openFiles}
        className="border-border bg-chrome flex h-9 items-stretch overflow-x-auto border-b"
      >
        {openTabs.map((id) => {
          const file = getFile(id);
          if (!file) return null;
          const isActive = id === activeFile;

          return (
            <div
              key={id}
              className={cn(
                "border-border group relative flex shrink-0 items-center gap-2 border-r pr-1.5 pl-3",
                isActive ? "bg-editor" : "bg-chrome hover:bg-editor/50",
              )}
            >
              {isActive && (
                <span className="bg-brand absolute inset-x-0 top-0 h-0.5" />
              )}
              <button
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(id)}
                className={cn(
                  "focus-visible:ring-ring flex items-center gap-2 py-2 text-[13px] focus-visible:ring-2 focus-visible:outline-none",
                  isActive ? "text-foreground" : "text-muted-foreground",
                )}
              >
                <FileIcon ext={file.ext} />
                {file.name}
              </button>
              <button
                type="button"
                onClick={() => closeTab(id)}
                aria-label={ui.chrome.close(file.name)}
                className={cn(
                  "hover:bg-hover focus-visible:ring-ring rounded p-0.5 focus-visible:ring-2 focus-visible:outline-none",
                  isActive
                    ? "text-muted-foreground hover:text-foreground"
                    : "text-transparent group-hover:text-muted-foreground",
                )}
              >
                <X className="size-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Breadcrumbs */}
      {active && (
        <nav
          aria-label={ui.chrome.breadcrumb}
          className="border-border bg-editor text-muted-foreground flex h-8 items-center gap-1.5 overflow-hidden border-b px-4 text-xs"
        >
          {/* The path shrinks before the actions do: on a phone the actions are
              the useful half. */}
          <span className="flex min-w-0 items-center gap-1.5 overflow-hidden">
            <span className="truncate">{workspaceName}</span>
            {breadcrumb(active).map((segment, i, all) => (
              <span key={segment} className="flex min-w-0 items-center gap-1.5">
                <ChevronRight className="size-3 shrink-0" aria-hidden />
                <span
                  className={cn(
                    "truncate",
                    i === all.length - 1 && "text-foreground/80",
                  )}
                >
                  {segment}
                </span>
              </span>
            ))}
          </span>

          {/* The résumé used to be one unlabelled glyph in the activity rail
              and the email lived inside contact.css. Both belong somewhere a
              visitor in a hurry can't miss them. */}
          <div className="ml-auto flex shrink-0 items-center gap-1 font-sans">
            <a
              href={profile.resumePath}
              download
              aria-label={ui.chrome.downloadResume}
              className="hover:text-foreground hover:bg-hover focus-visible:ring-ring flex items-center gap-1.5 rounded px-2 py-1 focus-visible:ring-2 focus-visible:outline-none"
            >
              <Download className="size-3.5 shrink-0" aria-hidden />
              <span className="hidden sm:inline">
                {ui.chrome.downloadResume}
              </span>
            </a>
            <a
              href={`mailto:${profile.email}`}
              aria-label={ui.chrome.contact}
              className="hover:text-foreground hover:bg-hover focus-visible:ring-ring flex items-center gap-1.5 rounded px-2 py-1 focus-visible:ring-2 focus-visible:outline-none"
            >
              <Mail className="size-3.5 shrink-0" aria-hidden />
              <span className="hidden sm:inline">{ui.chrome.contact}</span>
            </a>
          </div>
        </nav>
      )}
    </div>
  );
}
