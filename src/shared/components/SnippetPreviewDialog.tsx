"use client";

import CloseIcon from "@mui/icons-material/Close";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";

import SnippetDialogActions from "@/shared/components/SnippetDialogActions";
import SnippetEditor from "@/shared/components/SnippetEditor";
import SnippetHintCaption from "@/shared/components/SnippetHintCaption";
import SnippetInstallBanner from "@/shared/components/SnippetInstallBanner";
import { useAnalytics } from "@/shared/hooks/useAnalytics";
import { useClipboardCopy } from "@/shared/hooks/useClipboardCopy";
import { useSnippetFetch } from "@/shared/hooks/useSnippetFetch";
import { downloadMarkdown } from "@/shared/lib/downloadMarkdown";

interface SnippetPreviewDialogProps {
  open: boolean;
  onClose: () => void;
  href: string;
  label: string;
  hint?: string;
  filename: string;
  skillSlug: string | null;
}

export default function SnippetPreviewDialog({
  open,
  onClose,
  href,
  label,
  hint,
  filename,
  skillSlug,
}: SnippetPreviewDialogProps) {
  const { content, error, isEdited, setContent, resetContent } = useSnippetFetch(href, open);
  const { copied, copy } = useClipboardCopy();
  const analytics = useAnalytics();

  async function handleCopy() {
    if (content === null) return;
    analytics.track({ event: "snippet_copied", properties: { snippet: filename } });
    await copy(content);
  }

  function handleDownload() {
    if (content === null) return;
    analytics.track({ event: "snippet_downloaded", properties: { snippet: filename } });
    downloadMarkdown(content, filename);
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ pr: 6 }}>
        {label}
        {hint && <SnippetHintCaption text={hint} />}
        {isEdited && <SnippetHintCaption text="edited" emphasized />}
        <IconButton
          onClick={onClose}
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
  );
}
