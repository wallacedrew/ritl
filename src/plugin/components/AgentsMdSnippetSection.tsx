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
        ~25-line directive snippet for non-Claude-Code agents (Codex, Aider, Cursor, etc.). Drop
        into your AGENTS.md or CLAUDE.md so any coding agent gets the same refactoring discipline
        — sense the smell, identify the source, lay down a safety net, apply one named refactoring,
        stay green. Covers the Fowler loop only; for Kerievsky composite and GoF pattern coverage,
        install the full Claude Code plugin above.
      </Typography>
      <SnippetPreviewButton
        href="/snippets/refactoring-discipline.md"
        label="refactoring-discipline.md"
        hint="Directive rules, not catalog data"
      />
    </Stack>
  );
}
