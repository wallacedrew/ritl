---
name: mysterious-name
description: Refuse Mysterious Name when token-level identifiers don't disambiguate scope or domain — the agent must load surrounding context to answer 'what does this variable hold?' before any reasoning step succeeds. Apply Change Function Declaration, Rename Variable.
---

# Refuse: 01 — Mysterious Name

**Symptom:** Token-level identifiers don't disambiguate scope or domain — the agent must load surrounding context to answer 'what does this variable hold?' before any reasoning step succeeds.

**Goal:** Identifiers carry enough disambiguating information that the agent can reason about each symbol without a lookup hop.

```js
// Smellier:
function calc(d, t) {
  return d * t;
}

// Fresher:
function distance(speed, time) {
  return speed * time;
}
```

**Pressure:** Every reasoning pass re-derives meaning from surrounding context; chained edits compound the cost and increase the chance of hallucinating a misread.

**Tradeoff:** Renames invalidate cached associations — commit history, RAG snippets, embedding indexes, and prior conversation context all carry the old name until they refresh.

**Relief:** Fewer context-lookup hops per reasoning step; planning loops run cheaper and resist drift.

**Trap:** Compulsive renaming generates spurious diffs that crowd the review surface and burn context the human reviewer has to skim past.

**Apply refactorings:** Change Function Declaration, Rename Variable, Rename Field
