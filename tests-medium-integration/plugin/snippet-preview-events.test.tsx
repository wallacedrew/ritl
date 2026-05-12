import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { renderWithTheme } from "../../tests-small-unit/_helpers/renderWithTheme";
import PluginPage from "@/plugin/PluginPage";
import { RecordingAnalyticsTracker } from "@/shared/lib/RecordingAnalyticsTracker";

const STUB_SNIPPET_CONTENT = "# Refactoring discipline\n\nApply this cycle to every change.";

describe("snippet preview events", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(STUB_SNIPPET_CONTENT, { status: 200 })),
    );
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

    renderWithTheme(<PluginPage />, { analytics });

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

    renderWithTheme(<PluginPage />, { analytics });

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

    renderWithTheme(<PluginPage />, { analytics });

    await user.click(screen.getByRole("button", { name: /refactoring-discipline\.md/i }));
    await waitFor(() => expect(screen.getByRole("button", { name: /^Download$/ })).toBeEnabled());
    await user.click(screen.getByRole("button", { name: /^Download$/ }));

    expect(analytics.calls).toContainEqual({
      event: "snippet_downloaded",
      properties: { snippet: "refactoring-discipline.md" },
    });
  });
});
