"use client";

import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import SnippetPreviewButton from "@/shared/components/SnippetPreviewButton";
import { useClipboardCopy } from "@/shared/hooks/useClipboardCopy";
import { MONOSPACE_FONT } from "@/shared/theme/monospace";

const CLI_INSTALL_COMMAND = `/plugin marketplace add wallacedrew/ritl
/plugin install refactor@ritl`;

export default function AgentsDownloads() {
  const { copied, copy } = useClipboardCopy();

  async function handleCopyCommand() {
    await copy(CLI_INSTALL_COMMAND);
  }

  return (
    <Stack spacing={2} sx={{ display: { xs: "none", md: "flex" } }}>
      <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1 }}>
        <SnippetPreviewButton
          href="/snippets/refactoring-discipline.md"
          label="refactoring-discipline.md"
          hint="Refactoring discipline for AGENTS.md"
        />
        <SnippetPreviewButton
          href="/snippets/refactoring-catalog.md"
          label="refactoring-catalog.md"
          hint="90 SKILL.md sections"
        />
      </Stack>

      <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
        Fallback for non-Claude-Code agents — paste sections relevant to the smell you&apos;re
        working on, not the whole file.
      </Typography>

      <Box>
        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
          Claude Code users — install the auto-invoking plugin instead:
        </Typography>
        <Box
          sx={(theme) => ({
            position: "relative",
            bgcolor: theme.palette.mode === "dark" ? "#0a0a0a" : "#f4f4f5",
            border: 1,
            borderColor: "divider",
            borderRadius: 1,
            p: 1.5,
            pr: 5,
          })}
        >
          <Typography
            component="pre"
            variant="caption"
            sx={{
              fontFamily: MONOSPACE_FONT,
              whiteSpace: "pre",
              m: 0,
              overflow: "auto",
            }}
          >
            {CLI_INSTALL_COMMAND}
          </Typography>
          <Tooltip title={copied ? "Copied" : "Copy"}>
            <IconButton
              onClick={handleCopyCommand}
              size="small"
              sx={{ position: "absolute", right: 4, top: 4 }}
              aria-label="Copy install command"
            >
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Stack>
  );
}
