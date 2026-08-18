/**
 * Maps a technology name to one of the editor's syntax colors, so a stack chip
 * says something at a glance instead of being one more grey pill.
 *
 * The categories are the ones a reader actually distinguishes — language,
 * modelling, cloud/data, tooling — and anything unrecognised stays neutral
 * rather than being assigned a color at random. Keys are matched
 * case-insensitively as substrings, so "GCP / Vertex AI" hits "gcp".
 */

import type { SyntaxColor } from "@/data/skills";

const rules: [readonly string[], SyntaxColor][] = [
  // Languages
  [["python", "typescript", "javascript", "sql", "c#", "rust", "go", "scala"], "blue"],
  // Modelling and ML frameworks
  [
    ["pytorch", "tensorflow", "keras", "scikit", "deep learning", "computer vision", "xgboost", "transformers"],
    "orange",
  ],
  // LLM / generative
  [["llm", "rag", "gpt", "claude", "gemini", "prompt", "resume parsing", "ats"], "green"],
  // Cloud, data platforms and infrastructure
  [
    ["gcp", "vertex", "aws", "sagemaker", "lambda", "azure", "kafka", "postgres", "bigquery", "spark", "airflow", "dbt", "snowflake"],
    "purple",
  ],
  // Tooling and delivery
  [["docker", "kubernetes", "mlflow", "jenkins", "ci", "terraform", "git"], "yellow",],
];

export function techColor(tech: string): SyntaxColor | null {
  const name = tech.toLowerCase();
  for (const [needles, color] of rules) {
    if (needles.some((needle) => name.includes(needle))) return color;
  }
  return null;
}
