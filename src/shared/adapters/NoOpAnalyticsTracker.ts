import type { AnalyticsEvent, AnalyticsTracker } from "@/shared/lib/AnalyticsTracker";

export class NoOpAnalyticsTracker implements AnalyticsTracker {
  // Parameter declared so the signature matches AnalyticsTracker.track exactly
  // — disabled, SSR, and don't-care-test paths swallow the call.
  track(_event: AnalyticsEvent): void {
    void _event;
  }
}
