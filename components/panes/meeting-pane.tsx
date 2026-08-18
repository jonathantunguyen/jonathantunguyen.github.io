"use client";

import { useState } from "react";
import { ArrowUpRight, CalendarClock, Clock, Globe, Mail } from "lucide-react";
import {
  CommentLine,
  Pane,
  SectionHeading,
} from "@/components/panes/pane-shell";
import { Button } from "@/components/ui/button";
import { booking, bookingEnabled } from "@/data/booking";
import { profile } from "@/data/profile";
import { usePick, useUi } from "@/lib/locale-context";

/**
 * Booking pane.
 *
 * The calendar is click-to-load rather than an iframe that mounts with the page.
 * Every scheduling provider sets third-party cookies and phones home on load, so
 * embedding one eagerly would mean tracking every visitor who never intended to
 * book — on a site with no consent banner, and mostly European traffic. One
 * click is a small price for the embed being a thing the visitor asked for.
 */
export function MeetingPane() {
  const [loaded, setLoaded] = useState(false);
  const ui = useUi();
  const pick = usePick();

  return (
    <Pane title="Meeting">
      <CommentLine>{ui.panes.meetingComment}</CommentLine>
      <SectionHeading>{ui.panes.meetingHeading}</SectionHeading>

      <p className="max-w-2xl text-sm leading-relaxed sm:text-base">
        {ui.panes.meetingIntro}
      </p>

      <h3 className="text-muted-foreground mt-8 font-mono text-[11px] tracking-[0.18em] uppercase">
        {ui.panes.meetingGoodFor}
      </h3>
      <ul className="mt-3 flex max-w-2xl flex-col gap-2">
        {pick(booking.goodFor).map((item) => (
          <li key={item} className="flex gap-2 text-sm">
            <span className="text-syntax-green shrink-0" aria-hidden>
              ▸
            </span>
            <span className="text-foreground/85">{item}</span>
          </li>
        ))}
      </ul>

      {/* Facts a visitor wants before they click into someone's calendar. */}
      <dl className="text-muted-foreground mt-6 flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs">
        <div className="flex items-center gap-1.5">
          <Clock className="size-3.5 shrink-0" aria-hidden />
          <dt className="sr-only">{ui.panes.meetingDurationLabel}</dt>
          <dd>{ui.panes.meetingDuration(booking.durationMinutes)}</dd>
        </div>
        <div className="flex items-center gap-1.5">
          <Globe className="size-3.5 shrink-0" aria-hidden />
          <dt className="sr-only">{ui.panes.meetingTimezoneLabel}</dt>
          <dd>{booking.timezone}</dd>
        </div>
      </dl>

      {bookingEnabled ? (
        <div className="mt-8">
          {loaded ? (
            <>
              <iframe
                src={booking.url}
                title={ui.panes.meetingHeading}
                loading="lazy"
                // The provider's page needs its own scripts and forms; nothing
                // else is granted.
                sandbox="allow-scripts allow-forms allow-same-origin allow-popups"
                className="border-border bg-editor h-[42rem] w-full max-w-3xl border"
              />
              <p className="text-muted-foreground/70 mt-2 text-xs">
                {ui.panes.meetingLoadedNote(booking.provider)}
              </p>
            </>
          ) : (
            <div className="border-border flex max-w-3xl flex-col items-start gap-3 border border-dashed p-6">
              <p className="text-sm leading-relaxed">
                {ui.panes.meetingPrivacy(booking.provider)}
              </p>
              <div className="flex flex-wrap gap-2">
                <Button size="lg" onClick={() => setLoaded(true)}>
                  <CalendarClock data-icon="inline-start" />
                  {ui.panes.meetingLoad}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  nativeButton={false}
                  render={
                    <a
                      href={booking.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {ui.panes.meetingOpen}
                      <ArrowUpRight data-icon="inline-end" />
                    </a>
                  }
                />
              </div>
            </div>
          )}
        </div>
      ) : (
        /* No link configured yet: say so plainly instead of rendering a broken
           calendar, and give the visitor the route that does work. */
        <div className="border-border mt-8 flex max-w-3xl flex-col items-start gap-3 border border-dashed p-6">
          <p className="text-sm leading-relaxed">{ui.panes.meetingUnset}</p>
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
        </div>
      )}
    </Pane>
  );
}
