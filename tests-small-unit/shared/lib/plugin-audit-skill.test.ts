import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

const projectRoot = resolve(__dirname, "../../..");
const skillPath = resolve(projectRoot, "plugin/refactor/skills/audit/SKILL.md");
const skill = readFileSync(skillPath, "utf-8");

describe("refactor:audit orchestrator skill", () => {
  it("declares its skill name as 'audit' in the frontmatter", () => {
    expect(skill).toMatch(/^name: audit$/m);
  });

  it("carries a routing description that names the canonical trigger phrases", () => {
    const descriptionMatch = skill.match(/^description: (.+)$/m);
    if (descriptionMatch === null || descriptionMatch[1] === undefined) {
      throw new Error("description: line not found in audit skill");
    }
    const description = descriptionMatch[1];

    expect(description).toMatch(/"audit this"/);
    expect(description).toMatch(/"refactoring"/);
    expect(description).toMatch(/"ritl"/);
    expect(description).toMatch(/"smell"/);
    expect(description).toMatch(/"code-smell"/);
    expect(description).toMatch(/"tidy this up"/);
    expect(description).toMatch(/"is this clean"/);
  });

  it("keeps the description free of colon-space sequences that would break bare YAML", () => {
    const descriptionMatch = skill.match(/^description: (.+)$/m);
    if (descriptionMatch === null || descriptionMatch[1] === undefined) {
      throw new Error("description: line not found in audit skill");
    }
    const description = descriptionMatch[1];

    expect(description).not.toMatch(/: /);
  });

  it("walks Claude through the six audit phases in order", () => {
    expect(skill).toMatch(/^## 1\. Sense the smells$/m);
    expect(skill).toMatch(/^## 2\. Build \(or update and redisplay\) the table$/m);
    expect(skill).toMatch(/^## 3\. Establish a safety net for the next on the list$/m);
    expect(skill).toMatch(/^## 4\. Apply next on the list$/m);
    expect(skill).toMatch(/^## 5\. Stay green$/m);
    expect(skill).toMatch(/^## 6\. Re-sense$/m);
  });

  it("delegates safety-net + green-loop discipline to existing tdd / tcr skills by name", () => {
    expect(skill).toMatch(/`tdd`/);
    expect(skill).toMatch(/`tcr`/);
  });
});
