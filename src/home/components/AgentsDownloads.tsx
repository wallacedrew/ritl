import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import SnippetPreviewButton from "@/shared/components/SnippetPreviewButton";

interface SnippetDownload {
  href: string;
  label: string;
  hint: string;
}

const SNIPPETS: readonly SnippetDownload[] = [
  {
    href: "/snippets/refactorings.md",
    label: "refactorings.md",
    hint: "66 patterns to apply",
  },
  {
    href: "/snippets/smells.md",
    label: "smells.md",
    hint: "24 patterns to refuse",
  },
  {
    href: "/snippets/combined.md",
    label: "combined.md",
    hint: "single-paste digest",
  },
];

export default function AgentsDownloads() {
  return (
    <Stack spacing={1.5}>
      <Stack spacing={0.5}>
        <Typography variant="overline" color="text.secondary">
          For AGENTS.md
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Preview the catalog as directive-voiced markdown — copy or download to paste into your
          coding-agent guidance file.
        </Typography>
      </Stack>
      <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1 }}>
        {SNIPPETS.map((snippet) => (
          <SnippetPreviewButton
            key={snippet.href}
            href={snippet.href}
            label={snippet.label}
            hint={snippet.hint}
          />
        ))}
      </Stack>
    </Stack>
  );
}
