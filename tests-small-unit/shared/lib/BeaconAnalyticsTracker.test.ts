import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

import { BeaconAnalyticsTracker } from "@/shared/lib/BeaconAnalyticsTracker";

describe("BeaconAnalyticsTracker", () => {
  let sendBeaconSpy: ReturnType<typeof vi.fn>;
  let fetchSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    sendBeaconSpy = vi.fn(() => true);
    fetchSpy = vi.fn(async () => new Response(null, { status: 204 }));
    Object.defineProperty(navigator, "sendBeacon", {
      value: sendBeaconSpy,
      configurable: true,
      writable: true,
    });
    vi.stubGlobal("fetch", fetchSpy);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    delete (navigator as { sendBeacon?: unknown }).sendBeacon;
  });

  it("POSTs the serialized event to /api/track via sendBeacon", () => {
    const tracker = new BeaconAnalyticsTracker();

    tracker.track({
      event: "snippet_copied",
      properties: { snippet: "refactoring-discipline.md" },
    });

    expect(sendBeaconSpy).toHaveBeenCalledTimes(1);
    const [endpoint, body] = sendBeaconSpy.mock.calls[0]!;
    expect(endpoint).toBe("/api/track");
    expect(body).toBeInstanceOf(Blob);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("serializes the event payload as JSON in the beacon body", async () => {
    const tracker = new BeaconAnalyticsTracker();

    tracker.track({ event: "plugin_install_copied" });

    const [, body] = sendBeaconSpy.mock.calls[0]!;
    const text = await (body as Blob).text();
    expect(JSON.parse(text)).toEqual({ event: "plugin_install_copied" });
  });

  it("falls back to fetch with keepalive when sendBeacon returns false", () => {
    sendBeaconSpy.mockReturnValue(false);
    const tracker = new BeaconAnalyticsTracker();

    tracker.track({ event: "plugin_install_copied" });

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const [endpoint, init] = fetchSpy.mock.calls[0]!;
    expect(endpoint).toBe("/api/track");
    expect((init as RequestInit).method).toBe("POST");
    expect((init as RequestInit).keepalive).toBe(true);
  });

  it("falls back to fetch when sendBeacon is not available", () => {
    // @ts-expect-error - simulating older browser without sendBeacon
    delete navigator.sendBeacon;
    const tracker = new BeaconAnalyticsTracker();

    tracker.track({ event: "plugin_install_copied" });

    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it("swallows errors from sendBeacon (privacy-mode kill switch)", () => {
    sendBeaconSpy.mockImplementation(() => {
      throw new Error("blocked by privacy setting");
    });
    const tracker = new BeaconAnalyticsTracker();

    expect(() => tracker.track({ event: "plugin_install_copied" })).not.toThrow();
  });

  it("swallows fetch promise rejections (network down)", async () => {
    sendBeaconSpy.mockReturnValue(false);
    fetchSpy.mockRejectedValue(new Error("network down"));
    const tracker = new BeaconAnalyticsTracker();

    expect(() => tracker.track({ event: "plugin_install_copied" })).not.toThrow();
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
});
