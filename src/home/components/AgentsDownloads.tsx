import FileDownloadIcon from "@mui/icons-material/FileDownload";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

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
          Download the catalog as directive-voiced markdown ready to paste into your coding-agent
          guidance file.
        </Typography>
      </Stack>
      <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1 }}>
        {SNIPPETS.map((snippet) => (
          <Button
            key={snippet.href}
            component="a"
            href={snippet.href}
            download
            startIcon={<FileDownloadIcon />}
            variant="outlined"
            size="small"
          >
            {snippet.label}
            <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 1 }}>
              · {snippet.hint}
            </Typography>
          </Button>
        ))}
      </Stack>
    </Stack>
  );
}
