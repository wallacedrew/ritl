import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { renderWithTheme } from "../../tests-small-unit/_helpers/renderWithTheme";
import CatalogSearch from "@/shared/components/CatalogSearch";
import type { CatalogItem } from "@/shared/lib/CatalogItem";
import { RecordingAnalyticsTracker } from "@/shared/lib/RecordingAnalyticsTracker";

const pushMock = vi.fn();
const pathnameMock = vi.fn<() => string>(() => "/");
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
  usePathname: () => pathnameMock(),
}));

const items: CatalogItem[] = [
  { kind: "smell", number: 3, name: "Long Function", href: "/refactoring/smells/long-function" },
  {
    kind: "refactoring",
    number: 1,
    name: "Extract Function",
    href: "/refactoring/refactorings/extract-function",
  },
  {
    kind: "refactoring",
    number: 12,
    name: "Extract Class",
    href: "/refactoring/refactorings/extract-class",
  },
];

describe("user searches the catalog", () => {
  it("shows the current page's smell or refactoring as the selected value", () => {
    pathnameMock.mockReturnValue("/refactoring/smells/long-function");

    renderWithTheme(<CatalogSearch items={items} />);

    const combobox = screen.getByRole("combobox") as HTMLInputElement;
    expect(combobox.value).toBe("Long Function");
  });

  it("shows nothing selected on routes that aren't a smell or refactoring detail", () => {
    pathnameMock.mockReturnValue("/");

    renderWithTheme(<CatalogSearch items={items} />);

    const combobox = screen.getByRole("combobox") as HTMLInputElement;
    expect(combobox.value).toBe("");
  });

  it("filters options as the user types and navigates on selection", async () => {
    pathnameMock.mockReturnValue("/");
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

    expect(pushMock).toHaveBeenCalledWith("/refactoring/refactorings/extract-function");
  });

  it("fires search_selected with the picked entry's kind and slug", async () => {
    pathnameMock.mockReturnValue("/");
    pushMock.mockClear();
    const analytics = new RecordingAnalyticsTracker();
    const user = userEvent.setup();

    renderWithTheme(<CatalogSearch items={items} />, { analytics });

    const combobox = screen.getByRole("combobox");
    await user.click(combobox);
    await user.type(combobox, "long");
    await user.click(screen.getByRole("option", { name: /Long Function/ }));

    expect(analytics.calls).toContainEqual({
      event: "search_selected",
      properties: { kind: "smell", slug: "long-function" },
    });
  });
});
