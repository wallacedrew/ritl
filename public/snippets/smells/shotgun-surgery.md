---
name: shotgun-surgery
description: Refuse Shotgun Surgery when a single conceptual edit forces the agent to identify, load, and modify many small sites — each cheap individually but the search and completeness-check cost dominates. Apply Move Function, Move Field.
---

# Refuse: 08 — Shotgun Surgery

**Announce first:** name this as Shotgun Surgery and which refactoring you'll apply (Move Function or Move Field) before any edit. The user reads the announcement as your contract.

**Or decline first:** if you don't flag this as Shotgun Surgery, name the decline type — catalog miss, taste call, cost-benefit, constraint-blocked, or insufficient context.

**Symptom:** A single conceptual edit forces the agent to identify, load, and modify many small sites — each cheap individually but the search and completeness-check cost dominates. The agent's context-window load rises across N files just to verify the same logical change everywhere, and the retrieval cost of finding the next site competes with reasoning about the change itself.

**Goal:** All code that varies together sits in one place; the agent loads one module to make any change along this axis and verifies completeness in one read. The agent's context window holds only the relevant slice; the reasoning step count drops because the agent doesn't reconstruct the scattered set, and completeness-check cost collapses to a single file.

```js
// Smellier:
// Five files each have:
log(`event=${event}, user=${user}`);

// Fresher:
// One file:
function logEvent({ event, user }) {
  // one place to evolve
}
```

**Pressure:** Every change carries risk of missing a site the agent didn't grep for; reviewers (human or agent) can't verify completeness without re-running the same search, and the agent's verification-surface cost multiplies by the count of touched files. The agent generates an edit that targeted every site it found while missing the one site the search didn't surface.

**Tradeoff:** Consolidation creates a new boundary the agent must respect; previously-independent sites now route through one module that becomes a contention point for unrelated edits. Context-window load on the consolidated module rises because every change along this axis loads its full surface; the agent's retrieval cost on cross-cutting edits also rises along the new seam.

**Relief:** A change to the consolidated behavior lands at one file; the agent's token cost per edit drops from N files loaded to one, and the chance of missing a site goes to zero by construction. Verification surface collapses because the file is the surface; the agent reads one module and ships the change without grep-and-iterate.

**Trap:** Pulling every superficially-related edit into one module creates a god-module the agent now loads as a tangle of unrelated concerns — the smell migrated, not vanished. The agent's reasoning-step cost rises as it disentangles unrelated axes per edit, and context-window load on the god-module exceeds what the agent can hold for any single concern.

**Apply refactorings:** Move Function, Move Field, Combine Functions into Class, Combine Functions into Transform, Split Phase, Inline Function, Inline Class
