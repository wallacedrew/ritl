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
import type { CatalogEntry, Lens } from "@/shared/lib/CatalogEntry";

import { getRefactoringNeighbors } from "../lib/getRefactoringNeighbors";

interface RefactoringDetailProps {
  refactoring: CatalogEntry;
  number: number;
  lens: Lens;
}

export default function RefactoringDetail({ refactoring, number, lens }: RefactoringDetailProps) {
  const neighbors = getRefactoringNeighbors(number);
  const forces = refactoring.forcesFor(lens);
  const crossLensHref = lens === "human" ? refactoring.agentHref() : refactoring.href();
  const crossLensLabel = lens === "human" ? "View as agent →" : "← View as human";

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <CatalogBackLink href="/" label="Refactorings" />
        <CatalogEntryHeader
          name={refactoring.name}
          number={number}
          relatedNames={refactoring.nemeses}
        />
        <Typography variant="body2">
          <NextLink href={crossLensHref}>{crossLensLabel}</NextLink>
        </Typography>
        <Divider />
        {refactoring.safetyNet && (
          <CatalogSection label="Safety net" body={refactoring.safetyNet.toString()} />
        )}
        <CatalogSection label="Symptom" body={forces.symptom} />
        <CatalogSection label="Goal" body={forces.goal} />
        <BeforeAfterCodeBlocks
          beforeLabel="Before the refactoring"
          afterLabel="After the refactoring"
          beforeCode={refactoring.before}
          afterCode={refactoring.after}
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
