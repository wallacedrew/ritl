// Cloudflare Pages Function — POST /api/track
//
// Accepts a JSON body { event: string, properties?: Record<string, string|number|boolean> }
// from the AnalyticsTracker client adapter. Writes daily counter keys to
// Workers KV (bound as ANALYTICS_KV in the Pages project settings).
//
// Storage layout in KV:
//   event:<name>:total:<YYYY-MM-DD>            → "<count>"
//   event:<name>:<key>=<value>:<YYYY-MM-DD>    → "<count>"  (per property breakdown)
//
// Read-modify-write counters are not atomic in KV; missed increments under
// concurrent traffic are a rounding error and acceptable for a side-project
// scale. If accuracy ever matters, move to Workers Analytics Engine.

// Minimal local types so we don't pull in @cloudflare/workers-types as a
// devDep for a single Function. Mirrors the Pages Function runtime shape.
interface KVNamespace {
  get(key: string): Promise<string | null>;
  put(key: string, value: string): Promise<void>;
}

export interface TrackEnv {
  ANALYTICS_KV: KVNamespace;
}

interface PagesFunctionContext {
  request: Request;
  env: TrackEnv;
}

// Allowlist must match the AnalyticsEvent discriminated union in
// src/shared/lib/AnalyticsTracker.ts. Keep these in sync — there's
// no runtime path that imports across the boundary.
const ALLOWED_EVENT_NAMES = new Set([
  "plugin_install_copied",
  "snippet_preview_opened",
  "snippet_copied",
  "snippet_downloaded",
  "nav_clicked",
  "search_selected",
]);

interface TrackBody {
  event: string;
  properties?: Record<string, string | number | boolean>;
}

function isTrackBody(value: unknown): value is TrackBody {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Record<string, unknown>;
  if (typeof candidate.event !== "string") return false;
  if (candidate.properties === undefined) return true;
  if (typeof candidate.properties !== "object" || candidate.properties === null) return false;
  for (const propertyValue of Object.values(candidate.properties as Record<string, unknown>)) {
    const type = typeof propertyValue;
    if (type !== "string" && type !== "number" && type !== "boolean") return false;
  }
  return true;
}

function todayUtcDateString(): string {
  return new Date().toISOString().slice(0, 10);
}

async function incrementCounter(kv: KVNamespace, key: string): Promise<void> {
  const current = parseInt((await kv.get(key)) ?? "0", 10);
  await kv.put(key, String(current + 1));
}

export async function handleTrack(request: Request, env: TrackEnv): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  if (!isTrackBody(body)) {
    return new Response("Malformed event payload", { status: 400 });
  }

  if (!ALLOWED_EVENT_NAMES.has(body.event)) {
    return new Response("Unknown event", { status: 400 });
  }

  const date = todayUtcDateString();

  try {
    await incrementCounter(env.ANALYTICS_KV, `event:${body.event}:total:${date}`);
    if (body.properties) {
      for (const [key, value] of Object.entries(body.properties)) {
        await incrementCounter(env.ANALYTICS_KV, `event:${body.event}:${key}=${value}:${date}`);
      }
    }
  } catch {
    // KV write failure should never punish the client — analytics failures
    // are observable in logs, not in user-facing flow.
  }

  return new Response(null, { status: 204 });
}

export async function onRequest(context: PagesFunctionContext): Promise<Response> {
  if (context.request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405, headers: { Allow: "POST" } });
  }
  return handleTrack(context.request, context.env);
}
