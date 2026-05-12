export type AnalyticsEvent =
  | { event: "plugin_install_copied"; properties?: never }
  | { event: "snippet_preview_opened"; properties: { snippet: string } }
  | { event: "snippet_copied"; properties: { snippet: string } }
  | { event: "snippet_downloaded"; properties: { snippet: string } }
  | {
      event: "nav_clicked";
      properties: { tab: "refactorings" | "smells" | "reference" | "plugin" };
    }
  | { event: "search_selected"; properties: { kind: "smell" | "refactoring"; slug: string } };

export type AnalyticsEventName = AnalyticsEvent["event"];

export interface AnalyticsTracker {
  track(event: AnalyticsEvent): void;
}
