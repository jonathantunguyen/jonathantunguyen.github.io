import { ogCard, ogSize } from "@/components/og-card";
import { fullName } from "@/data/profile";

export const alt = `${fullName} — Portfolio`;
export const size = ogSize;
export const contentType = "image/png";

export default async function OpengraphImageFr() {
  return ogCard("fr");
}
