import Stack from "@mui/material/Stack";

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
    href: "/snippets/refactoring_catalog.md",
    label: "refactoring_catalog.md",
    hint: "single-paste digest",
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
