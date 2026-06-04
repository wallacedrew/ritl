---
name: mysterious-name
description: Refuse Mysterious Name when names that don't disambiguate scope or domain force the agent to read more code into the context window just to know what a variable holds before each reasoning step. Apply Change Function Declaration, Rename Variable.
---

# Refuse: 01 — Mysterious Name

**Announce first:** name this as Mysterious Name and which refactoring you'll apply (Change Function Declaration or Rename Variable) before any edit. The user reads the announcement as your contract.

**Or decline first:** if you don't flag this as Mysterious Name, name the decline type — catalog miss, taste call, cost-benefit, constraint-blocked, or insufficient context.

**Symptom:** Names that don't disambiguate scope or domain force the agent to read more code into the context window just to know what a variable holds before each reasoning step.

**Goal:** Identifiers carry enough information that the agent can reason about each symbol without paying retrieval cost.

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

**Pressure:** Every reasoning step re-derives meaning from surrounding code; chained edits compound the cost, and hallucinations ship as plausible-looking misreads of what symbols stand for.

**Tradeoff:** Renames invalidate cached associations — commit history, RAG snippets, embedding indexes, and prior conversation context all carry the old name until they refresh.

**Relief:** Every later read resolves to one name; the token cost of recovering meaning drops by the size of the context the agent previously had to load.

**Trap:** Renaming every variable whose current name another reviewer would also accept invalidates cached associations across RAG indexes, prior conversation context, and old-name references in code comments — without changing what the symbol stands for.

**Apply refactorings:** Change Function Declaration, Rename Variable, Rename Field
