import { loadPatterns } from "@/patterns/lib/loadPatterns";
import { toPatternListItem } from "@/patterns/lib/toPatternListItem";
import CatalogListPage from "@/shared/components/CatalogListPage";
import { loadCatalogSnapshot } from "@/shared/lib/loadCatalogSnapshot";

export default function GofLandingPage() {
  const snapshot = loadCatalogSnapshot();
  const items = loadPatterns("gof").map((pattern, index) =>
    toPatternListItem(pattern, index + 1, snapshot),
  );

  return (
    <CatalogListPage
      title="Design Patterns"
      description="The 23 canonical Gang of Four design patterns — Creational, Structural, Behavioral."
      note="Source: Gamma, Helm, Johnson, Vlissides, Design Patterns: Elements of Reusable Object-Oriented Software (Addison-Wesley, 1994). Code examples on this sub-site are illustrative adaptations written for the site, not direct quotations from the book."
      items={items}
    />
  );
}
