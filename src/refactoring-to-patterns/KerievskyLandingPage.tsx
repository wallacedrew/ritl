import CatalogListPage from "@/shared/components/CatalogListPage";
import { loadPatterns } from "@/patterns/lib/loadPatterns";
import { toPatternListItem } from "@/patterns/lib/toPatternListItem";

export default function KerievskyLandingPage() {
  const items = loadPatterns("kerievsky").map((pattern, index) =>
    toPatternListItem(pattern, index + 1),
  );

  return (
    <CatalogListPage
      title="Refactoring to Patterns"
      description="Kerievsky's composite refactorings whose destination is a design pattern."
      note="Source: Joshua Kerievsky, Refactoring to Patterns (Addison-Wesley, 2004). Code examples on this sub-site are illustrative adaptations written for the site, not direct quotations from the book."
      items={items}
    />
  );
}
