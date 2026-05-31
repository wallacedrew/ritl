/**
 * Returns a callback that triggers a browser download of `content` as
 * a markdown file named `filename`. Wrapped as a hook to mark the
 * client/DOM dependency at the call site, matching the convention
 * used by `useClipboardCopy` for `navigator.clipboard`.
 */
export function useDownloadMarkdown(): (content: string, filename: string) => void {
  return (content, filename) => {
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  };
}
