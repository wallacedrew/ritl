import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

import designPatternsJson from "@/design-patterns/content/design-patterns.json";
import refactoringsJson from "@/refactorings/content/refactorings.json";
import smellsJson from "@/smells/content/smells.json";
import { CatalogEntryName } from "@/shared/lib/CatalogEntryName";

const projectRoot = resolve(__dirname, "../../../");

function routeFilePathFor(detailHref: string, variant: "" | "agent" | "compare"): string {
  const segments = detailHref.split("/").filter((s) => s.length > 0);
  segments[segments.length - 1] = "[slug]";
  if (variant !== "") segments.push(variant);
  segments.push("page.tsx");
  return resolve(projectRoot, "src/app", ...segments);
}

interface RawEntry {
  name: string;
  book?: string;
}

function collectMissingRoutes(entries: CatalogEntryName[]): string[] {
  const missing: string[] = [];
  for (const entry of entries) {
    const detail = entry.toCatalogHref();
    for (const variant of ["", "agent", "compare"] as const) {
      const filePath = routeFilePathFor(detail, variant);
      if (!existsSync(filePath)) {
        missing.push(`${detail}${variant === "" ? "" : "/" + variant}`);
      }
    }
  }
  return missing;
}

describe("every catalog entry's detail / agent / compare URL has a matching App Router page", () => {
  it("ships routes for every refactoring (Fowler canon and Kerievsky sub-site alike)", () => {
    const entries = (refactoringsJson as RawEntry[]).map((raw) => {
      const book = raw.book === "kerievsky" ? "kerievsky" : "fowler";
      return CatalogEntryName.refactoring(raw.name, book);
    });

    expect(collectMissingRoutes(entries)).toEqual([]);
  });

  it("ships routes for every smell", () => {
    const entries = (smellsJson as RawEntry[]).map((raw) => CatalogEntryName.smell(raw.name));

    expect(collectMissingRoutes(entries)).toEqual([]);
  });

  it("ships routes for every design pattern (Kerievsky and GoF)", () => {
    const entries = (designPatternsJson as RawEntry[]).map((raw) => {
      const book = raw.book === "kerievsky" ? "kerievsky" : "gof";
      return CatalogEntryName.pattern(raw.name, book);
    });

    expect(collectMissingRoutes(entries)).toEqual([]);
  });
});
