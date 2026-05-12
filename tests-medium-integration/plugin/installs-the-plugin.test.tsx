import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";

import { renderWithTheme } from "../../tests-small-unit/_helpers/renderWithTheme";
import PluginPage from "@/plugin/PluginPage";

describe("user installs the plugin from /plugin", () => {
  it("offers the AGENTS.md discipline snippet, the catalog fallback, and the marketplace install", () => {
    renderWithTheme(<PluginPage />);

    expect(screen.getByRole("heading", { name: "Plugin" })).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /refactoring-discipline\.md/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /refactoring-catalog\.md/i })).toBeInTheDocument();

    expect(
      screen.getByText(
        /Fallback for non-Claude-Code agents.*paste sections relevant to the smell/i,
      ),
    ).toBeInTheDocument();

    expect(screen.getByText(/plugin marketplace add wallacedrew\/ritl/)).toBeInTheDocument();
    expect(screen.getByText(/plugin install refactor@ritl/)).toBeInTheDocument();
  });
});
