/**
 * Work history and education, newest first. Taken from
 * Jonathan-Nguyen-Resume.pdf.
 *
 * Job titles stay in English in both locales — that's the convention in French
 * tech CVs, and "Ingénieur Machine Learning Principal" reads worse than the
 * thing it translates. Dates and prose are localized.
 *
 * Note: several date ranges overlap (JovyanAI ran alongside Carrefour; DopikAI
 * alongside Voodoo). Only UpSlide is flagged `current`. If any of these were
 * side ventures or consulting, say so in the role title or a bullet — a reader
 * comparing dates will notice the overlap and wonder.
 */

import { t, type L } from "@/lib/i18n";

export interface Role {
  title: string;
  company: string;
  /** e.g. "Jun 2026 — Present". Free text so gaps and overlaps stay honest. */
  period: L<string>;
  location: L<string>;
  /** What you actually did. Lead each bullet with a verb. */
  bullets: L<string[]>;
  /** Tech chips for this role. */
  stack: string[];
  /** `true` renders a brand-coloured dot next to the period. */
  current?: boolean;
}

export interface Education {
  qualification: L<string>;
  institution: string;
  period: L<string>;
  /** Optional line for honours, relevant coursework, or a thesis title. */
  detail?: L<string>;
}

const paris = t("Paris, France", "Paris, France");

