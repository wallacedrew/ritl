import { describe, expect, it } from "vitest";

import { RecordingAnalyticsTracker } from "@/shared/lib/RecordingAnalyticsTracker";

describe("RecordingAnalyticsTracker", () => {
  it("records calls in order with their event + properties", () => {
    const tracker = new RecordingAnalyticsTracker();

    tracker.track({ event: "plugin_install_copied" });
    tracker.track({
      event: "snippet_copied",
      properties: { snippet: "refactoring-discipline.md" },
    });

    expect(tracker.calls).toEqual([
      { event: "plugin_install_copied" },
      { event: "snippet_copied", properties: { snippet: "refactoring-discipline.md" } },
    ]);
  });

  it("exposes calls as readonly (immutable snapshot)", () => {
    const tracker = new RecordingAnalyticsTracker();
    tracker.track({ event: "plugin_install_copied" });

    expect(tracker.calls).toHaveLength(1);
  });

  it("reset() clears all recorded calls", () => {
    const tracker = new RecordingAnalyticsTracker();
    tracker.track({ event: "plugin_install_copied" });
    tracker.track({ event: "plugin_install_copied" });

    tracker.reset();

    expect(tracker.calls).toEqual([]);
  });
});
