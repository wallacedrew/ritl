# Glossary

Canonical definitions for the LLM-research vocabulary and mechanism terms used in agent-side catalog content. Authoritative source for the [`agent-forces-vocabulary`](../tests-small-unit/shared/lib/agent-forces-vocabulary.test.ts) lint allow-list and the tooltip surface in the compare view (planned).

Cross-references: vocabulary rules in [ADR-0009](architecture/0009-strict-canonical-llm-research-terms.md); voice contract in [ADR-0010](architecture/0010-agent-side-voice-and-audience-contract.md); verb and mechanism rules in [ADR-0011](architecture/0011-no-anthropomorphism-and-mechanism-citation.md).

**What is not in this glossary:**

- Catalog entry names (`Long Function`, `Strategy`, `Duplicated Code`). Those are entries in the catalog itself.
- General programming vocabulary (`call site`, `definition`, `branch`, `type-tag`, `discriminator`). Common English / standard programming usage.
- Compound forms derived from glossed terms (`context-window cost`, `context-window usage`). Inferable from the components.

---

## Project-endorsed phrases (ADR-0009)

Three phrases endorsed by the catalog beyond strict canonical LLM-research terminology. Reader-Googleable in their own right.

### context window

The bounded input span the model attends to during one forward pass. Measured in tokens. Modern models range from a few thousand to multiple millions of tokens. Content outside the window is unavailable to the model without explicit retrieval.

### token cost

The per-step or per-operation token expense an agent pays for a read, write, or branch walk. Used as the unit of work for the agent's per-edit budget across the catalog.

### hallucinations

Model-generated content not grounded in the input. The model produces output that sounds plausible but is factually incorrect or unsupported by the prompt, retrieved context, or training data.

---

## Canonical LLM-research vocabulary (ADR-0009 allow-list)

Terms with established meaning in published LLM research or industry documentation. A reader can verify each by Googling the term.

### tokens

The discrete units the model consumes and produces. A token is typically a sub-word, word, or character fragment. Token count determines both the model's input size and the cost of inference.

### attention

The transformer mechanism that weights how strongly each token influences each other token during a forward pass. The mechanism `lost-in-the-middle` effects emerge from.

### lost-in-the-middle

The empirical finding that LLMs recall information near the start and end of a long context more reliably than information positioned in the middle.

