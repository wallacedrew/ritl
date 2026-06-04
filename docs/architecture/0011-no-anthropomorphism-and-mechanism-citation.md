# 0011. Agent-side voice: no mentalist verbs, one mechanism per field

- **Status**: accepted (extends ADR-0009 and ADR-0010; supersedes neither)
- **Date**: 2026-06-03
- **Deciders**: project owner, agent

## Context

ADR-0009 bounded the **vocabulary** of agent-side prose: canonical LLM-research terms plus three project-endorsed exceptions, no OS-memory borrowings, no invented compounds.

ADR-0010 (same day) bounded the **shape**: pair-coding developer as modal reader, "the agent" as grammatical subject, present-tense declarative mood, 50-word ceiling, 1–3 sentences, and a per-field role contract.

Two gaps remain that neither ADR catches mechanically, but that surface immediately when authoring new entries:

1. **Mentalist verbs slip past the vocabulary rules.** "The agent wants a single edit site," "the agent prefers a flat call graph," "the agent struggles with deep indirection." Each verb is grammatically valid, individually defensible, and corrosive in aggregate — they restate an LLM as a small human with feelings. The catalog's claim to ground in mechanics weakens every time a mentalist verb stands where an observable operation should. ADR-0010 names the grammatical subject ("the agent") but not the verb set; ADR-0009 bounds the nouns but not the verbs.

2. **Mechanism citation density is uneven across the corpus.** The strongest agent-side fields — Mysterious Name `relief`, Abstract Factory `pressure`, Extract Function `tradeoff` — each name a specific LLM-mechanical currency the agent pays (token cost, context-window load, retrieval lookup, type-checker visibility). The weakest fields drift into abstraction without naming what the agent is actually doing or paying. The role contract from ADR-0010 says _what each field is for_; this ADR says _what each field must name_.

Both gaps are about the same thing at different layers: the verbs and the costs are the load-bearing surface of the mechanics claim. If either layer goes abstract, the prose stops being citable from inside an AI coding standard and starts being editorial.

ADR-0010 named the catalog's voice frame; this ADR finishes filling it in.

## Decision

Both rules apply to every agent-side `symptom / goal / pressure / tradeoff / relief / trap` field. Neither rule supersedes any prior ADR; both extend ADR-0009 and ADR-0010.

### 1. Banned mentalist verbs

Agent-side fields describe observable operations against the codebase or against the agent's own context, never inner states.

**Banned** (verbs that ascribe intent, preference, or emotion):

- `wants`, `wishes`, `desires`, `would like`
- `prefers`, `favours`, `chooses`, `decides`, `picks`
- `tries`, `attempts`, `hopes`, `expects` (as a mental state)
- `struggles`, `dreads`, `fears`, `loves`, `hates`, `enjoys`
- `believes`, `thinks`, `assumes`, `understands`, `knows` (as cognition)
- `feels`, `senses`, `intuits`

**Allowed** (verbs naming observable operations or mechanical states):

- Reading and context: `reads`, `loads`, `holds in context`, `evicts`, `re-loads`, `cannot resolve`, `has no signal that`
- Parsing and reasoning: `parses`, `re-parses`, `re-derives`, `traces`, `chases`, `verifies`, `re-verifies`
- Writing and shipping: `writes`, `edits`, `inlines`, `extracts`, `ships`, `commits`
- Failure modes: `fails the type check`, `blows the context window`, `hallucinates`, `mis-aligns`, `misses`, `drops`, `ships stale`
- Cost: `pays`, `inflates`, `compounds`, `incurs`, `re-pays`

Rule of thumb when an unlisted verb is borderline:

> If the verb implies an inner state the reader cannot observe by reading the code or the prompt, **ban**. If the verb names an action a reviewer could see in a transcript — a file the agent read, a token it wrote, a check that failed — **allow**.

