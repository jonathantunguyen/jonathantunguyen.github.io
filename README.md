# jonathan-portfolio

A portfolio site laid out as a code editor. The files in the sidebar are the
sections of the site; the panel on the right is an assistant that answers
questions about the work from the same content the site displays.

## Running it

```bash
npm install
cp .env.example .env.local   # then fill in ANTHROPIC_API_KEY
npm run dev
```

`npm run build` produces a static export in `out/`.

## Deploying

`master` is the deployable branch and needs a Node runtime, because
`app/api/chat` is what makes the assistant stream from Claude rather than
answer from a keyword index.

### Railway

Railway runs a long-lived Node process, which suits this app better than
serverless does — see the rate-limiter note below.

1. **New Project → Deploy from GitHub repo**, pick this repo. Railway builds
   `master`.
2. Nixpacks detects Next.js; `railway.json` pins the build and start commands
   anyway, plus a healthcheck on `/`. `engines.node` in `package.json` keeps it
   off a Node too old for Next 16.
3. **Variables** → add:
   - `ANTHROPIC_API_KEY` — required for real answers. Without it the route
     still responds, but from `lib/chat-fallback.ts`, so a missing key looks
     like a working deploy with a duller assistant rather than an error.
   - `NEXT_PUBLIC_SITE_URL` — **only** for a custom domain. Otherwise the build
     reads `RAILWAY_PUBLIC_DOMAIN` and canonical tags, hreflang alternates and
     `sitemap.xml` come out right on their own.
4. **Settings → Networking → Generate Domain**, then deploy.

`next start` honours Railway's injected `PORT` and binds `0.0.0.0`, so no
custom server or Procfile is needed.

Because the container is long-lived, the in-memory rate limiter in the route
(10 questions/hour/IP) actually holds between requests. On serverless it resets
whenever a new instance spins up, which makes it far weaker than it looks.
Claude tokens bill to your Anthropic account whatever the host.

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

`app/api/chat/route.ts` streams from Claude (`claude-opus-5`). Its system
prompt is built in `lib/portfolio-context.ts` from the same `data/` files, and
it's instructed to answer only from that brief and defer to email otherwise.
The brief is built per locale and the model is told which language to answer
in, so a visitor on `/fr` gets a French answer. The panel reads the locale from
the route and passes it to the store, which sends it with each request.

- **No API key?** The route serves keyword-matched answers from
  `lib/chat-fallback.ts` instead of failing, so a fork works out of the box.
- **Rate limiting** is in-memory: 10 messages per hour per IP, per instance.
  Move it to Redis or Vercel KV if you need it to hold across instances.
- The brief is sent with a prompt-cache breakpoint, so repeat turns in a
  conversation only pay full price for the new message.

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
