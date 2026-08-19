/**
 * Core identity and hero content.
 *
 * Populated from Jonathan-Nguyen-Resume.pdf. Prose is bilingual via `t(en, fr)`
 * — the French is a translation, so reread the bio and About paragraphs where
 * voice matters most. Anything that was a judgement call rather than a fact
 * from the résumé is marked `REVIEW:`.
 */

import { t, type L } from "@/lib/i18n";

export interface Stat {
  /** Big value, e.g. "8+". Keep it short — it renders at 2rem. */
  value: string;
  /** Label under the value, rendered uppercase. */
  label: L<string>;
}

export interface Profile {
  firstName: string;
  lastName: string;
  /** Short role chips under the name. 2–4 reads best. */
  roles: L<string>[];
  /** Current employer chip, or null to hide it. */
  company: string | null;
  /**
   * Hero taglines. The first one is canonical — it is what the assistant
   * quotes and what shows before JavaScript runs; the hero types through the
   * rest and loops. One entry is valid and simply renders static.
   */
  taglines: L<string[]>;
  /**
   * Hero paragraph. Words wrapped in `**double asterisks**` render in the
   * brand color, the way keywords highlight in an editor.
   */
  bio: L<string>;
  /** Longer prose for the About pane, one paragraph per array entry. */
  about: L<string[]>;
  location: L<string>;
  email: string;
  /** Path under /public. Rendered as a downloadable "file" in the explorer. */
  resumePath: string;
  /** Availability line in the Contact pane. */
  availability: L<string>;
  stats: Stat[];
}

export const profile: Profile = {
  firstName: "Jonathan",
  lastName: "Nguyen",
  roles: [
    t("Staff AI Engineer", "Staff AI Engineer"),
    t("Deep Learning", "Deep Learning"),
    t("LLM Systems", "Systèmes LLM"),
  ],
  company: "UpSlide",
  // REVIEW: how you'd introduce yourself, in descending order of how current
  // it is. The first two are titles you actually held (see experience.ts); the
  // last two are the parts of the job that aren't a title. Keep them short —
  // the longest one sets the height of the line.
  taglines: t(
    [
      "Staff AI Engineer",
      "Lead Machine Learning Engineer",
      "Cofounder & CTO",
      "Kaggle Gold Medalist",
      "AI Enthusiast",
    ],
    [
      // The two titles stay in English, the way `roles` above keeps them.
      "Staff AI Engineer",
      "Lead Machine Learning Engineer",
      "Cofondateur & CTO",
      "Médaillé d'or Kaggle",
      "Passionné d'IA",
    ],
  ),
  bio: t(
    "I build **LLM** and **computer vision** systems that run at scale — decks " +
      "generated from a prompt, fraud detection across a thousand retail checkouts, " +
      "and real-time bidding at a hundred thousand requests a second.",
    "Je construis des systèmes **LLM** et de **vision par ordinateur** qui tiennent " +
      "à l'échelle : des présentations générées depuis un prompt, la détection de " +
      "fraude sur un millier de caisses automatiques, et du real-time bidding à cent " +
      "mille requêtes par seconde.",
  ),
  about: t(
    [
      "I'm a machine learning engineer in Paris. Eight years in, most of my work has been the part after the model trains: getting deep learning systems into production, keeping them reproducible, and making sure the numbers still hold when real traffic hits them.",
      "That's taken me through speech recognition and document understanding at BNP Paribas Cardif, real-time bidding and recommendation at Voodoo, and computer vision for retail fraud at Carrefour, where I led the ML team. Alongside that I cofounded JovyanAI, an AI copilot for data science work, which is where I got deep into RAG pipelines and multi-agent architectures.",
      "Now I'm a Staff AI Engineer at UpSlide, building an AI slide generator: a prompt in, a structured PowerPoint deck out. The interesting part isn't the model — it's the generation pipeline and the Office integration, where output has to be consistent, reliable, and hold up against professional design standards every time.",
      "Before all of that I studied financial engineering at Paris Dauphine. I still spend competitive energy on Kaggle — a gold medal in a molecular-property competition turned into a PLOS ONE paper on NMR prediction models.",
    ],
    [
      "Je suis ingénieur machine learning à Paris. Huit ans plus tard, l'essentiel de mon travail se situe après l'entraînement du modèle : mettre des systèmes de deep learning en production, les garder reproductibles, et vérifier que les chiffres tiennent encore quand le trafic réel arrive.",
      "Cela m'a mené de la reconnaissance vocale et de la compréhension de documents chez BNP Paribas Cardif au real-time bidding et à la recommandation chez Voodoo, puis à la vision par ordinateur pour la fraude en magasin chez Carrefour, où j'ai encadré l'équipe ML. En parallèle, j'ai cofondé JovyanAI, un copilote IA pour la data science : c'est là que je me suis plongé dans les pipelines RAG et les architectures multi-agents.",
      "Aujourd'hui je suis Staff AI Engineer chez UpSlide, où je construis un générateur de slides : un prompt en entrée, une présentation PowerPoint structurée en sortie. Le plus intéressant n'est pas le modèle — c'est le pipeline de génération et l'intégration Office, où le résultat doit être cohérent, fiable et à la hauteur des standards de design professionnels à chaque exécution.",
      "Avant tout cela, j'ai étudié l'ingénierie financière à Paris Dauphine. Je garde une part de mon énergie compétitive pour Kaggle : une médaille d'or sur une compétition de propriétés moléculaires est devenue un article dans PLOS ONE sur la prédiction de propriétés RMN.",
    ],
  ),
  location: t("Paris, France", "Paris, France"),
  email: "jonathan.tunguyen@gmail.com",
  // Keep this filename ASCII-only: accented characters get stored with
  // different Unicode normalisation on different filesystems, which breaks the
  // URL after deploy.
  resumePath: "/resume/Jonathan-Nguyen-Resume.pdf",
  // REVIEW: says nothing about job-seeking either way — adjust to taste.
  availability: t(
    "Always happy to talk about applied ML, computer vision and LLM systems in production.",
    "Toujours partant pour discuter de ML appliqué, de vision par ordinateur et de systèmes LLM en production.",
  ),
  // REVIEW: drawn from the résumé, but pick the ones you'd actually want a
  // recruiter to read first. The grid lays itself out from however many there
  // are, so adding or removing one needs no component change.
  stats: [
    { value: "8+", label: t("Years in ML", "Ans en ML") },
    { value: "6", label: t("Companies", "Entreprises") },
    // "Gold" sat in a slot otherwise filled by numbers, weakening the pattern;
    // the count goes in the value and the medal in the label.
    { value: "1×", label: t("Kaggle Gold Medal", "Médaille d'or Kaggle") },
  ],
};

export const fullName = `${profile.firstName} ${profile.lastName}`;

/** Lowercase-hyphenated name, used as the workspace name in the IDE chrome. */
export const workspaceName = `${profile.firstName}-${profile.lastName}`.toLowerCase();
