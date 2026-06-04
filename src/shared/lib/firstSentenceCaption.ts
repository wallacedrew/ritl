/**
 * Extracts the first sentence of a force-field string for use as a
 * catalog list-card caption. Strips `{{glossary-key}}` markers
 * (catalog listing pages render plain text, not tooltips) and returns
 * the prose up to and including the first terminating punctuation
 * (`.`, `!`, or `?`).
 *
 * The catalog convention is that the first sentence of every force
 * field is a short structural definition; subsequent sentences carry
 * the mechanism elaboration with glossary markers. Cards land at the
 * structural definition; the full prose (with tooltips) lives on the
 * detail page.
 */
export function firstSentenceCaption(text: string): string {
  const stripped = text.replace(/\{\{\s*([^}]+?)\s*\}\}/g, "$1");
  const match = stripped.match(/^[^.!?]*[.!?]/);
  return match ? match[0].trim() : stripped.trim();
}
