import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import CatalogDetailBody from "@/shared/components/CatalogDetailBody";
import type { CatalogEntry } from "@/shared/lib/CatalogEntry";

interface EmbeddedSkillPreviewProps {
  entry: CatalogEntry;
  description: string;
}

export default function EmbeddedSkillPreview({ entry, description }: EmbeddedSkillPreviewProps) {
  const skillName = entry.name.toString();
  const previewHeading = `What a skill looks like: ${skillName}`;

  return (
    <Stack spacing={2}>
      <Stack spacing={0.75}>
        <Typography component="h2" variant="h6" sx={{ fontWeight: 600 }}>
          {previewHeading}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          This is the SKILL.md the plugin auto-loads when its description matches the agent&apos;s
          task. Same content as the {skillName} detail page.
        </Typography>
      </Stack>
      <Box
        sx={{
          border: 1,
          borderColor: "divider",
          borderRadius: 1,
          p: 2,
          bgcolor: "background.paper",
        }}
      >
        <Stack spacing={3}>
          <Stack spacing={0.5}>
            <Typography variant="overline" color="text.secondary">
              SKILL description
            </Typography>
            <Typography variant="body1">{description}</Typography>
          </Stack>
          <CatalogDetailBody
            entry={entry}
            lens="agent"
            beforeLabel="Before the refactoring"
            afterLabel="After the refactoring"
          />
        </Stack>
      </Box>
    </Stack>
  );
}
