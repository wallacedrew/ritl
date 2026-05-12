import CatalogListPage from "@/shared/components/CatalogListPage";

import { loadRefactorings } from "./lib/loadRefactorings";
import { toRefactoringListItem } from "./lib/toRefactoringListItem";

export default function RefactoringsPage() {
  const items = loadRefactorings().map((refactoring, index) =>
    toRefactoringListItem(refactoring, index + 1),
  );

  return (
    <CatalogListPage
      title="Refactorings"
      description="Canonical Fowler refactorings and the smells they address."
      items={items}
    />
  );
}
