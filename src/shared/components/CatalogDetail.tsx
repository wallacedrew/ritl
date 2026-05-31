import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";

import CatalogBreadcrumb from "@/shared/components/CatalogBreadcrumb";
import CatalogDetailBody from "@/shared/components/CatalogDetailBody";
import CatalogEntryHeader from "@/shared/components/CatalogEntryHeader";
import LensSwitcher from "@/shared/components/LensSwitcher";
import SnippetPreviewButton from "@/shared/components/SnippetPreviewButton";
import type { Lens } from "@/shared/lib/CatalogEntry";
import type { CatalogDetailViewModel } from "@/shared/lib/CatalogDetailViewModel";

interface CatalogDetailProps {
  viewModel: CatalogDetailViewModel;
  lens: Lens;
}

export default function CatalogDetail({ viewModel, lens }: CatalogDetailProps) {
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
            currentView={lens}
          />
          <SnippetPreviewButton href={viewModel.snippetHref} label="Preview markdown" />
        </Stack>
        <CatalogDetailBody
          forces={viewModel.forces}
          beforeLabel={viewModel.beforeLabel}
          afterLabel={viewModel.afterLabel}
          beforeCode={viewModel.beforeCode}
          afterCode={viewModel.afterCode}
          exampleSource={viewModel.exampleSource}
        />
      </Stack>
    </Container>
  );
}
