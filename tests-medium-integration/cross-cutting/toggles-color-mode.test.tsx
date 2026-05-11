import { beforeEach, describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { renderWithTheme } from "../../tests-small-unit/_helpers/renderWithTheme";
import ColorModeToggle from "@/shared/components/ColorModeToggle";

describe("user toggles color mode", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("starts in dark mode and labels the action as 'switch to light mode'", () => {
    renderWithTheme(<ColorModeToggle />);

    expect(screen.getByRole("button", { name: /switch to light mode/i })).toBeInTheDocument();
  });

  it("flips to light mode on click and the label updates", async () => {
    const user = userEvent.setup();
    renderWithTheme(<ColorModeToggle />);

    await user.click(screen.getByRole("button", { name: /switch to light mode/i }));

    expect(screen.getByRole("button", { name: /switch to dark mode/i })).toBeInTheDocument();
  });

  it("persists the chosen mode to localStorage", async () => {
    const user = userEvent.setup();
    renderWithTheme(<ColorModeToggle />);

    await user.click(screen.getByRole("button", { name: /switch to light mode/i }));

    expect(window.localStorage.getItem("ritl-color-mode")).toBe("light");
  });
});
