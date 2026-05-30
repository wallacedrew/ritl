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
      note="Source: Martin Fowler, Refactoring: Improving the Design of Existing Code, 2nd edition (Addison-Wesley, 2018). Code examples on this sub-site are illustrative adaptations written for the site, not direct quotations from the book."
      items={items}
    />
  );
}
