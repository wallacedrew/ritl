import type { AnalyticsEvent, AnalyticsTracker } from "./AnalyticsTracker";

const TRACK_ENDPOINT = "/api/track";

export class BeaconAnalyticsTracker implements AnalyticsTracker {
  track(event: AnalyticsEvent): void {
    if (typeof navigator === "undefined") return;
    const payload = JSON.stringify(event);
    try {
      if (typeof navigator.sendBeacon === "function") {
        const accepted = navigator.sendBeacon(
          TRACK_ENDPOINT,
          new Blob([payload], { type: "application/json" }),
        );
        if (accepted) return;
      }
      void fetch(TRACK_ENDPOINT, {
        method: "POST",
        body: payload,
        headers: { "Content-Type": "application/json" },
        keepalive: true,
      }).catch(() => {
        // Analytics failures never break the user-visible feature.
      });
    } catch {
      // sendBeacon can throw under aggressive privacy settings.
    }
  }
}
