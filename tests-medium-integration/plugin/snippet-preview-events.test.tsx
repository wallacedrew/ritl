import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { renderWithTheme } from "../../tests-small-unit/_helpers/renderWithTheme";
import PluginPage from "@/plugin/PluginPage";
import { InMemorySnippetSource } from "@/shared/adapters/InMemorySnippetSource";
import { RecordingAnalyticsTracker } from "@/shared/adapters/RecordingAnalyticsTracker";

const STUB_SNIPPET_CONTENT = "# Refactoring discipline\n\nApply this cycle to every change.";

function snippetSource(): InMemorySnippetSource {
  return new InMemorySnippetSource(
    new Map([["/snippets/refactoring-discipline.md", STUB_SNIPPET_CONTENT]]),
  );
}

describe("snippet preview events", () => {
  beforeEach(() => {
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: vi.fn(async () => {}) },
      configurable: true,
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("fires snippet_preview_opened with the snippet filename when the trigger button is clicked", async () => {
    const analytics = new RecordingAnalyticsTracker();
    const user = userEvent.setup();

    renderWithTheme(<PluginPage />, { analytics, snippetSource: snippetSource() });

    const triggerButton = screen.getByRole("button", { name: /refactoring-discipline\.md/i });
    await user.click(triggerButton);

    expect(analytics.calls).toContainEqual({
      event: "snippet_preview_opened",
      properties: { snippet: "refactoring-discipline.md" },
    });
  });

  it("fires snippet_copied when the user copies from the open dialog", async () => {
    const analytics = new RecordingAnalyticsTracker();
    const user = userEvent.setup();

    renderWithTheme(<PluginPage />, { analytics, snippetSource: snippetSource() });

    await user.click(screen.getByRole("button", { name: /refactoring-discipline\.md/i }));
    await waitFor(() => expect(screen.getByRole("button", { name: /^Copy$/ })).toBeEnabled());
    await user.click(screen.getByRole("button", { name: /^Copy$/ }));

    expect(analytics.calls).toContainEqual({
      event: "snippet_copied",
      properties: { snippet: "refactoring-discipline.md" },
    });
  });

  it("fires snippet_downloaded when the user downloads from the open dialog", async () => {
    const analytics = new RecordingAnalyticsTracker();
    const user = userEvent.setup();

    renderWithTheme(<PluginPage />, { analytics, snippetSource: snippetSource() });

    await user.click(screen.getByRole("button", { name: /refactoring-discipline\.md/i }));
    await waitFor(() => expect(screen.getByRole("button", { name: /^Download$/ })).toBeEnabled());
    await user.click(screen.getByRole("button", { name: /^Download$/ }));

    expect(analytics.calls).toContainEqual({
      event: "snippet_downloaded",
      properties: { snippet: "refactoring-discipline.md" },
    });
  });
});
