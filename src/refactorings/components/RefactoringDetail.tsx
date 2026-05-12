import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import BeforeAfterCodeBlocks from "@/shared/components/BeforeAfterCodeBlocks";
import CatalogNumber from "@/shared/components/CatalogNumber";
import LinkedChip from "@/shared/components/LinkedChip";
import SnippetPreviewButton from "@/shared/components/SnippetPreviewButton";
import { Slug } from "@/shared/lib/Slug";

import type { Refactoring } from "../lib/Refactoring";
import RefactoringSection from "./RefactoringSection";

interface RefactoringDetailProps {
  refactoring: Refactoring;
  number: number;
}

export default function RefactoringDetail({ refactoring, number }: RefactoringDetailProps) {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Stack spacing={1.5}>
          <Stack direction="row" spacing={2} sx={{ alignItems: "baseline" }}>
            <CatalogNumber value={number} size="large" />
            <Typography component="h1" variant="h4" sx={{ fontWeight: 600 }}>
              {refactoring.name}
            </Typography>
          </Stack>
          <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1 }}>
            {refactoring.solves.map((smellName) => (
              <LinkedChip
                key={smellName}
                label={smellName}
                href={Slug.from(smellName).toCatalogHref("smells")}
              />
            ))}
          </Stack>
          <SnippetPreviewButton
            href={Slug.from(refactoring.name).toSnippetHref("refactorings")}
            label="Preview SKILL.md"
          />
        </Stack>
        <Divider />
        <RefactoringSection label="Goal" body={refactoring.goal} />
        <BeforeAfterCodeBlocks
          beforeLabel="Before the refactoring"
          afterLabel="After the refactoring"
          beforeCode={refactoring.before}
          afterCode={refactoring.after}
        />
        <RefactoringSection label="Savings" body={refactoring.savings} />
        <RefactoringSection label="Note" body={refactoring.risk} />
      </Stack>
    </Container>
  );
}
