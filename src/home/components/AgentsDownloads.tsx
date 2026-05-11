import Stack from "@mui/material/Stack";

import SnippetPreviewButton from "@/shared/components/SnippetPreviewButton";

interface SnippetDownload {
  href: string;
  label: string;
  hint: string;
}

const SNIPPETS: readonly SnippetDownload[] = [
  {
    href: "/snippets/refactoring-catalog.md",
    label: "refactoring-catalog.md",
    hint: "90 SKILL.md sections in one paste",
  },
];

export default function AgentsDownloads() {
  return (
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
  );
}
