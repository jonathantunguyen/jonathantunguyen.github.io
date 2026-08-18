import type { NextConfig } from "next";

/**
 * Configured for a host that can run Node — Vercel, in practice.
 *
 * The difference from the `master` branch is a single missing line:
 * `output: "export"`. Without it the app keeps its server, so
 * `app/api/chat/route.ts` exists and the assistant streams from Claude instead
 * of answering from a keyword index in the browser.
 *
 * `trailingSlash` is kept so URLs match `master` (`/fr/`, not `/fr`) — worth
 * keeping identical if both branches are ever live at once.
 */
const nextConfig: NextConfig = {
  trailingSlash: true,
};

export default nextConfig;
