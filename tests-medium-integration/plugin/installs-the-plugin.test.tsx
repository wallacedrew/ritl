import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { renderWithTheme } from "../../tests-small-unit/_helpers/renderWithTheme";
import PluginPage from "@/plugin/PluginPage";
import { RecordingAnalyticsTracker } from "@/shared/adapters/RecordingAnalyticsTracker";

describe("user installs the plugin from /plugin", () => {
  it("leads with the Claude Code marketplace install command", () => {
    renderWithTheme(<PluginPage />);

    expect(screen.getByRole("heading", { level: 1, name: "Plugin" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /If you have Claude Code: install the plugin/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/plugin marketplace add wallacedrew\/ritl/)).toBeInTheDocument();
    expect(screen.getByText(/plugin install refactor@ritl/)).toBeInTheDocument();
  });

  it("offers the AGENTS.md drop-in for non-Claude-Code agents", () => {
    renderWithTheme(<PluginPage />);

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /If you don['’]t have Claude Code: paste this AGENTS\.md drop-in instead/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /refactoring-discipline\.md/i }),
    ).toBeInTheDocument();
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
        /exceeds the agent's reliable chunk-reasoning budget/i,
      ),
    ).toBeInTheDocument();
    expect(document.body.textContent).toContain("let total = 0");
  });

  it("offers a rendered/raw toggle on the SKILL anatomy embed, defaulting to rendered", () => {
    renderWithTheme(<PluginPage />);

    const renderedButton = screen.getByRole("button", { name: /Rendered view/i });
    const rawButton = screen.getByRole("button", { name: /Raw markdown/i });

    expect(renderedButton).toBeInTheDocument();
    expect(rawButton).toBeInTheDocument();
    expect(renderedButton).toHaveAttribute("aria-pressed", "true");
    expect(rawButton).toHaveAttribute("aria-pressed", "false");
  });

  it("surfaces the literal SKILL.md bytes when the user flips to raw", async () => {
    const user = userEvent.setup();
    renderWithTheme(<PluginPage />);

    await user.click(screen.getByRole("button", { name: /Raw markdown/i }));

    expect(document.body.textContent).toContain("name: extract-function");
    expect(document.body.textContent).toContain("# Apply: 01 — Extract Function");
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

  it("maps each invocation scenario to a slash command on the page", () => {
    renderWithTheme(<PluginPage />);

    expect(
      screen.getByRole("heading", { level: 2, name: /How to invoke the plugin/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Something feels off and you can't name it."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("You want to refactor a block but don't know which named move."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("You already know the named refactoring you want."),
    ).toBeInTheDocument();
    expect(screen.getByText("/refactor:audit")).toBeInTheDocument();
    expect(screen.getByText("/refactor:<skill-slug>")).toBeInTheDocument();
  });

  it("walks the user through how to use the plugin once installed", () => {
    renderWithTheme(<PluginPage />);

    expect(
      screen.getByRole("heading", { level: 2, name: /How to use the plugin/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Describe the problem in plain English.")).toBeInTheDocument();
    expect(
      screen.getByText("Watch for the agent naming the smell and the refactoring."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Click through when you don't recognise the named skill."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Watch for the destination pattern when refactorings stack."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Watch the decline vocabulary when the agent doesn't refactor."),
    ).toBeInTheDocument();
  });

  it("names a scenario where the plugin is the wrong choice and how to disable it", () => {
    renderWithTheme(<PluginPage />);

    expect(
      screen.getByRole("heading", { level: 2, name: /When not to install/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/wrong choice when you're chasing a live bug/i)).toBeInTheDocument();
    expect(screen.getByText(/\/plugin disable refactor@ritl/)).toBeInTheDocument();
  });

});