`reasons about` is the canonical borderline term: allowed, because it names a reasoning pass (per ADR-0009's allow-list), and because "reasoning" in LLM-research literature is an observable operation against a defined budget, not an inner state.

### 2. One mechanism per field

Every agent-side force field lands at least one **specific LLM-mechanical currency** the agent pays or saves. A field that does not name a mechanism does not belong in the agent lens and should be promoted back to the human lens or rewritten.

Accepted mechanisms (non-exhaustive; canonical terms per ADR-0009):

- **Context-window load** — what fits, what falls outside the window, lost-in-the-middle position cost.
- **Token cost** — per-read, per-write, per-branch-walk, cost-per-additional-definition-loaded.
- **Retrieval / lookup cost** — extra grep, extra cross-file hops, RAG index invalidation.
- **Reasoning-step cost** — what a single reasoning pass can hold; what spills into chained passes.
- **Type-checker visibility** — what static analysis catches versus what slips past as type-compatible.
- **Cached-association cost** — embedding indexes, commit history, prior conversation context that go stale.
- **Completeness-check cost** — N call sites × M branches the agent must enumerate to prove an edit is complete.
- **Verification-surface cost** — extra files, extra tests, extra paths a regression must be traced through.

A field passes the rule when at least one of those currencies appears as a named noun phrase the field's claim depends on. A field fails when its claim could be rewritten about any tool (human IDE, linter, build system) without losing meaning.

#### Worked example — what the rule catches

> _Bad:_ "The agent gets confused by deep call chains and produces lower-quality refactors."

Fails on both rules: `gets confused` is mentalist; `lower-quality refactors` names no mechanism.

> _Good:_ "Each indirection hop adds a definition the next reasoning step must load; chained edits compound context-window cost and increase the chance of hallucinating a misread."

Both rules pass: every verb is observable (`adds`, `must load`, `compound`, `increase`, `hallucinating`); the mechanism (`context-window cost`, `reasoning step`) is named twice.

### What this ADR deliberately does not change

- The modal reader stays the pair-coding developer (ADR-0010 §1).
- The field-role contract stays as defined — `symptom / goal / relief` remain descriptive, `pressure / trap` carry the stake (ADR-0010 §7).
- The 50-word ceiling, present-tense declarative mood, and 1–3-sentence range all stand (ADR-0010 §3–6).
- The canonical vocabulary allow-list stands (ADR-0009).

## Consequences

**Easier:**

- A new author has a finite verb allow-list and a finite mechanism allow-list to work from, alongside the existing ADR-0009 noun allow-list. The agent lens now has three intersecting allow-lists, all small, all canonical.
- The "is this field doing its job" question collapses to two checks: does it name an observable verb, does it name a mechanism. Both are mechanical — a future lint can enforce them.
- The strongest existing entries (Mysterious Name, Abstract Factory, Extract Function, Builder) become explicit exemplars rather than implicit ones; their shape now matches a rule rather than a vibe.

**Harder / new constraints:**

- Drafting becomes slower. Composing a `tradeoff` that names a mechanism in 25 words is more compression work than writing prose at field length.
- Some legacy entries will fail the rules at next-touch. The audit slice from ADR-0006's follow-up list (not yet executed) gains two more mechanical checks to run.
- The verb ban will read as overstrict on borderline cases. The rule-of-thumb test (is the operation observable in a transcript) is the escape hatch; authors should default to banning when unsure, since the canonical allow-list usually has a substitute.

**Follow-up work:**

- **Lint test for banned mentalist verbs.** Mirror `agent-forces-pov.test.ts` and `agent-forces-vocabulary.test.ts` — a `agent-forces-mentalist-verbs.test.ts` that fails the suite on any banned verb in any agent-side field. Specifying the regex list is the work; the test scaffold already exists.
- **Lint or audit for mechanism citation.** Mechanical detection is harder than a regex (a mechanism is a noun phrase, not a token), so this may stay a manual audit checklist rather than a test. The mechanism allow-list above is the source for that checklist.
- **Examples sidecar update.** When `docs/voice-examples.md` lands (per ADR-0010's follow-up list), include the worked-example pair above as the canonical "before/after" for this ADR.

## Source framing

ADR-0009 said _which nouns are allowed_. ADR-0010 said _who the reader is, who the subject is, how long the prose runs, and what each field is for_. ADR-0011 says _which verbs are allowed and what every field must name_. Three ADRs, one direction: the most-read content on the site earns its claim to ground in mechanics by being mechanically bounded at every layer.
