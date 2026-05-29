# 0005. Compare-view differentials ground every entry in one specific failure mode

- **Status**: accepted
- **Date**: 2026-05-29
- **Deciders**: project owner, agent

## Context

Each catalog entry now carries an optional `compareDifferential` field (added in the Slice that introduced the compare view). It renders as an italic body1 strapline on `/<catalog>/<slug>/compare`, sitting between the entry header and the `Symptom / Goal / Pressure` sections. Its job is to make the **human-vs-agent stakes specific to this entry** — why the same code shape costs a human one thing and costs an agent something mechanically different.

An audit of all 140 differentials authored to date bucketed them by how concretely they framed that contrast:

- **37 STRONG** (26%) — explicitly name a specific mechanical failure mode (context budget, stale context, verification grounding, positional alignment, anchoring).
- **38 OK** (27%) — gesture at the right contrast but in generic terms ("ripple effects," "coupling," "polymorphism").
- **65 WEAK** (47%) — flat and generic; would read identically on most other entries.

The failure pattern in the WEAK set is the same failure the broader project teaches readers to recognize: **slop as a specification problem.** Without a concrete frame, the differential regresses to the safest-sounding average phrasing about the topic. Mode collapse, on a page that is supposed to make mode collapse legible.

Two framings were considered:

1. **Free-form authoring** — let each differential find its own voice; rely on author judgment to avoid flatness. This is what produced the current 47% WEAK rate.
2. **Rubric-bound authoring** — adopt a fixed vocabulary of named failure modes, banned hedge words, and a required contrast shape. Every differential commits to one specific mechanism.

## Decision

We will use **option 2**: every `compareDifferential` is authored against a fixed rubric, summarized below. The rubric becomes the load-bearing standard for the field; any rewrite or new entry must satisfy it.

### The rubric

A `compareDifferential` must:

0. **Answer the junior-engineer question.** The implicit question this field exists to answer is: "if humans are not reading the code but agents are, why should I care if the code is refactored well?" The agent-cost sentence must connect to user-visible stakes — code that ships broken, generated answers that drift from what the user asked, more iterations or higher token cost to reach the same outcome. A differential that only says "the agent finds it hard" without naming the consequence for the shipped product fails this rule.

1. **Use the two-actor sentence structure.** Each differential must contain at least one sentence beginning with "Humans" and at least one sentence beginning with "Agents." The Humans sentence states what the human reader cares about; the Agents sentence states the mechanical failure and ties it to a shipped-code consequence.

2. **Ground every differential in context window or token cost.** These are the two mechanical currencies that uniquely matter to an agent and trace back to a stake the user can feel (bill, latency, error rate per edit). Other failure modes (anchoring, drift, blast radius, verification grounding) all translate into either more tokens consumed per iteration or a wider context window than the budget supports — express them in those terms.
   - **Context window** — what fits, what gets paged out, what loads alongside what, lost-in-the-middle (attention drops in the middle of long bodies), and overflow when the relevant scope exceeds the budget.
   - **Token cost** — tokens consumed per query (read), tokens consumed per generation (write), tokens spent on unrelated payload loaded with the relevant code, tokens for a walk through every branch when the structure forces it.

   The differential should state how the code shape inflates one of these for the agent, and how the refactored shape deflates it. Pick whichever frame fits the entry; do not force both.

3. **Ban hedge words** as load-bearing: "can," "may," "might," "tends to," "often," "sometimes," "it's important to note." Commit to a position; that commitment is what distinguishes a real differential from generic prose.

4. **Ban abstract nouns** as the load-bearing word: "complexity," "coupling," "coordination," "cognitive load," "polymorphism," "encapsulation," "decoupling," "ergonomics," "ripple effects." Replace with concrete mechanisms ("token count," "type-checker reach," "edit locality," "fan-out to N files").

5. **Ban verbs that fit any entry**: "makes it easier," "reduces friction," "improves clarity," "becomes uniform." Replace with the specific thing that improves and the unit of improvement (tokens, files touched, oracle reach).

6. **Neutral voice; no dramatic emphasis.** State the mechanism as a fact. Banned: emotional verbs ("dread," "fear," "worry about"), value-laden nouns ("lie," "trap," "danger"), rhetorical em-dash emphasis ("— and the only way to know is —"), narrative voice ("every time," "the entire point"). Prefer colons over em-dashes when joining a claim to its mechanism.

7. **≤3 sentences.** Enforced mechanically by `parseCatalogEntry.ts` (`readOptionalCompareDifferential`). The parser throws on any longer differential at module load.

### Example of WEAK → STRONG on the same entry

**WEAK** (current Mutable Data): "Agents must trace ownership through every mutation to predict the value at a given point — pure data is a single read; mutated data is a graph of reads and writes."

**STRONG** target: "Humans track who else can change the value to predict what it will be. Agents have to load every file that writes to the value to reason about its current state, which costs tokens proportional to the number of write sites and on anything past trivial scope exceeds the context window. The result is generated against a truncated reading of the program and ships against assumptions the agent never confirmed."

The strong version satisfies every rule: it opens with a Humans sentence stating the human-side cost, follows with an Agents sentence grounded in token cost and context window (the two-mechanism rubric), and closes by tying the cost to a user-visible stake (the generated code ships against assumptions). Neutral voice throughout, ≤3 sentences.

## Consequences

**Easier:**

- New entries get a clear voice template. Authoring a differential is no longer "find a clever contrast" — it's "pick the failure mode this entry stresses, name it concretely, contrast with the human cost in human terms."
- Future agents reading `git log` see the rubric documented here and can self-correct before authoring rather than after a review pass.
- Cross-entry reading on the site stops being a wall of indistinguishable straplines. Each one teaches one named mechanism.

**Harder / new constraints:**

- Authors must understand the named failure modes well enough to pick the right one. Naming "context budget" on a 3-line method is **wrongness**, not flatness — a worse failure than the original WEAK version. The rubric demands more thought per entry, not less.
- Voice fatigue is now a real risk in the opposite direction. If every differential leans on "no oracle" or "context budget," the page itself collapses into a different mode. Distribute named mechanisms across entries; not every differential should hit the same failure mode.
- Existing 140 entries need a bulk pass to reground the WEAK 65 and tighten the OK 38. That work is being executed in a separate slice; this ADR is the standard the slice writes against.

**Follow-up work:**

- A lint test that scans `compareDifferential` strings for banned words ("complexity," "coupling," "ripple," "easier," etc.) would prevent regression in future entries. Worth doing as a separate tidying; not gated on this ADR.
- The fallback strapline in `CatalogCompareDetail.tsx` ("Humans pay in attention; agents pay in tokens — same target, different failure modes") becomes unreachable once every entry has a differential. Delete in a separate Tidy First commit.
- Auto-generating differentials from a template is an **anti-goal** — it is exactly the regression-to-the-mean failure this ADR exists to prevent. Do not.

## Source framing

The named failure modes above are drawn from the project owner's working framework on why agents produce slop and what prevents it. Key load-bearing claims that this rubric inherits:

- **Slop has two distinct failure modes** — wrongness (inaccurate, ungrounded) and flatness (correct but generic). They have different fixes; bigger models do not fix flatness.
- **Slop is a specification problem.** A model regresses to the mean when the request only points at the mean. Specificity, hard constraints, an explicit point of view, and concrete exemplars predict good output.
- **Agent quality lives in the corrective environment around the agent**, not the agent itself. Tests, type checkers, linters, and small isolated diffs are the ground truth that catches drift. The differentials should reflect this — they name what the agent's environment fails to catch, not just what the agent "finds hard."
