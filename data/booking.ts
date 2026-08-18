/**
 * Meeting bookings.
 *
 * Provider-agnostic on purpose: everything here needs is a URL that renders a
 * booking page, which Cal.com, Calendly and Google Appointment Schedules all
 * give you. Paste yours into `url` and the rest of the site picks it up — the
 * `meeting.ics` file in the sidebar, the button on the contact pane, the menu
 * item, and the assistant's answers.
 *
 * Until then the URL keeps its `TODO:` marker, `bookingEnabled` stays false, and
 * every surface degrades to "email me" rather than showing a broken calendar.
 */

import { t, type L } from "@/lib/i18n";

export interface Booking {
  /**
   * Your public scheduling link. Examples:
   *   Cal.com   https://cal.com/jonathan-nguyen/30min
   *   Calendly  https://calendly.com/jonathan-nguyen/30min
   *   Google    https://calendar.app.google/<id>
   */
  url: string;
  /** Shown to visitors before anything third-party loads. */
  provider: string;
  durationMinutes: number;
  /** Your working timezone, so visitors know what they're booking into. */
  timezone: string;
  /** What a call is actually useful for. Keep it honest and short. */
  goodFor: L<string[]>;
}

export const booking: Booking = {
  url: "TODO: paste your Cal.com / Calendly / Google booking link here",
  provider: "Cal.com",
  durationMinutes: 30,
  // REVIEW: assumed from the Paris location in data/profile.ts.
  timezone: "Europe/Paris",
  goodFor: t(
    [
      "Hiring conversations — roles, teams, what the work actually involves",
      "Getting an ML or LLM system from a notebook into production",
      "A second opinion on a model, a pipeline or an architecture",
    ],
    [
      "Discussions de recrutement — postes, équipes, la réalité du travail",
      "Passer un système ML ou LLM du notebook à la production",
      "Un deuxième avis sur un modèle, un pipeline ou une architecture",
    ],
  ),
};

/** False while the URL is still a placeholder. */
export const bookingEnabled = !booking.url.trimStart().startsWith("TODO:");
