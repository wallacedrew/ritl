"use client";

import CodeIcon from "@mui/icons-material/Code";
import SubjectIcon from "@mui/icons-material/Subject";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import { useState } from "react";

import CatalogDetailBody from "@/shared/components/CatalogDetailBody";
import CodeBlock from "@/shared/components/CodeBlock";
import type { CatalogEntry } from "@/shared/lib/CatalogEntry";

type SkillView = "rendered" | "raw";

interface EmbeddedSkillPreviewProps {
  entry: CatalogEntry;
  description: string;
  rawMarkdown: string;
}

export default function EmbeddedSkillPreview({
  entry,
  description,
  rawMarkdown,
}: EmbeddedSkillPreviewProps) {
  const [view, setView] = useState<SkillView>("rendered");
  const skillName = entry.name.toString();
  const previewHeading = `What a skill looks like: ${skillName}`;

  function handleViewChange(_event: React.MouseEvent<HTMLElement>, next: SkillView | null) {
    if (next !== null) {
      setView(next);
    }
  }

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
          <Stack direction="row" sx={{ justifyContent: "flex-end" }}>
            <ToggleButtonGroup
              value={view}
              exclusive
              onChange={handleViewChange}
              size="small"
              aria-label="SKILL.md view"
            >
              <ToggleButton value="rendered" aria-label="Rendered view">
                <SubjectIcon fontSize="small" />
              </ToggleButton>
              <ToggleButton value="raw" aria-label="Raw markdown">
                <CodeIcon fontSize="small" />
              </ToggleButton>
            </ToggleButtonGroup>
          </Stack>
          {view === "rendered" ? (
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
          ) : (
            <CodeBlock
              code={rawMarkdown}
              language="markdown"
              label="extract-function.md"
            />
          )}
        </Stack>
      </Box>
    </Stack>
  );
}
