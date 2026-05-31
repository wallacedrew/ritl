import { describe, expect, it } from "vitest";

import { CatalogEntryName } from "@/shared/lib/CatalogEntryName";
import { toCatalogEntryHeaderViewModel } from "@/shared/lib/toCatalogEntryHeaderViewModel";

describe("toCatalogEntryHeaderViewModel", () => {
  it("projects a smell name into a header with the Apply-refactorings label", () => {
    const header = toCatalogEntryHeaderViewModel({
      name: CatalogEntryName.smell("Long Function"),
      number: 12,
      relatedNames: [CatalogEntryName.refactoring("Extract Function")],
    });

    expect(header.title).toBe("Long Function");
    expect(header.number).toBe(12);
    expect(header.nemesesLabel).toBe("Apply refactorings");
    expect(header.relatedChips).toEqual([
      {
        label: "Extract Function",
        href: "/refactoring/canon/extract-function",
        tone: "fowler-refactoring",
      },
    ]);
    expect(header.destinationChip).toBeUndefined();
    expect(header.incomingSourceChips).toBeUndefined();
    expect(header.inboundPatternChips).toBeUndefined();
  });

  it("projects a Fowler refactoring with the Removes-smells label", () => {
    const header = toCatalogEntryHeaderViewModel({
      name: CatalogEntryName.refactoring("Extract Function"),
      number: 1,
      relatedNames: [CatalogEntryName.smell("Long Function")],
    });

    expect(header.nemesesLabel).toBe("Removes smells");
    expect(header.relatedChips[0]).toEqual({
      label: "Long Function",
      href: "/refactoring/smells/long-function",
      tone: "smell",
    });
  });

  it("projects a Kerievsky refactoring with the Triggered-by label", () => {
    const header = toCatalogEntryHeaderViewModel({
      name: CatalogEntryName.refactoring("Compose Method", "kerievsky"),
      number: 3,
      relatedNames: [],
      destinationPattern: CatalogEntryName.pattern("Composite", "gof"),
    });

    expect(header.nemesesLabel).toBe("Triggered by");
    expect(header.destinationChip).toEqual({
      label: "Composite",
      href: "/design-patterns/composite",
      tone: "pattern",
    });
  });

  it("projects a GoF pattern with the Triggered-by label", () => {
    const header = toCatalogEntryHeaderViewModel({
      name: CatalogEntryName.pattern("Abstract Factory", "gof"),
      number: 1,
      relatedNames: [],
    });

    expect(header.nemesesLabel).toBe("Triggered by");
  });

  it("carries incoming-source and inbound-pattern chips when provided", () => {
    const header = toCatalogEntryHeaderViewModel({
      name: CatalogEntryName.smell("Long Function"),
      number: 12,
      relatedNames: [],
      inboundPatternNames: [CatalogEntryName.pattern("Strategy", "gof")],
    });

    expect(header.inboundPatternChips).toEqual([
      {
        label: "Strategy",
        href: "/design-patterns/strategy",
        tone: "pattern",
      },
    ]);
  });
});
