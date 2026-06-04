import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { renderTermsInProse } from "@/shared/lib/renderTermsInProse";

interface CatalogSectionCompareProps {
  label: string;
  human: string;
  agent: string;
}

export default function CatalogSectionCompare({ label, human, agent }: CatalogSectionCompareProps) {
  return (
    <Stack spacing={0.5}>
      <Typography variant="overline" color="text.secondary">
        {label}
      </Typography>
      <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
        <Stack spacing={0.5} sx={{ flex: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Human
          </Typography>
          <Typography variant="body1">{renderTermsInProse(human)}</Typography>
        </Stack>
        <Stack spacing={0.5} sx={{ flex: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Agent
          </Typography>
          <Typography variant="body1">{renderTermsInProse(agent)}</Typography>
        </Stack>
      </Stack>
    </Stack>
  );
}
