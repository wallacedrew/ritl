import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";

import { renderWithTheme } from "../../tests-small-unit/_helpers/renderWithTheme";

const pathnameMock = vi.fn<() => string>();

vi.mock("next/navigation", () => ({
  usePathname: () => pathnameMock(),
}));

import ReferenceViewToggle from "@/reference/components/ReferenceViewToggle";

describe("user switches between list and map views of the reference page", () => {
  it("shows both List and Map controls and points the inactive one at its sub-route", () => {
    pathnameMock.mockReturnValue("/reference/list");

    renderWithTheme(<ReferenceViewToggle />);

    expect(screen.getByText(/^List$/)).toBeInTheDocument();
    expect(screen.getByText(/^Map$/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Map/ })).toHaveAttribute("href", "/reference/map");
  });

  it("marks the List control as the current page when the pathname is /reference/list", () => {
    pathnameMock.mockReturnValue("/reference/list");

    renderWithTheme(<ReferenceViewToggle />);

    expect(screen.getByText(/^List$/).closest("[aria-current='page']")).not.toBeNull();
    expect(screen.queryByRole("link", { name: /List/ })).toBeNull();
    expect(screen.getByRole("link", { name: /Map/ })).toHaveAttribute("href", "/reference/map");
  });

  it("marks the Map control as the current page when the pathname is /reference/map", () => {
    pathnameMock.mockReturnValue("/reference/map");

    renderWithTheme(<ReferenceViewToggle />);

    expect(screen.getByText(/^Map$/).closest("[aria-current='page']")).not.toBeNull();
    expect(screen.queryByRole("link", { name: /Map/ })).toBeNull();
    expect(screen.getByRole("link", { name: /List/ })).toHaveAttribute("href", "/reference/list");
  });

  it("treats the bare /reference pathname as List active (the default view)", () => {
    pathnameMock.mockReturnValue("/reference");

    renderWithTheme(<ReferenceViewToggle />);

    expect(screen.getByText(/^List$/).closest("[aria-current='page']")).not.toBeNull();
    expect(screen.queryByRole("link", { name: /List/ })).toBeNull();
    expect(screen.getByRole("link", { name: /Map/ })).toHaveAttribute("href", "/reference/map");
  });
});
