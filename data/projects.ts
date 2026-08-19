/**
 * Portfolio projects, newest first.
 *
 * The résumé has no separate projects section, so these are drawn from the
 * systems described in the work history plus the Kaggle/publication work.
 * Two consequences worth knowing:
 *
 * 1. Most have no public link — the work is internal. That's normal for ML
 *    roles, and empty `links` renders cleanly (no footer on the card).
 * 2. If any of this is under NDA or you'd rather not describe it publicly,
 *    delete the entry. Nothing here came from anywhere but your own résumé,
 *    but a résumé sent to a recruiter and a page on the open web are
 *    different audiences.
 */

import { t, type L } from "@/lib/i18n";

export interface ProjectLink {
  label: L<string>;
  href: string;
}

export interface Project {
  name: L<string>;
  /** One or two sentences: what it is and who it's for. */
  summary: L<string>;
  /** Bullet points — the interesting engineering decisions, not a feature list. */
  highlights: L<string[]>;
  /** Tech chips. Order matters; lead with what's most relevant. */
  stack: string[];
  links: ProjectLink[];
  /** e.g. "2026 — present". Shown right-aligned in the card header. */
  period: L<string>;
  /** Pinned projects render first regardless of array order. */
  featured?: boolean;
}

const site = t("Site", "Site");
const paper = t("Paper", "Article");

