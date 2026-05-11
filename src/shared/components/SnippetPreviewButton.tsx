"use client";

import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";

interface SnippetPreviewButtonProps {
  href: string;
  label: string;
  hint?: string;
}

const MONOSPACE_FONT =
  'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace';

function filenameFromHref(href: string): string {
  const last = href.split("/").pop();
  return last && last.length > 0 ? last : "snippet.md";
}

export default function SnippetPreviewButton({ href, label, hint }: SnippetPreviewButtonProps) {
  const [open, setOpen] = useState(false);
  const [original, setOriginal] = useState<string | null>(null);
  const [content, setContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open || original !== null) return;
    let cancelled = false;
    fetch(href)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.text();
      })
      .then((text) => {
        if (cancelled) return;
        setOriginal(text);
        setContent(text);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : String(err));
      });
    return () => {
      cancelled = true;
    };
  }, [open, original, href]);

  async function handleCopy() {
    if (content === null) return;
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function handleDownload() {
    if (content === null) return;
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filenameFromHref(href);
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  }

  function handleReset() {
    setContent(original);
  }

  const isEdited = content !== null && original !== null && content !== original;

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
          {isEdited && (
            <Typography variant="caption" color="warning.main" sx={{ ml: 1, fontWeight: 600 }}>
              · edited
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
          {content !== null && (
            <TextField
              fullWidth
              multiline
              minRows={15}
              maxRows={30}
              value={content}
              onChange={(event) => setContent(event.target.value)}
              variant="outlined"
              aria-label="Snippet content (editable)"
              sx={(theme) => ({
                "& .MuiInputBase-root": {
                  bgcolor: theme.palette.mode === "dark" ? "#0a0a0a" : "#f4f4f5",
                  alignItems: "flex-start",
                },
                "& .MuiInputBase-input": {
                  fontFamily: MONOSPACE_FONT,
                  fontSize: "0.8rem",
                  lineHeight: 1.5,
                },
              })}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleReset}
            startIcon={<RestartAltIcon />}
            disabled={!isEdited}
            sx={{ mr: "auto" }}
          >
            Reset
          </Button>
          <Button onClick={handleCopy} startIcon={<ContentCopyIcon />} disabled={content === null}>
            {copied ? "Copied!" : "Copy"}
          </Button>
          <Button
            onClick={handleDownload}
            startIcon={<FileDownloadIcon />}
            variant="contained"
            disabled={content === null}
          >
            Download
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
