import { defineMiddleware } from "astro:middleware";

/**
 * Edge concerns carried over from the TanStack server entry: redirect the `www`
 * alias to the canonical host, and rate-limit per client IP.
 *
 * Scope note: middleware runs for on-demand routes only. Prerendered pages are
 * served straight from the CDN and never reach this code, and the token buckets
 * live in the memory of one serverless instance, so the limit is per instance.
 * Treat both as a backstop, not as the primary defence — host-level redirect and
 * WAF rules belong in the platform configuration.
 */

type RateLimitBucket = {
  tokens: number;
  updatedAt: number;
};

const CANONICAL_HOST = "audo.ch";
const WWW_HOST = `www.${CANONICAL_HOST}`;

const rateLimitBuckets = new Map<string, RateLimitBucket>();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 120;
const RATE_LIMIT_REFILL_PER_MS = RATE_LIMIT_MAX_REQUESTS / RATE_LIMIT_WINDOW_MS;
const RATE_LIMIT_CLEANUP_INTERVAL_MS = 60_000;
const RATE_LIMIT_BUCKET_TTL_MS = 5 * RATE_LIMIT_WINDOW_MS;
const RATE_LIMIT_PUBLIC_ASSET_PATHS = new Set(["/robots.txt", "/sitemap.xml"]);

let lastRateLimitCleanupAt = 0;

// Redirect only the www alias to the canonical apex host. Preview/deployment hosts
// (for example *.vercel.app) are left alone so branch previews stay verifiable.
//
// Deliberately host-only: the scheme is never inspected here. TLS terminates at the
// edge, so `new URL(request.url).protocol` describes the internal proxy->function hop
// (usually http:) rather than the client's scheme, and x-forwarded-proto is not
// guaranteed to be present. Deriving a redirect from either one is what produced the
// outage: a request already on https://audo.ch/ was read as http, answered with a 301
// to https://audo.ch/ — itself — and the long-lived cache header pinned that loop
// (ERR_TOO_MANY_REDIRECTS) into browsers and edge nodes for a full day.
//
// Because the source host (www) always differs from the target host (apex), this
// redirect cannot resolve to its own URL. http->https upgrades stay where they belong,
// on the platform edge.
function canonicalHostRedirect(request: Request): Response | null {
  const url = new URL(request.url);
  if (url.hostname !== WWW_HOST) return null;

  return new Response(null, {
    status: 301,
    headers: {
      location: `https://${CANONICAL_HOST}${url.pathname}${url.search}`,
      "cache-control": "public, max-age=3600",
    },
  });
}

function rateLimitResponse(): Response {
  return new Response("Zu viele Anfragen. Bitte versuche es gleich nochmals.", {
    status: 429,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "retry-after": "60",
      "cache-control": "no-store",
    },
  });
}

function sanitizeClientIp(value: string | null): string | null {
  const ip = value?.split(",")[0]?.trim();
  if (!ip || ip.length > 64 || /[^0-9a-fA-F:.]/.test(ip)) {
    return null;
  }

  return ip;
}

function getClientIp(request: Request): string | null {
  return (
    sanitizeClientIp(request.headers.get("cf-connecting-ip")) ??
    sanitizeClientIp(request.headers.get("true-client-ip")) ??
    sanitizeClientIp(request.headers.get("x-forwarded-for"))
  );
}

function shouldRateLimit(request: Request): boolean {
  const { pathname } = new URL(request.url);
  if (pathname.startsWith("/_astro/") || RATE_LIMIT_PUBLIC_ASSET_PATHS.has(pathname)) {
    return false;
  }

  return true;
}

function cleanupRateLimitBuckets(now: number): void {
  if (now - lastRateLimitCleanupAt < RATE_LIMIT_CLEANUP_INTERVAL_MS) return;

  lastRateLimitCleanupAt = now;
  for (const [key, bucket] of rateLimitBuckets.entries()) {
    if (now - bucket.updatedAt > RATE_LIMIT_BUCKET_TTL_MS) {
      rateLimitBuckets.delete(key);
    }
  }
}

function isRateLimited(request: Request): boolean {
  if (!shouldRateLimit(request)) return false;

  const now = Date.now();
  cleanupRateLimitBuckets(now);

  const clientIp = getClientIp(request);
  if (!clientIp) return false;

  const key = `${clientIp}:${request.method}`;
  const bucket = rateLimitBuckets.get(key) ?? { tokens: RATE_LIMIT_MAX_REQUESTS, updatedAt: now };
  const elapsedMs = Math.max(0, now - bucket.updatedAt);
  bucket.tokens = Math.min(
    RATE_LIMIT_MAX_REQUESTS,
    bucket.tokens + elapsedMs * RATE_LIMIT_REFILL_PER_MS,
  );
  bucket.updatedAt = now;

  if (bucket.tokens < 1) {
    rateLimitBuckets.set(key, bucket);
    return true;
  }

  bucket.tokens -= 1;
  rateLimitBuckets.set(key, bucket);
  return false;
}

export const onRequest = defineMiddleware((context, next) => {
  // Prerendered routes are served straight from the CDN and never reach this code at
  // runtime; during the build they are rendered without a real request. Skip both.
  if (context.isPrerendered) return next();

  const { request } = context;
  const redirect = canonicalHostRedirect(request);
  if (redirect) return redirect;

  if (isRateLimited(request)) return rateLimitResponse();

  return next();
});
