import { useEffect, useState } from "react";

interface SnippetFetchState {
  content: string | null;
  error: string | null;
  isEdited: boolean;
  setContent: (next: string) => void;
  resetContent: () => void;
}

export function useSnippetFetch(href: string, open: boolean): SnippetFetchState {
  const [original, setOriginal] = useState<string | null>(null);
  const [content, setContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  function resetContent() {
    setContent(original);
  }

  const isEdited = content !== null && original !== null && content !== original;

  return { content, error, isEdited, setContent, resetContent };
}
