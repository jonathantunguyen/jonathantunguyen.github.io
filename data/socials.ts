/**
 * Social and contact links, taken from the hyperlinks embedded in the résumé.
 *
 * `icon` is a key, not a component — the icon lookup lives in
 * `components/icon-map.tsx` so this file stays free of React imports.
 * (Note: LinkedIn renders a generic briefcase — lucide v1 dropped brand
 * glyphs and simple-icons doesn't carry LinkedIn.)
 */

import { t, type L } from "@/lib/i18n";

export type SocialIcon =
  | "github"
  | "linkedin"
  | "mail"
  | "twitter"
  | "youtube"
  | "instagram"
  | "globe"
  | "fileText";

export interface Social {
  /** Localized only where the word differs — "GitHub" is "GitHub" everywhere. */
  label: L<string>;
  href: string;
  icon: SocialIcon;
  /** Shown in the Contact pane under the label. */
  handle?: string;
}

export const socials: Social[] = [
  {
    label: t("GitHub", "GitHub"),
    href: "https://github.com/mrtunguyen",
    icon: "github",
    handle: "@mrtunguyen",
  },
  {
    label: t("LinkedIn", "LinkedIn"),
    href: "https://www.linkedin.com/in/thanh-tu/",
    icon: "linkedin",
    handle: "/in/thanh-tu",
  },
  {
    label: t("Email", "E-mail"),
    href: "mailto:jonathan.tunguyen@gmail.com",
    icon: "mail",
    handle: "jonathan.tunguyen@gmail.com",
  },
  {
    label: t("Blog", "Blog"),
    href: "https://mlforall.substack.com/",
    icon: "fileText",
    handle: "ML for All",
  },
  {
    label: t("Kaggle", "Kaggle"),
    href: "https://www.kaggle.com/thanhtu",
    icon: "globe",
    handle: "@thanhtu",
  },
];
