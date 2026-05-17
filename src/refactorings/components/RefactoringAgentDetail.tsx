import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import NextLink from "next/link";

import BeforeAfterCodeBlocks from "@/shared/components/BeforeAfterCodeBlocks";

import { AGENT_LABELS } from "../lib/agentLensLabels";
import { agentTriggerDescription } from "../lib/agentTriggerDescription";
import type { Refactoring } from "../lib/Refactoring";
import AgentLine from "./AgentLine";

interface RefactoringAgentDetailProps {
  refactoring: Refactoring;
  number: number;
}

export default function RefactoringAgentDetail({
  refactoring,
  number,
}: RefactoringAgentDetailProps) {
  const numString = String(number).padStart(2, "0");
  const trigger = agentTriggerDescription(refactoring);
  const removesSmells = refactoring.solves.map((solved) => solved.toString()).join(", ");

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={2}>
        <Typography variant="body2">
          <NextLink href={refactoring.name.toCatalogHref()}>← View as human</NextLink>
        </Typography>
        <Typography component="h1" variant="h4" sx={{ fontWeight: 600 }}>
          Apply: {numString} — {refactoring.name.toString()}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
          {trigger}
        </Typography>
        {refactoring.safetyNet && (
          <AgentLine label={AGENT_LABELS.safetyNet} body={refactoring.safetyNet.toString()} />
        )}
        <AgentLine label={AGENT_LABELS.goal} body={refactoring.goal} />
        <AgentLine label={AGENT_LABELS.savings} body={refactoring.savings} />
        <AgentLine label={AGENT_LABELS.tradeoff} body={refactoring.tradeoff} />
        {refactoring.failureMode && (
          <AgentLine label={AGENT_LABELS.failureMode} body={refactoring.failureMode} />
        )}
        <BeforeAfterCodeBlocks
          beforeLabel={AGENT_LABELS.beforeCode}
          afterLabel={AGENT_LABELS.afterCode}
          beforeCode={refactoring.before}
          afterCode={refactoring.after}
        />
        <AgentLine label={AGENT_LABELS.solves} body={removesSmells} />
      </Stack>
    </Container>
  );
}
