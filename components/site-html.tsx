import { Inter, JetBrains_Mono, Outfit } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LocaleProvider } from "@/lib/locale-context";
import type { Locale } from "@/lib/i18n";

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

/** Used only for the oversized name in the hero. */
const display = Outfit({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["800"],
  display: "swap",
});

/**
 * Applies the stored theme before first paint. The document is server-rendered
 * dark, so this only has work to do when the visitor previously chose light —
 * which keeps it to two lines and avoids a flash of the wrong theme.
 *
 * Language is deliberately *not* handled here: it's decided by the route
 * (`/` vs `/fr`), so there's nothing to restore and no chance of a mismatch.
 */
const themeScript = `
try {
  if (localStorage.getItem('portfolio-theme') === 'light') {
    document.documentElement.classList.remove('dark');
  }
} catch (e) {}
`.trim();

/**
 * The shared document shell. Both root layouts — one per locale route group —
 * render this, so the only thing that differs between them is `lang` and the
 * metadata they export.
 */
export function SiteHtml({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  return (
    <html
      lang={locale}
      className={`dark ${mono.variable} ${sans.variable} ${display.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      {/* Rendered as a direct child of <html> rather than inside an explicit
          <head>: React hoists it, and the App Router lint rule against a
          hand-written <head> stays satisfied. */}
      <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      <body className="bg-chrome text-foreground h-full overflow-hidden font-mono">
        <LocaleProvider locale={locale}>
          <TooltipProvider delay={300}>{children}</TooltipProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
