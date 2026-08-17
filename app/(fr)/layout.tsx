import { SiteHtml } from "@/components/site-html";
import { localeMetadata, siteViewport } from "@/lib/metadata";
import "../globals.css";

/** Root layout for the French route (`/fr`). See `app/(en)/layout.tsx`. */
export const metadata = localeMetadata("fr");
export const viewport = siteViewport;

export default function FrLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SiteHtml locale="fr">{children}</SiteHtml>;
}
