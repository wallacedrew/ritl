// Cloudflare Pages Function — GET /api/stats?event=...&from=YYYY-MM-DD&to=YYYY-MM-DD
//
// Reads the per-day counter keys that /api/track writes to KV and returns
// aggregated totals + per-property breakdown for the requested event over
// the requested date range. HTTP basic auth via STATS_PASSWORD env. Designed
// to be hit by `curl -u stats:$STATS_PASSWORD ...` — no public dashboard.

interface KVListResult {
  keys: Array<{ name: string }>;
}

interface KVNamespace {
  get(key: string): Promise<string | null>;
  list(options?: { prefix?: string }): Promise<KVListResult>;
}

export interface StatsEnv {
  ANALYTICS_KV: KVNamespace;
  STATS_PASSWORD?: string;
}

interface PagesFunctionContext {
  request: Request;
  env: StatsEnv;
}

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function isValidDate(value: string | null): value is string {
  return value !== null && DATE_PATTERN.test(value);
}

function datesBetween(from: string, to: string): Set<string> {
  const result = new Set<string>();
  const startMs = Date.parse(`${from}T00:00:00Z`);
  const endMs = Date.parse(`${to}T00:00:00Z`);
  if (Number.isNaN(startMs) || Number.isNaN(endMs) || startMs > endMs) return result;
  for (let cursor = startMs; cursor <= endMs; cursor += 24 * 60 * 60 * 1000) {
    result.add(new Date(cursor).toISOString().slice(0, 10));
  }
  return result;
}

function isBasicAuthValid(header: string | null, expectedPassword: string): boolean {
  if (header === null || !header.startsWith("Basic ")) return false;
  try {
    const decoded = atob(header.slice("Basic ".length));
    const colonIndex = decoded.indexOf(":");
    if (colonIndex === -1) return false;
    const providedPassword = decoded.slice(colonIndex + 1);
    return providedPassword === expectedPassword;
  } catch {
    return false;
  }
}

interface StatsResponseBody {
  event: string;
  from: string;
  to: string;
  total: number;
  byProperty: Record<string, number>;
}

export async function handleStats(request: Request, env: StatsEnv): Promise<Response> {
  if (!env.STATS_PASSWORD) {
    return new Response("Stats endpoint not configured", { status: 503 });
  }

  if (!isBasicAuthValid(request.headers.get("Authorization"), env.STATS_PASSWORD)) {
    return new Response("Unauthorized", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="stats"' },
    });
  }

  const url = new URL(request.url);
  const event = url.searchParams.get("event");
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");

  if (event === null || event.trim().length === 0) {
    return new Response("event query param required", { status: 400 });
  }
  if (!isValidDate(from) || !isValidDate(to)) {
    return new Response("from and to query params required (YYYY-MM-DD)", { status: 400 });
  }

  const dates = datesBetween(from, to);
  const prefix = `event:${event}:`;
  const listing = await env.ANALYTICS_KV.list({ prefix });

  let total = 0;
  const byProperty: Record<string, number> = {};

  for (const keyEntry of listing.keys) {
    const lastColon = keyEntry.name.lastIndexOf(":");
    if (lastColon === -1) continue;
    const date = keyEntry.name.slice(lastColon + 1);
    if (!dates.has(date)) continue;

    const value = await env.ANALYTICS_KV.get(keyEntry.name);
    if (value === null) continue;
    const count = parseInt(value, 10);
    if (Number.isNaN(count)) continue;

    const descriptor = keyEntry.name.slice(prefix.length, lastColon);
    if (descriptor === "total") {
      total += count;
    } else {
      byProperty[descriptor] = (byProperty[descriptor] ?? 0) + count;
    }
  }

  const body: StatsResponseBody = { event, from, to, total, byProperty };
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function onRequest(context: PagesFunctionContext): Promise<Response> {
  if (context.request.method !== "GET") {
    return new Response("Method Not Allowed", { status: 405, headers: { Allow: "GET" } });
  }
  return handleStats(context.request, context.env);
}
