import CatalogListPage from "@/shared/components/CatalogListPage";
import { loadCatalogSnapshot } from "@/shared/lib/loadCatalogSnapshot";

import { toRefactoringListItem } from "./lib/toRefactoringListItem";

export default function RefactoringsPage() {
  const snapshot = loadCatalogSnapshot();
  const items = snapshot.refactorings.map((refactoring, index) =>
    toRefactoringListItem(refactoring, index + 1, snapshot),
  );

  return (
    <CatalogListPage
      title="Refactorings"
      description="Canonical Fowler refactorings and the smells they address."
      items={items}
    />
  );
}
