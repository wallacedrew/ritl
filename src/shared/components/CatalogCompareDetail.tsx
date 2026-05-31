import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";

import BeforeAfterCodeBlocks from "@/shared/components/BeforeAfterCodeBlocks";
import CatalogBreadcrumb from "@/shared/components/CatalogBreadcrumb";
import CatalogEntryHeader from "@/shared/components/CatalogEntryHeader";
import CatalogExampleSource from "@/shared/components/CatalogExampleSource";
import CatalogSectionCompare from "@/shared/components/CatalogSectionCompare";
import LensSwitcher from "@/shared/components/LensSwitcher";
import SnippetPreviewButton from "@/shared/components/SnippetPreviewButton";
import type { CatalogCompareDetailViewModel } from "@/shared/lib/CatalogDetailViewModel";

interface CatalogCompareDetailProps {
  viewModel: CatalogCompareDetailViewModel;
}

export default function CatalogCompareDetail({ viewModel }: CatalogCompareDetailProps) {
  const { humanForces, agentForces } = viewModel;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={4}>
        <CatalogBreadcrumb
          parentHref={viewModel.backLinkHref}
          parentLabel={viewModel.backLinkLabel}
          currentLabel={viewModel.header.title}
        />
        <CatalogEntryHeader header={viewModel.header} />
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
            humanHref={viewModel.humanHref}
            compareHref={viewModel.compareHref}
            agentHref={viewModel.agentHref}
            currentView="compare"
          />
          <SnippetPreviewButton href={viewModel.snippetHref} label="Preview markdown" />
        </Stack>
        <CatalogSectionCompare
          label="Symptom"
          human={humanForces.symptom}
          agent={agentForces.symptom}
        />
        <CatalogSectionCompare label="Goal" human={humanForces.goal} agent={agentForces.goal} />
        <BeforeAfterCodeBlocks
          beforeLabel={viewModel.beforeLabel}
          afterLabel={viewModel.afterLabel}
          beforeCode={viewModel.beforeCode}
          afterCode={viewModel.afterCode}
        />
        {viewModel.exampleSource && <CatalogExampleSource note={viewModel.exampleSource} />}
        <CatalogSectionCompare
          label="Pressure"
          human={humanForces.pressure}
          agent={agentForces.pressure}
        />
        <CatalogSectionCompare
          label="Tradeoff"
          human={humanForces.tradeoff}
          agent={agentForces.tradeoff}
        />
        <CatalogSectionCompare
          label="Relief"
          human={humanForces.relief}
          agent={agentForces.relief}
        />
        <CatalogSectionCompare label="Trap" human={humanForces.trap} agent={agentForces.trap} />
      </Stack>
    </Container>
  );
}
