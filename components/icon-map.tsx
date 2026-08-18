import {
  Briefcase,
  FileText,
  Globe,
  Mail,
  type LucideIcon,
} from "lucide-react";
import {
  siGithub,
  siInstagram,
  siX,
  siYoutube,
  type SimpleIcon,
} from "simple-icons";
import type { SocialIcon } from "@/data/socials";
import type { FileExt } from "@/lib/files";
import { cn } from "@/lib/utils";

/**
 * Brand marks come from simple-icons because lucide dropped brand glyphs in
 * v1. LinkedIn isn't in simple-icons either (trademark), so it falls back to a
 * generic lucide icon — every social control shows its label alongside the
 * icon, so nothing depends on the glyph alone to be identifiable.
 */
function brandIcon(icon: SimpleIcon): LucideIcon {
  const Brand = ({ className, ...props }: React.ComponentProps<"svg">) => (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={cn("size-4", className)}
      {...props}
    >
      <path d={icon.path} />
    </svg>
  );
  Brand.displayName = icon.title;
  // Brand marks are interchangeable with lucide icons at every call site.
  return Brand as unknown as LucideIcon;
}

export const socialIcons: Record<SocialIcon, LucideIcon> = {
  github: brandIcon(siGithub),
  twitter: brandIcon(siX),
  youtube: brandIcon(siYoutube),
  instagram: brandIcon(siInstagram),
  linkedin: Briefcase,
  mail: Mail,
  globe: Globe,
  fileText: FileText,
};

/**
 * Editor-style file badges: a small tinted square with the language mark,
 * the way VS Code's file icon theme reads at a glance.
 */
const badges: Record<FileExt, { mark: string; className: string }> = {
  tsx: { mark: "⚛", className: "bg-syntax-blue/15 text-syntax-blue" },
  ts: { mark: "TS", className: "bg-syntax-blue/15 text-syntax-blue" },
  js: { mark: "JS", className: "bg-syntax-yellow/15 text-syntax-yellow" },
  json: { mark: "{ }", className: "bg-syntax-yellow/15 text-syntax-yellow" },
  html: { mark: "<>", className: "bg-syntax-orange/15 text-syntax-orange" },
  css: { mark: "#", className: "bg-syntax-purple/15 text-syntax-purple" },
  md: { mark: "M↓", className: "bg-brand/15 text-brand" },
  ics: { mark: "31", className: "bg-syntax-green/15 text-syntax-green" },
  pdf: { mark: "PDF", className: "bg-syntax-red/15 text-syntax-red" },
};

export function FileIcon({
  ext,
  className,
}: {
  ext: FileExt;
  className?: string;
}) {
  const badge = badges[ext];
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex size-5 shrink-0 items-center justify-center rounded-[3px] text-[9px] leading-none font-bold",
        badge.className,
        className,
      )}
    >
      {badge.mark}
    </span>
  );
}
