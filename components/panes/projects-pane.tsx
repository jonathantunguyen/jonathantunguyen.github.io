"use client";

import { ArrowUpRight, Star } from "lucide-react";
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
import { sortedProjects } from "@/data/projects";
import { usePick, useUi } from "@/lib/locale-context";

export function ProjectsPane() {
  const ui = useUi();
  const pick = usePick();

  return (
    <Pane title="Projects">
      <CommentLine>{ui.panes.projectsComment}</CommentLine>
      <SectionHeading>{ui.panes.projectsHeading}</SectionHeading>

      <div className="flex flex-col gap-5">
        {sortedProjects.map((project) => (
          <Card key={pick(project.name)} className="bg-card/60">
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
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
                <span className="text-muted-foreground shrink-0 text-xs">
                  {pick(project.period)}
                </span>
              </div>
              <CardDescription>{pick(project.summary)}</CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col gap-4">
              <ul className="flex flex-col gap-2">
                {pick(project.highlights).map((highlight) => (
                  <li
                    key={highlight}
                    className="text-muted-foreground flex gap-2 text-sm"
                  >
                    <span className="text-syntax-green shrink-0" aria-hidden>
                      ▸
                    </span>
                    <span className="text-foreground/80">{highlight}</span>
                  </li>
                ))}
              </ul>

              <ul className="flex flex-wrap gap-1.5">
                {project.stack.map((tech) => (
                  <li key={tech}>
                    <Badge variant="secondary" className="rounded-md">
                      {tech}
                    </Badge>
                  </li>
                ))}
              </ul>
            </CardContent>

            {project.links.length > 0 && (
              <CardFooter className="gap-2">
                {project.links.map((link) => (
                  <Button
                    key={link.href}
                    variant="outline"
                    size="sm"
                    nativeButton={false}
                    render={
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {pick(link.label)}
                        <ArrowUpRight data-icon="inline-end" />
                      </a>
                    }
                  />
                ))}
              </CardFooter>
            )}
          </Card>
        ))}
      </div>
    </Pane>
  );
}
