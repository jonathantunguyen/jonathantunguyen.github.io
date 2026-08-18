/**
 * Request-side guardrails for the assistant endpoint.
 *
 * The threat model is narrow but real. The assistant has no tools, no writes
 * and no private data — the brief it answers from is the same content the site
 * displays publicly — so the exposure isn't data loss, it's **cost and
 * reputation**: someone using the endpoint as a free LLM proxy, or coaxing it
 * into saying something that reads as coming from Jonathan.
 *
 * These limits are per-instance and in-memory. That is genuinely enough on a
 * single long-lived container (Railway) and much weaker on serverless, where a
 * new instance starts with a clean slate. Move them to Redis if the site ever
 * runs more than one instance.
 */

/** Visitor questions allowed per window, per IP. */
export const RATE_LIMIT = 10;
const WINDOW_MS = 60 * 60 * 1000;

/**
 * Requests allowed per UTC day across all visitors — the backstop for the
 * per-IP limit, which anyone with a pool of addresses can walk around. Sized
 * for a portfolio site's traffic, not for a product.
 */
export const DAILY_LIMIT = Number(process.env.CHAT_DAILY_LIMIT ?? 400);

/** Longest single question. */
export const MAX_INPUT_CHARS = 1500;

/**
 * Longest whole conversation we'll forward. The per-question cap alone doesn't
 * bound the bill: the client sends the entire history, so a dozen
 * just-under-the-cap messages is a far bigger prompt than any real visitor
 * produces.
 */
export const MAX_TOTAL_CHARS = 8000;

/** Turns of history sent to the model (user + assistant combined). */
export const MAX_HISTORY = 12;

/** Largest body we'll read at all, before spending anything on parsing it. */
export const MAX_BODY_BYTES = 64_000;

/**
 * Best guess at the visitor's IP.
 *
 * The leftmost `X-Forwarded-For` entry is supplied by the *client*, so keying a
 * rate limiter on it makes the limiter advisory: one spoofed header per request
 * and every request looks like a new visitor. Prefer the headers our own edge
 * sets, and fall back to the rightmost `X-Forwarded-For` hop — the entry our
 * proxy appended — rather than the leftmost.
 *
 * `CHAT_TRUSTED_PROXIES` is how many proxies sit in front of this app (default
 * 1, which is Railway or Vercel on their own). Set it higher when you add
 * another layer, or the fallback starts bucketing every visitor together under
 * the nearest proxy's address.
 */
export function clientIp(req: Request): string {
  const direct =
    req.headers.get("x-envoy-external-address") ?? // Railway
    req.headers.get("cf-connecting-ip") ?? // Cloudflare
    req.headers.get("x-real-ip"); // nginx-style
  if (direct?.trim()) return direct.trim();

  const hops = req.headers
    .get("x-forwarded-for")
    ?.split(",")
    .map((hop) => hop.trim())
    .filter(Boolean);
  if (hops?.length) {
    const trusted = Math.max(1, Number(process.env.CHAT_TRUSTED_PROXIES ?? 1));
    return hops[Math.max(0, hops.length - trusted)] ?? "unknown";
  }

  return "unknown";
}

/**
 * Rejects cross-origin browser POSTs, so the endpoint can't be wired into
 * someone else's page as a free assistant.
 *
 * Deliberately not a security boundary: a script sends whatever `Origin` it
 * likes, or none at all. That's what the rate and daily limits are for. This
 * only stops the lazy case, and the absent-header case is allowed through so
 * curl and uptime checks keep working.
 *
 * The static `pages` branch calls this endpoint cross-origin, so list its
 * origin in `CHAT_ALLOWED_ORIGINS` (comma-separated) when that's deployed.
 */
const allowedOrigins = (process.env.CHAT_ALLOWED_ORIGINS ?? "")
  .split(",")
  .map((entry) => entry.trim().toLowerCase())
  .filter(Boolean);

export function originAllowed(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true;

  let host: string;
  try {
    host = new URL(origin).host.toLowerCase();
  } catch {
    return false;
  }

  // Same-origin: the Host header is what this request actually arrived on.
  const self = req.headers.get("host")?.toLowerCase();
  if (self && host === self) return true;

  if (host.startsWith("localhost:") || host.startsWith("127.0.0.1:")) {
    return process.env.NODE_ENV !== "production";
  }

  return allowedOrigins.some((entry) => entry === host || entry === origin.toLowerCase());
}

/* ------------------------------------------------------------------ *
 * Counters
 * ------------------------------------------------------------------ */

const hits = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = hits.get(ip);

  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    // Opportunistic sweep so the map can't grow without bound.
    if (hits.size > 5000) {
      for (const [key, value] of hits) if (now > value.resetAt) hits.delete(key);
    }
    return { allowed: true, remaining: RATE_LIMIT - 1 };
  }

  if (entry.count >= RATE_LIMIT) return { allowed: false, remaining: 0 };

  entry.count += 1;
  return { allowed: true, remaining: RATE_LIMIT - entry.count };
}

let today = { day: "", count: 0 };

/**
 * Site-wide daily ceiling. Checked before the per-IP limit so a distributed
 * flood can't quietly outspend the budget one address at a time.
 */
export function withinDailyBudget(): boolean {
  const day = new Date().toISOString().slice(0, 10);
  if (day !== today.day) today = { day, count: 0 };
  if (today.count >= DAILY_LIMIT) return false;
  today.count += 1;
  return true;
}

/** For logging: how much of today's budget is gone. */
export function dailyUsage(): { used: number; limit: number } {
  return { used: today.count, limit: DAILY_LIMIT };
}
