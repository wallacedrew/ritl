"use client";

import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import { useAnalytics } from "@/shared/hooks/useAnalytics";
import { useClipboardCopy } from "@/shared/hooks/useClipboardCopy";
import { MONOSPACE_FONT } from "@/shared/theme/monospace";

const CLAUDE_MD_DIRECTIVE = `When refactoring, name the Fowler smell and the named refactoring before applying it — the matching ritl skill will auto-load on description match.`;

export default function ClaudeMdCompanionSection() {
  const { copied, copy } = useClipboardCopy();
  const analytics = useAnalytics();

  async function handleCopyDirective() {
    analytics.track({ event: "claude_md_companion_copied" });
    await copy(CLAUDE_MD_DIRECTIVE);
  }

  return (
    <Stack spacing={1.5}>
      <Stack spacing={0.5}>
        <Typography component="h2" variant="h6" sx={{ fontWeight: 600 }}>
          Drop into your CLAUDE.md
        </Typography>
        <Typography variant="body2" color="text.secondary">
          One line so the agent knows the plugin is there and names what it&apos;s applying before
          the matching skill auto-loads.
        </Typography>
      </Stack>
      <Box
        sx={{
          position: "relative",
          bgcolor: "#f4f4f5",
          border: 1,
          borderColor: "divider",
          borderRadius: 1,
          p: 1.5,
          pr: 5,
        }}
      >
        <Typography
          component="pre"
          variant="caption"
          sx={{
            fontFamily: MONOSPACE_FONT,
            whiteSpace: "pre-wrap",
            m: 0,
            overflow: "auto",
          }}
        >
          {CLAUDE_MD_DIRECTIVE}
        </Typography>
        <Tooltip title={copied ? "Copied" : "Copy"}>
          <IconButton
            onClick={handleCopyDirective}
            size="small"
            sx={{ position: "absolute", right: 4, top: 4 }}
            aria-label="Copy CLAUDE.md directive"
          >
            <ContentCopyIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
      <Typography variant="caption" color="text.secondary">
        Remove anytime with{" "}
        <Box
          component="code"
          sx={{ fontFamily: MONOSPACE_FONT, bgcolor: "#f4f4f5", px: 0.5, borderRadius: 0.5 }}
        >
          /plugin uninstall refactor@ritl
        </Box>
        . Installed skills live under{" "}
        <Box
          component="code"
          sx={{ fontFamily: MONOSPACE_FONT, bgcolor: "#f4f4f5", px: 0.5, borderRadius: 0.5 }}
        >
          ~/.claude/plugins/
        </Box>{" "}
        — read any SKILL.md before installing.
      </Typography>
    </Stack>
  );
}
