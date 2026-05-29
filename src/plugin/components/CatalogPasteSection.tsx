import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import SnippetPreviewButton from "@/shared/components/SnippetPreviewButton";

export default function CatalogPasteSection() {
  return (
    <Stack spacing={1.5}>
      <Typography component="h2" variant="h6" sx={{ fontWeight: 600 }}>
        Skills index
      </Typography>
      <Typography variant="body2" color="text.secondary">
        All 141 skills listed by slug, routing description, and per-skill URL — 1 workflow
        orchestrator, 66 Fowler refactorings, 24 Fowler smells, 27 Kerievsky composites, 23 GoF
        patterns. For agents that can fetch URLs (Cursor, Aider, Codex, Cline, Continue, custom
        agents): drop this index in, read it once, fetch only the SKILL.md files whose
        description matches what you&apos;re working on. Do not concatenate every linked file
        into one context — that is exactly the anti-pattern this catalog teaches against. If
        your agent can&apos;t fetch URLs at all, prefer the AGENTS.md drop-in above.
      </Typography>
      <SnippetPreviewButton
        href="/snippets/ritl-skills-index.md"
        label="ritl-skills-index.md"
        hint="141 skill entries with URLs"
      />
    </Stack>
  );
}
