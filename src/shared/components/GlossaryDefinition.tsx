import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { GlossaryEntry, GlossaryTermKey } from "@/shared/lib/glossary";

interface Props {
  term: GlossaryTermKey;
  entry: GlossaryEntry;
}

export default function GlossaryDefinition({ term, entry }: Props) {
  return (
    <Stack spacing={1} sx={{ p: 2, maxWidth: 360 }}>
      <Typography component="h3" variant="subtitle2" sx={{ fontWeight: 700, m: 0 }}>
        {term}
      </Typography>
      <Typography variant="body2">{entry.definition}</Typography>
      {entry.citation && (
        <Typography variant="caption" color="text.secondary">
          {entry.citation.url ? (
            <Link
              href={entry.citation.url}
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
            >
              {entry.citation.text}
            </Link>
          ) : (
            entry.citation.text
          )}
        </Typography>
      )}
    </Stack>
  );
}
