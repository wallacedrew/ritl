import { afterEach, describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import AboutPage from "@/about/AboutPage";
import { openPopoverStack } from "@/shared/lib/openPopoverStack";

import { renderWithTheme } from "../../tests-small-unit/_helpers/renderWithTheme";

describe("user clicks a glossary term on the about page and reads its definition", () => {
  afterEach(() => {
    openPopoverStack.__resetForTest();
  });

  it("renders a clickable Term trigger for 'context window' in the problem section", () => {
    renderWithTheme(<AboutPage />);

    const trigger = screen.getByRole("button", { name: /Definition of context window/i });
    expect(trigger).toHaveTextContent("context window");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("opens a popover with the definition when the user clicks the trigger", async () => {
    const user = userEvent.setup();
    renderWithTheme(<AboutPage />);

    const trigger = screen.getByRole("button", { name: /Definition of context window/i });
    await user.click(trigger);

    const dialog = await screen.findByRole("dialog", { name: /Definition of context window/i });
    expect(dialog).toHaveTextContent(/bounded input span/i);
  });

  it("offers cited terms with their citation link", async () => {
    const user = userEvent.setup();
    renderWithTheme(<AboutPage />);

    const trigger = screen.getByRole("button", { name: /Definition of lost-in-the-middle/i });
    await user.click(trigger);

    const dialog = await screen.findByRole("dialog");
    expect(dialog).toHaveTextContent(/Liu et al/i);
  });
});
