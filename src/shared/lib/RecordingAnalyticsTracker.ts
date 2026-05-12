import type { AnalyticsEvent, AnalyticsTracker } from "./AnalyticsTracker";

export class RecordingAnalyticsTracker implements AnalyticsTracker {
  private readonly recorded: AnalyticsEvent[] = [];

  track(event: AnalyticsEvent): void {
    this.recorded.push(event);
  }

  get calls(): readonly AnalyticsEvent[] {
    return this.recorded;
  }

  reset(): void {
    this.recorded.length = 0;
  }
}
