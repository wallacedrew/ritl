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

  it("hoists the six-step discipline as a scannable ordered list", () => {
    renderWithTheme(<PluginPage />);

    expect(
      screen.getByRole("heading", { level: 2, name: /The six-step discipline/i }),
    ).toBeInTheDocument();

    const stepTitles = [
      "Sense the smell.",
      "Identify the source.",
      "Establish a safety net.",
      "Apply one named refactoring.",
      "Stay green.",
      "Recognize pattern destinations.",
    ];
    for (const title of stepTitles) {
      expect(screen.getByText(title)).toBeInTheDocument();
    }
  });

  it("embeds the Extract Function SKILL.md with description and agent forces", () => {
    renderWithTheme(<PluginPage />);

    expect(
      screen.getByRole("heading", { level: 2, name: /What a skill looks like: Extract Function/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Apply Extract Function when you see Long Function, Duplicated Code, Comments/i,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /A function whose token count exceeds the agent's reliable chunk-reasoning budget/i,
      ),
    ).toBeInTheDocument();
    expect(document.body.textContent).toContain("let total = 0");
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
