import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

/**
 * Every pane sits on this: a scrolling editor surface with a comfortable
 * measure. `id` doubles as the scroll container's accessible name.
 *
 * Prose is set in `font-sans`. The monospace conceit lives in the chrome and in
 * the code-ish bits inside a pane — comment lines, headings, chips, dates, tech
 * names — which opt back in explicitly. Long paragraphs in monospace cost real
 * reading speed and the metaphor doesn't depend on them.
 *
 * `@container` makes the pane itself the query context, so layouts respond to
 * how wide the editor actually is rather than the viewport — the editor loses
 * ~700px when the explorer and assistant are both open.
 */
export function Pane({
  title,
  children,
  className,
}: {
  /** Accessible name for the region — not rendered. */
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      aria-label={title}
      className={cn(
        "@container mx-auto w-full max-w-4xl px-5 py-8 font-sans sm:px-8 sm:py-10",
        className,
      )}
    >
      {children}
    </section>
  );
}

/** Uppercase, letter-spaced heading with a hairline under it. */
export function SectionHeading({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-5", className)}>
      <h2 className="text-syntax-yellow font-mono text-sm font-semibold tracking-[0.22em] uppercase">
        {children}
      </h2>
      <Separator className="mt-2" />
    </div>
  );
}

/** A `// comment` line, the way each pane introduces itself. */
export function CommentLine({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-syntax-green mb-6 font-mono text-sm sm:text-base">
      <span className="text-muted-foreground">{"// "}</span>
      {children}
    </p>
  );
}

/**
 * Renders `**highlighted**` spans in the brand color. Kept deliberately
 * simple — this is emphasis, not a Markdown renderer.
 */
export function Highlighted({ text }: { text: string }) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <span key={i} className="text-brand font-medium">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}
