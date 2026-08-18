import type { NextConfig } from "next";

/**
 * Configured for a host that can run Node — Railway, in practice.
 *
 * The `pages` branch adds Next's static-export output mode here; this branch
 * deliberately omits it so the app keeps its server, which is what lets
 * `app/api/chat/route.ts` exist and stream answers from Claude instead of
 * falling back to the in-browser keyword index.
 *
 * Do not name that option in this file, even in a comment: Railpack decides
 * static-vs-server by text-matching `next.config.*`, so mentioning it makes the
 * builder serve a nonexistent `out/` directory with Caddy and the deploy fails
 * with "/app/out: not found".
 *
 * `trailingSlash` is kept so URLs match `pages` (`/fr/`, not `/fr`) — worth
 * keeping identical if both branches are ever live at once.
 */
const nextConfig: NextConfig = {
  trailingSlash: true,
};

export default nextConfig;
