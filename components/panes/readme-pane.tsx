"use client";

import { Pane } from "@/components/panes/pane-shell";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { fullName } from "@/data/profile";
import { useUi } from "@/lib/locale-context";

const stack = [
  "Next.js",
  "React",
  "TypeScript",
  "Tailwind CSS",
  "shadcn/ui",
  "Claude API",
];

export function ReadmePane() {
  const ui = useUi();

  return (
    <Pane title="Readme" className="max-w-3xl">
      <h1 className="text-2xl font-semibold">
        <span className="text-muted-foreground"># </span>
        {fullName}
      </h1>
      <Separator className="mt-3 mb-6" />

      <p className="text-sm leading-relaxed sm:text-base">
        {ui.panes.readmeIntro}
      </p>

      <h2 className="mt-9 text-lg font-semibold">
        <span className="text-muted-foreground">## </span>
        {ui.panes.readmeBuiltWith}
      </h2>
      <ul className="mt-3 flex flex-wrap gap-1.5">
        {stack.map((item) => (
          <li key={item}>
            <Badge variant="secondary" className="rounded-md">
              {item}
            </Badge>
          </li>
        ))}
      </ul>

      <h2 className="mt-9 text-lg font-semibold">
        <span className="text-muted-foreground">## </span>
        {ui.panes.readmeShortcuts}
      </h2>
      <dl className="mt-3 flex flex-col gap-2">
        {ui.panes.readmeShortcutList.map(([keys, action]) => (
          <div key={keys} className="flex items-center gap-3 text-sm">
            <dt>
              <kbd className="border-border bg-chrome text-muted-foreground rounded border px-1.5 py-0.5 text-xs">
                {keys}
              </kbd>
            </dt>
            <dd className="text-muted-foreground">{action}</dd>
          </div>
        ))}
      </dl>

      <h2 className="mt-9 text-lg font-semibold">
        <span className="text-muted-foreground">## </span>
        {ui.panes.readmeAssistantNote}
      </h2>
      <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
        {ui.panes.readmeAssistantBody}
      </p>
    </Pane>
  );
}
