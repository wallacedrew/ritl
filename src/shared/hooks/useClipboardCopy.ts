import { useState } from "react";

interface ClipboardCopy {
  copied: boolean;
  copy: (text: string) => Promise<void>;
}

const COPIED_TOAST_DURATION_MS = 1500;

export function useClipboardCopy(): ClipboardCopy {
  const [copied, setCopied] = useState(false);

  async function copy(text: string) {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), COPIED_TOAST_DURATION_MS);
  }

  return { copied, copy };
}
