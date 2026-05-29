import { describe, expect, it } from "vitest";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { renderWithTheme } from "../../tests-small-unit/_helpers/renderWithTheme";
import ReferencePage from "@/reference/ReferencePage";

describe("user explores cross-references from a smell on the reference list page", () => {
  it("renders an inline chevron toggle next to every smell chip", () => {
    renderWithTheme(<ReferencePage />);

    const longFunctionToggle = screen.getByRole("button", {
      name: /Long Function cross-references/i,
    });
    expect(longFunctionToggle).toHaveAttribute("aria-expanded", "false");
  });

  it("opens a popover of refactorings that address the smell when the chevron is clicked", async () => {
    const user = userEvent.setup();
    renderWithTheme(<ReferencePage />);

    const longFunctionToggle = screen.getByRole("button", {
      name: /Long Function cross-references/i,
    });
    await user.click(longFunctionToggle);

    expect(longFunctionToggle).toHaveAttribute("aria-expanded", "true");
    const panel = await screen.findByRole("dialog", { name: /Long Function cross-references/i });
    expect(within(panel).getByText(/Apply refactorings/i)).toBeInTheDocument();

    const extractFunctionLink = within(panel).getByRole("link", { name: "Extract Function" });
    expect(extractFunctionLink).toHaveAttribute("href", "/refactoring/canon/extract-function");
  });

  it("closes the popover when the chevron is clicked again", async () => {
    const user = userEvent.setup();
    renderWithTheme(<ReferencePage />);

    const longFunctionToggle = screen.getByRole("button", {
      name: /Long Function cross-references/i,
    });
    await user.click(longFunctionToggle);
    expect(longFunctionToggle).toHaveAttribute("aria-expanded", "true");

    await user.click(longFunctionToggle);
    expect(longFunctionToggle).toHaveAttribute("aria-expanded", "false");
  });

  it("lists patterns that reference the smell under 'Referenced by patterns'", async () => {
    const user = userEvent.setup();
    renderWithTheme(<ReferencePage />);

    const longFunctionToggle = screen.getByRole("button", {
      name: /Long Function cross-references/i,
    });
    await user.click(longFunctionToggle);

    const panel = await screen.findByRole("dialog", { name: /Long Function cross-references/i });
    expect(within(panel).getByText(/Referenced by patterns/i)).toBeInTheDocument();
    expect(within(panel).getByRole("link", { name: /Compose Method/i })).toBeInTheDocument();
  });

  it("renders chevrons on the chips inside the popover so the user can keep drilling", async () => {
    const user = userEvent.setup();
    renderWithTheme(<ReferencePage />);

    const longFunctionToggle = screen.getByRole("button", {
      name: /Long Function cross-references/i,
    });
    await user.click(longFunctionToggle);

    const panel = await screen.findByRole("dialog", { name: /Long Function cross-references/i });
    expect(
      within(panel).getByRole("button", { name: /Extract Function cross-references/i }),
    ).toBeInTheDocument();
  });
});
