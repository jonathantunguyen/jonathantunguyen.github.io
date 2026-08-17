/**
 * Skills, grouped into the two-column card layout of the Skills pane.
 *
 * The *names* come from the résumé's skills section and work history. The
 * *numbers* do not — a résumé doesn't rate itself, so these are a first pass
 * for you to correct. They're self-assessment, and they should be yours.
 * Keep them coarse (65 / 80 / 90); precise-looking figures read as false
 * precision.
 */

import { t, type L } from "@/lib/i18n";

export type SyntaxColor =
  | "green"
  | "orange"
  | "purple"
  | "red"
  | "yellow"
  | "blue";

export interface Skill {
  name: string;
  level: number;
  color: SyntaxColor;
}

export interface SkillGroup {
  /** Rendered uppercase and letter-spaced, like a section header. */
  title: L<string>;
  skills: Skill[];
}

/** Skill names are tech names — identical in both locales, so not localized. */
export const skillGroups: SkillGroup[] = [
  {
    title: t("Machine Learning", "Machine learning"),
    skills: [
      { name: "Deep Learning", level: 95, color: "purple" },
      { name: "Computer Vision", level: 90, color: "green" },
      { name: "LLMs & RAG", level: 90, color: "blue" },
      { name: "Recommender Systems", level: 85, color: "orange" },
      { name: "Speech Recognition", level: 80, color: "yellow" },
    ],
  },
  {
    title: t("Languages", "Langages"),
    skills: [
      { name: "Python", level: 95, color: "green" },
      { name: "SQL", level: 85, color: "orange" },
      { name: "C#", level: 75, color: "purple" },
      { name: "TypeScript", level: 75, color: "blue" },
      { name: "JavaScript", level: 75, color: "yellow" },
      { name: "Scala", level: 65, color: "red" },
    ],
  },
  {
    title: t("ML Frameworks", "Frameworks ML"),
    skills: [
      { name: "PyTorch", level: 95, color: "orange" },
      { name: "TensorFlow", level: 80, color: "orange" },
      { name: "Keras", level: 75, color: "red" },
      { name: "Spark", level: 75, color: "yellow" },
      { name: "scikit-learn", level: 85, color: "blue" },
    ],
  },
  {
    title: t("Cloud & Data", "Cloud et données"),
    skills: [
      { name: "GCP / Vertex AI", level: 90, color: "blue" },
      { name: "AWS (SageMaker, Lambda)", level: 80, color: "orange" },
      { name: "PostgreSQL", level: 80, color: "blue" },
      { name: "Kafka", level: 70, color: "purple" },
      { name: "Elasticsearch", level: 70, color: "green" },
    ],
  },
  {
    title: t("MLOps", "MLOps"),
    skills: [
      { name: "Docker", level: 90, color: "blue" },
      { name: "Airflow", level: 80, color: "green" },
      { name: "MLflow", level: 80, color: "purple" },
      { name: "Kubernetes", level: 80, color: "blue" },
      { name: "Terraform", level: 70, color: "purple" },
    ],
  },
  {
    title: t("Also On My Desk", "Aussi sur mon bureau"),
    skills: [
      { name: "PowerPoint / OOXML", level: 80, color: "red" },
      { name: "Jenkins / CI-CD", level: 80, color: "green" },
      { name: "DBT", level: 65, color: "orange" },
      { name: "Tableau", level: 60, color: "yellow" },
      { name: "Next.js", level: 70, color: "purple" },
    ],
  },
];

/** Maps a skill color onto its CSS custom property. */
export const syntaxVar: Record<SyntaxColor, string> = {
  green: "var(--syntax-green)",
  orange: "var(--syntax-orange)",
  purple: "var(--syntax-purple)",
  red: "var(--syntax-red)",
  yellow: "var(--syntax-yellow)",
  blue: "var(--syntax-blue)",
};
