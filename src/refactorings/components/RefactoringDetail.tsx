import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import NextLink from "next/link";

import BeforeAfterCodeBlocks from "@/shared/components/BeforeAfterCodeBlocks";
import CatalogBackLink from "@/shared/components/CatalogBackLink";
import CatalogEntryHeader from "@/shared/components/CatalogEntryHeader";
import CatalogPrevNext from "@/shared/components/CatalogPrevNext";
import CatalogSection from "@/shared/components/CatalogSection";

import { getRefactoringNeighbors } from "../lib/getRefactoringNeighbors";
import type { Refactoring } from "../lib/Refactoring";

interface RefactoringDetailProps {
  refactoring: Refactoring;
  number: number;
}

export default function RefactoringDetail({ refactoring, number }: RefactoringDetailProps) {
  const neighbors = getRefactoringNeighbors(number);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <CatalogBackLink href="/" label="Refactorings" />
        <CatalogEntryHeader
          name={refactoring.name}
          number={number}
          relatedNames={refactoring.solves}
        />
        <Typography variant="body2">
          <NextLink href={`${refactoring.name.toCatalogHref()}/agent`}>View as agent →</NextLink>
        </Typography>
        <Divider />
        {refactoring.safetyNet && (
          <CatalogSection label="Safety net" body={refactoring.safetyNet.toString()} />
        )}
        <CatalogSection label="Goal" body={refactoring.goal} />
        <BeforeAfterCodeBlocks
          beforeLabel="Before the refactoring"
          afterLabel="After the refactoring"
          beforeCode={refactoring.before}
          afterCode={refactoring.after}
        />
        <CatalogSection label="Savings" body={refactoring.savings} />
        <CatalogSection label="Tradeoff" body={refactoring.tradeoff} />
        {refactoring.failureMode && (
          <CatalogSection label="Failure mode" body={refactoring.failureMode} />
        )}
        <Divider />
        <CatalogPrevNext prev={neighbors.prev} next={neighbors.next} />
      </Stack>
    </Container>
  );
}
