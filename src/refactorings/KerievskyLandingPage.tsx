import { loadKerievsky } from "@/refactorings/lib/loadKerievsky";
import { toRefactoringListItem } from "@/refactorings/lib/toRefactoringListItem";
import CatalogListPage from "@/shared/components/CatalogListPage";

export default function KerievskyLandingPage() {
  const items = loadKerievsky().map((refactoring, index) =>
    toRefactoringListItem(refactoring, index + 1),
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
