import type { Metadata, Viewport } from "next";
import { fullName, profile } from "@/data/profile";
import { pick, type Locale } from "@/lib/i18n";

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/** `/` is English, `/fr` is French. */
export const localePath: Record<Locale, string> = { en: "/", fr: "/fr" };

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
