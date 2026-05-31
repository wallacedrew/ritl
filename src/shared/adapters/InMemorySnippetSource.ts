import type { SnippetSource } from "@/shared/lib/SnippetSource";

/**
 * In-memory adapter for SnippetSource. Tests construct one with the
 * snippet bodies they want to assert against; the SnippetPreviewDialog
 * resolves to those entries instead of hitting the network. Throws if
 * a caller asks for an href that wasn't preloaded — preferable to a
 * silent miss because every test scenario should declare its inputs.
 */
export class InMemorySnippetSource implements SnippetSource {
  constructor(private readonly entries: ReadonlyMap<string, string>) {}

  async fetch(href: string): Promise<string> {
    const content = this.entries.get(href);
    if (content === undefined) {
      throw new Error(`InMemorySnippetSource: no entry for "${href}"`);
    }
    return content;
  }
}
