"use client";

import { AboutPane } from "@/components/panes/about-pane";
import { ContactPane } from "@/components/panes/contact-pane";
import { ExperiencePane } from "@/components/panes/experience-pane";
import { HomePane } from "@/components/panes/home-pane";
import { ProjectsPane } from "@/components/panes/projects-pane";
import { ReadmePane } from "@/components/panes/readme-pane";
import { SkillsPane } from "@/components/panes/skills-pane";
import { TabBar } from "@/components/ide/tab-bar";
import { useIde } from "@/lib/ide-store";
import { useUi } from "@/lib/locale-context";

const panes: Record<string, React.ComponentType> = {
  home: HomePane,
  about: AboutPane,
  projects: ProjectsPane,
  skills: SkillsPane,
  experience: ExperiencePane,
  contact: ContactPane,
  readme: ReadmePane,
};

/** Shown when every tab is closed, the way an editor shows its logo. */
function Watermark() {
  const setQuickOpenOpen = useIde((s) => s.setQuickOpenOpen);
  const ui = useUi();

  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
      <p className="text-muted-foreground/50 font-heading text-5xl">{"{ }"}</p>
      <p className="text-muted-foreground text-sm">{ui.editor.noFile}</p>
      <button
        type="button"
        onClick={() => setQuickOpenOpen(true)}
        className="text-brand hover:underline focus-visible:ring-ring rounded text-sm focus-visible:ring-2 focus-visible:outline-none"
      >
        {ui.editor.goToFile}
        <kbd className="border-border bg-chrome text-muted-foreground ml-2 rounded border px-1.5 py-0.5 text-xs">
          Ctrl P
        </kbd>
      </button>
    </div>
  );
}

export function Editor() {
  const activeFile = useIde((s) => s.activeFile);
  const ActivePane = activeFile ? panes[activeFile] : undefined;

  return (
    <main className="bg-editor flex min-w-0 flex-1 flex-col">
      <TabBar />
      <div className="min-h-0 flex-1 overflow-y-auto">
        {ActivePane ? <ActivePane /> : <Watermark />}
      </div>
    </main>
  );
}
