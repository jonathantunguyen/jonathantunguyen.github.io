import type { Metadata, Viewport } from "next";
import { fullName, profile } from "@/data/profile";
import { pick, type Locale } from "@/lib/i18n";

/**
 * The absolute origin used for canonical URLs, hreflang alternates, the
 * sitemap and OG image URLs.
 *
 * `NEXT_PUBLIC_SITE_URL` wins, so a custom domain is a single setting. Failing
 * that we use the domain Vercel injects at build time — which means a fresh
 * deploy produces correct tags instead of silently advertising localhost to
 * crawlers. Only the local fallback remains.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");

  // Set by Vercel on every build; the production domain, even in previews.
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercel) return `https://${vercel.replace(/^https?:\/\//, "")}`;

  return "http://localhost:3000";
}

export const siteUrl = resolveSiteUrl();

/** `/` is English, `/fr` is French. */
export const localePath: Record<Locale, string> = { en: "/", fr: "/fr/" };

const descriptions: Record<Locale, string> = {
  en: "Portfolio, projects and experience, presented as a code editor.",
  fr: "Portfolio, projets et expérience, présentés comme un éditeur de code.",
};

/**
 * Per-locale metadata, including the reciprocal `hreflang` alternates that make
 * the two URLs a language pair rather than duplicate content.
 */
export function localeMetadata(locale: Locale): Metadata {
  const roles = profile.roles.map((role) => pick(role, locale)).join(" · ");
  const description = `${fullName} — ${roles}. ${descriptions[locale]}`;
  const title = `${fullName} — Portfolio`;

  return {
    metadataBase: new URL(siteUrl),
    title: { default: title, template: `%s — ${fullName}` },
    description,
    applicationName: `${fullName} — Portfolio`,
    authors: [{ name: fullName }],
    keywords: [
      fullName,
      "portfolio",
      locale === "fr" ? "ingénieur machine learning" : "machine learning engineer",
      ...profile.roles.map((role) => pick(role, locale)),
    ],
    alternates: {
      canonical: localePath[locale],
      languages: {
        en: localePath.en,
        fr: localePath.fr,
        // Tells crawlers which version to serve when no language matches.
        "x-default": localePath.en,
      },
    },
    openGraph: {
      type: "website",
      locale: locale === "fr" ? "fr_FR" : "en_US",
      url: localePath[locale],
      title,
      description,
      siteName: `${fullName} — Portfolio`,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export const siteViewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#eef1f4" },
    { media: "(prefers-color-scheme: dark)", color: "#0d1117" },
  ],
  colorScheme: "dark light",
};
