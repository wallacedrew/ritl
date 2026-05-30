import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import SnippetPreviewButton from "@/shared/components/SnippetPreviewButton";

export default function AgentsMdSnippetSection() {
  return (
    <Stack spacing={1.5}>
      <Typography component="h2" variant="h6" sx={{ fontWeight: 600 }}>
        If you don&apos;t have Claude Code: paste this AGENTS.md drop-in instead
      </Typography>
      <Typography variant="body2" color="text.secondary">
        For Codex, Aider, Cursor, and other agents that read AGENTS.md or CLAUDE.md. A ~30-line
        directive that runs the six-step discipline above. References the catalog at
        refactoringintheloop.com for the lookup data. Skip this whole section if you installed the
        Claude Code plugin — the two artifacts do the same job.
      </Typography>
      <SnippetPreviewButton
        href="/snippets/refactoring-discipline.md"
        label="refactoring-discipline.md"
        hint="Directive rules, not catalog data"
      />
    </Stack>
  );
}
