/**
 * The small subset of Markdown the assistant is allowed to use.
 *
 * Deliberately hand-rolled rather than a library: the panel needs paragraphs,
 * bullets, emphasis, inline code and links, and nothing else. A general parser
 * would be several times the bundle for features (tables, images, raw HTML) that
 * would look wrong in a 340px column anyway.
 *
 * Everything is built as React elements — no `dangerouslySetInnerHTML` — so
 * model output can't inject markup, and link hrefs are restricted to http(s)
 * so a `javascript:` URL can never be rendered as clickable.
 *
 * It also has to cope with *partial* input: answers stream in, so this parses a
 * half-finished string on every frame. Unterminated emphasis simply renders as
 * the literal asterisks until the closing pair arrives.
 */

import { Fragment, type ReactNode } from "react";

/**
 * Bold, italic, inline code, [text](url), bare http(s) URLs, bare emails.
 *
 * The link forms only ever match an `http(s)` target or an address, so a
 * `javascript:` or `data:` URL can never reach an href — it falls through to the
 * plain-text branch and renders as literal characters.
 */
const INLINE =
  /(\*\*[^*]+\*\*|\*[^*\n]+\*|`[^`]+`|\[[^\]\n]+\]\(https?:\/\/[^\s)]+\)|https?:\/\/[^\s<>]+|[\w.+-]+@[\w-]+\.[\w.-]+)/g;

function Link({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-brand underline decoration-dotted underline-offset-2 hover:decoration-solid"
    >
      {children}
    </a>
  );
}

/** Renders one line's worth of inline markup. */
function inline(text: string, keyPrefix: string): ReactNode[] {
  return text.split(INLINE).map((token, i) => {
    const key = `${keyPrefix}-${i}`;
    if (!token) return null;

    if (token.startsWith("**") && token.endsWith("**") && token.length > 4) {
      return (
        <strong key={key} className="font-semibold">
          {token.slice(2, -2)}
        </strong>
      );
    }

    if (token.startsWith("`") && token.endsWith("`") && token.length > 2) {
      return (
        <code
          key={key}
          // Tight horizontal padding: any more and the following punctuation
          // looks detached, e.g. "`OOXML` ." instead of "`OOXML`."
          className="bg-muted rounded px-0.5 py-0.5 font-mono text-[0.9em]"
        >
          {token.slice(1, -1)}
        </code>
      );
    }

    // [label](url) — the regex already guaranteed an http(s) target.
    const linked = /^\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)$/.exec(token);
    if (linked) {
      return (
        <Link key={key} href={linked[2]!}>
          {linked[1]}
        </Link>
      );
    }

    if (/^https?:\/\//.test(token)) {
      return (
        <Link key={key} href={token}>
          {token}
        </Link>
      );
    }

    // A bare address — the contact answer leads with one, and it should be
    // clickable rather than something to copy by hand.
    if (/^[\w.+-]+@[\w-]+\.[\w.-]+$/.test(token)) {
      return (
        <a
          key={key}
          href={`mailto:${token}`}
          className="text-brand underline decoration-dotted underline-offset-2 hover:decoration-solid"
        >
          {token}
        </a>
      );
    }

    if (
      token.startsWith("*") &&
      token.endsWith("*") &&
      token.length > 2 &&
      !token.startsWith("**")
    ) {
      return <em key={key}>{token.slice(1, -1)}</em>;
    }

    return <Fragment key={key}>{token}</Fragment>;
  });
}

type Block =
  | { kind: "p"; lines: string[] }
  | { kind: "ul"; items: string[] }
  | { kind: "ol"; items: string[] };

const BULLET = /^\s*[-*•▸]\s+(.*)$/;
const ORDERED = /^\s*\d+[.)]\s+(.*)$/;

/**
 * Groups lines into blocks. Scans line by line rather than splitting on blank
 * lines first, so a list that follows a sentence without one still becomes a
 * list — which is how the keyword fallback in `lib/chat-fallback.ts` writes.
 */
function parse(text: string): Block[] {
  const blocks: Block[] = [];
  // The paragraph being accumulated, kept outside `blocks` so that a bullet or
  // a blank line closes it without having to look backwards.
  let paragraph: string[] = [];

  const flush = () => {
    if (paragraph.length > 0) blocks.push({ kind: "p", lines: paragraph });
    paragraph = [];
  };

  for (const raw of text.split("\n")) {
    const line = raw.trimEnd();
    const bullet = BULLET.exec(line);
    const ordered = ORDERED.exec(line);

    if (bullet) {
      flush();
      const last = blocks.at(-1);
      if (last?.kind === "ul") last.items.push(bullet[1]!);
      else blocks.push({ kind: "ul", items: [bullet[1]!] });
      continue;
    }

    if (ordered) {
      flush();
      const last = blocks.at(-1);
      if (last?.kind === "ol") last.items.push(ordered[1]!);
      else blocks.push({ kind: "ol", items: [ordered[1]!] });
      continue;
    }

    // A blank line closes the paragraph; a text line after a list starts a new
    // one, which happens for free because paragraphs are flushed in order.
    if (!line.trim()) flush();
    else paragraph.push(line);
  }

  flush();
  return blocks;
}

/** Assistant answers. User messages stay plain text — they wrote them. */
export function MarkdownText({ text }: { text: string }) {
  const blocks = parse(text);

  return (
    <div className="flex flex-col gap-3">
      {blocks.map((block, i) => {
        if (block.kind === "ul") {
          return (
            <ul key={i} className="flex flex-col gap-1.5">
              {block.items.map((item, j) => (
                <li key={j} className="flex gap-2">
                  <span className="text-brand-2 shrink-0" aria-hidden>
                    ▸
                  </span>
                  <span className="min-w-0">{inline(item, `${i}-${j}`)}</span>
                </li>
              ))}
            </ul>
          );
        }

        if (block.kind === "ol") {
          return (
            <ol key={i} className="flex flex-col gap-1.5">
              {block.items.map((item, j) => (
                <li key={j} className="flex gap-2">
                  <span
                    className="text-brand-2 shrink-0 font-mono text-xs"
                    aria-hidden
                  >
                    {j + 1}.
                  </span>
                  <span className="min-w-0">{inline(item, `${i}-${j}`)}</span>
                </li>
              ))}
            </ol>
          );
        }

        return (
          <p key={i}>
            {block.lines.map((line, j) => (
              <Fragment key={j}>
                {j > 0 && <br />}
                {inline(line, `${i}-${j}`)}
              </Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}
