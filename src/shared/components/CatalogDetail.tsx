import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";

import BeforeAfterCodeBlocks from "@/shared/components/BeforeAfterCodeBlocks";
import CatalogBackLink from "@/shared/components/CatalogBackLink";
import CatalogEntryHeader from "@/shared/components/CatalogEntryHeader";
import CatalogPrevNext from "@/shared/components/CatalogPrevNext";
import CatalogPrevNextStrip from "@/shared/components/CatalogPrevNextStrip";
import CatalogSection from "@/shared/components/CatalogSection";
import LensSwitcher from "@/shared/components/LensSwitcher";
import type { CatalogEntry, Lens } from "@/shared/lib/CatalogEntry";
import type { CatalogNeighbors } from "@/shared/lib/CatalogNeighbors";

interface CatalogDetailProps {
  entry: CatalogEntry;
  number: number;
  lens: Lens;
  backLinkHref: string;
  backLinkLabel: string;
  beforeLabel: string;
  afterLabel: string;
  neighbors: CatalogNeighbors;
}

export default function CatalogDetail({
  entry,
  number,
  lens,
  backLinkHref,
  backLinkLabel,
  beforeLabel,
  afterLabel,
  neighbors,
}: CatalogDetailProps) {
  const forces = entry.forcesFor(lens);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <CatalogBackLink href={backLinkHref} label={backLinkLabel} />
        <CatalogEntryHeader name={entry.name} number={number} relatedNames={entry.nemeses} />
        <CatalogPrevNextStrip neighbors={neighbors} />
        <LensSwitcher entry={entry} currentView={lens} />
        <Divider />
        {entry.safetyNet && <CatalogSection label="Safety net" body={entry.safetyNet.toString()} />}
        <CatalogSection label="Symptom" body={forces.symptom} />
        <CatalogSection label="Goal" body={forces.goal} />
        <BeforeAfterCodeBlocks
          beforeLabel={beforeLabel}
          afterLabel={afterLabel}
          beforeCode={entry.before}
          afterCode={entry.after}
        />
        <CatalogSection label="Pressure" body={forces.pressure} />
        <CatalogSection label="Tradeoff" body={forces.tradeoff} />
        <CatalogSection label="Relief" body={forces.relief} />
        <CatalogSection label="Trap" body={forces.trap} />
        <Divider />
        <CatalogPrevNext prev={neighbors.prev} next={neighbors.next} />
      </Stack>
    </Container>
  );
}
