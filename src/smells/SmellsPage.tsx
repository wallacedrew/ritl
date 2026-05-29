import CatalogListPage from "@/shared/components/CatalogListPage";
import { loadCatalogSnapshot } from "@/shared/lib/loadCatalogSnapshot";

import { toSmellListItem } from "./lib/toSmellListItem";

export default function SmellsPage() {
  const snapshot = loadCatalogSnapshot();
  const items = snapshot.smells.map((smell, index) => toSmellListItem(smell, index + 1, snapshot));

  return (
    <CatalogListPage
      title="Code Smells"
      description="Canonical Fowler smells and the refactorings that address them."
      items={items}
    />
  );
}
