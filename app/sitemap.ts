import type { MetadataRoute } from "next";

// Required by output: export: generated once at build time.
export const dynamic = "force-static";
import { localePath, siteUrl } from "@/lib/metadata";

/**
 * Two URLs, each declaring the other as its language alternate — the same pair
 * the `hreflang` tags describe, so crawlers get a consistent story from both
 * the markup and the sitemap.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const alternates = {
    languages: {
      en: `${siteUrl}${localePath.en}`,
      fr: `${siteUrl}${localePath.fr}`,
    },
  };

  return [
    {
      url: `${siteUrl}${localePath.en}`,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
      alternates,
    },
    {
      url: `${siteUrl}${localePath.fr}`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
      alternates,
    },
  ];
}
