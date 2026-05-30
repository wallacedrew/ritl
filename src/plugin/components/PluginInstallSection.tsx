"use client";

import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
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
      <Stack spacing={0.5}>
        <Typography component="h2" variant="h6" sx={{ fontWeight: 600 }}>
          If you have Claude Code: install the plugin
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Only the skill matching what you&apos;re working on enters context — the other 139 in the
          catalog cost nothing per query. Coverage spans 66 refactorings, 24 smells, 27 Kerievsky
          composites, and 23 GoF patterns. An audit orchestrator picks which one applies.
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
      <Typography variant="caption" color="text.secondary">
        Browse before installing:{" "}
        <Link href="/refactoring/canon" color="inherit" underline="hover">
          66 refactorings
        </Link>{" "}
        ·{" "}
        <Link href="/refactoring/smells" color="inherit" underline="hover">
          24 smells
        </Link>{" "}
        ·{" "}
        <Link href="/refactoring-to-patterns" color="inherit" underline="hover">
          27 Kerievsky composites
        </Link>{" "}
        ·{" "}
        <Link href="/design-patterns" color="inherit" underline="hover">
          23 GoF patterns
        </Link>
        . Each has a detail page with Before/After and the human-vs-agent comparison.
      </Typography>
    </Stack>
  );
}
