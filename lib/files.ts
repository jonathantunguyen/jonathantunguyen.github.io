/**
 * The "files" in the explorer are the sections of the site. This registry is
 * the single source of truth for the explorer, the tab bar, the breadcrumbs
 * and the quick-open palette.
 */

import { profile } from "@/data/profile";

export type FileExt = "tsx" | "html" | "js" | "json" | "ts" | "css" | "md" | "pdf";

export interface FileEntry {
  /** Stable key used for tab identity and the URL hash. */
  id: string;
  /** Displayed name, including extension. */
  name: string;
  ext: FileExt;
  /** Breadcrumb segments shown above the editor, workspace name excluded. */
  path: string[];
  /** A short human label used in the quick-open palette and aria labels. */
  label: string;
  /**
   * `pane` renders a section in the editor. `download` is a link out — the
   * resume — and never opens a tab.
   */
  kind: "pane" | "download";
  /** Only for `kind: "download"`. */
  href?: string;
}

export const files: FileEntry[] = [
  {
    id: "home",
    name: "home.tsx",
    ext: "tsx",
    path: ["src"],
    label: "Home",
    kind: "pane",
  },
  {
    id: "about",
    name: "about.html",
    ext: "html",
    path: ["src"],
    label: "About",
    kind: "pane",
  },
  {
    id: "projects",
    name: "projects.js",
    ext: "js",
    path: ["src"],
    label: "Projects",
    kind: "pane",
  },
  {
    id: "skills",
    name: "skills.json",
    ext: "json",
    path: ["data"],
    label: "Skills",
    kind: "pane",
  },
  {
    id: "experience",
    name: "experience.ts",
    ext: "ts",
    path: ["data"],
    label: "Experience",
    kind: "pane",
  },
  {
    id: "contact",
    name: "contact.css",
    ext: "css",
    path: ["styles"],
    label: "Contact",
    kind: "pane",
  },
  {
    id: "readme",
    name: "README.md",
    ext: "md",
    path: [],
    label: "Readme",
    kind: "pane",
  },
  {
    id: "resume",
    name: profile.resumePath.split("/").pop() ?? "resume.pdf",
    ext: "pdf",
    path: [],
    label: "Resume",
    kind: "download",
    href: profile.resumePath,
  },
];

/** Only the entries that open as editor tabs. */
export const paneFiles = files.filter((f) => f.kind === "pane");

export const defaultFileId = "home";

export function getFile(id: string): FileEntry | undefined {
  return files.find((f) => f.id === id);
}

/** `src › home.tsx` for the breadcrumb row. */
export function breadcrumb(file: FileEntry): string[] {
  return [...file.path, file.name];
}
