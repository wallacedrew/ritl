import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { visuallyHidden } from "@mui/utils";

import type { ReferenceCatalogCounts } from "@/reference/lib/getReferenceSections";

interface Props {
  counts: ReferenceCatalogCounts;
}

export default function ReferencePageHeader({ counts }: Props) {
  return (
    <Stack spacing={1}>
      <Typography component="h1" sx={visuallyHidden}>
        Reference
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Every refactoring, smell, and pattern in the catalog, grouped by its source book.{" "}
        {counts.refactorings} refactorings · {counts.smells} smells · {counts.kerievskyRefactorings}{" "}
        Kerievsky refactorings · {counts.gofPatterns} GoF design patterns.
      </Typography>
    </Stack>
  );
}
