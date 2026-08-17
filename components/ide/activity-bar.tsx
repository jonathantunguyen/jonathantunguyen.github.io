"use client";

import {
  Download,
  Files,
  GitBranch,
  Search,
  Settings,
  Sparkles,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { profile } from "@/data/profile";
import { useIde } from "@/lib/ide-store";
import { useUi } from "@/lib/locale-context";
import { cn } from "@/lib/utils";

function Rail({
  label,
  active,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <button
            type="button"
            onClick={onClick}
            aria-label={label}
            aria-pressed={active}
            className={cn(
              "focus-visible:ring-ring relative flex size-12 items-center justify-center focus-visible:ring-2 focus-visible:outline-none",
              active
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {active && (
              <span className="bg-brand absolute left-0 h-6 w-0.5 rounded-r" />
            )}
            {children}
          </button>
        }
      />
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
}

export function ActivityBar() {
  const explorerOpen = useIde((s) => s.explorerOpen);
  const copilotOpen = useIde((s) => s.copilotOpen);
  const togglePanel = useIde((s) => s.togglePanel);
  const setQuickOpenOpen = useIde((s) => s.setQuickOpenOpen);
  const openFile = useIde((s) => s.openFile);
  const ui = useUi();

  return (
    <nav
      aria-label={ui.chrome.activityBar}
      className="border-border bg-chrome flex w-12 shrink-0 flex-col items-center justify-between border-r py-1"
    >
      <div className="flex flex-col items-center">
        <Rail
          label={ui.chrome.explorer}
          active={explorerOpen}
          onClick={() => togglePanel("explorer")}
        >
          <Files className="size-5" />
        </Rail>
        <Rail
          label={ui.chrome.quickOpen}
          onClick={() => setQuickOpenOpen(true)}
        >
          <Search className="size-5" />
        </Rail>
        <Rail
          label={ui.chrome.sourceControl}
          onClick={() => openFile("readme")}
        >
          <GitBranch className="size-5" />
        </Rail>
        <Tooltip>
          <TooltipTrigger
            render={
              <a
                href={profile.resumePath}
                download
                aria-label={ui.chrome.downloadResume}
                className="text-muted-foreground hover:text-foreground focus-visible:ring-ring flex size-12 items-center justify-center focus-visible:ring-2 focus-visible:outline-none"
              >
                <Download className="size-5" />
              </a>
            }
          />
          <TooltipContent side="right">
            {ui.chrome.downloadResume}
          </TooltipContent>
        </Tooltip>
        <Rail
          label={ui.chrome.toggleAssistant}
          active={copilotOpen}
          onClick={() => togglePanel("copilot")}
        >
          <Sparkles className="size-5" />
        </Rail>
      </div>

      <Rail label={ui.chrome.contact} onClick={() => openFile("contact")}>
        <Settings className="size-5" />
      </Rail>
    </nav>
  );
}
