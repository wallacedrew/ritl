"use client";

import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";

interface SnippetPreviewButtonProps {
  href: string;
  label: string;
  hint?: string;
}

export default function SnippetPreviewButton({ href, label, hint }: SnippetPreviewButtonProps) {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open || content !== null) return;
    let cancelled = false;
    fetch(href)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.text();
      })
      .then((text) => {
        if (!cancelled) setContent(text);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : String(err));
      });
    return () => {
      cancelled = true;
    };
  }, [open, content, href]);

  async function handleCopy() {
    if (!content) return;
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        startIcon={<FileDownloadIcon />}
        variant="outlined"
        size="small"
        sx={{ alignSelf: "flex-start", textTransform: "none" }}
      >
        {label}
        {hint && (
          <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 1 }}>
            · {hint}
          </Typography>
        )}
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ pr: 6 }}>
          {label}
          {hint && (
            <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
              · {hint}
            </Typography>
          )}
          <IconButton
            onClick={() => setOpen(false)}
            size="small"
            sx={{ position: "absolute", right: 12, top: 12 }}
            aria-label="Close preview"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {content === null && !error && (
            <Stack sx={{ alignItems: "center", py: 4 }}>
              <CircularProgress size={24} />
            </Stack>
          )}
          {error && <Alert severity="error">Failed to load snippet: {error}</Alert>}
          {content && (
            <Box
              component="pre"
              sx={(theme) => ({
                margin: 0,
                padding: 2,
                borderRadius: 1,
                bgcolor: theme.palette.mode === "dark" ? "#0a0a0a" : "#f4f4f5",
                color: "text.primary",
                fontFamily:
                  'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
                fontSize: "0.8rem",
                lineHeight: 1.5,
                whiteSpace: "pre-wrap",
                overflowX: "auto",
                border: 1,
                borderColor: "divider",
              })}
            >
              {content}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCopy} startIcon={<ContentCopyIcon />} disabled={!content}>
            {copied ? "Copied!" : "Copy"}
          </Button>
          <Button
            component="a"
            href={href}
            download
            startIcon={<FileDownloadIcon />}
            variant="contained"
          >
            Download
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
