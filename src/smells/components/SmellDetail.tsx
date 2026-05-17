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

import { getSmellNeighbors } from "../lib/getSmellNeighbors";

interface SmellDetailProps {
  smell: CatalogEntry;
  number: number;
  lens: Lens;
}

export default function SmellDetail({ smell, number, lens }: SmellDetailProps) {
  const neighbors = getSmellNeighbors(number);
  const forces = smell.forcesFor(lens);
  const crossLensHref = lens === "human" ? smell.agentHref() : smell.href();
  const crossLensLabel = lens === "human" ? "View as agent →" : "← View as human";

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <CatalogBackLink href="/smells" label="Smells" />
        <CatalogEntryHeader name={smell.name} number={number} relatedNames={smell.nemeses} />
        <Typography variant="body2">
          <NextLink href={crossLensHref}>{crossLensLabel}</NextLink>
        </Typography>
        <Divider />
        <CatalogSection label="Symptom" body={forces.symptom} />
        <CatalogSection label="Goal" body={forces.goal} />
        <BeforeAfterCodeBlocks
          beforeLabel="Smellier version"
          afterLabel="Fresher version"
          beforeCode={smell.before}
          afterCode={smell.after}
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
