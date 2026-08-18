"use client";

import { useEffect, useState } from "react";
import { CommentLine, Pane } from "@/components/panes/pane-shell";
import { Separator } from "@/components/ui/separator";
import { skillGroups, syntaxVar, type Skill } from "@/data/skills";
import { usePick, useUi } from "@/lib/locale-context";
import { symbolAnchor } from "@/lib/symbols";

/**
 * Bars start empty and fill on the frame after the pane becomes visible.
 *
 * Keyed on `active`, not mount: every pane is now mounted at once (so crawlers
 * see all of them), which means mounting no longer tells us anyone is looking.
 * Scroll position would work too but costs an IntersectionObserver and a
 * failure mode for no real gain.
 */
function useFillOnActive(active: boolean) {
  const [filled, setFilled] = useState(false);

  useEffect(() => {
    if (!active) return;
    const frame = requestAnimationFrame(() => setFilled(true));
    return () => cancelAnimationFrame(frame);
  }, [active]);

  return filled;
}

function SkillRow({ skill, revealed }: { skill: Skill; revealed: boolean }) {
  const color = syntaxVar[skill.color];

  return (
    <li className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 sm:grid-cols-[minmax(0,1fr)_7rem_2.75rem]">
      <span className="text-foreground/85 truncate font-mono text-sm">
        {skill.name}
      </span>

      {/* The bar is decorative; the number beside it carries the value. */}
      <div
        aria-hidden
        className="bg-muted col-span-2 h-[3px] w-full overflow-hidden rounded-full sm:col-span-1"
      >
        <div
          className="h-full rounded-full transition-[width] duration-700 ease-out"
          style={{
            width: revealed ? `${skill.level}%` : "0%",
            background: color,
          }}
        />
      </div>

      <span
        className="text-right font-mono text-sm tabular-nums"
        style={{ color }}
      >
        {skill.level}%
      </span>
    </li>
  );
}

export function SkillsPane({ active = true }: { active?: boolean }) {
  const revealed = useFillOnActive(active);
  const ui = useUi();
  const pick = usePick();

  return (
    <Pane title="Skills">
      <CommentLine>{ui.panes.skillsComment}</CommentLine>

      <div className="grid gap-x-12 gap-y-10 md:grid-cols-2">
        {skillGroups.map((group) => (
          <div
            key={pick(group.title)}
            id={symbolAnchor("skills", pick(group.title))}
            className="scroll-mt-6"
          >
            <h2 className="text-syntax-yellow font-mono text-sm font-semibold tracking-[0.22em] uppercase">
              {pick(group.title)}
            </h2>
            <Separator className="mt-2 mb-4" />
            <ul className="flex flex-col gap-3.5">
              {group.skills.map((skill) => (
                <SkillRow key={skill.name} skill={skill} revealed={revealed} />
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Pane>
  );
}
