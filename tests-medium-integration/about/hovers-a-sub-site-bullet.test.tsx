import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { renderWithTheme } from "../../tests-small-unit/_helpers/renderWithTheme";
import WhatThisIs from "@/about/components/WhatThisIs";
import CatalogToolbar from "@/shared/components/CatalogToolbar";
import { NavHoverProvider } from "@/shared/components/NavHoverProvider";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({ push: vi.fn() }),
}));

function renderHoverScene() {
  return renderWithTheme(
    <NavHoverProvider>
      <CatalogToolbar />
      <WhatThisIs />
    </NavHoverProvider>,
  );
}

describe("user hovers a sub-site bullet on the About page to find its nav tab", () => {
  it("marks the Refactorings and Smells nav tabs as hovered when the Fowler bullet is hovered", async () => {
    const user = userEvent.setup();
    renderHoverScene();

    const fowlerBullet = screen.getByTestId("about-bullet-refactoring");
    await user.hover(fowlerBullet);

    expect(screen.getByRole("link", { name: /^Refactorings$/ })).toHaveAttribute(
      "data-nav-hovered",
      "true",
    );
    expect(screen.getByRole("link", { name: /^Smells$/ })).toHaveAttribute(
      "data-nav-hovered",
      "true",
    );
    expect(screen.getByRole("link", { name: /^Design Patterns$/ })).not.toHaveAttribute(
      "data-nav-hovered",
      "true",
    );
  });

  it("marks the Refactorings to Patterns nav tab as hovered when the Kerievsky bullet is hovered", async () => {
    const user = userEvent.setup();
    renderHoverScene();

    const kerievskyBullet = screen.getByTestId("about-bullet-refactoring-to-patterns");
    await user.hover(kerievskyBullet);

    expect(screen.getByRole("link", { name: /^Refactorings to Patterns$/ })).toHaveAttribute(
      "data-nav-hovered",
      "true",
    );
    expect(screen.getByRole("link", { name: /^Refactorings$/ })).not.toHaveAttribute(
      "data-nav-hovered",
      "true",
    );
  });

  it("marks the Design Patterns nav tab as hovered when the Gang of Four bullet is hovered", async () => {
    const user = userEvent.setup();
    renderHoverScene();

    const gofBullet = screen.getByTestId("about-bullet-design-patterns");
    await user.hover(gofBullet);

    expect(screen.getByRole("link", { name: /^Design Patterns$/ })).toHaveAttribute(
      "data-nav-hovered",
      "true",
    );
    expect(screen.getByRole("link", { name: /^Refactorings$/ })).not.toHaveAttribute(
      "data-nav-hovered",
      "true",
    );
  });

  it("clears the hovered marker when the pointer leaves the bullet", async () => {
    const user = userEvent.setup();
    renderHoverScene();

    const kerievskyBullet = screen.getByTestId("about-bullet-refactoring-to-patterns");
    await user.hover(kerievskyBullet);
    await user.unhover(kerievskyBullet);

    expect(screen.getByRole("link", { name: /^Refactorings to Patterns$/ })).not.toHaveAttribute(
      "data-nav-hovered",
      "true",
    );
  });
});
