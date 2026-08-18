/**
 * The "symbols" in this workspace: the individual roles, projects, skill groups
 * and qualifications inside the files.
 *
 * Quick open (Ctrl/⌘+P) jumps between files; Go to Symbol (Ctrl/⌘+Shift+O)
 * jumps *within* them, which is the other half of an editor's muscle memory —
 * and here the symbols are real entries rather than invented structure.
 *
 * `symbolAnchor` is shared by this registry and the panes, so the id the palette
 * scrolls to is the id a pane rendered.
 */

import { education, roles } from "@/data/experience";
import { sortedProjects } from "@/data/projects";
import { skillGroups } from "@/data/skills";
import type { L } from "@/lib/i18n";

export type SymbolKind = "role" | "project" | "skills" | "education";

export interface WorkspaceSymbol {
  /** DOM id to scroll to, also the React key. */
  anchor: string;
  kind: SymbolKind;
  name: string;
  /** Secondary line — company, period, institution. */
  detail: string;
  /** The file that contains it. */
  fileId: string;
}

/** Stable, readable DOM id: `sym-role-upslide-staff-ai-engineer`. */
export function symbolAnchor(kind: SymbolKind, key: string): string {
  const slug = key
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `sym-${kind}-${slug}`;
}

type Pick = <T>(value: L<T>) => T;

/** Built per render because every label depends on the active locale. */
export function buildSymbols(pick: Pick): WorkspaceSymbol[] {
  return [
    ...roles.map((role) => ({
      anchor: symbolAnchor("role", `${role.company}-${role.title}`),
      kind: "role" as const,
      name: role.title,
      detail: `${role.company} · ${pick(role.period)}`,
      fileId: "experience",
    })),
    ...sortedProjects.map((project) => ({
      anchor: symbolAnchor("project", pick(project.name)),
      kind: "project" as const,
      name: pick(project.name),
      detail: pick(project.period),
      fileId: "projects",
    })),
    ...skillGroups.map((group) => ({
      anchor: symbolAnchor("skills", pick(group.title)),
      kind: "skills" as const,
      name: pick(group.title),
      detail: `${group.skills.length}`,
      fileId: "skills",
    })),
    ...education.map((entry) => ({
      anchor: symbolAnchor("education", entry.institution),
      kind: "education" as const,
      name: pick(entry.qualification),
      detail: `${entry.institution} · ${pick(entry.period)}`,
      fileId: "about",
    })),
  ];
}
