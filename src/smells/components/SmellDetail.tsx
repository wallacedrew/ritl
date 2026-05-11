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

import type { Smell } from "../lib/Smell";
import SmellSection from "./SmellSection";

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
                href={`/refactorings/${slugify(refactoringName)}`}
              />
            ))}
          </Stack>
          <Button
            component="a"
            href={`/snippets/smells/${slugify(smell.name)}.md`}
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
        <SmellSection label="Symptom" body={smell.symptom} />
        <SmellSection label="Goal" body={smell.goal} />
        <Stack spacing={2}>
          <Typography variant="overline" color="text.secondary">
            Smellier version
          </Typography>
          <CodeBlock code={smell.before} />
          <Typography variant="overline" color="text.secondary">
            Fresher version
          </Typography>
          <CodeBlock code={smell.after} />
        </Stack>
        <SmellSection label="Savings" body={smell.savings} />
        <SmellSection label="Note" body={smell.risk} />
      </Stack>
    </Container>
  );
}
