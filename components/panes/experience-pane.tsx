"use client";

import {
  CommentLine,
  Pane,
  SectionHeading,
} from "@/components/panes/pane-shell";
import { Badge } from "@/components/ui/badge";
import { roles } from "@/data/experience";
import { usePick, useUi } from "@/lib/locale-context";

export function ExperiencePane() {
  const ui = useUi();
  const pick = usePick();

  return (
    <Pane title="Experience">
      <CommentLine>{ui.panes.experienceComment}</CommentLine>
      <SectionHeading>{ui.panes.experienceHeading}</SectionHeading>

      {/* The rail is tinted brighter than `border` so it reads against the
          editor background at 1px. */}
      <ol className="border-muted-foreground/50 flex flex-col gap-9 border-l pl-6">
        {roles.map((role) => (
          <li key={`${role.company}-${role.title}`} className="relative">
            {/* Timeline node */}
            <span
              aria-hidden
              // Centres a 12px node on the rail: 24px of padding + half the node.
              className="border-editor absolute top-1.5 -left-[30px] size-3 rounded-full border-2"
              style={{
                background: role.current ? "var(--brand)" : "var(--border)",
              }}
            />

            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h3 className="text-sm font-semibold sm:text-base">
                {role.title}
                <span className="text-muted-foreground font-normal"> · </span>
                <span className="text-brand font-normal">{role.company}</span>
              </h3>
              <span className="text-muted-foreground flex items-center gap-2 text-xs">
                {role.current && (
                  <span
                    aria-hidden
                    className="bg-syntax-green size-1.5 rounded-full"
                  />
                )}
                {pick(role.period)}
              </span>
            </div>

            <p className="text-muted-foreground mt-1 text-xs">
              {pick(role.location)}
            </p>

            <ul className="mt-3 flex flex-col gap-2">
              {pick(role.bullets).map((bullet) => (
                <li key={bullet} className="flex gap-2 text-sm">
                  <span className="text-syntax-green shrink-0" aria-hidden>
                    ▸
                  </span>
                  <span className="text-foreground/85">{bullet}</span>
                </li>
              ))}
            </ul>

            <ul className="mt-3 flex flex-wrap gap-1.5">
              {role.stack.map((tech) => (
                <li key={tech}>
                  <Badge variant="secondary" className="rounded-md">
                    {tech}
                  </Badge>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </Pane>
  );
}
