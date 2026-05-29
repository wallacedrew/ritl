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
        into your AGENTS.md or CLAUDE.md so any coding agent gets the same six-step discipline
        — sense the smell, identify the source, lay down a safety net, apply one named
        refactoring, stay green, and recognize when a stack of refactorings climbs toward a
        Kerievsky composite or GoF pattern destination. The discipline references the catalog
        at refactoringintheloop.com/reference for the lookup data; for richest coverage install
        the full Claude Code plugin above.
      </Typography>
      <SnippetPreviewButton
        href="/snippets/refactoring-discipline.md"
        label="refactoring-discipline.md"
        hint="Directive rules, not catalog data"
      />
    </Stack>
  );
}
