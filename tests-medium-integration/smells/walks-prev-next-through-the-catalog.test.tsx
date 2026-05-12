import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";

import { renderWithTheme } from "../../tests-small-unit/_helpers/renderWithTheme";
import SmellDetailPage from "@/smells/SmellDetailPage";

describe("user walks the smells catalog with prev/next tiles", () => {
  it("on the first smell, shows Next only", async () => {
    const ui = await SmellDetailPage({
      params: Promise.resolve({ slug: "mysterious-name" }),
    });

    renderWithTheme(ui);

    expect(screen.queryByRole("link", { name: /^previous/i })).toBeNull();
    const nextLink = screen.getByRole("link", { name: /next/i });
    expect(nextLink).toHaveAttribute("href", "/smells/duplicated-code");
  });

  it("on a middle smell, shows both Prev and Next pointing to neighbors", async () => {
    const ui = await SmellDetailPage({
      params: Promise.resolve({ slug: "long-function" }),
    });

    renderWithTheme(ui);

    const prevLink = screen.getByRole("link", { name: /previous/i });
    const nextLink = screen.getByRole("link", { name: /next/i });
    expect(prevLink).toHaveAttribute("href", "/smells/duplicated-code");
    expect(nextLink).toHaveAttribute("href", "/smells/long-parameter-list");
  });

  it("on the last smell, shows Previous only", async () => {
    const ui = await SmellDetailPage({
      params: Promise.resolve({ slug: "comments" }),
    });

    renderWithTheme(ui);

    expect(screen.queryByRole("link", { name: /^next/i })).toBeNull();
    expect(screen.getByRole("link", { name: /previous/i })).toBeInTheDocument();
  });
});
