import CatalogListPage from "@/shared/components/CatalogListPage";

import { loadSmells } from "./lib/loadSmells";
import { toSmellListItem } from "./lib/toSmellListItem";

export default function SmellsPage() {
  const items = loadSmells().map((smell, index) => toSmellListItem(smell, index + 1));

  return (
    <CatalogListPage
      title="Code Smells"
      description="Canonical Fowler smells and the refactorings that address them."
      items={items}
    />
  );
}
