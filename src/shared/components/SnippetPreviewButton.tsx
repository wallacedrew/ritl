"use client";

import CloseIcon from "@mui/icons-material/Close";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useState } from "react";

import SnippetDialogActions from "@/shared/components/SnippetDialogActions";
import SnippetEditor from "@/shared/components/SnippetEditor";
import SnippetInstallBanner from "@/shared/components/SnippetInstallBanner";
import { useClipboardCopy } from "@/shared/hooks/useClipboardCopy";
import { useSnippetFetch } from "@/shared/hooks/useSnippetFetch";

interface SnippetPreviewButtonProps {
  href: string;
  label: string;
  hint?: string;
}

const PER_ENTITY_SNIPPET_HREF = /^\/snippets\/(refactorings|smells)\//;

function filenameFromHref(href: string): string {
  const last = href.split("/").pop();
  return last && last.length > 0 ? last : "snippet.md";
}

function skillSlugFromHref(href: string): string | null {
  if (!PER_ENTITY_SNIPPET_HREF.test(href)) return null;
  return filenameFromHref(href).replace(/\.md$/, "");
}

export default function SnippetPreviewButton({ href, label, hint }: SnippetPreviewButtonProps) {
  const [open, setOpen] = useState(false);
  const { content, error, isEdited, setContent, resetContent } = useSnippetFetch(href, open);
  const { copied, copy } = useClipboardCopy();

  async function handleCopy() {
    if (content !== null) await copy(content);
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

  const skillSlug = skillSlugFromHref(href);

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
          <SnippetInstallBanner slug={skillSlug} />
          {content === null && !error && (
            <Stack sx={{ alignItems: "center", py: 4 }}>
              <CircularProgress size={24} />
            </Stack>
          )}
          {error && <Alert severity="error">Failed to load snippet: {error}</Alert>}
          {content !== null && <SnippetEditor value={content} onChange={setContent} />}
        </DialogContent>
        <SnippetDialogActions
          isEdited={isEdited}
          copied={copied}
          disabled={content === null}
          onReset={resetContent}
          onCopy={handleCopy}
          onDownload={handleDownload}
        />
      </Dialog>
    </>
  );
}
