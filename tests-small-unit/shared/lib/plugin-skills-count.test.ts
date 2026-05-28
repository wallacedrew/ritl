import { readFileSync, readdirSync, statSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

const projectRoot = resolve(__dirname, "../../..");
const skillsRoot = resolve(projectRoot, "plugin/refactor/skills");

function isSkillDirectory(name: string): boolean {
  return statSync(resolve(skillsRoot, name)).isDirectory();
}

describe("refactor plugin skills folder", () => {
  const skillFolders = readdirSync(skillsRoot).filter(isSkillDirectory);

  it("contains exactly 130 skill folders (1 workflow orchestrator + 66 refactorings + 24 smells + 39 patterns)", () => {
    expect(skillFolders).toHaveLength(130);
  });

  it("has a SKILL.md inside every skill folder", () => {
    for (const folder of skillFolders) {
      const skillFile = resolve(skillsRoot, folder, "SKILL.md");
      expect(statSync(skillFile).isFile()).toBe(true);
    }
  });

  it("preserves the same SKILL.md content as the per-entity snippet (single source of truth)", () => {
    const pluginSkill = readFileSync(resolve(skillsRoot, "extract-function/SKILL.md"), "utf-8");
    const siteSnippet = readFileSync(
      resolve(projectRoot, "public/snippets/refactorings/extract-function.md"),
      "utf-8",
    );
    expect(pluginSkill).toBe(siteSnippet);
  });
});
