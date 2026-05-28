import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";

import BeforeAfterCodeBlocks from "@/shared/components/BeforeAfterCodeBlocks";
import CatalogBreadcrumb from "@/shared/components/CatalogBreadcrumb";
import CatalogEntryHeader from "@/shared/components/CatalogEntryHeader";
import CatalogExampleSource from "@/shared/components/CatalogExampleSource";
import CatalogSection from "@/shared/components/CatalogSection";
import CatalogSectionCompare from "@/shared/components/CatalogSectionCompare";
import LensSwitcher from "@/shared/components/LensSwitcher";
import SnippetPreviewButton from "@/shared/components/SnippetPreviewButton";
import type { CatalogEntry } from "@/shared/lib/CatalogEntry";
import type { CatalogNeighbors } from "@/shared/lib/CatalogNeighbors";

interface CatalogCompareDetailProps {
  entry: CatalogEntry;
  number: number;
  backLinkHref: string;
  backLinkLabel: string;
  beforeLabel: string;
  afterLabel: string;
  neighbors: CatalogNeighbors;
}

export default function CatalogCompareDetail({
  entry,
  number,
  backLinkHref,
  backLinkLabel,
  beforeLabel,
  afterLabel,
  neighbors,
}: CatalogCompareDetailProps) {
  const human = entry.forcesFor("human");
  const agent = entry.forcesFor("agent");

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={4}>
        <CatalogBreadcrumb
          parentHref={backLinkHref}
          parentLabel={backLinkLabel}
          currentLabel={entry.name.toString()}
        />
        <CatalogEntryHeader
          name={entry.name}
          number={number}
          relatedNames={entry.nemeses}
          neighbors={neighbors}
        />
        <SnippetPreviewButton href={entry.name.toSnippetHref()} label="Preview markdown" />
        <LensSwitcher
          humanHref={entry.href()}
          compareHref={entry.compareHref()}
          agentHref={entry.agentHref()}
          currentView="compare"
        />
        <Divider />
        {entry.safetyNet && <CatalogSection label="Safety net" body={entry.safetyNet.toString()} />}
        <CatalogSectionCompare label="Symptom" human={human.symptom} agent={agent.symptom} />
        <CatalogSectionCompare label="Goal" human={human.goal} agent={agent.goal} />
        <BeforeAfterCodeBlocks
          beforeLabel={beforeLabel}
          afterLabel={afterLabel}
          beforeCode={entry.before}
          afterCode={entry.after}
        />
        {entry.exampleSource && <CatalogExampleSource note={entry.exampleSource} />}
        <CatalogSectionCompare label="Pressure" human={human.pressure} agent={agent.pressure} />
        <CatalogSectionCompare label="Tradeoff" human={human.tradeoff} agent={agent.tradeoff} />
        <CatalogSectionCompare label="Relief" human={human.relief} agent={agent.relief} />
        <CatalogSectionCompare label="Trap" human={human.trap} agent={agent.trap} />
      </Stack>
    </Container>
  );
}
