import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { renderWithTheme } from "../../tests-small-unit/_helpers/renderWithTheme";
import PluginPage from "@/plugin/PluginPage";
import { RecordingAnalyticsTracker } from "@/shared/lib/RecordingAnalyticsTracker";

describe("user installs the plugin from /plugin", () => {
  it("leads with the Claude Code marketplace install marked Recommended", () => {
    renderWithTheme(<PluginPage />);

    expect(screen.getByRole("heading", { level: 1, name: "Plugin" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: /Claude Code plugin/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Recommended")).toBeInTheDocument();
    expect(screen.getByText(/plugin marketplace add wallacedrew\/ritl/)).toBeInTheDocument();
    expect(screen.getByText(/plugin install refactor@ritl/)).toBeInTheDocument();
  });

  it("offers the AGENTS.md drop-in for non-Claude-Code agents", () => {
    renderWithTheme(<PluginPage />);

    expect(
      screen.getByRole("heading", { level: 2, name: /AGENTS\.md drop-in/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /refactoring-discipline\.md/i }),
    ).toBeInTheDocument();
  });

  it("frames the full catalog paste as a last-resort fallback", () => {
    renderWithTheme(<PluginPage />);

    expect(
      screen.getByRole("heading", { level: 2, name: /Full catalog paste/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /refactoring-catalog\.md/i })).toBeInTheDocument();
    expect(
      screen.getByText(
        /last-resort fallback for non-Claude-Code agents.*Paste sections relevant to the smell/i,
      ),
    ).toBeInTheDocument();
  });

  it("fires plugin_install_copied when the user clicks the install-command copy button", async () => {
    const analytics = new RecordingAnalyticsTracker();
    const user = userEvent.setup();

    renderWithTheme(<PluginPage />, { analytics });

    const copyButton = screen.getByRole("button", { name: /copy install command/i });
    await user.click(copyButton);

    expect(analytics.calls).toEqual([{ event: "plugin_install_copied" }]);
  });
});
