/**
 * Typed glossary of LLM-research vocabulary and mechanism terms used in
 * agent-side catalog content. Mirrors `docs/glossary.md` — that file is
 * the human-readable reference; this file is the data source consumed by
 * the `<Term>` component (slice 2) and any future tooling.
 *
 * Keep this file in sync with `docs/glossary.md` by hand. If drift
 * becomes a maintenance problem, a future slice can codegen one from
 * the other.
 *
 * Vocabulary rules: ADR-0009 (canonical terms allow-list) and ADR-0011
 * (mechanism vocabulary). Voice contract: ADR-0010.
 */

export type GlossaryTermKey =
  // Three project-endorsed phrases (ADR-0009)
  | "context window"
  | "token cost"
  | "hallucinations"
  // Canonical LLM-research vocabulary
  | "tokens"
  | "attention"
  | "lost-in-the-middle"
  | "context overflow"
  | "prompt"
  | "completion"
  | "system prompt"
  | "user message"
  | "tool result"
  | "assistant turn"
  | "in-context learning"
  | "chain-of-thought"
  | "few-shot"
  | "zero-shot"
  | "retrieval"
  | "RAG"
  | "reasoning step"
  // Mechanism vocabulary (ADR-0011 §2)
  | "context-window load"
  | "retrieval cost"
  | "reasoning-step cost"
  | "type-checker visibility"
  | "cache-staleness cost"
  | "completeness-check cost"
  | "verification-surface cost"
  // Project usage
  | "the agent"
  | "reasoning trace"
  // Human-side software-engineering vocabulary (editorial-only, no lint)
  | "cognitive load"
  | "leaky abstraction"
  | "blast radius"
  | "invariant"
  | "idempotent"
  | "conflation"
  | "side effect"
  | "precondition"
  | "postcondition"
  | "separation of concerns";

export interface GlossaryCitation {
  text: string;
  url?: string;
}

export interface GlossaryEntry {
  definition: string;
  citation?: GlossaryCitation;
}

