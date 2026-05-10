import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import CodeBlock from "@/shared/components/CodeBlock";

import type { Smell } from "../lib/Smell";
import SmellSection from "./SmellSection";

interface SmellDetailProps {
  smell: Smell;
}

export default function SmellDetail({ smell }: SmellDetailProps) {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Stack spacing={1.5}>
          <Typography component="h1" variant="h3" sx={{ fontWeight: 600 }}>
            {smell.name}
          </Typography>
          <Chip label={smell.refactoring} color="primary" sx={{ alignSelf: "flex-start" }} />
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
