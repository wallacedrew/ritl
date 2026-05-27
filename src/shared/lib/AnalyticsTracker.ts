export type AnalyticsEvent =
  | { event: "plugin_install_copied"; properties?: never }
  | { event: "snippet_preview_opened"; properties: { snippet: string } }
  | { event: "snippet_copied"; properties: { snippet: string } }
  | { event: "snippet_downloaded"; properties: { snippet: string } }
  | {
      event: "nav_clicked";
      properties: { tab: "refactorings" | "smells" | "reference" | "patterns" | "plugin" };
    }
  | {
      event: "search_selected";
      properties: { kind: "smell" | "refactoring" | "pattern"; slug: string };
    };

export type AnalyticsEventName = AnalyticsEvent["event"];

export interface AnalyticsTracker {
  track(event: AnalyticsEvent): void;
}
