import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { renderWithTheme } from "../../tests-small-unit/_helpers/renderWithTheme";
import CatalogSearch from "@/shared/components/CatalogSearch";
import type { CatalogItem } from "@/shared/lib/CatalogItem";

const pushMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

const items: CatalogItem[] = [
  { kind: "smell", number: 3, name: "Long Function", href: "/smells/long-function" },
  {
    kind: "refactoring",
    number: 1,
    name: "Extract Function",
    href: "/refactorings/extract-function",
  },
  {
    kind: "refactoring",
    number: 12,
    name: "Extract Class",
    href: "/refactorings/extract-class",
  },
];

describe("user searches the catalog", () => {
  it("filters options as the user types and navigates on selection", async () => {
    pushMock.mockClear();
    const user = userEvent.setup();

    renderWithTheme(<CatalogSearch items={items} />);

    const combobox = screen.getByRole("combobox");
    await user.click(combobox);
    await user.type(combobox, "extract");

    expect(screen.getByRole("option", { name: /Extract Function/ })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /Extract Class/ })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: /Long Function/ })).not.toBeInTheDocument();

    await user.click(screen.getByRole("option", { name: /Extract Function/ }));

    expect(pushMock).toHaveBeenCalledWith("/refactorings/extract-function");
  });
});
