import { SiteHtml } from "@/components/site-html";
import { localeMetadata, siteViewport } from "@/lib/metadata";
import "../globals.css";

/**
 * Root layout for the English route (`/`). There is a second root layout under
 * `app/(fr)` — route groups let each locale own its `<html lang>`, which a
 * single shared layout could not do.
 */
export const metadata = localeMetadata("en");
export const viewport = siteViewport;

export default function EnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SiteHtml locale="en">{children}</SiteHtml>;
}
