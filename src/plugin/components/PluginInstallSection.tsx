"use client";

import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import { useAnalytics } from "@/shared/hooks/useAnalytics";
import { useClipboardCopy } from "@/shared/hooks/useClipboardCopy";
import { MONOSPACE_FONT } from "@/shared/theme/monospace";

const CLI_INSTALL_COMMAND = `/plugin marketplace add wallacedrew/ritl
/plugin install refactor@ritl`;

export default function PluginInstallSection() {
  const { copied, copy } = useClipboardCopy();
  const analytics = useAnalytics();

  async function handleCopyCommand() {
    analytics.track({ event: "plugin_install_copied" });
    await copy(CLI_INSTALL_COMMAND);
  }

  return (
    <Stack spacing={1.5}>
      <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
        <Typography component="h2" variant="h6" sx={{ fontWeight: 600 }}>
          Claude Code plugin
        </Typography>
        <Chip label="Recommended" color="primary" size="small" />
      </Stack>
      <Typography variant="body2" color="text.secondary">
        141 auto-invoking skills — 1 workflow orchestrator, 66 refactorings, 24 smells, 50 patterns
        (27 Kerievsky composites + 23 GoF design patterns). Each loads just-in-time when its
        description matches what you&apos;re working on, so the model only pays attention to the
        smell, refactoring, or pattern that&apos;s actually in play.
      </Typography>
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
    </Stack>
  );
}
