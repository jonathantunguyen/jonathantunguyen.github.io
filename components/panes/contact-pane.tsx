"use client";

import { Download, Mail, MapPin, Sparkles } from "lucide-react";
import { socialIcons } from "@/components/icon-map";
import {
  CommentLine,
  Pane,
  SectionHeading,
} from "@/components/panes/pane-shell";
import { Button } from "@/components/ui/button";
import { profile } from "@/data/profile";
import { socials } from "@/data/socials";
import { useIde } from "@/lib/ide-store";
import { usePick, useUi } from "@/lib/locale-context";

export function ContactPane() {
  const showPanel = useIde((s) => s.showPanel);
  const ui = useUi();
  const pick = usePick();

  return (
    <Pane title="Contact">
      <CommentLine>{ui.panes.contactComment}</CommentLine>
      <SectionHeading>{ui.panes.contactHeading}</SectionHeading>

      <p className="max-w-2xl text-sm leading-relaxed sm:text-base">
        {pick(profile.availability)}
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button
          size="lg"
          nativeButton={false}
          render={
            <a href={`mailto:${profile.email}`} className="font-mono">
              <Mail data-icon="inline-start" />
              {profile.email}
            </a>
          }
        />
        <Button
          variant="outline"
          size="lg"
          nativeButton={false}
          render={
            <a href={profile.resumePath} download>
              <Download data-icon="inline-start" />
              {ui.panes.contactResume}
            </a>
          }
        />
        <Button
          variant="outline"
          size="lg"
          onClick={() => showPanel("copilot")}
        >
          <Sparkles data-icon="inline-start" />
          {ui.panes.contactAskAssistant}
        </Button>
      </div>

      <p className="text-muted-foreground mt-6 flex items-center gap-2 font-mono text-sm">
        <MapPin className="size-4 shrink-0" aria-hidden />
        {pick(profile.location)}
      </p>

      <SectionHeading className="mt-12">
        {ui.panes.contactElsewhere}
      </SectionHeading>
      <ul className="grid gap-2 sm:grid-cols-2">
        {socials.map((social) => {
          const Icon = socialIcons[social.icon];
          return (
            <li key={social.href}>
              <a
                href={social.href}
                target={social.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="border-border hover:border-brand/50 hover:bg-hover focus-visible:ring-ring flex items-center gap-3 border px-4 py-3 transition-colors focus-visible:ring-2 focus-visible:outline-none"
              >
                <Icon className="text-brand size-4 shrink-0" aria-hidden />
                <span className="min-w-0">
                  <span className="block text-sm">{pick(social.label)}</span>
                  {social.handle && (
                    <span className="text-muted-foreground block truncate font-mono text-xs">
                      {social.handle}
                    </span>
                  )}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </Pane>
  );
}
