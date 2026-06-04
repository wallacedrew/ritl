import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { renderTermsInProse } from "@/shared/lib/renderTermsInProse";

import { renderWithTheme } from "../../_helpers/renderWithTheme";

describe("renderTermsInProse parses {{term}} tokens and wraps known keys in <Term>", () => {
  it("returns plain text unchanged when no tokens are present", () => {
    const result = renderTermsInProse("Plain prose with no markup.");
    expect(result).toBe("Plain prose with no markup.");
  });

  it("wraps a single known token in a Term trigger", () => {
    renderWithTheme(<>{renderTermsInProse("Read the {{context window}} carefully.")}</>);

    const trigger = screen.getByRole("button", { name: /Definition of context window/i });
    expect(trigger).toHaveTextContent("context window");
  });

  it("preserves the surrounding prose around a token", () => {
    const { container } = renderWithTheme(
      <>{renderTermsInProse("Each {{reasoning step}} costs tokens.")}</>,
    );

    expect(container).toHaveTextContent("Each reasoning step costs tokens.");
  });

  it("wraps multiple tokens independently in the same string", () => {
    renderWithTheme(
      <>
        {renderTermsInProse(
          "{{tokens}} accumulate in the {{context window}} until {{context overflow}}.",
        )}
      </>,
    );

    expect(screen.getByRole("button", { name: /Definition of tokens/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Definition of context window/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Definition of context overflow/i }),
    ).toBeInTheDocument();
  });

  it("renders unknown tokens as literal text with their braces preserved", () => {
    const { container } = render(<>{renderTermsInProse("Mentions {{not-a-real-term}} inline.")}</>);

    expect(container).toHaveTextContent("Mentions {{not-a-real-term}} inline.");
    expect(
      screen.queryByRole("button", { name: /Definition of not-a-real-term/i }),
    ).not.toBeInTheDocument();
  });

  it("trims whitespace around the term key inside the braces", () => {
    renderWithTheme(<>{renderTermsInProse("Loads {{  tokens  }} per pass.")}</>);

    expect(screen.getByRole("button", { name: /Definition of tokens/i })).toBeInTheDocument();
  });

  it("resolves capitalized markers (e.g. sentence start) to the canonical lowercase key", () => {
    renderWithTheme(
      <>{renderTermsInProse("{{Comprehension cost}} drives every downstream cost.")}</>,
    );

    const trigger = screen.getByRole("button", { name: /Definition of comprehension cost/i });
    expect(trigger).toHaveTextContent("Comprehension cost");
  });
});
