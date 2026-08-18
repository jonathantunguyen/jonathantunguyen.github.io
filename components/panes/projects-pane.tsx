"use client";

import { ArrowUpRight, ChevronRight, Star } from "lucide-react";
import {
  CommentLine,
  Pane,
  SectionHeading,
} from "@/components/panes/pane-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { sortedProjects, type Project } from "@/data/projects";
import { syntaxVar } from "@/data/skills";
import { techColor } from "@/lib/tech-color";
import { symbolAnchor } from "@/lib/symbols";
import { usePick, useUi } from "@/lib/locale-context";
import type { Dictionary } from "@/lib/i18n";

/** A stack chip, tinted by what kind of technology it is. */
function TechChip({ tech }: { tech: string }) {
  const color = techColor(tech);
  return (
    <Badge
      variant="secondary"
      className="rounded-md font-mono"
      style={
        color
          ? {
              color: syntaxVar[color],
              // Tint from the same value as the text so light and dark both
              // stay legible without a second set of tokens.
              background: `color-mix(in oklab, ${syntaxVar[color]} 12%, transparent)`,
            }
          : undefined
      }
    >
      {tech}
    </Badge>
  );
}

function StackList({ stack }: { stack: string[] }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {stack.map((tech) => (
        <li key={tech}>
          <TechChip tech={tech} />
        </li>
      ))}
    </ul>
  );
}

function Highlights({ highlights }: { highlights: string[] }) {
  return (
    <ul className="flex flex-col gap-2">
      {highlights.map((highlight) => (
        <li key={highlight} className="flex gap-2 text-sm">
          <span className="text-syntax-green shrink-0" aria-hidden>
            ▸
          </span>
          <span className="text-foreground/80">{highlight}</span>
        </li>
      ))}
    </ul>
  );
}

function ProjectLinks({ links, labels }: { links: Project["links"]; labels: (label: string) => string }) {
  return (
    <>
      {links.map((link) => (
        <Button
          key={link.href}
          variant="outline"
          size="sm"
          nativeButton={false}
          render={
            <a href={link.href} target="_blank" rel="noopener noreferrer">
              {labels(link.href)}
              <ArrowUpRight data-icon="inline-end" />
            </a>
          }
        />
      ))}
    </>
  );
}

/**
 * One project. Featured entries show everything; the rest lead with the summary
 * and stack and keep their detail behind a disclosure — eight fully-expanded
 * cards meant the ones past the fold were effectively invisible.
 *
 * `<details>` rather than state: it works before hydration, is keyboard
 * operable for free, and the browser's find-in-page can open it.
 */
function ProjectCard({
  project,
  ui,
  pick,
}: {
  project: Project;
  ui: Dictionary;
  pick: <T>(value: { en: T; fr: T }) => T;
}) {
  const highlights = pick(project.highlights);
  const primaryLink = project.links.find(
    (link) => !link.href.trimStart().startsWith("TODO:"),
  );
  const linkLabel = (href: string) =>
    pick(project.links.find((l) => l.href === href)!.label);

  return (
    <Card
      id={symbolAnchor("project", pick(project.name))}
      className="bg-card/60 flex scroll-mt-6 flex-col"
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          {/* Mono, so card titles match the rest of the editor surface. */}
          <CardTitle className="flex items-center gap-2 font-mono text-base">
            {project.featured && (
              <Star
                className="text-syntax-yellow size-4 shrink-0"
                aria-label={ui.panes.projectsFeatured}
              />
            )}
            {pick(project.name)}
          </CardTitle>
          <div className="flex shrink-0 items-center gap-2">
            <span className="text-muted-foreground font-mono text-xs">
              {pick(project.period)}
            </span>
            {/* A live URL deserves an affordance in the header, not only a
                button under the fold of its own card. */}
            {primaryLink && (
              <a
                href={primaryLink.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${pick(project.name)} — ${pick(primaryLink.label)}`}
                className="text-muted-foreground hover:text-brand hover:border-brand/50 border-border focus-visible:ring-ring rounded border p-1 focus-visible:ring-2 focus-visible:outline-none"
              >
                <ArrowUpRight className="size-3.5" aria-hidden />
              </a>
            )}
          </div>
        </div>
        <CardDescription>{pick(project.summary)}</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4">
        {project.featured ? (
          <Highlights highlights={highlights} />
        ) : (
          highlights.length > 0 && (
            <details className="group">
              <summary className="text-muted-foreground hover:text-foreground focus-visible:ring-ring marker:content-none flex w-fit cursor-pointer items-center gap-1 rounded font-mono text-xs focus-visible:ring-2 focus-visible:outline-none">
                <ChevronRight
                  className="size-3.5 transition-transform group-open:rotate-90"
                  aria-hidden
                />
                {ui.panes.projectsHighlights(highlights.length)}
              </summary>
              <div className="mt-3">
                <Highlights highlights={highlights} />
              </div>
            </details>
          )
        )}

        <StackList stack={project.stack} />
      </CardContent>

      {project.links.length > 0 && (
        <CardFooter className="mt-auto gap-2">
          <ProjectLinks links={project.links} labels={linkLabel} />
        </CardFooter>
      )}
    </Card>
  );
}

export function ProjectsPane() {
  const ui = useUi();
  const pick = usePick();

  return (
    <Pane title="Projects" className="max-w-6xl">
      <CommentLine>{ui.panes.projectsComment}</CommentLine>
      <SectionHeading>{ui.panes.projectsHeading}</SectionHeading>

      {/* Container query, not a viewport one: the editor is only ~750px wide
          with both side panels open, so a viewport breakpoint would give two
          columns in a pane too narrow for them. */}
      <div className="grid gap-5 @4xl:grid-cols-2">
        {sortedProjects.map((project) => (
          <ProjectCard
            key={pick(project.name)}
            project={project}
            ui={ui}
            pick={pick}
          />
        ))}
      </div>
    </Pane>
  );
}
