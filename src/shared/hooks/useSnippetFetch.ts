import { useEffect, useState } from "react";

import { useSnippetSource } from "./useSnippetSource";

interface SnippetFetchState {
  content: string | null;
  error: string | null;
  isEdited: boolean;
  setContent: (next: string) => void;
  resetContent: () => void;
}

export function useSnippetFetch(href: string, open: boolean): SnippetFetchState {
  const source = useSnippetSource();
  const [original, setOriginal] = useState<string | null>(null);
  const [content, setContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || original !== null) return;
    let cancelled = false;
    source
      .fetch(href)
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
  }, [open, original, href, source]);

  function resetContent() {
    setContent(original);
  }

  const isEdited = content !== null && original !== null && content !== original;

  return { content, error, isEdited, setContent, resetContent };
}
