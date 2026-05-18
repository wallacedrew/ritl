import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

const projectRoot = resolve(__dirname, "../../..");

function readSnippet(relativePath: string): string {
  return readFileSync(resolve(projectRoot, relativePath), "utf-8");
}

describe("refactoring per-entity snippet is a valid Claude SKILL.md", () => {
  const snippet = readSnippet("public/snippets/refactorings/extract-function.md");
  const lines = snippet.split("\n");

  it("opens with a YAML frontmatter delimiter", () => {
    expect(lines[0]).toBe("---");
  });

  it("declares its skill name as the kebab-case slug", () => {
    expect(snippet).toMatch(/^name: extract-function$/m);
  });

  it("carries an Apply-shaped routing description naming the refactoring", () => {
    const descriptionMatch = snippet.match(/^description: (.+)$/m);
    if (descriptionMatch === null || descriptionMatch[1] === undefined) {
      throw new Error("description: line not found in snippet");
    }
    const description = descriptionMatch[1];

    expect(description.startsWith("Apply Extract Function")).toBe(true);
    expect(description.endsWith(".")).toBe(true);
  });

  it("keeps the description free of colon-space sequences that would break bare YAML", () => {
    const descriptionMatch = snippet.match(/^description: (.+)$/m);
    if (descriptionMatch === null || descriptionMatch[1] === undefined) {
      throw new Error("description: line not found in snippet");
    }
    const description = descriptionMatch[1];

    expect(description).not.toMatch(/: /);
  });

  it("closes the frontmatter and follows with an H1 title in the body", () => {
    const closingDelimiterIndex = lines.findIndex((line, index) => index > 0 && line === "---");
    expect(closingDelimiterIndex).toBeGreaterThan(0);
    expect(snippet).toMatch(/^# Apply: 01 — Extract Function$/m);
  });

  it("renders all six force sections + code + cross-link", () => {
    expect(snippet).toContain("**Symptom:**");
    expect(snippet).toContain("**Goal:**");
    expect(snippet).toContain("**Pressure:**");
    expect(snippet).toContain("**Tradeoff:**");
    expect(snippet).toContain("**Relief:**");
    expect(snippet).toContain("**Trap:**");
    expect(snippet).toContain("**Removes smells:** Long Function, Duplicated Code, Comments");
    expect(snippet).toContain("subtotalAfterBulkDiscount(invoice);");
  });
});
