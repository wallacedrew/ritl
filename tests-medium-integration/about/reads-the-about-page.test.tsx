import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";

import { renderWithTheme } from "../../tests-small-unit/_helpers/renderWithTheme";
import AboutPage from "@/about/AboutPage";

describe("user reads the about page at /about", () => {
  it("introduces the site under a top-level About heading", () => {
    renderWithTheme(<AboutPage />);

    expect(screen.getByRole("heading", { level: 1, name: /^About$/i })).toBeInTheDocument();
  });

  it("names every section a reader should be able to find", () => {
    renderWithTheme(<AboutPage />);

    expect(screen.getByRole("heading", { name: /What this is/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Who this is for/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /The problem/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Three example uses/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Attributions/i })).toBeInTheDocument();
  });

  it("cites each of the three source books with author, title, and year", () => {
    renderWithTheme(<AboutPage />);

    expect(screen.getByText(/Martin Fowler/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Refactoring: Improving the Design of Existing Code/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/2018/)).toBeInTheDocument();

    expect(screen.getByText(/Joshua Kerievsky/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Refactoring to Patterns/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/2004/)).toBeInTheDocument();

    expect(
      screen.getByText(/Erich Gamma.*Richard Helm.*Ralph Johnson.*John Vlissides/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Design Patterns: Elements of Reusable Object-Oriented Software/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/1994/)).toBeInTheDocument();
  });

  it("discloses AI involvement in producing the site's prose", () => {
    renderWithTheme(<AboutPage />);

    expect(screen.getByRole("heading", { name: /AI in production/i })).toBeInTheDocument();
  });

  it("exposes the feedback email address as a mailto link", () => {
    renderWithTheme(<AboutPage />);

    const feedbackLink = screen.getByRole("link", { name: /feedback@refactorplug\.com/i });
    expect(feedbackLink).toHaveAttribute("href", "mailto:feedback@refactorplug.com");
  });
});
