import { afterEach, describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Term from "@/shared/components/Term";
import { openPopoverStack } from "@/shared/lib/openPopoverStack";

import { renderWithTheme } from "../../_helpers/renderWithTheme";

describe("Term wraps a glossary term and opens a definition popover on click", () => {
  afterEach(() => {
    openPopoverStack.__resetForTest();
  });

  it("renders the children as the trigger label", () => {
    renderWithTheme(<Term term="context window">context window</Term>);

    const trigger = screen.getByRole("button", { name: /Definition of context window/i });
    expect(trigger).toHaveTextContent("context window");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("opens a popover with the definition when the trigger is clicked", async () => {
    const user = userEvent.setup();
    renderWithTheme(<Term term="context window">context window</Term>);

    const trigger = screen.getByRole("button", { name: /Definition of context window/i });
    await user.click(trigger);

    expect(trigger).toHaveAttribute("aria-expanded", "true");
    const dialog = await screen.findByRole("dialog", { name: /Definition of context window/i });
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveTextContent(/bounded input span/i);
  });

  it("closes the popover when the trigger is clicked a second time", async () => {
    const user = userEvent.setup();
    renderWithTheme(<Term term="context window">context window</Term>);

    const trigger = screen.getByRole("button", { name: /Definition of context window/i });
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("shows the citation when the entry has one", async () => {
    const user = userEvent.setup();
    renderWithTheme(<Term term="lost-in-the-middle">lost-in-the-middle</Term>);

    const trigger = screen.getByRole("button", { name: /Definition of lost-in-the-middle/i });
    await user.click(trigger);

    const dialog = await screen.findByRole("dialog");
    expect(dialog).toHaveTextContent(/Liu et al\./i);
    const citationLink = screen.getByRole("link", { name: /Liu et al\./i });
    expect(citationLink).toHaveAttribute("href", "https://arxiv.org/abs/2307.03172");
  });

  it("opens on Enter when the trigger has keyboard focus", async () => {
    const user = userEvent.setup();
    renderWithTheme(<Term term="tokens">tokens</Term>);

    const trigger = screen.getByRole("button", { name: /Definition of tokens/i });
    trigger.focus();
    await user.keyboard("{Enter}");

    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("opens on Space when the trigger has keyboard focus", async () => {
    const user = userEvent.setup();
    renderWithTheme(<Term term="tokens">tokens</Term>);

    const trigger = screen.getByRole("button", { name: /Definition of tokens/i });
    trigger.focus();
    await user.keyboard(" ");

    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("renders children unchanged when the term key is unknown to the glossary", () => {
    renderWithTheme(
      // @ts-expect-error — intentionally passing an unknown key to test the fallback
      <Term term="not-a-real-term">fallback content</Term>,
    );

    expect(screen.getByText("fallback content")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /Definition of not-a-real-term/i }),
    ).not.toBeInTheDocument();
  });
});
