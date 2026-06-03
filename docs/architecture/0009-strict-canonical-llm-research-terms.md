# 0009. Voice rubric tightened: strict canonical LLM-research terms only

- **Status**: accepted (supersedes ADR-0006 for the voice rubric)
- **Date**: 2026-06-03
- **Deciders**: project owner, agent

## Context

ADR-0006 endorsed an enumerated vocabulary for the agent-side force fields: "context window (what fits, what gets paged out, lost-in-the-middle, overflow) or token cost (tokens per read, tokens per write, tokens for unrelated payload, tokens for a walk through every branch)." Two of those framings — `paged out` and the implied `working set` — are OS-memory-management borrowings, not LLM-research terminology. They read as if they name a mechanism a curious reader could look up; in fact they map onto LLM phenomena only by analogy.

The same gap surfaced when authoring fresh agent-side prose against ADR-0006: invented compounds slipped in (`focused-attention region`, `duplicate-payload tokens`) that read research-y but aren't published concepts. A reader who Googles those terms lands on nothing.

The shipped consequence: a catalog whose voice claims to ground in agent mechanics, while half its mechanism-naming vocabulary is borrowed metaphor or invented compound that no reader can cross-reference. The fix is to bound the vocabulary explicitly to what an LLM-literate reader can independently verify.

ADR-0006's two non-rubric decisions stand unchanged: the `compareDifferential` field stays removed, and the six agent-side force fields per entry continue to carry the human/agent contrast. This ADR supersedes ADR-0006 only on vocabulary.

## Decision

Agent-side force-field vocabulary is restricted to **canonical LLM-research terminology**, with three project-endorsed exceptions.

### Three project-endorsed phrases

1. **`context window`** — the bounded input span the model attends to during one forward pass.
2. **`token cost`** — the per-step or per-operation token expense an agent pays for a read, write, or branch walk.
3. **`hallucinations`** — model-generated content not grounded in the input.

### Canonical LLM-research vocabulary (non-exhaustive allow-list)

A reader can verify each of these by Googling the term and landing on actual literature or canonical documentation. Authors may use any of these freely:

- **`tokens`** — the discrete units the model consumes and produces.
- **`attention`** — the transformer mechanism.
- **`lost-in-the-middle`** — Liu et al. 2023, "Lost in the Middle: How Language Models Use Long Contexts" — recall degrades for content positioned mid-context.
- **`context overflow`** / **`overflow`** — input exceeding the window.
- **`prompt`**, **`completion`**, **`system prompt`**, **`user message`**, **`tool result`**, **`assistant turn`** — turn-structure terms.
- **`in-context learning`**, **`chain-of-thought`**, **`few-shot`**, **`zero-shot`** — prompting paradigms.
- **`retrieval`**, **`RAG`** (retrieval-augmented generation) — retrieval-augmented setups.
- **`reasoning step`** / **`reasoning pass`** — descriptive and already in established catalog voice.

### Banned terms

Replace on touch. Legacy entries audited in a separate slice.

- **OS-memory-management borrowings**: `paged out`, `paging`, `paged-out`, `working set`, `swap`, `evict`, `cache miss` (in the LLM sense).
- **Invented compounds masquerading as terminology**: `focused-attention region`, `duplicate-payload tokens`, and any neologism that sounds technical but has no upstream source a reader could cite.
- **Network / IO borrowings used as LLM metaphors**: `payload` as a standalone noun for "code", `bandwidth`, `throughput` (when describing model behaviour rather than literal network use).

### Carried forward from ADR-0006

- **Banned hedge words**: `can`, `may`, `might`, `tends to`.
- **Banned abstract nouns as load-bearing**: `complexity`, `coupling`, `coordination`, `ergonomics`.
- **Neutral, facts-only voice**: no emotional verbs, value-laden nouns, rhetorical em-dash emphasis, or narrative voice.
- **Stake requirement**: `pressure` and `trap` fields land a user-visible consequence (shipped bug, drift in generated answers, iteration cost) where the field role allows.

## Consequences

**Easier:**

- A reader who tries to look up an agent-side term lands on actual literature or canonical documentation, not invented project jargon. The catalog's claim to "ground in mechanics" is independently verifiable.
- The vocabulary lint (`agent-forces-vocabulary.test.ts`) gains a bounded list of banned terms it can enforce mechanically; future writes drift less.
- New entries authored against the rubric have a finite allow-list to work from instead of "use canonical mechanics" interpreted loosely.

**Harder / new constraints:**

- Writing about "code the agent has not loaded into context" loses the `paged out` shorthand. The canonical replacement is "outside the context window" or "not in context" — wordier but accurate.
- Authors must distinguish between "in the window but at a position where recall degrades" (use `lost-in-the-middle`) and "not in the window at all" (use `outside the context window`). The two phenomena were elided under `paged out`; they are different.
- Legacy entries that use now-banned vocabulary fail the extended lint until rewritten. As of this ADR, four field instances need fixing — all of them inside the Duplicated Code rewrite that prompted this ADR. The Duplicated Code fix lands in the same commit; no other entries are affected.

**Follow-up work:**

- **Vocabulary additions over time.** When a new LLM-research term enters general use and maps cleanly onto a refactoring mechanism, write a successor ADR that adds it to the allow-list. Do not edit this ADR in place.

## Source framing

ADR-0006 named two endorsed framings (context-window mechanics, token-cost mechanics) without bounding the vocabulary inside them. The rubric was a frame; this ADR puts walls inside that frame. Same goal — specificity grounded in concrete mechanism — narrower allowed surface for getting there.
