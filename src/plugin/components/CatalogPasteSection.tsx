import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import SnippetPreviewButton from "@/shared/components/SnippetPreviewButton";

export default function CatalogPasteSection() {
  return (
    <Stack spacing={1.5}>
      <Typography component="h2" variant="h6" sx={{ fontWeight: 600 }}>
        Full skills bundle
      </Typography>
      <Typography variant="body2" color="text.secondary">
        All 141 SKILL.md sections concatenated — 1 workflow orchestrator, 66 Fowler refactorings,
        24 Fowler smells, 27 Kerievsky composites, 23 GoF patterns. A last-resort fallback for
        non-Claude-Code agents that can&apos;t load AGENTS.md or fetch per-skill URLs. Paste
        sections relevant to the smell, refactoring, or pattern you&apos;re working on, not the
        whole file; pasting all 141 into one context burns tokens and dilutes attention. Prefer
        the AGENTS.md drop-in above whenever your agent supports it.
      </Typography>
      <SnippetPreviewButton
        href="/snippets/ritl-skills-bundle.md"
        label="ritl-skills-bundle.md"
        hint="141 SKILL.md sections"
      />
    </Stack>
  );
}
