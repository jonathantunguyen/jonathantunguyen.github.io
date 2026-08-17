/**
 * Keyword-matched answers used when `ANTHROPIC_API_KEY` isn't configured, so a
 * fork of this repo still has a working assistant panel instead of a 500.
 *
 * These are assembled from the same data files as the real system prompt —
 * they're a degraded reader, not a second set of facts.
 */

import { roles } from "@/data/experience";
import { fullName, profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { skillGroups } from "@/data/skills";
import { pick, type L, type Locale } from "@/lib/i18n";

function clean(value: string): string {
  return value.replace(/^TODO:\s*/, "").trim();
}

interface Canned {
  /** Matched against the lower-cased question, so include both languages. */
  keywords: string[];
  answer: (locale: Locale) => string;
}

const canned: Canned[] = [
  {
    keywords: [
      "project",
      "built",
      "build",
      "portfolio",
      "shipped",
      "projet",
      "construit",
      "réalisé",
      "production",
    ],
    answer: (locale) => {
      const p = <T,>(v: L<T>) => pick(v, locale);
      const names = projects.map((proj) => clean(p(proj.name))).join(", ");
      return locale === "fr"
        ? `${profile.firstName} a ${projects.length} projets listés : ${names}. Ouvrez projects.js dans la barre latérale pour le détail de chacun.`
        : `${profile.firstName} has ${projects.length} projects listed: ${names}. Open projects.js in the sidebar for the details on each.`;
    },
  },
  {
    keywords: [
      "skill",
      "tech",
      "stack",
      "language",
      "tools",
      "know",
      "compétence",
      "outil",
      "langage",
      "framework",
    ],
    answer: (locale) => {
      const p = <T,>(v: L<T>) => pick(v, locale);
      const groups = skillGroups
        .slice(0, 3)
        .map((g) => clean(p(g.title)).toLowerCase())
        .join(", ");
      return locale === "fr"
        ? `${profile.firstName} travaille sur ${groups} et plus encore. skills.json dans la barre latérale contient le détail complet.`
        : `${profile.firstName} works across ${groups} and more. skills.json in the sidebar has the full breakdown.`;
    },
  },
  {
    keywords: [
      "experience",
      "job",
      "role",
      "career",
      "worked",
      "company",
      "expérience",
      "poste",
      "carrière",
      "entreprise",
      "travaillé",
    ],
    answer: (locale) => {
      const p = <T,>(v: L<T>) => pick(v, locale);
      const current = roles.find((r) => r.current) ?? roles[0];
      if (!current) {
        return locale === "fr"
          ? "experience.ts dans la barre latérale contient le parcours."
          : "experience.ts in the sidebar has the work history.";
      }
      return locale === "fr"
        ? `${profile.firstName} est ${clean(current.title)} chez ${clean(current.company)} (${clean(p(current.period))}). experience.ts dans la barre latérale contient tout le parcours.`
        : `${profile.firstName} is ${clean(current.title)} at ${clean(current.company)} (${clean(p(current.period))}). experience.ts in the sidebar has the full history.`;
    },
  },
  {
    keywords: [
      "contact",
      "email",
      "reach",
      "hire",
      "hiring",
      "touch",
      "talk",
      "joindre",
      "contacter",
      "recruter",
      "écrire",
    ],
    answer: (locale) =>
      locale === "fr"
        ? `Le meilleur moyen de joindre ${profile.firstName} est ${profile.email}. contact.css dans la barre latérale contient les autres liens.`
        : `The best way to reach ${profile.firstName} is ${profile.email}. contact.css in the sidebar has the other links.`,
  },
  {
    keywords: ["github", "linkedin", "kaggle", "blog", "social", "réseau"],
    answer: (locale) =>
      locale === "fr"
        ? `Les liens dans contact.css pointent vers les profils de ${profile.firstName} — GitHub, LinkedIn, Kaggle et le blog.`
        : `The links in contact.css point to ${profile.firstName}'s profiles — GitHub, LinkedIn, Kaggle and the blog.`,
  },
  {
    keywords: [
      "about",
      "who",
      "background",
      "tell me",
      "qui",
      "parcours",
      "présent",
      "résume",
    ],
    answer: (locale) => {
      const p = <T,>(v: L<T>) => pick(v, locale);
      const rolesList = profile.roles.map((r) => clean(p(r))).join(", ");
      const bio = clean(p(profile.bio)).replace(/\*\*/g, "");
      return locale === "fr"
        ? `${fullName} — ${rolesList}. ${bio} about.html dans la barre latérale en dit plus.`
        : `${fullName} — ${rolesList}. ${bio} about.html in the sidebar has more.`;
    },
  },
];

function fallbackAnswer(locale: Locale): string {
  return locale === "fr"
    ? `Je tourne sans modèle de langage configuré : je ne peux répondre qu'à quelques questions courantes. Parcourez les fichiers de la barre latérale, ou écrivez directement à ${profile.email}.`
    : `I'm running without a language model configured, so I can only answer a few common questions. Browse the files in the sidebar, or email ${profile.email} directly.`;
}

export function cannedAnswer(question: string, locale: Locale): string {
  const q = question.toLowerCase();
  const match = canned.find((c) => c.keywords.some((k) => q.includes(k)));
  return match ? match.answer(locale) : fallbackAnswer(locale);
}
