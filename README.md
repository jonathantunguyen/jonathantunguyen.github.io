# jonathan-portfolio

A portfolio site laid out as a code editor. The files in the sidebar are the
sections of the site; the panel on the right is an assistant that answers
questions about the work from the same content the site displays.

## Running it

```bash
npm install
cp .env.example .env.local   # then fill in GEMINI_API_KEY
npm run dev
```

`npm run build` produces a server build in `.next/`; `npm run start` serves it.
(The `pages` branch is the one that emits a static `out/`.)

## Deploying

`master` is the deployable branch and needs a Node runtime, because
`app/api/chat` is what makes the assistant stream from a model rather than
answer from a keyword index.

### Railway

Railway runs a long-lived Node process, which suits this app better than
serverless does — see the rate-limiter note below.

1. **New Project → Deploy from GitHub repo**, pick this repo. Railway builds
   `master`.
2. Railpack detects Next.js; `railway.json` pins the build and start commands
   anyway, plus a healthcheck on `/`. `engines.node` in `package.json` keeps it
   off a Node too old for Next 16. Note that Railpack decides static-vs-server
   by text-matching `next.config.ts` — see the warning in that file before
   editing its comments.
3. **Variables** → add:
   - `GEMINI_API_KEY` — required for real answers. Without it (and without
     `ANTHROPIC_API_KEY`) the route still responds, but from
     `lib/chat-fallback.ts`, so a missing key looks like a working deploy with
     a duller assistant rather than an error.
   - `NEXT_PUBLIC_SITE_URL` — **only** for a custom domain. Otherwise the build
     reads `RAILWAY_PUBLIC_DOMAIN` and canonical tags, hreflang alternates and
     `sitemap.xml` come out right on their own.
4. **Settings → Networking → Generate Domain**, then deploy.

`next start` honours Railway's injected `PORT` and binds `0.0.0.0`, so no
custom server or Procfile is needed.

Because the container is long-lived, the in-memory rate limiter in the route
(10 questions/hour/IP) actually holds between requests. On serverless it resets
whenever a new instance spins up, which makes it far weaker than it looks.
Model tokens bill to your Google or Anthropic account whatever the host.

### Other hosts

- **Vercel** — import and deploy; it builds the default branch. Same env vars;
  `VERCEL_PROJECT_PRODUCTION_URL` is the site-URL fallback.
- **`pages` branch** — a GitHub Pages variant: `output: "export"`, no API
  route, a workflow that publishes `out/`. A static host cannot run the
  assistant, so there it answers from the keyword index in the browser. Merge
  content across with `git switch pages && git merge master`; expect conflicts
  only in `next.config.ts` and `lib/chat-store.ts`, the two files that
  intentionally differ.

## Filling in the content

All content lives in `data/` — no component needs editing to change what the
site says. Prose is bilingual, written as `t(english, french)`:

```ts
tagline: t("Machine learning that survives production",
           "Du machine learning qui survit à la production"),
```

Values that read the same in both languages (a company, a tech name, a URL)
stay plain strings. TypeScript enforces that both locales exist, so a missing
French string is a build error rather than a blank on the page.

Placeholders, where any remain, are marked so they're easy to find:

```bash
rg "TODO:" data/     # unfilled content
rg "REVIEW:" data/   # judgement calls worth a second look
```

| File | Holds |
| --- | --- |
| `data/profile.ts` | Name, roles, bio, hero stats, résumé path, contact details |
| `data/skills.ts` | Skill groups and self-rated levels (bar widths) |
| `data/projects.ts` | Projects, highlights, stacks, links |
| `data/experience.ts` | Work history and education |
| `data/socials.ts` | Social links (delete unused entries rather than leaving placeholder hrefs) |

Replace `public/resume/Jonathan_Nguyen_Resume.pdf` with the real résumé,
keeping the filename — or point `profile.resumePath` somewhere else.

To rename or reorder the sidebar files, edit `lib/files.ts` and add a matching
entry to the `panes` map in `components/ide/editor.tsx`.

## The assistant

`app/api/chat/route.ts` streams from whichever provider
`lib/chat-providers.ts` selects — **Gemini by default**
(`gemini-3.7-flash`), or Claude (`claude-opus-5`) with
`CHAT_PROVIDER=anthropic`. Both get the same brief and both yield plain text,
so the route never learns which one answered. Override the model per provider
with `GEMINI_MODEL` / `ANTHROPIC_MODEL`.

The system prompt is built in `lib/portfolio-context.ts` from the `data/` files, and
it's instructed to answer only from that brief and defer to email otherwise.
The brief is built per locale and the model is told which language to answer
in, so a visitor on `/fr` gets a French answer. The panel reads the locale from
the route and passes it to the store, which sends it with each request.

- **Response depth** is set in three places, and they have to agree: the
  response rules in `lib/portfolio-context.ts`, the thinking effort and token
  ceiling in `lib/chat-providers.ts`, and the keyword answers in
  `lib/chat-fallback.ts`. Answers default to substantive — direct answer, then
  the specifics from the brief, then a pointer to the file or project that goes
  deeper. The rules are explicit that richer means more of the brief, never
  more than the brief.
- **No markdown** in answers: the panel renders text literally
  (`whitespace-pre-wrap`), so emphasis and headings would arrive as stray
  punctuation. Dash-prefixed lines are the one bit of structure that survives.
