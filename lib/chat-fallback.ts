/**
 * Keyword-matched answers used when no provider key is configured, so a fork of
 * this repo still has a working assistant panel instead of a 500.
 *
 * These are assembled from the same data files as the real system prompt —
 * they're a degraded reader, not a second set of facts. Degraded in reasoning,
 * though, not in substance: each answer carries the specifics a visitor came
 * for, matching the depth the model is asked for in `lib/portfolio-context.ts`.
 * Blank lines are meaningful — the panel renders with `whitespace-pre-wrap`.
 */

import { roles } from "@/data/experience";
import { fullName, profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { skillGroups } from "@/data/skills";
import { socials } from "@/data/socials";
import { pick, type L, type Locale } from "@/lib/i18n";

function clean(value: string): string {
  return value.replace(/^TODO:\s*/, "").trim();
}

function isPlaceholder(value: string): boolean {
  return value.trimStart().startsWith("TODO:");
}

/** French puts a space before the colon; English doesn't. */
function colon(locale: Locale): string {
  return locale === "fr" ? " :" : ":";
}

/** Joins list lines within one paragraph. */
function lines(...parts: (string | null)[]): string {
  return parts.filter(Boolean).join("\n");
}

/** Joins the parts of an answer into paragraphs. */
function paragraphs(...parts: (string | null)[]): string {
  return parts.filter(Boolean).join("\n\n");
}

/**
 * The socials that point somewhere real, as dash-prefixed lines. Pass
 * `skipEmail` where the answer has already given the address, so it isn't
 * printed twice. `mailto:` is stripped — it's a link scheme, not something to
 * read.
 */
function socialLines(locale: Locale, skipEmail = false): string {
  return lines(
    ...socials
      .filter((social) => !isPlaceholder(social.href))
      .filter((social) => !(skipEmail && social.href.startsWith("mailto:")))
      .map(
        (social) =>
          `- ${clean(pick(social.label, locale))}${colon(locale)} ${social.href.replace(/^mailto:/, "")}`,
      ),
  );
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
      const featured = projects.filter((proj) => proj.featured).slice(0, 3);
      const rest = projects
        .filter((proj) => !featured.includes(proj))
        .map((proj) => clean(p(proj.name)));

      const detail = lines(
        ...featured.map(
          (proj) =>
            `- ${clean(p(proj.name))} (${clean(p(proj.period))}) — ${clean(p(proj.summary))} Stack${colon(locale)} ${proj.stack.map(clean).join(", ")}.`,
        ),
      );

      return locale === "fr"
        ? paragraphs(
            `${profile.firstName} a ${projects.length} projets listés. Les plus marquants :`,
            detail,
            rest.length > 0 ? `Les autres : ${rest.join(", ")}.` : null,
            "Ouvrez projects.js dans la barre latérale pour les points clés et les liens de chacun.",
          )
        : paragraphs(
            `${profile.firstName} has ${projects.length} projects listed. The headline ones:`,
            detail,
            rest.length > 0 ? `The others: ${rest.join(", ")}.` : null,
            "Open projects.js in the sidebar for the highlights and links on each.",
          );
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
      const breakdown = lines(
        ...skillGroups.map((group) => {
          const top = [...group.skills]
            .sort((a, b) => b.level - a.level)
            .slice(0, 4)
            .map((skill) => clean(skill.name))
            .join(", ");
          return `- ${clean(p(group.title))}${colon(locale)} ${top}`;
        }),
      );

      return locale === "fr"
        ? paragraphs(
            `Les compétences de ${profile.firstName} se répartissent en ${skillGroups.length} catégories, les plus solides en tête de chacune :`,
            breakdown,
            "skills.json dans la barre latérale contient la liste complète avec les niveaux — ce sont des auto-évaluations, pas des certifications.",
          )
        : paragraphs(
            `${profile.firstName}'s skills fall into ${skillGroups.length} areas, strongest first in each:`,
            breakdown,
            "skills.json in the sidebar has the full list with levels — those are self-ratings, not certifications.",
          );
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

      const bullets = lines(
        ...p(current.bullets)
          .slice(0, 2)
          .map((bullet) => `- ${clean(bullet)}`),
      );
      const previous = roles
        .filter((role) => role !== current)
        .map((role) => `${clean(role.company)} (${clean(p(role.period))})`);

      return locale === "fr"
        ? paragraphs(
            `${profile.firstName} est actuellement ${clean(current.title)} chez ${clean(current.company)}, ${clean(p(current.period))}, à ${clean(p(current.location))}. Stack : ${current.stack.map(clean).join(", ")}.`,
            bullets,
            previous.length > 0
              ? `Avant cela, ${previous.length} postes : ${previous.join(", ")}.`
              : null,
            "experience.ts dans la barre latérale détaille chaque poste, avec la formation en bas.",
          )
        : paragraphs(
            `${profile.firstName} is currently ${clean(current.title)} at ${clean(current.company)}, ${clean(p(current.period))}, based in ${clean(p(current.location))}. Stack: ${current.stack.map(clean).join(", ")}.`,
            bullets,
            previous.length > 0
              ? `Before that, ${previous.length} roles: ${previous.join(", ")}.`
              : null,
            "experience.ts in the sidebar details every role, with education at the bottom.",
          );
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
    answer: (locale) => {
      const p = <T,>(v: L<T>) => pick(v, locale);
      return locale === "fr"
        ? paragraphs(
            `Le meilleur moyen de joindre ${profile.firstName} est ${profile.email}. Basé à ${clean(p(profile.location))}.`,
            clean(p(profile.availability)),
            socialLines(locale, true),
            "contact.css dans la barre latérale reprend tout ceci, et le CV se télécharge depuis la barre d'activité.",
          )
        : paragraphs(
            `The best way to reach ${profile.firstName} is ${profile.email}. Based in ${clean(p(profile.location))}.`,
            clean(p(profile.availability)),
            socialLines(locale, true),
            "contact.css in the sidebar repeats all of this, and the résumé downloads from the activity bar.",
          );
    },
  },
  {
    keywords: ["github", "linkedin", "kaggle", "blog", "social", "réseau"],
    answer: (locale) =>
      locale === "fr"
        ? paragraphs(
            `Les profils de ${profile.firstName} :`,
            socialLines(locale),
            `Le CV se télécharge depuis la barre d'activité, et ${profile.email} reste le moyen le plus direct.`,
          )
        : paragraphs(
            `${profile.firstName}'s profiles:`,
            socialLines(locale),
            `The résumé downloads from the activity bar, and ${profile.email} is still the most direct route.`,
          ),
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
      // The bio carries `**` emphasis for the hero; strip it for plain text.
      const bio = clean(p(profile.bio)).replace(/\*\*/g, "");
      const stats = lines(
        ...profile.stats.map(
          (stat) => `- ${clean(stat.value)} ${clean(p(stat.label))}`,
        ),
      );

      return locale === "fr"
        ? paragraphs(
            `${fullName} — ${rolesList}${profile.company ? `, actuellement chez ${clean(profile.company)}` : ""}, à ${clean(p(profile.location))}.`,
            bio,
            stats,
            "about.html dans la barre latérale développe, et experience.ts contient le parcours complet.",
          )
        : paragraphs(
            `${fullName} — ${rolesList}${profile.company ? `, currently at ${clean(profile.company)}` : ""}, based in ${clean(p(profile.location))}.`,
            bio,
            stats,
            "about.html in the sidebar goes further, and experience.ts has the full history.",
          );
    },
  },
];

function fallbackAnswer(locale: Locale): string {
  return locale === "fr"
    ? paragraphs(
        "Je tourne sans modèle de langage configuré : je ne peux répondre qu'aux questions courantes, à savoir le parcours, l'expérience, les projets, les compétences et les moyens de contact.",
        `Reformulez avec un de ces sujets, parcourez les fichiers de la barre latérale, ou écrivez directement à ${profile.email}.`,
      )
    : paragraphs(
        "I'm running without a language model configured, so I can only answer the common questions: background, experience, projects, skills, and how to get in touch.",
        `Try one of those, browse the files in the sidebar, or email ${profile.email} directly.`,
      );
}

export function cannedAnswer(question: string, locale: Locale): string {
  const q = question.toLowerCase();
  const match = canned.find((c) => c.keywords.some((k) => q.includes(k)));
  return match ? match.answer(locale) : fallbackAnswer(locale);
}
