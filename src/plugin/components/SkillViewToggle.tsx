"use client";

import CodeIcon from "@mui/icons-material/Code";
import SubjectIcon from "@mui/icons-material/Subject";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { useState, type ReactNode } from "react";

type SkillView = "rendered" | "raw";

interface SkillViewToggleProps {
  rendered: ReactNode;
  raw: ReactNode;
}

export default function SkillViewToggle({ rendered, raw }: SkillViewToggleProps) {
  const [view, setView] = useState<SkillView>("rendered");

  function handleViewChange(_event: React.MouseEvent<HTMLElement>, next: SkillView | null) {
    if (next !== null) {
      setView(next);
    }
  }

  return (
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
        {view === "rendered" ? rendered : raw}
      </Stack>
    </Box>
  );
}
