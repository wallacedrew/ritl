import { describe, expect, it, vi } from "vitest";

import { handleStats, onRequest, type StatsEnv } from "../../functions/api/stats";

interface FakeKV {
  storage: Map<string, string>;
  get: (key: string) => Promise<string | null>;
  list: (options?: { prefix?: string }) => Promise<{ keys: Array<{ name: string }> }>;
}

function buildFakeKv(initial?: Record<string, string>): FakeKV {
  const storage = new Map<string, string>(Object.entries(initial ?? {}));
  return {
    storage,
    get: vi.fn(async (key: string) => storage.get(key) ?? null),
    list: vi.fn(async (options) => {
      const prefix = options?.prefix ?? "";
      const keys = [...storage.keys()]
        .filter((name) => name.startsWith(prefix))
        .map((name) => ({ name }));
      return { keys };
    }),
  };
}

function buildEnv(kv: FakeKV, password = "secret"): StatsEnv {
  return {
    ANALYTICS_KV: { get: kv.get, list: kv.list },
    STATS_PASSWORD: password,
  };
}

function basicAuth(password: string): string {
  return `Basic ${btoa(`stats:${password}`)}`;
}

function getRequest(query: string, headers: Record<string, string> = {}): Request {
  return new Request(`https://example.com/api/stats?${query}`, {
    method: "GET",
    headers,
  });
}

describe("GET /api/stats", () => {
  it("returns 503 when STATS_PASSWORD env is not configured", async () => {
    const kv = buildFakeKv();
    const env: StatsEnv = { ANALYTICS_KV: { get: kv.get, list: kv.list } };

    const response = await handleStats(
      getRequest("event=plugin_install_copied&from=2026-05-01&to=2026-05-12"),
      env,
    );

    expect(response.status).toBe(503);
  });

  it("returns 401 with WWW-Authenticate when the Authorization header is missing", async () => {
    const kv = buildFakeKv();
    const response = await handleStats(
      getRequest("event=plugin_install_copied&from=2026-05-01&to=2026-05-12"),
      buildEnv(kv),
    );

    expect(response.status).toBe(401);
    expect(response.headers.get("WWW-Authenticate")).toMatch(/Basic/);
  });

  it("returns 401 when the password is wrong", async () => {
    const kv = buildFakeKv();
    const response = await handleStats(
      getRequest("event=plugin_install_copied&from=2026-05-01&to=2026-05-12", {
        Authorization: basicAuth("wrong"),
      }),
      buildEnv(kv),
    );

    expect(response.status).toBe(401);
  });

  it("returns 400 when event query param is missing", async () => {
    const kv = buildFakeKv();
    const response = await handleStats(
      getRequest("from=2026-05-01&to=2026-05-12", { Authorization: basicAuth("secret") }),
      buildEnv(kv),
    );

    expect(response.status).toBe(400);
  });

  it("returns 400 when from or to query param is malformed", async () => {
    const kv = buildFakeKv();
    const response = await handleStats(
      getRequest("event=plugin_install_copied&from=not-a-date&to=2026-05-12", {
        Authorization: basicAuth("secret"),
      }),
      buildEnv(kv),
    );

    expect(response.status).toBe(400);
  });

  it("returns 200 with aggregated totals across the date range", async () => {
    const kv = buildFakeKv({
      "event:plugin_install_copied:total:2026-05-01": "3",
      "event:plugin_install_copied:total:2026-05-02": "7",
      "event:plugin_install_copied:total:2026-05-03": "2",
      // Outside the requested range — must not be counted
      "event:plugin_install_copied:total:2026-04-30": "100",
    });

    const response = await handleStats(
      getRequest("event=plugin_install_copied&from=2026-05-01&to=2026-05-03", {
        Authorization: basicAuth("secret"),
      }),
      buildEnv(kv),
    );

    expect(response.status).toBe(200);
    const body = (await response.json()) as {
      event: string;
      total: number;
      byProperty: Record<string, number>;
    };
    expect(body.event).toBe("plugin_install_copied");
    expect(body.total).toBe(12);
  });

  it("aggregates per-property breakdown counters and excludes total", async () => {
    const kv = buildFakeKv({
      "event:snippet_copied:total:2026-05-01": "5",
      "event:snippet_copied:snippet=refactoring-discipline.md:2026-05-01": "3",
      "event:snippet_copied:snippet=ritl-skills-index.md:2026-05-01": "2",
    });

    const response = await handleStats(
      getRequest("event=snippet_copied&from=2026-05-01&to=2026-05-01", {
        Authorization: basicAuth("secret"),
      }),
      buildEnv(kv),
    );

    const body = (await response.json()) as {
      total: number;
      byProperty: Record<string, number>;
    };
    expect(body.total).toBe(5);
    expect(body.byProperty).toEqual({
      "snippet=refactoring-discipline.md": 3,
      "snippet=ritl-skills-index.md": 2,
    });
  });

  it("returns total 0 when no data exists in the range", async () => {
    const kv = buildFakeKv();

    const response = await handleStats(
      getRequest("event=plugin_install_copied&from=2026-05-01&to=2026-05-12", {
        Authorization: basicAuth("secret"),
      }),
      buildEnv(kv),
    );

    const body = (await response.json()) as { total: number; byProperty: Record<string, number> };
    expect(body.total).toBe(0);
    expect(body.byProperty).toEqual({});
  });
});

describe("onRequest /api/stats", () => {
  it("returns 405 for non-GET methods", async () => {
    const kv = buildFakeKv();
    const request = new Request("https://example.com/api/stats", { method: "POST" });

    const response = await onRequest({ request, env: buildEnv(kv) });

    expect(response.status).toBe(405);
    expect(response.headers.get("Allow")).toBe("GET");
  });
});
