import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

const projectRoot = resolve(__dirname, "../../..");
const skillPath = resolve(projectRoot, "plugin/refactor/skills/workflow/SKILL.md");
const skill = readFileSync(skillPath, "utf-8");

describe("refactor:workflow orchestrator skill", () => {
  it("declares its skill name as 'workflow' in the frontmatter", () => {
    expect(skill).toMatch(/^name: workflow$/m);
  });

  it("carries a routing description that names every alias trigger phrase", () => {
    const descriptionMatch = skill.match(/^description: (.+)$/m);
    if (descriptionMatch === null || descriptionMatch[1] === undefined) {
      throw new Error("description: line not found in workflow skill");
    }
    const description = descriptionMatch[1];

    expect(description).toMatch(/"refactoring"/);
    expect(description).toMatch(/"ritl"/);
    expect(description).toMatch(/"smell"/);
    expect(description).toMatch(/"code-smell"/);
  });

  it("keeps the description free of colon-space sequences that would break bare YAML", () => {
    const descriptionMatch = skill.match(/^description: (.+)$/m);
    if (descriptionMatch === null || descriptionMatch[1] === undefined) {
      throw new Error("description: line not found in workflow skill");
    }
    const description = descriptionMatch[1];

    expect(description).not.toMatch(/: /);
  });

  it("walks Claude through the five workflow sections in order", () => {
    expect(skill).toMatch(/^## 1\. Sense the smell$/m);
    expect(skill).toMatch(/^## 2\. Identify the source$/m);
    expect(skill).toMatch(/^## 3\. Establish a safety net$/m);
    expect(skill).toMatch(/^## 4\. Apply the matching refactoring$/m);
    expect(skill).toMatch(/^## 5\. Stay green$/m);
  });

  it("delegates safety-net + green-loop discipline to existing tdd / tcr skills by name", () => {
    expect(skill).toMatch(/`tdd`/);
    expect(skill).toMatch(/`tcr`/);
  });
});
