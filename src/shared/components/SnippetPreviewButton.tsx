"use client";

import FileDownloadIcon from "@mui/icons-material/FileDownload";
import Button from "@mui/material/Button";
import { useState } from "react";

import SnippetHintCaption from "@/shared/components/SnippetHintCaption";
import SnippetPreviewDialog from "@/shared/components/SnippetPreviewDialog";
import { useAnalytics } from "@/shared/hooks/useAnalytics";

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
  const filename = filenameFromHref(href);
  const skillSlug = skillSlugFromHref(href);
  const analytics = useAnalytics();

  function handleOpen() {
    analytics.track({ event: "snippet_preview_opened", properties: { snippet: filename } });
    setOpen(true);
  }

  return (
    <>
      <Button
        onClick={handleOpen}
        startIcon={<FileDownloadIcon />}
        variant="outlined"
        size="small"
        sx={{
          alignSelf: "flex-start",
          textTransform: "none",
          display: { xs: "none", md: "inline-flex" },
        }}
      >
        {label}
        {hint && <SnippetHintCaption text={hint} />}
      </Button>

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