> Liu et al., "Lost in the Middle: How Language Models Use Long Contexts" (2023). [arXiv:2307.03172](https://arxiv.org/abs/2307.03172)

### context overflow / overflow

The condition where the input prompt exceeds the model's context window. Behavior on overflow varies by model: some truncate the earliest content, some refuse the request, some silently drop content without notice.

### prompt

The input the model receives. Typically the concatenation of system prompt, user message, prior conversation turns, retrieved context, and tool results.

### completion

The model's output for a given prompt. May be streamed (partial completions over time) or returned as a single finalized response.

### system prompt

The portion of the prompt that establishes the model's role, constraints, and operating instructions. Typically supplied by the application, not the end-user.

### user message

A turn in the conversation authored by the end-user (or by the next layer above the model in agent setups).

### tool result

The output of a tool call returned to the model so it can continue reasoning with the tool's response.

### assistant turn

A turn in the conversation authored by the model.

### in-context learning

The model's ability to acquire a task pattern from examples included in the prompt rather than from fine-tuning. The capability that makes few-shot and zero-shot prompting effective.

### chain-of-thought

A prompting pattern where the model emits explicit intermediate reasoning steps before the final answer. Improves accuracy on multi-step tasks at the cost of more output tokens.

### few-shot

A prompting strategy that includes a small number of input/output examples in the prompt before asking for a new output.

### zero-shot

A prompting strategy that gives no examples — only the task instruction and the new input.

### retrieval

The process of fetching relevant external context (documents, code snippets, embedding-similarity matches) at inference time and injecting it into the prompt.

### RAG

Retrieval-augmented generation. The system pattern of (1) retrieving relevant external context for a query, (2) injecting it into the prompt, (3) generating a response grounded in both the retrieval and the model's parameters.

### reasoning step / reasoning pass

One discrete unit of inference work the model performs. In chain-of-thought, each named intermediate step is one reasoning step. In agentic loops, each tool call + response cycle bounds one reasoning step.

---

## Mechanism vocabulary (ADR-0011 §2)

Currency labels for the LLM-mechanical costs every agent-side force field names.

### context-window load

The total tokens currently held in the context window. As load approaches the window cap, what fits in future reads becomes contested and lost-in-the-middle effects compound.

### retrieval / lookup cost

The token and latency cost of fetching external context (file read, grep, RAG query) and injecting it into the next reasoning step.

### reasoning-step cost

The token and computation cost of one reasoning step. Multi-step tasks pay this cost N times.

### type-checker visibility

Whether a property of the code is visible to static analysis. Visible properties surface as compile-time errors the agent can catch in one read. Invisible properties surface as runtime bugs the agent must discover by execution.

### cache-staleness cost

The cost incurred when embedding indexes, RAG caches, or prior conversation context drift out of date with the underlying code. Stale retrieval produces answers grounded in an obsolete view of the system.

### completeness-check cost

The cost of enumerating N call sites × M branches to prove an edit is complete. Missing one cell ships a silent runtime bug.

### verification-surface cost

The extra files, tests, and code paths a regression must be traced through. Larger verification surfaces inflate the token and reasoning-step budget for any edit.

---

## Project usage

### the agent

In agent-side catalog prose, "the agent" refers to an LLM-powered coding tool acting on the codebase — drafting, editing, reviewing, or verifying code under human-in-the-loop supervision. Per [ADR-0010 §2](architecture/0010-agent-side-voice-and-audience-contract.md), this is the canonical grammatical subject of every agent-side force field.

### reasoning trace

The ordered sequence of reasoning steps the agent emits while completing a task. Used in catalog prose to describe the work the agent does per edit. Distinct from the model's internal computation — a reasoning trace is the observable, transcript-visible sequence of intermediate outputs.

---

## Human-side vocabulary (editorial-only)

Software-engineering terms that may appear in **human-side** catalog prose where the modal reader might not know the precise meaning. Unlike the agent-side glossary, these terms are **editorial-only**: there is no marking lint, and authors mark at discretion.

### cognitive load

The mental effort required to hold and process information in working memory. Higher cognitive load reduces a reader's ability to spot subtle bugs, follow long chains of reasoning, or hold multiple interacting concerns in mind at once.

> Sweller, "Cognitive load during problem solving: Effects on learning" (1988)

### signal-to-noise ratio

The proportion of meaningful content (signal) to irrelevant or distracting content (noise) in a piece of code or prose. High signal-to-noise means most of what the reader sees matters; low signal-to-noise means readers must filter clutter to find the relevant parts.

> Shannon & Weaver, "A Mathematical Theory of Communication" (1948)

### essential complexity

Complexity inherent to the problem being solved, independent of any particular implementation. Brooks argued essential complexity cannot be reduced through technical means — only by changing what the software is being asked to do.

> Brooks, "No Silver Bullet: Essence and Accidents of Software Engineering" (1987)

### accidental complexity

Complexity introduced by the tools, languages, frameworks, or implementation choices used to solve a problem — not by the problem itself. Brooks argued order-of-magnitude productivity gains require attacking accidental complexity, since essential complexity cannot be reduced.

> Brooks, "No Silver Bullet: Essence and Accidents of Software Engineering" (1987)

### cyclomatic complexity

A measurement of how many linearly independent execution paths a function contains, equal to one plus the count of branching points (if/else, loops, switch cases). Higher cyclomatic complexity means more code paths the reader must trace and more test cases to cover the function fully.

> McCabe, "A Complexity Measure" (IEEE Transactions on Software Engineering, 1976)

### leaky abstraction

An abstraction that fails to fully hide its underlying implementation, forcing the user to understand both layers to use it correctly. Spolsky's Law: all non-trivial abstractions, to some degree, are leaky.

> Spolsky, "The Law of Leaky Abstractions" (2002). <https://www.joelonsoftware.com/2002/11/11/the-law-of-leaky-abstractions/>

### blast radius

The scope of impact a change, failure, or fix has on the system. A small blast radius means the change affects one file, one user, or one feature. A large blast radius means it affects many files, users, or features and is harder to validate or roll back.

### invariant

A property of a system or value that must always hold true at well-defined points in execution — typically before and after a method, or throughout a class's lifetime. Invariants encode rules the code depends on for correctness.

### conflation

The act of treating two distinct concepts as one. Conflation hides differences that the system later needs to distinguish, producing bugs when the implicit assumption fails.

### side effect

An observable change a function produces beyond returning a value — writing to a file, sending a request, modifying a global, mutating a parameter. Pure functions have no side effects; impure functions do.

### precondition

A condition that must be true when a function or operation is invoked. Violating a precondition is the caller's bug, not the function's.

### postcondition

A condition the function or operation guarantees will be true after it executes. Postconditions are the contract the function offers in exchange for its preconditions being met.

### separation of concerns

The design principle of dividing a system into parts where each part handles one well-defined responsibility, and parts overlap as little as possible. Dijkstra named this the most important principle of software design.

> Dijkstra, "On the role of scientific thought" (1974)

---

## Maintenance

This file is the single source of truth for the lint allow-list and the planned compare-view tooltip surface. When the catalog needs a new term:

1. Add the term here with a definition and (if applicable) a citation to upstream LLM research.
2. Write a successor ADR that updates the vocabulary allow-list. Do not edit the prior ADRs in place; the convention is supersession via new ADR.
3. Update `agent-forces-vocabulary.test.ts` if the lint surface changes.

Terms in this glossary that turn out to be invented or non-canonical (e.g., a term that fails the "reader can Google it and find the upstream source" test) should be removed via a successor ADR, with non-compliant entries fixed in the same slice.
