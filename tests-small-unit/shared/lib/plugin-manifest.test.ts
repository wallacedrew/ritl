import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

const projectRoot = resolve(__dirname, "../../..");

describe("refactor plugin manifest", () => {
  const manifestPath = resolve(projectRoot, "plugin/refactor/.claude-plugin/plugin.json");
  const manifest = JSON.parse(readFileSync(manifestPath, "utf-8"));

  it("declares the plugin name", () => {
    expect(manifest.name).toBe("refactor");
  });

  it("carries a non-empty description naming the catalog", () => {
    expect(typeof manifest.description).toBe("string");
    expect(manifest.description.length).toBeGreaterThan(20);
    expect(manifest.description.toLowerCase()).toContain("refactoring");
  });

  it("includes an author object with a name", () => {
    expect(manifest.author).toBeDefined();
    expect(typeof manifest.author.name).toBe("string");
    expect(manifest.author.name.length).toBeGreaterThan(0);
  });

  it("points at the live site and the source repo", () => {
    expect(manifest.homepage).toBe("https://refactoringintheloop.com");
    expect(manifest.repository).toBe("https://github.com/wallacedrew/ritl");
  });
});
