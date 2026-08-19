"use client";

import { useEffect, useState } from "react";

/**
 * Hero tagline that types itself out, deletes, and moves to the next phrase.
 *
 * The server renders the first phrase in full and the animation only starts
 * after mount. That keeps hydration honest, leaves a complete sentence for
 * anyone without JavaScript, and lets `prefers-reduced-motion` simply hold that
 * first phrase forever rather than degrade into something jerkier.
 */

const TYPE_MS = 55;
const DELETE_MS = 28;
/** How long a finished phrase sits before it starts deleting. */
const HOLD_MS = 2400;
/** A beat on the empty line, so the phrases read as separate thoughts. */
const SWAP_MS = 420;

export function TypingTagline({ phrases }: { phrases: string[] }) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState(phrases[0] ?? "");
  const [deleting, setDeleting] = useState(false);
  const [running, setRunning] = useState(false);

  const target = phrases[index] ?? "";
  const count = phrases.length;

  useEffect(() => {
    if (count < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setTimeout(() => setRunning(true), HOLD_MS);
    return () => window.clearTimeout(id);
  }, [count]);

  useEffect(() => {
    if (!running) return;

    if (!deleting && text === target) {
      const id = window.setTimeout(() => setDeleting(true), HOLD_MS);
      return () => window.clearTimeout(id);
    }
    if (deleting && text === "") {
      const id = window.setTimeout(() => {
        setDeleting(false);
        setIndex((i) => (i + 1) % count);
      }, SWAP_MS);
      return () => window.clearTimeout(id);
    }

    const id = window.setTimeout(
      () =>
        setText((cur) =>
          deleting
            ? target.slice(0, cur.length - 1)
            : target.slice(0, cur.length + 1),
        ),
      deleting ? DELETE_MS : TYPE_MS,
    );
    return () => window.clearTimeout(id);
  }, [count, deleting, running, target, text]);

  // The longest phrase holds the line open. Without it, a phrase that wraps on
  // a narrow screen would shove the bio down mid-keystroke.
  const longest = phrases.reduce((a, b) => (b.length > a.length ? b : a), "");
  // Solid while the text is moving, blinking once it settles — the way a real
  // terminal caret behaves.
  const resting = !running || text === target;

  return (
    <span className="grid">
      <span aria-hidden className="invisible col-start-1 row-start-1">
        {longest}
      </span>
      {/* One stable sentence for screen readers, rather than a stream of
          single-character updates from a decorative animation. */}
      <span className="sr-only">{phrases[0]}</span>
      <span aria-hidden className="col-start-1 row-start-1">
        {text}{" "}
        <span className={resting ? "caret text-brand" : "text-brand"}>|</span>
      </span>
    </span>
  );
}
