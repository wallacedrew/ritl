import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import SnippetPreviewButton from "@/shared/components/SnippetPreviewButton";

export default function AgentsMdSnippetSection() {
  return (
    <Stack spacing={1.5}>
      <Typography component="h2" variant="h6" sx={{ fontWeight: 600 }}>
        AGENTS.md drop-in
      </Typography>
      <Typography variant="body2" color="text.secondary">
        ~30-line directive snippet for non-Claude-Code agents (Codex, Aider, Cursor, etc.). Drop
        into your AGENTS.md or CLAUDE.md so any coding agent runs the six-step discipline above.
        References the catalog at refactoringintheloop.com for the lookup data; for richer coverage
        install the Claude Code plugin instead.
      </Typography>
      <SnippetPreviewButton
        href="/snippets/refactoring-discipline.md"
        label="refactoring-discipline.md"
        hint="Directive rules, not catalog data"
      />
    </Stack>
  );
}
