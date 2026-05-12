import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";

import BeforeAfterCodeBlocks from "@/shared/components/BeforeAfterCodeBlocks";
import CatalogBackLink from "@/shared/components/CatalogBackLink";
import CatalogEntryHeader from "@/shared/components/CatalogEntryHeader";
import CatalogSection from "@/shared/components/CatalogSection";

import type { Refactoring } from "../lib/Refactoring";

interface RefactoringDetailProps {
  refactoring: Refactoring;
  number: number;
}

export default function RefactoringDetail({ refactoring, number }: RefactoringDetailProps) {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <CatalogBackLink href="/" label="Refactorings" />
        <CatalogEntryHeader
          name={refactoring.name}
          number={number}
          relatedNames={refactoring.solves}
        />
        <Divider />
        <CatalogSection label="Goal" body={refactoring.goal} />
        <BeforeAfterCodeBlocks
          beforeLabel="Before the refactoring"
          afterLabel="After the refactoring"
          beforeCode={refactoring.before}
          afterCode={refactoring.after}
        />
        <CatalogSection label="Savings" body={refactoring.savings} />
        <CatalogSection label="Note" body={refactoring.risk} />
      </Stack>
    </Container>
  );
}
