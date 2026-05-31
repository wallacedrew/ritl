import type { SnippetSource } from "@/shared/lib/SnippetSource";

/**
 * Production adapter for SnippetSource. Loads the snippet body via the
 * browser fetch API against the public /snippets/... URL space served
 * by Next.js out of public/snippets/.
 */
export class HttpSnippetSource implements SnippetSource {
  async fetch(href: string): Promise<string> {
    const response = await globalThis.fetch(href);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return response.text();
  }
}
