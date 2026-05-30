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

  it("shows a provenance line citing the canon and linking the ADR + GitHub repo", () => {
    renderWithTheme(<PluginPage />);

    expect(screen.getByText(/Built by Wallace Drew/i)).toBeInTheDocument();

    const adrLink = screen.getByRole("link", { name: "ADR-0006" });
    expect(adrLink).toHaveAttribute(
      "href",
      "https://github.com/wallacedrew/ritl/blob/main/docs/architecture/0006-agent-forces-carry-the-contrast.md",
    );

    const githubLink = screen.getByRole("link", { name: "github.com/wallacedrew/ritl" });
    expect(githubLink).toHaveAttribute("href", "https://github.com/wallacedrew/ritl");
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

  it("links out to each catalog list so visitors can browse before installing", () => {
    renderWithTheme(<PluginPage />);

    expect(screen.getByRole("link", { name: "66 refactorings" })).toHaveAttribute(
      "href",
      "/refactoring/canon",
    );
    expect(screen.getByRole("link", { name: "24 smells" })).toHaveAttribute(
      "href",
      "/refactoring/smells",
    );
    expect(screen.getByRole("link", { name: "27 Kerievsky composites" })).toHaveAttribute(
      "href",
      "/refactoring-to-patterns",
    );
    expect(screen.getByRole("link", { name: "23 GoF patterns" })).toHaveAttribute(
      "href",
      "/design-patterns",
    );
  });

  it("offers a CLAUDE.md companion directive with the verified uninstall command", () => {
    renderWithTheme(<PluginPage />);

    expect(
      screen.getByRole("heading", { level: 2, name: /Drop into your CLAUDE\.md/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/name the Fowler smell and the named refactoring before applying it/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/\/plugin uninstall refactor@ritl/)).toBeInTheDocument();
  });

  it("fires claude_md_companion_copied when the user clicks the CLAUDE.md directive copy button", async () => {
    const analytics = new RecordingAnalyticsTracker();
    const user = userEvent.setup();

    renderWithTheme(<PluginPage />, { analytics });

    const copyButton = screen.getByRole("button", { name: /copy CLAUDE\.md directive/i });
    await user.click(copyButton);

    expect(analytics.calls).toEqual([{ event: "claude_md_companion_copied" }]);
  });
});
