/**
 * Locales, localized-value helpers, and the UI string dictionary.
 *
 * Deliberately free of `"use client"` and of React: the chat route imports
 * `ui()` on the server. The client-side locale store lives in
 * `lib/locale-store.ts`.
 */

export const locales = ["en", "fr"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export function isLocale(value: unknown): value is Locale {
  return (
    typeof value === "string" && (locales as readonly string[]).includes(value)
  );
}

/**
 * A value that exists in both languages. Used for prose in `data/*` — anything
 * that reads the same in both (a tech name, a URL, a company) stays a plain
 * value instead.
 */
export type L<T> = Record<Locale, T>;

/** Shorthand for building a localized value: `t("Home", "Accueil")`. */
export const t = <T,>(en: T, fr: T): L<T> => ({ en, fr });

/** Resolve a localized value outside React (used by the chat route). */
export function pick<T>(value: L<T>, locale: Locale): T {
  return value[locale];
}

/* ------------------------------------------------------------------ *
 * UI strings. Content lives in `data/*`; this is the chrome around it.
 * ------------------------------------------------------------------ */

// No `as const` here: widening the literal types is what lets the French
// dictionary hold different strings while still being type-checked for shape.
const en = {
  menu: {
    file: "File",
    edit: "Edit",
    view: "View",
    run: "Run",
    help: "Help",
    goToFile: "Go to File…",
    openFiles: "Open",
    copyEmail: "Copy email address",
    copyLink: "Copy link to this section",
    copied: "Copied to clipboard",
    explorer: "Explorer",
    assistantPanel: "Assistant",
    theme: "Switch theme",
    language: "Language",
    askAssistant: "Ask the assistant",
    bookMeeting: "Book a meeting…",
    aboutSite: "About this site",
    elsewhere: "Elsewhere",
  },
  chrome: {
    assistant: "Assistant",
    explorer: "Explorer",
    quickOpen: "Quick open",
    sourceControl: "Source control",
    downloadResume: "Download résumé",
    contact: "Contact",
    toggleExplorer: "Toggle file explorer",
    toggleAssistant: "Toggle AI assistant",
    activityBar: "Activity bar",
    openFiles: "Open files",
    explorerHint: "These files are the sections of the site.",
    explorerHintKeys: "to jump between them",
    dismissHint: "Dismiss",
    close: (name: string) => `Close ${name}`,
    breadcrumb: "Breadcrumb",
    themeDark: "Tensor Dark",
    themeLight: "Tensor Light",
    switchToLight: "Switch to the light theme",
    switchToDark: "Switch to the dark theme",
    switchLanguage: "Read this site in French",
    languageSwitch: "EN → FR",
  },
  quickOpen: {
    title: "Go to file",
    description:
      "Search the files in this portfolio and press Enter to open one.",
    placeholder: "Go to file… or @ for symbols",
    empty: "No matches",
    symbolTitle: "Go to symbol",
    symbolHint: "@ for symbols · Ctrl/⌘ + Shift + O",
  },
  editor: {
    noFile: "No file open",
    goToFile: "Go to file",
  },
  assistant: {
    context: "Context",
    contextValue: "data/*.ts — read only",
    newConversation: "Start a new conversation",
    closePanel: "Close the assistant",
    send: "Send message",
    greetingTitle: "Ask about the work",
    greetingBody:
      "This assistant reads the same files you can open in the sidebar. It won't answer beyond them.",
    prompts: [
      "Summarise the ML experience",
      "What has shipped to production?",
      "Which frameworks and clouds?",
      "What was the work at Voodoo?",
      "Tell me about the Kaggle gold medal",
      "How do I get in touch?",
    ],
    label: "Ask about my work",
    placeholder: "Ask about my projects, experience, skills…",
    limitPlaceholder: (email: string) =>
      `Question limit reached — email ${email}`,
    perHour: (limit: number) => `${limit} questions an hour`,
    staticNote: "Answers from this site's own data files",
    left: (remaining: number, limit: number) =>
      `${remaining} of ${limit} questions left this hour`,
    thinking: "Thinking",
    role: "Assistant",
    disclaimer:
      "Answers are generated from the files in this repo. For anything you need to rely on, email me.",
    unreachable: "Couldn't reach the assistant. Check your connection.",
    unavailable: "The assistant is unavailable right now.",
    rateLimited:
      "That's the question limit for now — email me directly and I'll reply properly.",
    busy: "The assistant has answered all it can today. Email me and I'll reply properly.",
    refused: "I can't answer that one. Try asking about the work, or email me.",
    failed:
      "\n\nSomething went wrong on my end. Please try again, or email me directly.",
    tooLong: (max: number) => `Please keep questions under ${max} characters.`,
  },
  panes: {
    homeComment: "shipping models to production since 2018",
    /** Joins the current role to the company in the hero subtitle. */
    atCompany: "at",
    homeProjects: "Projects",
    homeAbout: "About Me",
    homeContact: "Contact",
    aboutComment: "a little more about me",
    aboutWho: "Who I Am",
    aboutEducation: "Education",
    projectsComment: "things I've built",
    projectsHeading: "Selected Work",
    projectsFeatured: "Featured",
    projectsHighlights: (count: number) =>
      `${count} highlight${count === 1 ? "" : "s"}`,
    skillsComment: "what I work with",
    experienceComment: "where I've worked",
    experienceHeading: "Experience",
    contactComment: "let's talk",
    contactHeading: "Get In Touch",
    contactElsewhere: "Elsewhere",
    contactResume: "Résumé",
    contactAskAssistant: "Ask my assistant",
    contactBook: "Book a meeting",
    meetingComment: "find a time that works",
    meetingHeading: "Book A Meeting",
    meetingIntro:
      "If it's easier to talk than to type, pick a slot. I'll come prepared — send a line about what you'd like to cover when you book and I'll read it beforehand.",
    meetingGoodFor: "Good for",
    meetingDurationLabel: "Length",
    meetingDuration: (minutes: number) => `${minutes} minutes`,
    meetingTimezoneLabel: "Timezone",
    meetingLoad: "Show the calendar",
    meetingOpen: "Open in a new tab",
    meetingPrivacy: (provider: string) =>
      `The calendar is hosted by ${provider}. It loads only when you ask it to, so nothing third-party runs here unless you want to book.`,
    meetingLoadedNote: (provider: string) =>
      `Calendar by ${provider} — booking and reminders are handled there.`,
    meetingUnset:
      "The booking calendar isn't connected yet. Email me and we'll find a time the old-fashioned way.",
    readmeIntro:
      "This portfolio is laid out like a code editor. The files in the sidebar are the sections of the site — open them the way you'd open a file. The panel on the right is an assistant that answers questions about my work using the same content you can read here.",
    readmeBuiltWith: "Built with",
    readmeShortcuts: "Keyboard shortcuts",
    readmeShortcutList: [
      ["Ctrl / ⌘ + P", "Go to file"],
      ["Ctrl / ⌘ + B", "Toggle the explorer"],
      ["Ctrl / ⌘ + J", "Toggle the assistant"],
      ["Ctrl / ⌘ + K", "Switch theme"],
      ["Esc", "Close the palette or a panel"],
    ] as [string, string][],
    readmeAssistantNote: "A note on the assistant",
    readmeAssistantBody:
      "The assistant only sees the content in this site's data files. It will say so when it doesn't know something rather than guessing — but it is a language model, so check anything that matters with me directly.",
  },
};

export type Dictionary = typeof en;

const fr: Dictionary = {
  menu: {
    file: "Fichier",
    edit: "Édition",
    view: "Affichage",
    run: "Exécuter",
    help: "Aide",
    goToFile: "Aller au fichier…",
    openFiles: "Ouvrir",
    copyEmail: "Copier l'adresse e-mail",
    copyLink: "Copier le lien vers cette section",
    copied: "Copié dans le presse-papiers",
    explorer: "Explorateur",
    assistantPanel: "Assistant",
    theme: "Changer de thème",
    language: "Langue",
    askAssistant: "Demander à l'assistant",
    bookMeeting: "Réserver un créneau…",
    aboutSite: "À propos de ce site",
    elsewhere: "Ailleurs",
  },
  chrome: {
    assistant: "Assistant",
    explorer: "Explorateur",
    quickOpen: "Ouverture rapide",
    sourceControl: "Gestion de versions",
    downloadResume: "Télécharger le CV",
    contact: "Contact",
    toggleExplorer: "Afficher ou masquer l'explorateur",
    toggleAssistant: "Afficher ou masquer l'assistant",
    activityBar: "Barre d'activité",
    openFiles: "Fichiers ouverts",
    explorerHint: "Ces fichiers sont les sections du site.",
    explorerHintKeys: "pour naviguer entre elles",
    dismissHint: "Masquer",
    close: (name: string) => `Fermer ${name}`,
    breadcrumb: "Fil d'Ariane",
    themeDark: "Tensor Sombre",
    themeLight: "Tensor Clair",
    switchToLight: "Passer au thème clair",
    switchToDark: "Passer au thème sombre",
    switchLanguage: "Read this site in English",
    languageSwitch: "FR → EN",
  },
  quickOpen: {
    title: "Aller au fichier",
    description:
      "Recherchez un fichier de ce portfolio et appuyez sur Entrée pour l'ouvrir.",
    placeholder: "Aller au fichier… ou @ pour les symboles",
    empty: "Aucun résultat",
    symbolTitle: "Aller au symbole",
    symbolHint: "@ pour les symboles · Ctrl/⌘ + Maj + O",
  },
  editor: {
    noFile: "Aucun fichier ouvert",
    goToFile: "Aller au fichier",
  },
  assistant: {
    context: "Contexte",
    contextValue: "data/*.ts — lecture seule",
    newConversation: "Démarrer une nouvelle conversation",
    closePanel: "Fermer l'assistant",
    send: "Envoyer le message",
    greetingTitle: "Posez vos questions sur mon travail",
    greetingBody:
      "Cet assistant lit les mêmes fichiers que ceux que vous pouvez ouvrir dans la barre latérale. Il ne répondra rien au-delà.",
    prompts: [
      "Résume l'expérience en ML",
      "Qu'est-ce qui est parti en production ?",
      "Quels frameworks et quels clouds ?",
      "Quel était le travail chez Voodoo ?",
      "Parle-moi de la médaille d'or Kaggle",
      "Comment vous contacter ?",
    ],
    label: "Posez une question sur mon travail",
    placeholder: "Mes projets, mon expérience, mes compétences…",
    limitPlaceholder: (email: string) =>
      `Limite de questions atteinte — écrivez-moi à ${email}`,
    perHour: (limit: number) => `${limit} questions par heure`,
    staticNote: "Réponses issues des fichiers de données de ce site",
    left: (remaining: number, limit: number) =>
      `${remaining} question${remaining === 1 ? "" : "s"} sur ${limit} restante${remaining === 1 ? "" : "s"} cette heure`,
    thinking: "Réflexion",
    role: "Assistant",
    disclaimer:
      "Les réponses sont générées à partir des fichiers de ce dépôt. Pour tout ce qui compte vraiment, écrivez-moi.",
    unreachable: "Impossible de joindre l'assistant. Vérifiez votre connexion.",
    unavailable: "L'assistant est indisponible pour le moment.",
    rateLimited:
      "C'est la limite de questions pour l'instant — écrivez-moi directement et je répondrai comme il faut.",
    busy: "L'assistant a répondu à tout ce qu'il pouvait aujourd'hui. Écrivez-moi et je répondrai comme il faut.",
    refused:
      "Je ne peux pas répondre à celle-là. Posez-moi une question sur le travail, ou écrivez-moi.",
    failed:
      "\n\nUn problème est survenu de mon côté. Réessayez, ou écrivez-moi directement.",
    tooLong: (max: number) =>
      `Merci de limiter les questions à ${max} caractères.`,
  },
  panes: {
    homeComment: "des modèles en production depuis 2018",
    atCompany: "chez",
    homeProjects: "Projets",
    homeAbout: "À propos",
    homeContact: "Contact",
    aboutComment: "quelques mots de plus sur moi",
    aboutWho: "Qui je suis",
    aboutEducation: "Formation",
    projectsComment: "ce que j'ai construit",
    projectsHeading: "Travaux sélectionnés",
    projectsFeatured: "À la une",
    projectsHighlights: (count: number) =>
      `${count} point${count === 1 ? "" : "s"} clé${count === 1 ? "" : "s"}`,
    skillsComment: "mes outils de travail",
    experienceComment: "où j'ai travaillé",
    experienceHeading: "Expérience",
    contactComment: "on en discute",
    contactHeading: "Me contacter",
    contactElsewhere: "Ailleurs",
    contactResume: "CV",
    contactAskAssistant: "Demander à mon assistant",
    contactBook: "Réserver un créneau",
    meetingComment: "trouver un créneau qui convient",
    meetingHeading: "Réserver Un Créneau",
    meetingIntro:
      "Si c'est plus simple d'en parler que de l'écrire, choisissez un créneau. J'arriverai préparé — indiquez en une ligne ce que vous souhaitez aborder et je le lirai avant.",
    meetingGoodFor: "Utile pour",
    meetingDurationLabel: "Durée",
    meetingDuration: (minutes: number) => `${minutes} minutes`,
    meetingTimezoneLabel: "Fuseau horaire",
    meetingLoad: "Afficher le calendrier",
    meetingOpen: "Ouvrir dans un nouvel onglet",
    meetingPrivacy: (provider: string) =>
      `Le calendrier est hébergé par ${provider}. Il ne se charge que si vous le demandez : rien de tiers ne s'exécute ici sans votre accord.`,
    meetingLoadedNote: (provider: string) =>
      `Calendrier fourni par ${provider} — la réservation et les rappels s'y passent.`,
    meetingUnset:
      "Le calendrier de réservation n'est pas encore connecté. Écrivez-moi et nous trouverons un créneau à l'ancienne.",
    readmeIntro:
      "Ce portfolio est présenté comme un éditeur de code. Les fichiers de la barre latérale sont les sections du site — ouvrez-les comme vous ouvririez un fichier. Le panneau de droite est un assistant qui répond aux questions sur mon travail à partir du même contenu que celui affiché ici.",
    readmeBuiltWith: "Réalisé avec",
    readmeShortcuts: "Raccourcis clavier",
    readmeShortcutList: [
      ["Ctrl / ⌘ + P", "Aller au fichier"],
      ["Ctrl / ⌘ + B", "Afficher l'explorateur"],
      ["Ctrl / ⌘ + J", "Afficher l'assistant"],
      ["Ctrl / ⌘ + K", "Changer de thème"],
      ["Échap", "Fermer la palette ou un panneau"],
    ] as [string, string][],
    readmeAssistantNote: "À propos de l'assistant",
    readmeAssistantBody:
      "L'assistant ne voit que le contenu des fichiers de données de ce site. Il le dira franchement quand il ne sait pas, plutôt que d'inventer — mais c'est un modèle de langage : vérifiez avec moi directement ce qui compte.",
  },
};

const dictionaries: Record<Locale, Dictionary> = { en, fr };

/** Dictionary lookup that works on both sides of the network boundary. */
export function ui(locale: Locale): Dictionary {
  return dictionaries[locale];
}
