import { afterEach, describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import SmellComparePage from "@/smells/SmellComparePage";
import { openPopoverStack } from "@/shared/lib/openPopoverStack";

import { renderWithTheme } from "../../tests-small-unit/_helpers/renderWithTheme";

describe("user clicks a glossary term inside the Duplicated Code compare view", () => {
  afterEach(() => {
    openPopoverStack.__resetForTest();
  });

  it("renders Term triggers for context window, tokens, and token cost in the agent-side fields", async () => {
    const ui = await SmellComparePage({
      params: Promise.resolve({ slug: "duplicated-code" }),
    });

    renderWithTheme(ui);

    expect(
      screen.getByRole("button", { name: /Definition of context window/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Definition of tokens/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Definition of token cost/i })).toBeInTheDocument();
  });

  it("opens the context-window popover with its definition on click", async () => {
    const user = userEvent.setup();
    const ui = await SmellComparePage({
      params: Promise.resolve({ slug: "duplicated-code" }),
    });

    renderWithTheme(ui);

    const trigger = screen.getByRole("button", { name: /Definition of context window/i });
    await user.click(trigger);

    const dialog = await screen.findByRole("dialog", { name: /Definition of context window/i });
    expect(dialog).toHaveTextContent(/bounded input span/i);
  });
});
