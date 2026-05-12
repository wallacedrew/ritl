import { describe, expect, it, vi } from "vitest";

import { handleTrack, onRequest, type TrackEnv } from "../../functions/api/track";

interface FakeKV {
  storage: Map<string, string>;
  get: (key: string) => Promise<string | null>;
  put: (key: string, value: string) => Promise<void>;
}

function buildFakeKv(): FakeKV {
  const storage = new Map<string, string>();
  return {
    storage,
    get: vi.fn(async (key: string) => storage.get(key) ?? null),
    put: vi.fn(async (key: string, value: string) => {
      storage.set(key, value);
    }),
  };
}

function buildEnv(kv: FakeKV): TrackEnv {
  return { ANALYTICS_KV: { get: kv.get, put: kv.put } };
}

function postRequest(body: unknown): Request {
  return new Request("https://example.com/api/track", {
    method: "POST",
    body: typeof body === "string" ? body : JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

describe("POST /api/track", () => {
  it("accepts a valid event and returns 204", async () => {
    const kv = buildFakeKv();

    const response = await handleTrack(
      postRequest({ event: "plugin_install_copied" }),
      buildEnv(kv),
    );

    expect(response.status).toBe(204);
  });

  it("increments the total counter for the event on the current UTC day", async () => {
    const kv = buildFakeKv();

    await handleTrack(postRequest({ event: "plugin_install_copied" }), buildEnv(kv));

    const today = new Date().toISOString().slice(0, 10);
    const counterKey = `event:plugin_install_copied:total:${today}`;
    expect(kv.storage.get(counterKey)).toBe("1");
  });

  it("reads the existing counter and increments by one (not overwrites)", async () => {
    const kv = buildFakeKv();
    const today = new Date().toISOString().slice(0, 10);
    kv.storage.set(`event:plugin_install_copied:total:${today}`, "5");

    await handleTrack(postRequest({ event: "plugin_install_copied" }), buildEnv(kv));

    expect(kv.storage.get(`event:plugin_install_copied:total:${today}`)).toBe("6");
  });

  it("records per-property breakdown counters", async () => {
    const kv = buildFakeKv();

    await handleTrack(
      postRequest({
        event: "snippet_copied",
        properties: { snippet: "refactoring-discipline.md" },
      }),
      buildEnv(kv),
    );

    const today = new Date().toISOString().slice(0, 10);
    expect(kv.storage.get(`event:snippet_copied:total:${today}`)).toBe("1");
    expect(kv.storage.get(`event:snippet_copied:snippet=refactoring-discipline.md:${today}`)).toBe(
      "1",
    );
  });

  it("rejects events not on the allowlist with 400", async () => {
    const kv = buildFakeKv();

    const response = await handleTrack(postRequest({ event: "made_up_event" }), buildEnv(kv));

    expect(response.status).toBe(400);
    expect(vi.mocked(kv.put)).not.toHaveBeenCalled();
  });

  it("rejects malformed JSON with 400", async () => {
    const kv = buildFakeKv();

    const response = await handleTrack(postRequest("not valid json"), buildEnv(kv));

    expect(response.status).toBe(400);
    expect(vi.mocked(kv.put)).not.toHaveBeenCalled();
  });

  it("rejects a missing event field with 400", async () => {
    const kv = buildFakeKv();

    const response = await handleTrack(postRequest({ properties: { x: 1 } }), buildEnv(kv));

    expect(response.status).toBe(400);
    expect(vi.mocked(kv.put)).not.toHaveBeenCalled();
  });

  it("rejects property values that aren't string/number/boolean", async () => {
    const kv = buildFakeKv();

    const response = await handleTrack(
      postRequest({ event: "snippet_copied", properties: { snippet: { nested: true } } }),
      buildEnv(kv),
    );

    expect(response.status).toBe(400);
    expect(vi.mocked(kv.put)).not.toHaveBeenCalled();
  });

  it("returns 204 even when KV writes fail (client never punished)", async () => {
    const failingKv: FakeKV = {
      storage: new Map(),
      get: vi.fn(async () => null),
      put: vi.fn(async () => {
        throw new Error("KV quota exceeded");
      }),
    };

    const response = await handleTrack(
      postRequest({ event: "plugin_install_copied" }),
      buildEnv(failingKv),
    );

    expect(response.status).toBe(204);
  });
});

describe("onRequest /api/track", () => {
  it("returns 405 for non-POST methods", async () => {
    const kv = buildFakeKv();
    const request = new Request("https://example.com/api/track", { method: "GET" });

    const response = await onRequest({ request, env: buildEnv(kv) });

    expect(response.status).toBe(405);
    expect(response.headers.get("Allow")).toBe("POST");
  });

  it("delegates POST to handleTrack", async () => {
    const kv = buildFakeKv();

    const response = await onRequest({
      request: postRequest({ event: "plugin_install_copied" }),
      env: buildEnv(kv),
    });

    expect(response.status).toBe(204);
    const today = new Date().toISOString().slice(0, 10);
    expect(kv.storage.get(`event:plugin_install_copied:total:${today}`)).toBe("1");
  });
});
