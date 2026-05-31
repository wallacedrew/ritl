import { describe, expect, it } from "vitest";

import { InMemorySnippetSource } from "@/shared/adapters/InMemorySnippetSource";

describe("InMemorySnippetSource", () => {
  it("returns the body preloaded for a known href", async () => {
    const source = new InMemorySnippetSource(
      new Map([["/snippets/refactorings/extract-function.md", "# Extract Function"]]),
    );

    const body = await source.fetch("/snippets/refactorings/extract-function.md");

    expect(body).toBe("# Extract Function");
  });

  it("throws when asked for an href that was not preloaded", async () => {
    const source = new InMemorySnippetSource(new Map());

    await expect(source.fetch("/snippets/unknown.md")).rejects.toThrow(
      /no entry for "\/snippets\/unknown\.md"/,
    );
  });
});
