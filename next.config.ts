import type { NextConfig } from "next";

/**
 * Configured for GitHub Pages, which serves static files and nothing else.
 *
 * `output: "export"` prerenders every route to HTML in `out/`. Consequences
 * worth knowing before changing hosts:
 *
 * - No server, so no Route Handlers. `app/api/chat` cannot exist in this build;
 *   the assistant answers from a keyword index in the browser instead. Its
 *   server version is in git history (see README → Deploying) if you move to a
 *   host that can run it.
 * - No image optimizer, hence `unoptimized`.
 * - `trailingSlash` makes `/fr` emit `out/fr/index.html`, which Pages serves
 *   without a redirect hop.
 *
 * This is a user site (jonathantunguyen.github.io), served from the domain
 * root, so no `basePath` is needed. A project site would need one.
 */
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