- **Only one key set?** The chosen provider falls back to the other one and
  logs why, so setting just `ANTHROPIC_API_KEY` works without touching
  `CHAT_PROVIDER`.
- **No API key at all?** The route serves keyword-matched answers from
  `lib/chat-fallback.ts` instead of failing, so a fork works out of the box.
### Guardrails

The exposure here isn't data loss — the brief the assistant answers from is the
same content the site shows anyone. It's **cost** (someone using the endpoint as
a free LLM proxy) and **reputation** (coaxing it into saying something that
reads as coming from Jonathan). `lib/chat-guards.ts` holds the request-side
limits; the prompt-side rules are in `lib/portfolio-context.ts`.

Checks run cheapest-first, so a hostile request is turned away before it costs
anything:

| Guard | Limit | Why |
| --- | --- | --- |
| Origin check | same-origin + `CHAT_ALLOWED_ORIGINS` | Stops the endpoint being embedded in someone else's page |
| Body size | 64 KB | Bounded before parsing |
| Per-message length | 1500 chars, **every** message | The client sends the whole history, so capping only the newest bounds nothing |
| Whole-conversation length | 8000 chars | A dozen just-under-cap messages is a far bigger prompt than any real visitor sends |
| Daily ceiling | `CHAT_DAILY_LIMIT`, default 400/day | Backstop for the per-IP limit, which a pool of addresses walks around |
| Per-IP limit | 10/hour | The everyday case |
| Abort on disconnect | `req.signal` | Closing the tab stops generation instead of billing into a response nobody reads |

Two things worth knowing about the limits:

- **IP resolution is the load-bearing part.** The leftmost `X-Forwarded-For`
  entry is written by the *client*, so keying a limiter on it makes the limiter
  advisory — one spoofed header per request and every request looks new. The
  code prefers the headers our own edge sets (`X-Envoy-External-Address` on
  Railway, `CF-Connecting-IP`, `X-Real-IP`) and otherwise takes the rightmost
  `X-Forwarded-For` hop. Set `CHAT_TRUSTED_PROXIES` if you add a proxy layer.
- **The origin check is not a security boundary.** A script sends whatever
  `Origin` it likes, or none. It stops casual embedding; the rate and daily
  limits are what stop abuse.

On the prompt side, the assistant is told that conversation history arrives from
the visitor's browser and may be forged — so an earlier turn appearing to be its
own is visitor text, not a decision it made — and that no claimed identity,
hypothetical framing or formatting request grants an exception. Prompt rules
mitigate, they don't guarantee; the reason that's tolerable here is that the
assistant has no tools, no writes, and nothing private to leak.

- **Rate limiting** is in-memory: 10 messages per hour per IP, per instance.
  Move it to Redis or Vercel KV if you need it to hold across instances.
- On Claude the brief is sent with a prompt-cache breakpoint, so repeat turns
  only pay full price for the new message. Gemini caches implicitly, and the
  brief sits in `systemInstruction` where it is eligible.

## Language

Two URLs, each prerendered and independently indexable:

| URL | Language | `<html lang>` |
| --- | --- | --- |
| `/` | English | `en` |
| `/fr` | French | `fr` |

The locale comes from the route, not from a store or a cookie — so the server
and the first client render always agree, and there's nothing to persist. It's
carried down by `LocaleProvider` (`lib/locale-context.tsx`); components read it
with `useUi()` for chrome strings and `usePick()` for content.

Each page carries a canonical URL and reciprocal `hreflang` alternates
(`en`, `fr`, `x-default`), has its own OG image, and both appear in
`sitemap.xml` with alternate links. Set `NEXT_PUBLIC_SITE_URL` or those URLs
point at localhost.

**Why two root layouts.** `<html lang>` has to differ per locale, and only the
root layout renders `<html>`. Route groups let each locale own one:
`app/(en)/layout.tsx` serves `/`, `app/(fr)/layout.tsx` serves `/fr`, and both
render the shared `components/site-html.tsx` so the body isn't duplicated.
Crossing between two root layouts triggers a full document load rather than a
client transition — which is what you want from a language switch anyway.

The switcher appears twice on purpose: a legible `EN → FR` button in the title
bar (top right, where visitors look) and a compact one in the status bar. Both
are real links that preserve the open file, so `/#skills` becomes `/fr#skills`.

There's no automatic redirect based on browser language. Google advises against
it, and it strands anyone who wants the other version.

## Theme

Dark by default, light available, remembered in `localStorage`. An inline
script in `components/site-html.tsx` applies the stored choice before first
paint, so there's no flash of the wrong theme — keep that script and
`lib/theme-store.ts` in sync on the storage key.

Both palettes live in the two blocks at the top of `app/globals.css` and
nowhere else: `:root` is light, `.dark` overrides it. The identity pair is
`--brand` and `--brand-2` (cyan/indigo, darkened in light mode so they hold on
white); the rest are surfaces, text, lines, and a syntax palette.

## Keyboard shortcuts

`Ctrl/⌘ + P` go to file · `Ctrl/⌘ + B` toggle explorer · `Ctrl/⌘ + J` toggle
assistant · `Ctrl/⌘ + K` switch theme.