export const GLOSSARY: Record<GlossaryTermKey, GlossaryEntry> = {
  // --- Project-endorsed phrases ---

  "context window": {
    definition:
      "The bounded input span the model attends to during one forward pass. Measured in tokens. Content outside the window is unavailable to the model without explicit retrieval.",
  },

  "token cost": {
    definition:
      "The per-step or per-operation token expense an agent pays for a read, write, or branch walk. Used as the unit of work for the agent's per-edit budget across the catalog.",
  },

  hallucinations: {
    definition:
      "Model-generated content not grounded in the input. The model produces output that sounds plausible but is factually incorrect or unsupported by the prompt, retrieved context, or training data.",
  },

  // --- Canonical LLM-research vocabulary ---

  tokens: {
    definition:
      "The discrete units the model consumes and produces. Typically a sub-word, word, or character fragment. Token count determines both input size and inference cost.",
  },

  attention: {
    definition:
      "The transformer mechanism that weights how strongly each token influences each other token during a forward pass. The mechanism lost-in-the-middle effects emerge from.",
  },

  "lost-in-the-middle": {
    definition:
      "The empirical finding that LLMs recall information near the start and end of a long context more reliably than information positioned in the middle.",
    citation: {
      text: 'Liu et al., "Lost in the Middle: How Language Models Use Long Contexts" (2023)',
      url: "https://arxiv.org/abs/2307.03172",
    },
  },

  "context overflow": {
    definition:
      "The condition where the input prompt exceeds the model's context window. Behavior on overflow varies by model: some truncate the earliest content, some refuse the request, some silently drop content without notice.",
  },

  prompt: {
    definition:
      "The input the model receives. Typically the concatenation of system prompt, user message, prior conversation turns, retrieved context, and tool results.",
  },

  completion: {
    definition:
      "The model's output for a given prompt. May be streamed (partial completions over time) or returned as a single finalized response.",
  },

  "system prompt": {
    definition:
      "The portion of the prompt that establishes the model's role, constraints, and operating instructions. Typically supplied by the application, not the end-user.",
  },

  "user message": {
    definition:
      "A turn in the conversation authored by the end-user (or by the next layer above the model in agent setups).",
  },

  "tool result": {
    definition:
      "The output of a tool call returned to the model so it can continue reasoning with the tool's response.",
  },

  "assistant turn": {
    definition: "A turn in the conversation authored by the model.",
  },

  "in-context learning": {
    definition:
      "The model's ability to acquire a task pattern from examples included in the prompt rather than from fine-tuning. The capability that makes few-shot and zero-shot prompting effective.",
  },

  "chain-of-thought": {
    definition:
      "A prompting pattern where the model emits explicit intermediate reasoning steps before the final answer. Improves accuracy on multi-step tasks at the cost of more output tokens.",
  },

  "few-shot": {
    definition:
      "A prompting strategy that includes a small number of input/output examples in the prompt before asking for a new output.",
  },

  "zero-shot": {
    definition:
      "A prompting strategy that gives no examples — only the task instruction and the new input.",
  },

  retrieval: {
    definition:
      "The process of fetching relevant external context (documents, code snippets, embedding-similarity matches) at inference time and injecting it into the prompt.",
  },

  RAG: {
    definition:
      "Retrieval-augmented generation. The system pattern of (1) retrieving relevant external context for a query, (2) injecting it into the prompt, (3) generating a response grounded in both the retrieval and the model's parameters.",
  },

  "reasoning step": {
    definition:
      "One discrete unit of inference work the model performs. In chain-of-thought, each named intermediate step is one reasoning step. In agentic loops, each tool call + response cycle bounds one reasoning step.",
  },

  // --- Mechanism vocabulary (ADR-0011 §2) ---

  "context-window load": {
    definition:
      "The total tokens currently held in the context window. As load approaches the window cap, what fits in future reads becomes contested and lost-in-the-middle effects compound.",
  },

  "retrieval cost": {
    definition:
      "The token and latency cost of fetching external context (file read, grep, RAG query) and injecting it into the next reasoning step.",
  },

  "reasoning-step cost": {
    definition:
      "The token and computation cost of one reasoning step. Multi-step tasks pay this cost N times.",
  },

  "type-checker visibility": {
    definition:
      "Whether a property of the code is visible to static analysis. Visible properties surface as compile-time errors the agent can catch in one read. Invisible properties surface as runtime bugs the agent must discover by execution.",
  },

  "cache-staleness cost": {
    definition:
      "The cost incurred when embedding indexes, RAG caches, or prior conversation context drift out of date with the underlying code. Stale retrieval produces answers grounded in an obsolete view of the system.",
  },

  "completeness-check cost": {
    definition:
      "The cost of enumerating N call sites × M branches to prove an edit is complete. Missing one cell ships a silent runtime bug.",
  },

  "verification-surface cost": {
    definition:
      "The extra files, tests, and code paths a regression must be traced through. Larger verification surfaces inflate the token and reasoning-step budget for any edit.",
  },

  // --- Project usage ---

  "the agent": {
    definition:
      "In agent-side catalog prose, an LLM-powered coding tool acting on the codebase — drafting, editing, reviewing, or verifying code under human-in-the-loop supervision. Per ADR-0010 §2, this is the canonical grammatical subject of every agent-side force field.",
  },

  "reasoning trace": {
    definition:
      "The ordered sequence of reasoning steps the agent emits while completing a task. The observable, transcript-visible sequence of intermediate outputs — distinct from the model's internal computation.",
  },

  // --- Human-side software-engineering vocabulary (editorial-only) ---

  "cognitive load": {
    definition:
      "The mental effort required to hold and process information in working memory. Higher cognitive load reduces a reader's ability to spot subtle bugs, follow long chains of reasoning, or hold multiple interacting concerns in mind at once.",
    citation: {
      text: 'Sweller, "Cognitive load during problem solving: Effects on learning" (1988)',
    },
  },

  "leaky abstraction": {
    definition:
      "An abstraction that fails to fully hide its underlying implementation, forcing the user to understand both layers to use it correctly. Spolsky's Law: all non-trivial abstractions, to some degree, are leaky.",
    citation: {
      text: 'Spolsky, "The Law of Leaky Abstractions" (2002)',
      url: "https://www.joelonsoftware.com/2002/11/11/the-law-of-leaky-abstractions/",
    },
  },

  "blast radius": {
    definition:
      "The scope of impact a change, failure, or fix has on the system. A small blast radius means the change affects one file, one user, or one feature. A large blast radius means it affects many files, users, or features and is harder to validate or roll back.",
  },

  invariant: {
    definition:
      "A property of a system or value that must always hold true at well-defined points in execution — typically before and after a method, or throughout a class's lifetime. Invariants encode rules the code depends on for correctness.",
  },

  idempotent: {
    definition:
      "A property of an operation where applying it multiple times produces the same result as applying it once. Idempotent operations are safe to retry without producing duplicate effects.",
  },

  conflation: {
    definition:
      "The act of treating two distinct concepts as one. Conflation hides differences that the system later needs to distinguish, producing bugs when the implicit assumption fails.",
  },

  "side effect": {
    definition:
      "An observable change a function produces beyond returning a value — writing to a file, sending a request, modifying a global, mutating a parameter. Pure functions have no side effects; impure functions do.",
  },

  precondition: {
    definition:
      "A condition that must be true when a function or operation is invoked. Violating a precondition is the caller's bug, not the function's.",
  },

  postcondition: {
    definition:
      "A condition the function or operation guarantees will be true after it executes. Postconditions are the contract the function offers in exchange for its preconditions being met.",
  },

  "separation of concerns": {
    definition:
      "The design principle of dividing a system into parts where each part handles one well-defined responsibility, and parts overlap as little as possible. Dijkstra named this the most important principle of software design.",
    citation: {
      text: 'Dijkstra, "On the role of scientific thought" (1974)',
    },
  },
};

export function lookupTerm(term: GlossaryTermKey): GlossaryEntry {
  return GLOSSARY[term];
}

export function isKnownTerm(term: string): term is GlossaryTermKey {
  return Object.prototype.hasOwnProperty.call(GLOSSARY, term);
}
