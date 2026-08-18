"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Check,
  GitBranch,
  Languages,
  Moon,
  Sparkles,
  Sun,
  XCircle,
} from "lucide-react";
import { getFile, type FileExt } from "@/lib/files";
import { useIde } from "@/lib/ide-store";
import { otherLocalePath, useLocale, useUi } from "@/lib/locale-context";
import { useTheme, useThemeStore } from "@/lib/theme-store";

/** The language label VS Code would show for each of our fake files. */
const languages: Record<FileExt, string> = {
  tsx: "TypeScript React",
  ts: "TypeScript",
  js: "JavaScript",
  json: "JSON",
  html: "HTML",
  css: "CSS",
  md: "Markdown",
  pdf: "PDF",
};

function Clock() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  // Rendered only after mount so the server and client markup agree. Hidden on
  // the narrowest phones, where it was the last item and pushed the status bar
  // into a horizontal scroll.
  return (
    <span className="hidden tabular-nums min-[380px]:inline">
      {time ?? "--:--"}
    </span>
  );
}

const itemClass =
  "hover:text-foreground focus-visible:ring-ring flex items-center gap-1 rounded focus-visible:ring-2 focus-visible:outline-none";

export function StatusBar() {
  const activeFile = useIde((s) => s.activeFile);
  const copilotOpen = useIde((s) => s.copilotOpen);
  const togglePanel = useIde((s) => s.togglePanel);
  const flash = useIde((s) => s.flash);
  const ui = useUi();
  const locale = useLocale();
  const theme = useTheme();
  const toggleTheme = useThemeStore((s) => s.toggleTheme);

  const file = activeFile ? getFile(activeFile) : undefined;

  return (
    <footer className="border-border bg-chrome text-muted-foreground flex h-6 shrink-0 items-center gap-4 border-t px-3 text-[11px]">
      <span className="flex items-center gap-1.5">
        <GitBranch className="size-3" aria-hidden />
        main
      </span>
      <span className="flex items-center gap-1.5">
        <XCircle className="size-3" aria-hidden />0
        <AlertTriangle className="ml-1.5 size-3" aria-hidden />0
      </span>

      {/* Transient confirmation from a menu action. */}
      {flash && (
        <span className="text-syntax-green flex items-center gap-1.5 truncate">
          <Check className="size-3 shrink-0" aria-hidden />
          <span aria-live="polite">{flash}</span>
        </span>
      )}

      <span className="flex-1" />

      {file && <span className="hidden sm:inline">{languages[file.ext]}</span>}
      <span className="hidden sm:inline">UTF-8</span>
      <span className="hidden items-center gap-1 md:flex">
        <Check className="size-3" aria-hidden />
        Prettier
      </span>

      {/* Language switch — a real link, so the other locale is crawlable and
          the URL reflects the language. `hrefLang` tells assistive tech and
          crawlers what is on the other side. */}
      <a
        href={otherLocalePath(locale)}
        hrefLang={locale === "en" ? "fr" : "en"}
        onClick={(event) => {
          // Carry the open file across, so /#skills lands on /fr#skills.
          const hash = window.location.hash;
          if (hash) {
            event.preventDefault();
            window.location.href = otherLocalePath(locale, hash);
          }
        }}
        className={itemClass}
        title={ui.chrome.switchLanguage}
      >
        <Languages className="size-3" aria-hidden />
        {ui.chrome.languageSwitch}
      </a>

      {/* Theme switch — the colour theme's own name, not the site owner's. */}
      <button
        type="button"
        onClick={toggleTheme}
        className={`${itemClass} text-brand`}
        aria-label={
          theme === "dark" ? ui.chrome.switchToLight : ui.chrome.switchToDark
        }
        title={
          theme === "dark" ? ui.chrome.switchToLight : ui.chrome.switchToDark
        }
      >
        {theme === "dark" ? (
          <Moon className="size-3" aria-hidden />
        ) : (
          <Sun className="size-3" aria-hidden />
        )}
        <span className="hidden md:inline">
          {theme === "dark" ? ui.chrome.themeDark : ui.chrome.themeLight}
        </span>
      </button>

      <button
        type="button"
        onClick={() => togglePanel("copilot")}
        aria-pressed={copilotOpen}
        className={itemClass}
      >
        <Sparkles className="size-3" aria-hidden />
        {ui.chrome.assistant}
      </button>

      <Clock />
    </footer>
  );
}
