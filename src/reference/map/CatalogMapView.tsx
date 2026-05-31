import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";

import { loadPatterns } from "@/design-patterns/lib/loadPatterns";
import { loadRefactorings } from "@/refactorings/lib/loadRefactorings";
import { loadSmells } from "@/smells/lib/loadSmells";

import CatalogMapSection from "./components/CatalogMapSection";
import ChipsRow from "./components/ChipsRow";
import CrossBookBridgesList from "./components/CrossBookBridgesList";
import RankedEntriesList from "./components/RankedEntriesList";
import { computeCatalogMap } from "./lib/computeCatalogMap";

export default function CatalogMapView() {
  const catalogMap = computeCatalogMap({
    refactorings: loadRefactorings(),
    smells: loadSmells(),
    patterns: loadPatterns(),
  });

  return (
    <Container maxWidth="lg" sx={{ pt: 2, pb: 4 }}>
      <Stack spacing={2} divider={<SectionDivider />}>
        <CatalogMapSection
          title="Cross-book bridges"
          description="Each Kerievsky refactoring journey that lands on a Gang of Four design pattern."
        >
          <CrossBookBridgesList
            bridges={catalogMap.crossBookBridges}
            emptyMessage="No Kerievsky entries declare a destination pattern yet."
          />
        </CatalogMapSection>

        <CatalogMapSection
          title="Patterns without a destination"
          description="Kerievsky entries with no GoF destination linked. These are content gaps."
        >
          <ChipsRow
            chips={catalogMap.kerievskyWithoutDestination}
            emptyMessage="Every Kerievsky entry currently has a destination."
          />
        </CatalogMapSection>

        <CatalogMapSection
          title="Sparsest cross-references"
          description="Entries with the fewest inbound + outbound connections — the next places to enrich."
        >
          <RankedEntriesList
            entries={catalogMap.sparsestEntries}
            emptyMessage="No catalog entries to rank."
          />
        </CatalogMapSection>

        <CatalogMapSection
          title="Most-connected entries"
          description="Hubs of the catalog by total inbound + outbound connections."
        >
          <RankedEntriesList
            entries={catalogMap.mostConnectedEntries}
            emptyMessage="No catalog entries to rank."
          />
        </CatalogMapSection>
      </Stack>
    </Container>
  );
}

function SectionDivider() {
  return (
    <div
      style={{
        borderTop: "1px solid rgba(0, 0, 0, 0.08)",
        marginLeft: -8,
        marginRight: -8,
      }}
    />
  );
}
