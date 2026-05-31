/**
 * Port for loading the markdown body of a snippet by its public href.
 * The shell decides which adapter to wire (HttpSnippetSource against
 * the real /snippets/... URL; InMemorySnippetSource for tests). Pure
 * consumers — useSnippetFetch and the SnippetPreviewDialog — depend
 * only on this interface.
 */
export interface SnippetSource {
  fetch(href: string): Promise<string>;
}
