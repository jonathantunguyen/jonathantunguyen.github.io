import { ogCard, ogSize } from "@/components/og-card";
import { fullName } from "@/data/profile";

export const alt = `${fullName} — Portfolio`;
export const size = ogSize;
export const contentType = "image/png";

// Required by output: export: the card is generated once at build time.
export const dynamic = "force-static";

export default async function OpengraphImageFr() {
  return ogCard("fr");
}
