import CatalogListPage from "@/shared/components/CatalogListPage";

import { loadSmells } from "./lib/loadSmells";
import { toSmellListItem } from "./lib/toSmellListItem";

export default function SmellsPage() {
  const items = loadSmells().map((smell, index) => toSmellListItem(smell, index + 1));

  return (
    <CatalogListPage
      title="Code Smells"
      description="Canonical Fowler smells and the refactorings that address them."
      note="Source: Martin Fowler, Refactoring: Improving the Design of Existing Code, 2nd edition (Addison-Wesley, 2018), Chapter 3 'Bad Smells in Code' (co-authored with Kent Beck). Code examples on this sub-site are illustrative adaptations written for the site, not direct quotations from the book."
      items={items}
    />
  );
}
