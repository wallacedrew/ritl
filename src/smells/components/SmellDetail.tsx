import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";

import BeforeAfterCodeBlocks from "@/shared/components/BeforeAfterCodeBlocks";
import CatalogEntryHeader from "@/shared/components/CatalogEntryHeader";
import CatalogSection from "@/shared/components/CatalogSection";

import type { Smell } from "../lib/Smell";

interface SmellDetailProps {
  smell: Smell;
  number: number;
}

export default function SmellDetail({ smell, number }: SmellDetailProps) {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <CatalogEntryHeader
          name={smell.name}
          number={number}
          relatedNames={smell.refactorings}
          relatedKind="refactorings"
          snippetKind="smells"
        />
        <Divider />
        <CatalogSection label="Symptom" body={smell.symptom} />
        <CatalogSection label="Goal" body={smell.goal} />
        <BeforeAfterCodeBlocks
          beforeLabel="Smellier version"
          afterLabel="Fresher version"
          beforeCode={smell.before}
          afterCode={smell.after}
        />
        <CatalogSection label="Savings" body={smell.savings} />
        <CatalogSection label="Note" body={smell.risk} />
      </Stack>
    </Container>
  );
}
