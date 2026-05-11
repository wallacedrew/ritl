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
        </Stack>
        <Divider />
        <SmellSection label="Symptom" body={smell.symptom} />
        <SmellSection label="Risk" body={smell.risk} />
        <SmellSection label="Goal" body={smell.goal} />
        <SmellSection label="Savings" body={smell.savings} />
        <Stack spacing={2}>
          <Typography variant="overline" color="text.secondary">
            Before
          </Typography>
          <CodeBlock code={smell.before} />
          <Typography variant="overline" color="text.secondary">
            After
          </Typography>
          <CodeBlock code={smell.after} />
        </Stack>
      </Stack>
    </Container>
  );
}
