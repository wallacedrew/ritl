import FileDownloadIcon from "@mui/icons-material/FileDownload";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import CatalogNumber from "@/shared/components/CatalogNumber";
import CodeBlock from "@/shared/components/CodeBlock";
import LinkedChip from "@/shared/components/LinkedChip";
import { slugify } from "@/shared/lib/slugify";

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
                href={`/smells/${slugify(smellName)}`}
              />
            ))}
          </Stack>
          <Button
            component="a"
            href={`/snippets/refactorings/${slugify(refactoring.name)}.md`}
            download
            startIcon={<FileDownloadIcon />}
            variant="outlined"
            size="small"
            sx={{ alignSelf: "flex-start" }}
          >
            Download snippet for AGENTS.md
          </Button>
        </Stack>
        <Divider />
        <RefactoringSection label="Goal" body={refactoring.goal} />
        <Stack spacing={2}>
          <Typography variant="overline" color="text.secondary">
            Before the refactoring
          </Typography>
          <CodeBlock code={refactoring.before} />
          <Typography variant="overline" color="text.secondary">
            After the refactoring
          </Typography>
          <CodeBlock code={refactoring.after} />
        </Stack>
        <RefactoringSection label="Savings" body={refactoring.savings} />
        <RefactoringSection label="Note" body={refactoring.risk} />
      </Stack>
    </Container>
  );
}
