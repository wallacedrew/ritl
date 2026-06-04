# 0010. Agent-side voice and audience contract

- **Status**: accepted
- **Date**: 2026-06-03
- **Deciders**: project owner, agent

## Context

ADR-0005 → ADR-0006 → ADR-0009 collectively pin down what words are allowed in the agent-side force fields: canonical LLM-research terms plus three project-endorsed exceptions, banned hedge words and abstract nouns, banned OS metaphors, banned invented compounds. That covers **vocabulary**.

What is not yet written down is everything that holds the corpus together at the level above words: **who the modal reader is, who the grammatical subject is, what tense and mood the prose uses, how long each field is allowed to be, and what each of the six fields is for.** These rules exist in the corpus — the de-facto pattern across the catalog is consistent — but they are emergent. A new author writing entries against the vocabulary ADRs alone has enough rope to drift on every axis without tripping the lint.

The agent-side fields are projected to be the most-read content on the site. Two slices of voice drift would be visible to every reader.

This ADR locks in the voice and audience rules that the existing corpus follows so any future author writing a new entry, or a follow-up audit pass, has the same disciplined frame from the vocabulary outward.

## Decision

### 1. Modal reader

The reader is **a developer pair-coding with an LLM agent** who already knows the catalog entry's name and rough definition, and wants to understand how the entry's force plays out under LLM-coding mechanics. Three things follow:

- The reader is **human**, not the agent.
- The reader reads **about** agent mechanics, never **as** the agent.
- The reader does not need the entry's premise restated. They know what "Long Function" or "Strategy" already means; the fields explain the force at agent grain.

### 2. Grammatical subject

The grammatical subject of the agent-side prose is **"the agent"** — third person, throughout.

**Banned** in agent-side fields:

- Second person: `you`, `your`, `your agent`, `yours`.
- First person: `we`, `our`, `ours`, `I`, `my`, `mine`, `let's`.
- Direct address of any kind.

The reader-versus-subject distance is the load-bearing structural feature of the voice. It is what lets a human reader read about agent mechanics without the prose collapsing into prescription.

### 3. Tense

**Present tense**, throughout. The agent reads, loads, ships, fails. Never read, loaded, will ship, would fail.

The catalog describes how the force plays out **right now, in any session**, not a story about a past edit.

### 4. Mood

**Declarative**, throughout.

**Banned**:

- Imperatives: "do X", "use Y", "verify Z".
- Second-person prescription: "you should...", "you must...".
- Questions: "what happens when...".
- Exclamations.

The fields name observable mechanics and follow-on logical consequences. They do not instruct.

### 5. Field-length budget

- **Median target**: ~25 words per field.
- **Hard ceiling**: 50 words per field (enforced by `agent-forces-length.test.ts`).
- **Soft cap**: 40 words. Anything between 40 and 50 is a fixed-cost claim that does not compress further; under 40 is the default.

The cap forces compression on every entry. The most-read content earns brevity.

### 6. Sentence count

**1 to 3 sentences per field**. Semicolons preferred over periods when the clauses are tightly linked (a follow-on consequence of the previous clause); periods when the claims are independent.

### 7. Field-role contract

Each of the six fields has a fixed role.

| Field      | Role                                                                                                                  | Stake required? |
| ---------- | --------------------------------------------------------------------------------------------------------------------- | --------------- |
| `symptom`  | What the agent observes in the code. Descriptive.                                                                     | No              |
| `goal`     | The target post-state. Descriptive.                                                                                   | No              |
| `pressure` | The forcing function under the current code — what the agent is forced to do, and why that ships a user-visible cost. | **Yes**         |
| `tradeoff` | The honest cost of applying the remedy. Names what gets worse alongside what gets better.                             | No              |
| `relief`   | The agent-side post-state once the remedy is applied. Descriptive.                                                    | No              |
| `trap`     | The misapplication failure mode — applying the remedy wrong, with the user-visible cost.                              | **Yes**         |

A field that drifts off its role (e.g. a `goal` field that doubles as a `relief`, or a `tradeoff` that turns into a second `trap`) loses the contract.

### 8. Parallel structure across the human/agent columns

When the human-side field describes a phenomenon, the agent-side field describes **the same phenomenon at a different grain** — context-window or token-cost mechanics, per ADR-0009. The two columns describe the same force, never different forces.

A compare-view row whose human-side and agent-side cells read as independent topics has failed this rule.

## Consequences

**Easier:**

- A new author has a single ADR they can read alongside ADR-0009 and produce prose indistinguishable in shape from Long Function or Strategy.
- The two new lints (`agent-forces-pov.test.ts`, `agent-forces-length.test.ts`) catch drift on POV and length mechanically. Together with `agent-forces-vocabulary.test.ts`, three mechanical surfaces now constrain the prose.
- The field-role contract makes it obvious when a field is doing the wrong job. A `relief` that says "the agent must verify..." is doing `pressure`'s work.
- The reader-versus-subject distance, once named, is self-correcting. An author who notices their draft says "your agent" knows immediately to rewrite.

**Harder / new constraints:**

- The 50-word ceiling will fail on the rare entry that needs a longer clause to land its claim. The discipline is to find the compression; the escape hatch is a written exception in the entry's commit message.
- The POV ban on `you` and `your` will catch some current legacy uses. The in-scope tail is fixed in the implementing slice; sweeping audit happens in a follow-up if needed.
- An author tempted to write "do X, then Y, then verify Z" in `pressure` will hit the imperative ban. They have to rephrase as observable mechanics: "the agent does X, then Y, then verifies Z — and ships an unverified Z when the verification step is skipped."

**Follow-up work:**

- **Glossary** (`docs/glossary.md`) — AGENTS-general references it; it does not exist. Its own decision (what terms it covers, what format, who maintains it).
- **Voice rules for non-catalog surfaces** — home, plugin, about. Out of scope here. Each has its own audience.
- **Examples sidecar** — a `docs/voice-examples.md` that shows good and bad agent-side prose for each field, side-by-side. Useful once the rules have settled.

## Source framing

ADR-0006 set the structural frame (six fields, no strapline). ADR-0009 set the vocabulary frame (canonical LLM-research only, three exceptions). ADR-0010 sets the voice frame around both: who the prose is for, who its subject is, how long it is, what each field is doing.

The three ADRs together make the agent-side content as constrained as the code under it. The reader gets a stable, recognizable shape on every entry.
