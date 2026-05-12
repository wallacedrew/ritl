"use client";

import FileDownloadIcon from "@mui/icons-material/FileDownload";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import { useState } from "react";

import SnippetHintCaption from "@/shared/components/SnippetHintCaption";
import SnippetPreviewDialog from "@/shared/components/SnippetPreviewDialog";
import { useAnalytics } from "@/shared/hooks/useAnalytics";

interface SnippetPreviewButtonProps {
  href: string;
  label: string;
  hint?: string;
}

const AGENT_TOOLTIP_TITLE =
  "Compact Markdown for coding agents (Claude Code, Codex, Aider). Same content as this page.";

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
  const filename = filenameFromHref(href);
  const skillSlug = skillSlugFromHref(href);
  const analytics = useAnalytics();

  function handleOpen() {
    analytics.track({ event: "snippet_preview_opened", properties: { snippet: filename } });
    setOpen(true);
  }

  return (
    <>
      <Tooltip title={AGENT_TOOLTIP_TITLE} describeChild enterDelay={300} placement="bottom-start">
        <Button
          onClick={handleOpen}
          startIcon={<FileDownloadIcon />}
          variant="outlined"
          size="small"
          sx={{
            alignSelf: "flex-start",
            textTransform: "none",
          }}
        >
          {label}
          {hint && <SnippetHintCaption text={hint} />}
        </Button>
      </Tooltip>

      <SnippetPreviewDialog
        open={open}
        onClose={() => setOpen(false)}
        href={href}
        label={label}
        hint={hint}
        filename={filename}
        skillSlug={skillSlug}
      />
    </>
  );
}