export const roles: Role[] = [
  {
    title: "Staff AI Engineer",
    company: "UpSlide",
    period: t("Jun 2026 — Present", "juin 2026 — aujourd'hui"),
    // ASSUMPTION: Paris, like your other roles — change if this one is London
    // or remote.
    location: paris,
    bullets: t(
      [
        "Built an AI-powered slide generator that turns a user's prompt into a polished, structured PowerPoint deck, cutting the manual effort of building slides from scratch.",
        "Developed the generation pipeline and the Office integration, improving slide consistency and reliability and keeping output aligned with professional design standards.",
      ],
      [
        "Conçu un générateur de slides propulsé par l'IA qui transforme le prompt d'un utilisateur en une présentation PowerPoint structurée et soignée, réduisant le travail manuel de création.",
        "Développé le pipeline de génération et l'intégration Office, améliorant la cohérence et la fiabilité des slides et gardant le résultat aligné sur les standards de design professionnels.",
      ],
    ),
    stack: ["Python", "LLMs", "PowerPoint / OOXML", "Office Add-ins"],
    current: true,
  },
  {
    title: "Lead Machine Learning Engineer",
    company: "Carrefour",
    // ASSUMPTION: end-dated to when UpSlide started. Your résumé still says
    // "Present" — if the two overlap, put "Feb 2024 — Present" back and decide
    // which role carries the `current` flag (two current roles render two
    // "current" dots, which reads as a bug).
    period: t("Feb 2024 — Jun 2026", "févr. 2024 — juin 2026"),
    location: paris,
    bullets: t(
      [
        "Built and deployed a deep learning computer vision system that detects and tracks fraud across more than 1,000 self-checkout registers in Europe, targeting a 2% revenue improvement.",
        "Cut the ML deployment cycle from three weeks to one day by building a Vertex AI–based MLOps platform that automates the end-to-end pipeline, and established the team's practices for ML system design and reproducibility.",
        "Deployed a deep learning people-counting system for real-time queue monitoring in stores, giving staffing decisions actual data to work from.",
        "Led a team of three ML engineers, delivering AI work across functional boundaries.",
      ],
      [
        "Conçu et déployé un système de vision par ordinateur en deep learning qui détecte et suit la fraude sur plus de 1 000 caisses automatiques en Europe, avec un objectif de 2 % de chiffre d'affaires supplémentaire.",
        "Réduit le cycle de déploiement ML de trois semaines à un jour en construisant une plateforme MLOps sur Vertex AI qui automatise le pipeline de bout en bout, et établi les pratiques de l'équipe en conception et reproductibilité des systèmes ML.",
        "Déployé un système de comptage de personnes en deep learning pour le suivi des files d'attente en temps réel, donnant enfin des données concrètes aux décisions de staffing.",
        "Encadré une équipe de trois ingénieurs ML, en livrant des projets IA au-delà des frontières entre équipes.",
      ],
    ),
    stack: ["Python", "PyTorch", "Computer Vision", "Vertex AI", "GCP", "MLOps"],
  },
  {
    title: "Cofounder & CTO",
    company: "JovyanAI",
    period: t("Dec 2024 — Dec 2025", "déc. 2024 — déc. 2025"),
    location: paris,
    bullets: t(
      [
        "Cofounded an AI copilot for data science and machine learning work, reaching €2,000 monthly recurring revenue.",
        "Built an assistant that automates data science workflows with intelligent code assistance, shortening the loop between idea and experiment.",
        "Designed and implemented the full-stack LLM system on Google Cloud — RAG pipelines, multi-agent architectures, Next.js and TypeScript front to back.",
      ],
      [
        "Cofondé un copilote IA pour la data science et le machine learning, jusqu'à 2 000 € de revenu récurrent mensuel.",
        "Construit un assistant qui automatise les workflows de data science avec de l'assistance de code intelligente, raccourcissant la boucle entre l'idée et l'expérience.",
        "Conçu et implémenté le système LLM full-stack sur Google Cloud : pipelines RAG, architectures multi-agents, Next.js et TypeScript de bout en bout.",
      ],
    ),
    stack: ["Python", "TypeScript", "Next.js", "LLMs", "RAG", "GCP"],
  },
  {
    title: "Lead Machine Learning Engineer",
    company: "DopikAI",
    period: t("Jan 2022 — Dec 2024", "janv. 2022 — déc. 2024"),
    location: paris,
    bullets: t(
      [
        "Delivered a production Facebook Messenger chatbot using RAG and text-to-SQL to answer apartment rental questions in context, at over 1,000 user requests a day.",
        "Built on-premise deep learning for extracting structured information from Vietnamese documents.",
      ],
      [
        "Livré un chatbot Facebook Messenger en production utilisant RAG et text-to-SQL pour répondre en contexte aux questions de location d'appartements, à plus de 1 000 requêtes par jour.",
        "Construit des modèles de deep learning on-premise pour extraire de l'information structurée de documents vietnamiens.",
      ],
    ),
    stack: ["Python", "RAG", "Text-to-SQL", "NLP", "Docker"],
  },
  {
    title: "Senior Machine Learning Engineer",
    company: "Voodoo",
    period: t("Dec 2021 — Jan 2024", "déc. 2021 — janv. 2024"),
    location: paris,
    bullets: t(
      [
        "Built an ad network from scratch — the layer between advertisers buying placements and publishers selling them — generating €1M in monthly revenue.",
        "Deployed ML models and a recommendation system for real-time bidding at over 100,000 impressions per second across 40 million daily active users.",
        "Improved the manual bidding process by more than 60% with models predicting user lifetime value, install volumes and margins.",
        "Automated user-acquisition bidding across mobile ad platforms for 200+ games and a $100M annual budget.",
        "Built an internal LLM Slackbot that answers employee questions against internal and external sources.",
      ],
      [
        "Construit un ad network de zéro — la couche entre les annonceurs qui achètent des emplacements et les éditeurs qui les vendent — générant 1 M€ de revenu mensuel.",
        "Déployé des modèles ML et un système de recommandation pour le real-time bidding à plus de 100 000 impressions par seconde, sur 40 millions d'utilisateurs actifs quotidiens.",
        "Amélioré de plus de 60 % le processus d'enchères manuel avec des modèles prédisant la valeur vie client, les volumes d'installation et les marges.",
        "Automatisé les enchères d'acquisition d'utilisateurs sur les plateformes publicitaires mobiles pour plus de 200 jeux et un budget annuel de 100 M$.",
        "Construit un Slackbot LLM interne qui répond aux questions des employés à partir de sources internes et externes.",
      ],
    ),
    stack: ["Python", "Real-Time Bidding", "Recommender Systems", "Spark", "AWS"],
  },
  {
    title: "Senior Machine Learning Engineer",
    company: "BNP Paribas Cardif",
    period: t("Dec 2020 — Dec 2021", "déc. 2020 — déc. 2021"),
    location: paris,
    bullets: t(
      [
        "Led the ML side of speech recognition R&D, recognising and translating Spanish, Italian and French speech to text.",
        "Halved the volume of audited calls — and the cost of auditing them — with a speech recognition and text audit pipeline built end to end, from annotation through training.",
        "Reached word error rates below 15% on very limited internal data using state-of-the-art unsupervised methods.",
        "Managed an intern and an AI resident researching unsupervised and self-supervised learning for speech.",
      ],
      [
        "Piloté le volet ML de la R&D en reconnaissance vocale : reconnaissance et transcription de l'espagnol, de l'italien et du français.",
        "Divisé par deux le volume d'appels audités — et leur coût — grâce à un pipeline de reconnaissance vocale et d'audit de texte construit de bout en bout, de l'annotation à l'entraînement.",
        "Atteint des taux d'erreur mot inférieurs à 15 % sur très peu de données internes, avec des méthodes non supervisées à l'état de l'art.",
        "Encadré un stagiaire et un AI resident en recherche sur l'apprentissage non supervisé et auto-supervisé pour la parole.",
      ],
    ),
    stack: ["Python", "PyTorch", "Speech Recognition", "Self-Supervised Learning"],
  },
  {
    title: "Machine Learning Engineer",
    company: "BNP Paribas Cardif",
    period: t("Apr 2018 — Dec 2020", "avr. 2018 — déc. 2020"),
    location: paris,
    bullets: t(
      [
        "Cut the time and cost of extracting information from documents by 60% with a scalable, production-ready extraction pipeline.",
        "Detected document layout and text using state-of-the-art object and text detection models.",
        "Built in-house recognition models reaching word error rates below 5%.",
        "Owned the Docker environment, API and CI/CD pipeline for deployment.",
      ],
      [
        "Réduit de 60 % le temps et le coût d'extraction d'information depuis des documents, avec un pipeline d'extraction scalable et prêt pour la production.",
        "Détecté la mise en page et le texte des documents avec des modèles de détection d'objets et de texte à l'état de l'art.",
        "Construit des modèles de reconnaissance maison atteignant des taux d'erreur mot inférieurs à 5 %.",
        "Pris en charge l'environnement Docker, l'API et le pipeline CI/CD pour le déploiement.",
      ],
    ),
    stack: ["Python", "Deep Learning", "OCR", "Docker", "CI/CD"],
  },
];

export const education: Education[] = [
  {
    qualification: t(
      "M.S.E, Financial Engineering",
      "Master, Ingénierie financière",
    ),
    institution: "Paris Dauphine University",
    period: t("Sep 2014 — Sep 2018", "sept. 2014 — sept. 2018"),
  },
  {
    qualification: t(
      "BSc, Economics and Management",
      "Licence, Économie et gestion",
    ),
    institution: "Paris Nanterre La Défense University",
    period: t("Sep 2012 — Jul 2014", "sept. 2012 — juil. 2014"),
    detail: t(
      "Ranked 2nd in cohort, Highest Honours.",
      "2e de promotion, mention très bien.",
    ),
  },
];
