"use client";

import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useState } from "react";

import SnippetPreviewButton from "@/shared/components/SnippetPreviewButton";

const MONOSPACE_FONT =
  'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace';

const CLI_INSTALL_COMMAND = `/plugin marketplace add wallacedrew/ritl
/plugin install refactoring-in-the-loop@ritl`;

export default function AgentsDownloads() {
  const [copied, setCopied] = useState(false);

  async function handleCopyCommand() {
    await navigator.clipboard.writeText(CLI_INSTALL_COMMAND);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <Stack spacing={2}>
      <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1 }}>
        <SnippetPreviewButton
          href="/snippets/refactoring-catalog.md"
          label="refactoring-catalog.md"
          hint="90 SKILL.md sections in one paste"
        />
        <Button
          component="a"
          href="/refactoring-in-the-loop.zip"
          download
          startIcon={<FileDownloadIcon />}
          variant="outlined"
          size="small"
          sx={{ alignSelf: "flex-start", textTransform: "none" }}
        >
          refactoring-in-the-loop.zip
          <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 1 }}>
            · 90-skill plugin
          </Typography>
        </Button>
      </Stack>

      <Box>
        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
          Or install via Claude Code CLI:
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
