import { describe, expect, it } from "vitest";

import { loadPatterns } from "@/design-patterns/lib/loadPatterns";
import { loadRefactorings } from "@/refactorings/lib/loadRefactorings";
import { loadSmells } from "@/smells/lib/loadSmells";
import type { CatalogEntry, Lens } from "@/shared/lib/CatalogEntry";
import { GLOSSARY, type GlossaryTermKey } from "@/shared/lib/glossary";

const FORCE_FIELDS = ["symptom", "goal", "pressure", "tradeoff", "relief", "trap"] as const;

/**
 * Glossary keys eligible for the marking lint.
 *
 * Excluded from this list: `retrieval` (where the LLM-research sense
 * cannot be distinguished from ordinary usage without semantic
 * analysis) and `the agent` (which appears as the grammatical subject
 * of nearly every field — marking the first occurrence per entry
 * would put a tooltip on "the agent" in symptom and never elsewhere,
 * which adds noise without teaching the reader anything they don't
 * already infer from the modal-reader contract).
 */
const LINTABLE_KEYS: readonly GlossaryTermKey[] = [
  "context window",
  "token cost",
  "hallucinations",
  "tokens",
  "lost-in-the-middle",
  "context overflow",
  "chain-of-thought",
  "RAG",
  "reasoning step",
  "context-window load",
  "retrieval cost",
  "reasoning-step cost",
  "type-checker visibility",
  "cache-staleness cost",
  "completeness-check cost",
  "verification-surface cost",
];

const MARKER_PATTERN = /\{\{\s*([^}]+?)\s*\}\}/g;

function escapeRegex(literal: string): string {
  return literal.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Longest-first so multi-word matches claim their tokens before any
// shorter key's regex sees them.
const SORTED_KEYS = [...LINTABLE_KEYS].sort((a, b) => b.length - a.length);

function combinedKeyPattern(): RegExp {
  return new RegExp(`\\b(?:${SORTED_KEYS.map(escapeRegex).join("|")})\\b`, "gi");
}

interface Event {
  key: GlossaryTermKey;
  fieldIndex: number;
  pos: number;
  kind: "marked" | "unmarked";
}

function canonicalize(matched: string): GlossaryTermKey | null {
  const lower = matched.toLowerCase();
  for (const key of LINTABLE_KEYS) {
    if (key.toLowerCase() === lower) return key;
  }
  return null;
}

function collectEvents(entry: CatalogEntry): Event[] {
  const agent = entry.forcesFor("agent" as Lens);
  const events: Event[] = [];
  const keyPattern = combinedKeyPattern();

  for (let fieldIndex = 0; fieldIndex < FORCE_FIELDS.length; fieldIndex++) {
    const fieldName = FORCE_FIELDS[fieldIndex]!;
    const text = agent[fieldName];

    // Capture marker spans so unmarked scanning can skip them.
    const markerSpans: Array<[number, number]> = [];
    const markerPattern = new RegExp(MARKER_PATTERN.source, "g");
    let markerMatch: RegExpExecArray | null;
    while ((markerMatch = markerPattern.exec(text)) !== null) {
      const captured = markerMatch[1];
      if (captured === undefined) continue;
      const markerKey = captured.trim();
      markerSpans.push([markerMatch.index, markerMatch.index + markerMatch[0].length]);
      const canonical = canonicalize(markerKey);
      if (canonical !== null && (LINTABLE_KEYS as readonly string[]).includes(canonical)) {
        events.push({ key: canonical, fieldIndex, pos: markerMatch.index, kind: "marked" });
      }
    }

    // Unmarked occurrences: whole-word matches outside any marker span.
    keyPattern.lastIndex = 0;
    let occurrenceMatch: RegExpExecArray | null;
    while ((occurrenceMatch = keyPattern.exec(text)) !== null) {
      const start = occurrenceMatch.index;
      const end = start + occurrenceMatch[0].length;
      const insideMarker = markerSpans.some(([s, e]) => start >= s && end <= e);
      if (insideMarker) continue;
      const canonical = canonicalize(occurrenceMatch[0]);
      if (canonical === null) continue;
      events.push({ key: canonical, fieldIndex, pos: start, kind: "unmarked" });
    }
  }

  return events;
}

interface Hit {
  entry: string;
  key: GlossaryTermKey;
  reason: string;
}

function checkEntry(entry: CatalogEntry): Hit[] {
  const events = collectEvents(entry);
  if (events.length === 0) return [];

  const markedCount = events.filter((e) => e.kind === "marked").length;
  if (markedCount === 0) return []; // legacy entry, not opted in

  const eventsByKey = new Map<GlossaryTermKey, Event[]>();
  for (const ev of events) {
    if (!eventsByKey.has(ev.key)) eventsByKey.set(ev.key, []);
    eventsByKey.get(ev.key)!.push(ev);
  }

  const hits: Hit[] = [];
  for (const [key, keyEvents] of eventsByKey) {
    keyEvents.sort((a, b) => a.fieldIndex - b.fieldIndex || a.pos - b.pos);
    const markedEvents = keyEvents.filter((e) => e.kind === "marked");

    if (markedEvents.length > 1) {
      hits.push({
        entry: entry.name.toString(),
        key,
        reason: `over-marked: ${markedEvents.length} {{${key}}} markers; the rule is first-occurrence per entry only`,
      });
      continue;
    }

    if (markedEvents.length === 0) {
      const firstField = FORCE_FIELDS[keyEvents[0]!.fieldIndex];
      hits.push({
        entry: entry.name.toString(),
        key,
        reason: `missing marker: '${key}' appears unmarked in agent.${firstField} (and possibly elsewhere); entries that opt in must mark every lintable key`,
      });
      continue;
    }

    const firstEvent = keyEvents[0]!;
    if (firstEvent.kind !== "marked") {
      const firstUnmarkedField = FORCE_FIELDS[firstEvent.fieldIndex];
      const markerField = FORCE_FIELDS[markedEvents[0]!.fieldIndex];
      hits.push({
        entry: entry.name.toString(),
        key,
        reason: `marker out of position: unmarked '${key}' in agent.${firstUnmarkedField} precedes the {{${key}}} marker in agent.${markerField}`,
      });
    }
  }
  return hits;
}

function formatHits(hits: readonly Hit[]): string {
  return hits.map((h) => `  - ${h.entry} :: ${h.key} :: ${h.reason}`).join("\n");
}

describe("opted-in entries mark every lintable glossary key on its first occurrence", () => {
  it("emits no hits for entries that have at least one {{glossary-key}} marker", () => {
    const allEntries = [...loadSmells(), ...loadRefactorings(), ...loadPatterns()];
    const hits: Hit[] = [];
    for (const entry of allEntries) {
      hits.push(...checkEntry(entry));
    }
    expect(hits, `\n${formatHits(hits)}\n`).toEqual([]);
  });
});

// Tiny self-check: confirm every LINTABLE_KEY actually exists in the
// glossary. Catches a renaming drift at lint-author time.
describe("LINTABLE_KEYS allow-list is in sync with the glossary", () => {
  it("contains only keys that exist in the glossary", () => {
    const missing = LINTABLE_KEYS.filter(
      (key) => !Object.prototype.hasOwnProperty.call(GLOSSARY, key),
    );
    expect(missing).toEqual([]);
  });
});
