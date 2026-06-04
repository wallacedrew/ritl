import { type ReactNode } from "react";

import Term from "@/shared/components/Term";
import { isKnownTerm } from "@/shared/lib/glossary";

/**
 * Parses `{{glossary-key}}` tokens out of a prose string and returns a
 * ReactNode tree where each known glossary key is wrapped in a `<Term>`
 * tooltip trigger. Unknown keys render as literal text (with their
 * curly braces preserved so the typo stays visible) and log a dev-mode
 * warning. Plain strings without any tokens pass through unchanged.
 *
 * Conventions: the token's contents must match a glossary key 1:1.
 * Inflected forms (e.g. plural / possessive) are out of scope for the
 * minimum viable parser — author the JSON to use the canonical form,
 * or extend this helper if a follow-up slice needs them.
 */
export function renderTermsInProse(text: string): ReactNode {
  const TERM_PATTERN = /\{\{([^}]+)\}\}/g;
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = TERM_PATTERN.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const captured = match[1];
    if (captured === undefined) continue;
    const candidateKey = captured.trim();
    if (isKnownTerm(candidateKey)) {
      parts.push(
        <Term key={`${candidateKey}-${match.index}`} term={candidateKey}>
          {candidateKey}
        </Term>,
      );
    } else {
      parts.push(match[0]);
      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.warn(`renderTermsInProse: unknown glossary key "${candidateKey}"`);
      }
    }
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  if (parts.length === 0) return text;
  if (parts.length === 1 && typeof parts[0] === "string") return parts[0];
  return parts;
}
