import type { RefactoringCategoryGroup } from "@/refactorings/lib/getRefactoringsByCategory";
import { getRefactoringsByCategory } from "@/refactorings/lib/getRefactoringsByCategory";
import { loadRefactorings } from "@/refactorings/lib/loadRefactorings";
import { loadPatterns } from "@/patterns/lib/loadPatterns";
import { toPatternListItem } from "@/patterns/lib/toPatternListItem";
import type { CatalogSnapshot } from "@/reference/lib/collectCrossReferences";
import type { CatalogListItem } from "@/shared/lib/CatalogListItem";
import { loadSmells } from "@/smells/lib/loadSmells";
import { toSmellListItem } from "@/smells/lib/toSmellListItem";

export interface ReferenceCatalogCounts {
  refactorings: number;
  smells: number;
  kerievskyPatterns: number;
  gofPatterns: number;
}

export interface ReferenceSections {
  refactoringsByCategory: RefactoringCategoryGroup[];
  smells: CatalogListItem[];
  kerievskyPatterns: CatalogListItem[];
  gofPatternsByBand: RefactoringCategoryGroup[];
  counts: ReferenceCatalogCounts;
}

interface GofBand {
  readonly name: string;
  readonly firstNumber: number;
  readonly lastNumber: number;
}

const GOF_BANDS: readonly GofBand[] = [
  { name: "Creational", firstNumber: 1, lastNumber: 5 },
  { name: "Structural", firstNumber: 6, lastNumber: 12 },
  { name: "Behavioral", firstNumber: 13, lastNumber: 23 },
];

export function getReferenceSections(): ReferenceSections {
  const snapshot: CatalogSnapshot = {
    refactorings: loadRefactorings(),
    smells: loadSmells(),
    patterns: loadPatterns(),
  };
  const refactoringsByCategory = getRefactoringsByCategory(snapshot);
  const smells = snapshot.smells.map((entry, index) => toSmellListItem(entry, index + 1, snapshot));
  const kerievskyPatterns = loadPatterns("kerievsky").map((pattern, index) =>
    toPatternListItem(pattern, index + 1, snapshot),
  );
  const gofItems = loadPatterns("gof").map((pattern, index) =>
    toPatternListItem(pattern, index + 1, snapshot),
  );
  const gofPatternsByBand = GOF_BANDS.map((band) => ({
    category: band.name,
    items: gofItems.filter(
      (item) => item.number >= band.firstNumber && item.number <= band.lastNumber,
    ),
  }));
  const refactoringCount = refactoringsByCategory.reduce(
    (sum, group) => sum + group.items.length,
    0,
  );

  return {
    refactoringsByCategory,
    smells,
    kerievskyPatterns,
    gofPatternsByBand,
    counts: {
      refactorings: refactoringCount,
      smells: smells.length,
      kerievskyPatterns: kerievskyPatterns.length,
      gofPatterns: gofItems.length,
    },
  };
}
