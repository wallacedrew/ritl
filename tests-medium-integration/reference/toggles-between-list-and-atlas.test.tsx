import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";

import { renderWithTheme } from "../../tests-small-unit/_helpers/renderWithTheme";

const pathnameMock = vi.fn<() => string>();

vi.mock("next/navigation", () => ({
  usePathname: () => pathnameMock(),
}));

import ReferenceViewToggle from "@/reference/components/ReferenceViewToggle";

describe("user switches between list and atlas views of the reference page", () => {
  it("renders a List link and an Atlas link pointing at the matching sub-routes", () => {
    pathnameMock.mockReturnValue("/reference/list");

    renderWithTheme(<ReferenceViewToggle />);

    const listLink = screen.getByRole("link", { name: /^List$/ });
    const atlasLink = screen.getByRole("link", { name: /^Atlas$/ });
    expect(listLink).toHaveAttribute("href", "/reference/list");
    expect(atlasLink).toHaveAttribute("href", "/reference/atlas");
  });

  it("marks the List link as the current page when the pathname is /reference/list", () => {
    pathnameMock.mockReturnValue("/reference/list");

    renderWithTheme(<ReferenceViewToggle />);

    expect(screen.getByRole("link", { name: /^List$/ })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: /^Atlas$/ })).not.toHaveAttribute("aria-current");
  });

  it("marks the Atlas link as the current page when the pathname is /reference/atlas", () => {
    pathnameMock.mockReturnValue("/reference/atlas");

    renderWithTheme(<ReferenceViewToggle />);

    expect(screen.getByRole("link", { name: /^Atlas$/ })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: /^List$/ })).not.toHaveAttribute("aria-current");
  });

  it("treats the bare /reference pathname as List active (the default view)", () => {
    pathnameMock.mockReturnValue("/reference");

    renderWithTheme(<ReferenceViewToggle />);

    expect(screen.getByRole("link", { name: /^List$/ })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: /^Atlas$/ })).not.toHaveAttribute("aria-current");
  });
});
