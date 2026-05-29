import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import BeforeAfterCodeBlocks from "@/shared/components/BeforeAfterCodeBlocks";
import CatalogBreadcrumb from "@/shared/components/CatalogBreadcrumb";
import CatalogEntryHeader from "@/shared/components/CatalogEntryHeader";
import CatalogExampleSource from "@/shared/components/CatalogExampleSource";
import CatalogSection from "@/shared/components/CatalogSection";
import CatalogSectionCompare from "@/shared/components/CatalogSectionCompare";
import LensSwitcher from "@/shared/components/LensSwitcher";
import SnippetPreviewButton from "@/shared/components/SnippetPreviewButton";
import type { CatalogEntry } from "@/shared/lib/CatalogEntry";
import type { CatalogEntryName } from "@/shared/lib/CatalogEntryName";
import type { CatalogNeighbors } from "@/shared/lib/CatalogNeighbors";

interface CatalogCompareDetailProps {
  entry: CatalogEntry;
  number: number;
  backLinkHref: string;
  backLinkLabel: string;
  beforeLabel: string;
  afterLabel: string;
  neighbors: CatalogNeighbors;
  incomingSources?: readonly CatalogEntryName[];
  inboundPatterns?: readonly CatalogEntryName[];
}

export default function CatalogCompareDetail({
  entry,
  number,
  backLinkHref,
  backLinkLabel,
  beforeLabel,
  afterLabel,
  neighbors,
  incomingSources,
  inboundPatterns,
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
          destinationPattern={entry.destinationPattern}
          incomingSources={incomingSources}
          inboundPatterns={inboundPatterns}
          neighbors={neighbors}
        />
        <Stack
          direction="row"
          sx={{
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 1.5,
          }}
        >
          <LensSwitcher
            humanHref={entry.href()}
            compareHref={entry.compareHref()}
            agentHref={entry.agentHref()}
            currentView="compare"
          />
          <SnippetPreviewButton href={entry.name.toSnippetHref()} label="Preview markdown" />
        </Stack>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ fontStyle: "italic", lineHeight: 1.55 }}
        >
          {entry.compareDifferential ??
            "Humans pay in attention; agents pay in tokens — same target, different failure modes."}
        </Typography>
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
