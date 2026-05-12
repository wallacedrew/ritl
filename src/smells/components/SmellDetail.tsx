import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";

import BeforeAfterCodeBlocks from "@/shared/components/BeforeAfterCodeBlocks";
import CatalogBackLink from "@/shared/components/CatalogBackLink";
import CatalogEntryHeader from "@/shared/components/CatalogEntryHeader";
import CatalogPrevNext from "@/shared/components/CatalogPrevNext";
import CatalogSection from "@/shared/components/CatalogSection";

import { getSmellNeighbors } from "../lib/getSmellNeighbors";
import type { Smell } from "../lib/Smell";

interface SmellDetailProps {
  smell: Smell;
  number: number;
}

export default function SmellDetail({ smell, number }: SmellDetailProps) {
  const neighbors = getSmellNeighbors(number);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <CatalogBackLink href="/smells" label="Smells" />
        <CatalogEntryHeader name={smell.name} number={number} relatedNames={smell.refactorings} />
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
        <Divider />
        <CatalogPrevNext prev={neighbors.prev} next={neighbors.next} />
      </Stack>
    </Container>
  );
}
