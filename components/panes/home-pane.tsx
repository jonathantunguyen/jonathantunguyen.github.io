"use client";

import { FolderOpen, Mail, User } from "lucide-react";
import { socialIcons } from "@/components/icon-map";
import { CommentLine, Highlighted, Pane } from "@/components/panes/pane-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { profile } from "@/data/profile";
import { socials } from "@/data/socials";
import { useIde } from "@/lib/ide-store";
import { usePick, useUi } from "@/lib/locale-context";

export function HomePane() {
  const openFile = useIde((s) => s.openFile);
  const ui = useUi();
  const pick = usePick();

  return (
    <Pane title="Home">
      <CommentLine>{ui.panes.homeComment}</CommentLine>

      <h1 className="font-heading text-[clamp(2.75rem,11vw,6.5rem)] leading-[0.9] tracking-tight">
        <span className="text-foreground block">{profile.firstName}</span>
        <span className="text-brand-2 block">{profile.lastName}</span>
      </h1>

      <div className="bg-brand mt-5 mb-5 h-0.5 w-full max-w-xl" />

      <div className="flex flex-wrap gap-2">
        {profile.roles.map((role, i) => (
          <Badge
            key={pick(role)}
            variant="outline"
            className="h-7 gap-2 rounded-md px-3"
          >
            <span
              aria-hidden
              className="size-1.5 rounded-full"
              style={{
                background: [
                  "var(--syntax-green)",
                  "var(--syntax-purple)",
                  "var(--brand)",
                ][i % 3],
              }}
            />
            {pick(role)}
          </Badge>
        ))}
      </div>

      {profile.company && (
        <Badge
          variant="outline"
          className="border-brand-2/40 text-brand-2 mt-2 h-7 gap-2 rounded-md px-3"
        >
          <span aria-hidden className="bg-brand-2 size-1.5 rounded-full" />@{" "}
          {profile.company}
        </Badge>
      )}

      <p className="text-muted-foreground mt-7 text-sm sm:text-base">
        {pick(profile.tagline)} <span className="caret text-brand">|</span>
      </p>

      <p className="mt-6 max-w-2xl text-sm leading-relaxed sm:text-base">
        <Highlighted text={pick(profile.bio)} />
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button size="lg" onClick={() => openFile("projects")}>
          <FolderOpen data-icon="inline-start" />
          {ui.panes.homeProjects}
        </Button>
        <Button variant="outline" size="lg" onClick={() => openFile("about")}>
          <User data-icon="inline-start" />
          {ui.panes.homeAbout}
        </Button>
        <Button variant="outline" size="lg" onClick={() => openFile("contact")}>
          <Mail data-icon="inline-start" />
          {ui.panes.homeContact}
        </Button>
      </div>

      {/* Stat grid */}
      <dl className="border-border mt-10 grid grid-cols-2 divide-x divide-y divide-[var(--border)] border sm:grid-cols-4 sm:divide-y-0">
        {profile.stats.map((stat) => (
          <div
            key={stat.value + pick(stat.label)}
            className="flex flex-col items-center gap-2 px-4 py-7"
          >
            <dt className="sr-only">{pick(stat.label)}</dt>
            <dd className="font-heading text-3xl leading-none">{stat.value}</dd>
            <span
              aria-hidden
              className="text-muted-foreground text-center text-[11px] tracking-[0.18em] uppercase"
            >
              {pick(stat.label)}
            </span>
          </div>
        ))}
      </dl>

      {/* Socials */}
      <ul className="mt-8 flex flex-wrap gap-2">
        {socials.map((social) => {
          const Icon = socialIcons[social.icon];
          return (
            <li key={social.href}>
              <Button
                variant="outline"
                size="sm"
                // Rendering an <a>, so opt out of native button semantics.
                nativeButton={false}
                render={
                  <a
                    href={social.href}
                    target={
                      social.href.startsWith("http") ? "_blank" : undefined
                    }
                    rel="noopener noreferrer"
                  >
                    <Icon data-icon="inline-start" />
                    {pick(social.label)}
                  </a>
                }
              />
            </li>
          );
        })}
      </ul>
    </Pane>
  );
}
