import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import { loadKerievsky } from "@/refactorings/lib/loadKerievsky";
import { loadFowlerRefactorings } from "@/refactorings/lib/loadFowlerRefactorings";
import { loadPatterns } from "@/patterns/lib/loadPatterns";
import { loadSmells } from "@/smells/lib/loadSmells";

const FIXTURE_PATH = resolve(__dirname, "../../_fixtures/url-inventory.json");

type UrlInventory = {
  smells: readonly string[];
  fowlerRefactorings: readonly string[];
  kerievsky: readonly string[];
  patterns: readonly string[];
};

function currentInventory(): UrlInventory {
  return {
    smells: loadSmells()
      .map((entry) => entry.name.toSlug().toString())
      .sort(),
    fowlerRefactorings: loadFowlerRefactorings()
      .map((entry) => entry.name.toSlug().toString())
      .sort(),
    kerievsky: loadKerievsky()
      .map((entry) => entry.name.toSlug().toString())
      .sort(),
    patterns: loadPatterns()
      .map((entry) => entry.name.toSlug().toString())
      .sort(),
  };
}

function readFixture(): UrlInventory {
  return JSON.parse(readFileSync(FIXTURE_PATH, "utf-8")) as UrlInventory;
}

if (process.env.UPDATE_URL_INVENTORY === "1") {
  writeFileSync(FIXTURE_PATH, JSON.stringify(currentInventory(), null, 2) + "\n", "utf-8");
}

describe("URL inventory", () => {
  it("emits 24 smell slugs", () => {
    expect(loadSmells()).toHaveLength(24);
  });

  it("emits 66 Fowler refactoring slugs", () => {
    expect(loadFowlerRefactorings()).toHaveLength(66);
  });

  it("emits 27 Kerievsky refactoring slugs", () => {
    expect(loadKerievsky()).toHaveLength(27);
  });

  it("emits 23 design-pattern slugs", () => {
    expect(loadPatterns()).toHaveLength(23);
  });

  it("matches the pinned slug set per route", () => {
    const actual = currentInventory();
    const expected = readFixture();
    expect(
      actual,
      "URL inventory drifted; if intentional, regenerate with UPDATE_URL_INVENTORY=1",
    ).toEqual(expected);
  });
});
