import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/metadata";

// Required by output: export: generated once at build time.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: "/api/" }],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
