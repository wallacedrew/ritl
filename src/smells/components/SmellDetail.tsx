import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import BeforeAfterCodeBlocks from "@/shared/components/BeforeAfterCodeBlocks";
import CatalogNumber from "@/shared/components/CatalogNumber";
import LinkedChip from "@/shared/components/LinkedChip";
import SnippetPreviewButton from "@/shared/components/SnippetPreviewButton";
import { Slug } from "@/shared/lib/Slug";

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
        <Stack spacing={1.5}>
          <Stack direction="row" spacing={2} sx={{ alignItems: "baseline" }}>
            <CatalogNumber value={number} size="large" />
            <Typography component="h1" variant="h4" sx={{ fontWeight: 600 }}>
              {smell.name}
            </Typography>
          </Stack>
          <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1 }}>
            {smell.refactorings.map((refactoringName) => (
              <LinkedChip
                key={refactoringName}
                label={refactoringName}
                href={Slug.from(refactoringName).toCatalogHref("refactorings")}
              />
            ))}
          </Stack>
          <SnippetPreviewButton
            href={Slug.from(smell.name).toSnippetHref("smells")}
            label="Preview SKILL.md"
          />
        </Stack>
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
