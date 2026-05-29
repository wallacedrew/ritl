import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";

import { renderWithTheme } from "../../tests-small-unit/_helpers/renderWithTheme";

const pathnameMock = vi.fn<() => string>();

vi.mock("next/navigation", () => ({
  usePathname: () => pathnameMock(),
}));

import ReferenceViewToggle from "@/reference/components/ReferenceViewToggle";

describe("user switches between list and map views of the reference page", () => {
  it("renders a List link and a Map link pointing at the matching sub-routes", () => {
    pathnameMock.mockReturnValue("/reference/list");

    renderWithTheme(<ReferenceViewToggle />);

    const listLink = screen.getByRole("link", { name: /^List$/ });
    const mapLink = screen.getByRole("link", { name: /^Map$/ });
    expect(listLink).toHaveAttribute("href", "/reference/list");
    expect(mapLink).toHaveAttribute("href", "/reference/map");
  });

  it("marks the List link as the current page when the pathname is /reference/list", () => {
    pathnameMock.mockReturnValue("/reference/list");

    renderWithTheme(<ReferenceViewToggle />);

    expect(screen.getByRole("link", { name: /^List$/ })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: /^Map$/ })).not.toHaveAttribute("aria-current");
  });

  it("marks the Map link as the current page when the pathname is /reference/map", () => {
    pathnameMock.mockReturnValue("/reference/map");

    renderWithTheme(<ReferenceViewToggle />);

    expect(screen.getByRole("link", { name: /^Map$/ })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: /^List$/ })).not.toHaveAttribute("aria-current");
  });

  it("treats the bare /reference pathname as List active (the default view)", () => {
    pathnameMock.mockReturnValue("/reference");

    renderWithTheme(<ReferenceViewToggle />);

    expect(screen.getByRole("link", { name: /^List$/ })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: /^Map$/ })).not.toHaveAttribute("aria-current");
  });
});
