import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";

import BeforeAfterCodeBlocks from "@/shared/components/BeforeAfterCodeBlocks";
import CatalogBreadcrumb from "@/shared/components/CatalogBreadcrumb";
import CatalogEntryHeader from "@/shared/components/CatalogEntryHeader";
import CatalogExampleSource from "@/shared/components/CatalogExampleSource";
import CatalogPrevNext from "@/shared/components/CatalogPrevNext";
import CatalogPrevNextStrip from "@/shared/components/CatalogPrevNextStrip";
import CatalogSection from "@/shared/components/CatalogSection";
import LensSwitcher from "@/shared/components/LensSwitcher";
import SnippetPreviewButton from "@/shared/components/SnippetPreviewButton";
import type { CatalogEntry, Lens } from "@/shared/lib/CatalogEntry";
import type { CatalogNeighbors } from "@/shared/lib/CatalogNeighbors";

import type { CatalogEntryName } from "@/shared/lib/CatalogEntryName";

interface CatalogDetailProps {
  entry: CatalogEntry;
  number: number;
  lens: Lens;
  backLinkHref: string;
  backLinkLabel: string;
  beforeLabel: string;
  afterLabel: string;
  neighbors: CatalogNeighbors;
  incomingSources?: readonly CatalogEntryName[];
  inboundPatterns?: readonly CatalogEntryName[];
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
  incomingSources,
  inboundPatterns,
}: CatalogDetailProps) {
  const forces = entry.forcesFor(lens);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <CatalogBreadcrumb
          parentHref={backLinkHref}
          parentLabel={backLinkLabel}
          currentLabel={entry.name.toString()}
        />
        <CatalogEntryHeader
          name={entry.name}
          number={number}
          relatedNames={entry.nemeses}
          destinationPattern={entry.destinationPattern}
          incomingSources={incomingSources}
          inboundPatterns={inboundPatterns}
        />
        <CatalogPrevNextStrip neighbors={neighbors} />
        <LensSwitcher
          humanHref={entry.href()}
          compareHref={entry.compareHref()}
          agentHref={entry.agentHref()}
          currentView={lens}
        />
        <SnippetPreviewButton href={entry.name.toSnippetHref()} label="Preview markdown" />
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
        {entry.exampleSource && <CatalogExampleSource note={entry.exampleSource} />}
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
