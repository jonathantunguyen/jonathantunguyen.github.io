"use client";

import { GraduationCap, MapPin } from "lucide-react";
import {
  CommentLine,
  Pane,
  SectionHeading,
} from "@/components/panes/pane-shell";
import { profile } from "@/data/profile";
import { education } from "@/data/experience";
import { usePick, useUi } from "@/lib/locale-context";

export function AboutPane() {
  const ui = useUi();
  const pick = usePick();

  return (
    <Pane title="About">
      <CommentLine>{ui.panes.aboutComment}</CommentLine>

      <SectionHeading>{ui.panes.aboutWho}</SectionHeading>
      <div className="flex flex-col gap-4 text-sm leading-relaxed sm:text-base">
        {pick(profile.about).map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      <p className="text-muted-foreground mt-6 flex items-center gap-2 text-sm">
        <MapPin className="size-4 shrink-0" aria-hidden />
        {pick(profile.location)}
      </p>

      <SectionHeading className="mt-12">
        {ui.panes.aboutEducation}
      </SectionHeading>
      <ul className="flex flex-col gap-6">
        {education.map((entry) => (
          <li key={entry.institution} className="flex gap-3">
            <GraduationCap
              className="text-syntax-purple mt-0.5 size-5 shrink-0"
              aria-hidden
            />
            <div>
              <h3 className="text-sm font-semibold sm:text-base">
                {pick(entry.qualification)}
              </h3>
              <p className="text-brand text-sm">{entry.institution}</p>
              <p className="text-muted-foreground mt-1 text-xs">
                {pick(entry.period)}
              </p>
              {entry.detail && (
                <p className="text-muted-foreground mt-2 text-sm">
                  {pick(entry.detail)}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </Pane>
  );
}
