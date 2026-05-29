import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { renderWithTheme } from "../../tests-small-unit/_helpers/renderWithTheme";
import PluginPage from "@/plugin/PluginPage";
import { RecordingAnalyticsTracker } from "@/shared/lib/RecordingAnalyticsTracker";

describe("user installs the plugin from /plugin", () => {
  it("leads with the Claude Code marketplace install command", () => {
    renderWithTheme(<PluginPage />);

    expect(screen.getByRole("heading", { level: 1, name: "Plugin" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: /Claude Code plugin/i }),
    ).toBeInTheDocument();
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

  it("offers the skills index for agents that can fetch URLs on demand", () => {
    renderWithTheme(<PluginPage />);

    expect(
      screen.getByRole("heading", { level: 2, name: /Skills index/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /ritl-skills-index\.md/i })).toBeInTheDocument();
    expect(
      screen.getByText(
        /fetch only the SKILL\.md files whose description matches what you're working on/i,
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
