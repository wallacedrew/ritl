import { describe, expect, it } from "vitest";

import { NoOpAnalyticsTracker } from "@/shared/lib/NoOpAnalyticsTracker";

describe("NoOpAnalyticsTracker", () => {
  it("track() returns without throwing for any event", () => {
    const tracker = new NoOpAnalyticsTracker();

    expect(() => tracker.track({ event: "plugin_install_copied" })).not.toThrow();
    expect(() =>
      tracker.track({ event: "snippet_copied", properties: { snippet: "x.md" } }),
    ).not.toThrow();
  });
});