export const projects: Project[] = [
  {
    name: t("AI Slide Generator", "Générateur de slides IA"),
    summary: t(
      "A prompt goes in, a polished and structured PowerPoint deck comes out. Built at UpSlide for the people who make client-ready decks all day.",
      "Un prompt en entrée, une présentation PowerPoint structurée et soignée en sortie. Construit chez UpSlide pour ceux qui produisent des décks clients à longueur de journée.",
    ),
    highlights: t(
      [
        "Built the generation pipeline and the Office integration end to end.",
        "The hard requirement isn't fluency, it's consistency: slides have to be reliable and hold up against professional design standards on every run, not just the demo.",
      ],
      [
        "Pipeline de génération et intégration Office construits de bout en bout.",
        "La contrainte difficile n'est pas la fluidité mais la constance : les slides doivent être fiables et tenir face aux standards de design professionnels à chaque exécution, pas seulement pour la démo.",
      ],
    ),
    stack: ["Python", "LLMs", "PowerPoint / OOXML", "Office Add-ins"],
    links: [],
    period: t("2026 — present", "2026 — aujourd'hui"),
    featured: true,
  },
  {
    // ASSUMPTION: description written from what betterjobshunt.com says about
    // itself. Confirm three things I couldn't know from the site: your role
    // (solo? cofounded?), the period, and the real stack chips below.
    name: t("BetterJobsHunt", "BetterJobsHunt"),
    summary: t(
      "An AI job-search workspace for people who'd rather send ten targeted applications than a hundred blind ones. Scores job fit, rewrites experience into STAR bullets, and tracks the whole pipeline in one place.",
      "Un espace de recherche d'emploi propulsé par l'IA, pensé pour ceux qui préfèrent dix candidatures ciblées à cent envoyées à l'aveugle. Il évalue l'adéquation à l'offre, réécrit l'expérience en bullets STAR et suit tout le pipeline au même endroit.",
    ),
    highlights: t(
      [
        "Fit and ATS scoring with keyword gap analysis, so a candidate sees what's missing before they apply rather than after the rejection.",
        "Human-in-the-loop by design: the model drafts and rewrites, but nothing is auto-submitted — every application needs approval before it leaves.",
        "Pipeline tracking with follow-up reminders, company research briefings and interview prep packs, plus pattern analysis across outcomes.",
        "Subscription product with a free tier and credit-based usage, live and taking customers.",
      ],
      [
        "Score d'adéquation et de compatibilité ATS avec analyse des mots-clés manquants : le candidat voit ce qui manque avant de postuler, pas après le refus.",
        "Human-in-the-loop par conception : le modèle rédige et réécrit, mais rien n'est envoyé automatiquement — chaque candidature passe par une validation.",
        "Suivi du pipeline avec rappels de relance, fiches de recherche entreprise et préparation d'entretien, plus une analyse des tendances de résultats.",
        "Produit en abonnement avec offre gratuite et usage à crédits, en ligne et avec des clients.",
      ],
    ),
    // TODO: replace with the real stack — these are capabilities inferred from
    // the product, not the frameworks and infrastructure you actually used.
    stack: ["LLMs", "Resume Parsing", "ATS Matching", "SaaS"],
    links: [{ label: site, href: "https://betterjobshunt.com/" }],
    period: t("2026 — present", "2026 — aujourd'hui"),
    featured: true,
  },
  {
    name: t(
      "Self-Checkout Fraud Detection",
      "Détection de fraude en caisse automatique",
    ),
    summary: t(
      "A deep learning computer vision system that detects and tracks fraud at self-checkout across Carrefour's European estate.",
      "Un système de vision par ordinateur en deep learning qui détecte et suit la fraude aux caisses automatiques sur le parc européen de Carrefour.",
    ),
    highlights: t(
      [
        "Runs across more than 1,000 registers, targeting a 2% revenue improvement.",
        "Built for the messy end of CV: varied store lighting, occlusion, and a false-positive budget that has to keep cashiers' trust.",
      ],
      [
        "Tourne sur plus de 1 000 caisses, avec un objectif de 2 % de chiffre d'affaires supplémentaire.",
        "Conçu pour le côté ingrat de la vision : éclairages de magasin variables, occlusions, et un budget de faux positifs qui doit préserver la confiance des équipes en caisse.",
      ],
    ),
    stack: ["Python", "PyTorch", "Computer Vision", "GCP"],
    links: [],
    period: t("2024 — 2026", "2024 — 2026"),
    featured: true,
  },
  {
    name: t("Vertex AI MLOps Platform", "Plateforme MLOps sur Vertex AI"),
    summary: t(
      "An internal platform that automates the end-to-end ML pipeline, from training through deployment and monitoring.",
      "Une plateforme interne qui automatise le pipeline ML de bout en bout, de l'entraînement au déploiement et au monitoring.",
    ),
    highlights: t(
      [
        "Took the deployment cycle from three weeks to one day.",
        "Made reproducibility the default rather than a per-project effort — the same practices now apply across the team's models.",
      ],
      [
        "Cycle de déploiement ramené de trois semaines à un jour.",
        "Reproductibilité devenue la norme plutôt qu'un effort projet par projet — les mêmes pratiques s'appliquent désormais à tous les modèles de l'équipe.",
      ],
    ),
    stack: ["Vertex AI", "GCP", "Terraform", "Docker", "Airflow"],
    links: [],
    period: t("2024", "2024"),
  },
  {
    name: t("JovyanAI", "JovyanAI"),
    summary: t(
      "An AI copilot for data science and machine learning work — code assistance and faster experimentation for people who live in notebooks. Cofounded as CTO.",
      "Un copilote IA pour la data science et le machine learning : assistance de code et expérimentation plus rapide pour ceux qui vivent dans des notebooks. Cofondé en tant que CTO.",
    ),
    highlights: t(
      [
        "Reached €2,000 monthly recurring revenue.",
        "Full-stack LLM system on Google Cloud: RAG pipelines, multi-agent architectures, Next.js and TypeScript.",
      ],
      [
        "Jusqu'à 2 000 € de revenu récurrent mensuel.",
        "Système LLM full-stack sur Google Cloud : pipelines RAG, architectures multi-agents, Next.js et TypeScript.",
      ],
    ),
    stack: ["LLMs", "RAG", "Multi-Agent", "Next.js", "TypeScript", "GCP"],
    links: [{ label: site, href: "https://www.jovyan-ai.com/" }],
    period: t("2024 — 2025", "2024 — 2025"),
    featured: true,
  },
  {
    name: t("Real-Time Bidding & Ad Network", "Real-Time Bidding et ad network"),
    summary: t(
      "An ad network built from scratch at Voodoo, plus the ML that decides what to bid, for a portfolio of mobile games with hundreds of millions of players.",
      "Un ad network construit de zéro chez Voodoo, avec le ML qui décide des enchères, pour un portefeuille de jeux mobiles comptant des centaines de millions de joueurs.",
    ),
    highlights: t(
      [
        "Generated €1M in monthly revenue as the layer between advertisers and publishers.",
        "Served recommendations and bids at over 100,000 impressions per second across 40 million daily active users.",
        "Automated user-acquisition bidding for 200+ games against a $100M annual budget, replacing a manual process it improved on by 60%.",
      ],
      [
        "1 M€ de revenu mensuel généré en tant que couche entre annonceurs et éditeurs.",
        "Recommandations et enchères servies à plus de 100 000 impressions par seconde, sur 40 millions d'utilisateurs actifs quotidiens.",
        "Enchères d'acquisition automatisées pour plus de 200 jeux et un budget annuel de 100 M$, en remplacement d'un processus manuel amélioré de 60 %.",
      ],
    ),
    stack: ["Python", "Recommender Systems", "Real-Time Bidding", "Spark", "AWS"],
    links: [],
    period: t("2021 — 2024", "2021 — 2024"),
  },
  {
    name: t("NMR Property Prediction", "Prédiction de propriétés RMN"),
    summary: t(
      "A machine learning strategy for predicting magnetic interaction between atoms in a molecule — a Kaggle gold medal that became a peer-reviewed paper.",
      "Une stratégie de machine learning pour prédire l'interaction magnétique entre atomes dans une molécule — une médaille d'or Kaggle devenue un article évalué par des pairs.",
    ),
    highlights: t(
      [
        "Gold medal against roughly 3,000 participants.",
        "Published in PLOS ONE as a machine learning strategy for finding NMR property prediction models.",
      ],
      [
        "Médaille d'or face à environ 3 000 participants.",
        "Publié dans PLOS ONE comme stratégie de machine learning pour trouver des modèles de prédiction de propriétés RMN.",
      ],
    ),
    stack: ["Python", "PyTorch", "Graph Neural Networks"],
    links: [{ label: paper, href: "https://arxiv.org/abs/2008.05994" }],
    period: t("2020", "2020"),
    featured: true,
  },
  {
    name: t(
      "Vietnamese Document & Rental Assistant",
      "Assistant documents et location (Vietnam)",
    ),
    summary: t(
      "Two production NLP systems at DopikAI: a rental-enquiry chatbot and on-premise information extraction for Vietnamese documents.",
      "Deux systèmes NLP en production chez DopikAI : un chatbot pour les demandes de location et de l'extraction d'information on-premise pour des documents vietnamiens.",
    ),
    highlights: t(
      [
        "The chatbot combined RAG with text-to-SQL to answer apartment questions in context, at over 1,000 requests a day.",
        "Document extraction ran on-premise, which shaped every decision about model size and inference cost.",
      ],
      [
        "Le chatbot combinait RAG et text-to-SQL pour répondre en contexte aux questions sur les appartements, à plus de 1 000 requêtes par jour.",
        "L'extraction documentaire tournait on-premise, ce qui a conditionné chaque décision sur la taille des modèles et le coût d'inférence.",
      ],
    ),
    stack: ["Python", "RAG", "Text-to-SQL", "NLP", "Docker"],
    links: [{ label: site, href: "https://dopikai.com/" }],
    period: t("2022 — 2024", "2022 — 2024"),
  },
  {
    name: t(
      "Multilingual Speech Recognition",
      "Reconnaissance vocale multilingue",
    ),
    summary: t(
      "Speech-to-text R&D at BNP Paribas Cardif across Spanish, Italian and French, built to make call auditing affordable rather than to chase a benchmark.",
      "R&D de reconnaissance vocale chez BNP Paribas Cardif en espagnol, italien et français, conçue pour rendre l'audit des appels abordable plutôt que pour courir après un benchmark.",
    ),
    highlights: t(
      [
        "Halved both the volume of audited calls and the cost of auditing them, with a recognition and text-audit pipeline built end to end from annotation through training.",
        "Reached word error rates below 15% on very limited internal data, which is what made unsupervised and self-supervised methods the point rather than a nice-to-have.",
        "Led the ML side of the work, including the research track on self-supervised learning for speech.",
      ],
      [
        "Divisé par deux le volume d'appels audités et leur coût, avec un pipeline de reconnaissance et d'audit de texte construit de bout en bout, de l'annotation à l'entraînement.",
        "Atteint des taux d'erreur mot inférieurs à 15 % sur très peu de données internes — c'est ce qui a rendu les méthodes non supervisées et auto-supervisées essentielles plutôt qu'optionnelles.",
        "Piloté le volet ML, y compris la recherche sur l'apprentissage auto-supervisé pour la parole.",
      ],
    ),
    stack: [
      "Python",
      "PyTorch",
      "Speech Recognition",
      "Self-Supervised Learning",
    ],
    links: [],
    period: t("2020 — 2021", "2020 — 2021"),
  },
  {
    name: t("Document OCR Pipeline", "Pipeline OCR documentaire"),
    summary: t(
      "A production document-extraction pipeline at BNP Paribas Cardif: find the layout, find the text, read it, and do it at the volume an insurer actually receives.",
      "Un pipeline d'extraction documentaire en production chez BNP Paribas Cardif : détecter la mise en page, détecter le texte, le lire — au volume que reçoit réellement un assureur.",
    ),
    highlights: t(
      [
        "Cut the time and cost of extracting information from documents by 60%.",
        "Detected layout and text with object- and text-detection models, then read it with in-house recognition models reaching word error rates below 5%.",
        "Owned the deployment path as well as the models — the Docker environment, the API and the CI/CD pipeline.",
      ],
      [
        "Réduit de 60 % le temps et le coût d'extraction d'information depuis des documents.",
        "Détecté la mise en page et le texte avec des modèles de détection d'objets et de texte, puis lecture par des modèles de reconnaissance maison atteignant des taux d'erreur mot inférieurs à 5 %.",
        "Pris en charge le chemin de déploiement autant que les modèles : environnement Docker, API et pipeline CI/CD.",
      ],
    ),
    stack: ["Python", "Deep Learning", "OCR", "Computer Vision", "Docker", "CI/CD"],
    links: [],
    period: t("2018 — 2020", "2018 — 2020"),
  },
];

/** Featured projects first, original order preserved within each group. */
export const sortedProjects = [...projects].sort(
  (a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)),
);
