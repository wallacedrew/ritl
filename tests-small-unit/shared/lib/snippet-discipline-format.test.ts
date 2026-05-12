import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

const projectRoot = resolve(__dirname, "../../..");
const disciplinePath = resolve(projectRoot, "public/snippets/refactoring-discipline.md");
const discipline = readFileSync(disciplinePath, "utf-8");

describe("refactoring-discipline.md AGENTS.md rules snippet", () => {
  it("walks the agent through the five-step refactoring cycle in order", () => {
    expect(discipline).toMatch(/^## 1\. Sense the smell$/m);
    expect(discipline).toMatch(/^## 2\. Identify the source$/m);
    expect(discipline).toMatch(/^## 3\. Establish a safety net$/m);
    expect(discipline).toMatch(/^## 4\. Apply one named refactoring$/m);
    expect(discipline).toMatch(/^## 5\. Stay green$/m);
  });

  it("anchors smell vocabulary by naming all 24 Fowler smells inline", () => {
    expect(discipline).toMatch(/mysterious-name/);
    expect(discipline).toMatch(/duplicated-code/);
    expect(discipline).toMatch(/long-function/);
    expect(discipline).toMatch(/primitive-obsession/);
    expect(discipline).toMatch(/feature-envy/);
    expect(discipline).toMatch(/comments/);
  });

  it("calls out Tidy First commit discipline with the Before / After / Value pattern", () => {
    expect(discipline).toMatch(/## Tidy First/m);
    expect(discipline).toMatch(/Before: \/ After: \/ Value:/);
  });

  it("points Claude Code users at the marketplace install command rather than this paste", () => {
    expect(discipline).toMatch(/plugin marketplace add wallacedrew\/ritl/);
    expect(discipline).toMatch(/plugin install refactor@ritl/);
  });

  it("refuses to enumerate every refactoring inline — keeps the file directive, not a catalog", () => {
    const wordCount = discipline.split(/\s+/).length;
    expect(wordCount).toBeLessThan(500);
  });
});
