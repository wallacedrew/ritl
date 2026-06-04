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
  // === Cost to the human ===
  | "cognitive load"
  | "mental effort"
  | "comprehension cost"
  | "verification cost"
  | "debugging cost"
  | "maintenance cost"
  | "enhancement cost"
  | "search cost"
  | "inference-step cost"
  | "knowledge-decay cost"
  // === Cross-cutting design principles ===
  | "signal-to-noise ratio"
  | "essential complexity"
  | "accidental complexity"
  | "cyclomatic complexity"
  | "leaky abstraction"
  | "blast radius"
  | "invariant"
  | "side effect"
  | "precondition"
  | "postcondition"
  | "separation of concerns"
  | "type-checker visibility"
  // === Cost to the agent ===
  // Project-endorsed phrases (ADR-0009)
  | "context window"
  | "token cost"
  // Canonical LLM-research vocabulary
  | "tokens"
  | "chain-of-thought"
  | "retrieval"
  | "RAG"
  | "reasoning step"
  // Mechanism vocabulary (ADR-0011 §2)
  | "context-window load"
  | "retrieval cost"
  | "reasoning-step cost"
  | "cache-staleness cost"
  | "completeness-check cost"
  | "verification-surface cost"
  // Project usage
  | "the agent"
  // === Failure modes ===
  // Human failure modes
  | "confabulation"
  | "inattentional blindness"
  | "cognitive overload"
  // Agent failure modes
  | "hallucinations"
  | "lost-in-the-middle"
  | "context overflow";

export interface GlossaryCitation {
  text: string;
  url?: string;
}

export interface GlossaryEntry {
  definition: string;
  citation?: GlossaryCitation;
}

export const GLOSSARY: Record<GlossaryTermKey, GlossaryEntry> = {
  // ============================================================
  // Cost to the human
  // ============================================================

  "cognitive load": {
    definition:
      "The mental effort required to hold and process information in working memory. Higher cognitive load reduces a reader's ability to spot subtle bugs, follow long chains of reasoning, or hold multiple interacting concerns in mind at once.",
    citation: {
      text: 'Sweller, "Cognitive load during problem solving: Effects on learning" (1988)',
    },
  },

  "mental effort": {
    definition:
      "The unit of cognitive resource a reader spends per operation — reading a line of code, evaluating a condition, holding a state in working memory. Kahneman established mental effort as the foundational accounting unit for human cognitive cost. Maps to the agent's token cost: both name what each actor pays per operation.",
    citation: {
      text: 'Kahneman, "Attention and Effort" (1973)',
    },
  },

  "comprehension cost": {
    definition:
      "The mental effort and time a reader pays to understand a piece of code well enough to reason about its behavior. Drives every downstream cost — verification, debugging, editing, onboarding. Reduced by clarifying names, lower cyclomatic complexity, smaller blast radius, and stronger separation of concerns.",
  },

  "verification cost": {
    definition:
      "The mental effort and time required to confirm a change is correct — through review, testing, type-checking, or manual exercise. Scales with the change's blast radius, the cyclomatic complexity of the touched code, and the cognitive load of loading the surrounding context.",
  },

  "debugging cost": {
    definition:
      "The mental effort and time required to diagnose a bug — trace from observed symptom to root cause. Scales with the breadth of side effects the system permits, the number of invariants that could have been violated, and the cognitive load of modeling the system's state across time.",
  },

  "maintenance cost": {
    definition:
      "The ongoing mental effort and time required to keep code working as the system around it evolves — bug fixes, dependency upgrades, deprecations, behavioral drift in collaborators. Scales with the breadth of side effects, the strength of postconditions, the cyclomatic complexity of branches that must be re-verified on every change, and the cognitive load of recovering the original author's intent.",
  },

  "enhancement cost": {
    definition:
      "The mental effort and time required to add a new capability to existing code without breaking what's there. Scales with the blast radius of the addition, how cleanly the existing separation of concerns lets the new behavior plug in, and the cyclomatic complexity of paths the new behavior must interleave with. The agent equivalent is a composite of retrieval cost, reasoning-step cost, and verification-surface cost — no single agent-side term captures it.",
  },

  "search cost": {
    definition:
      "The mental effort and time a developer pays to find external information — reading docs, grepping the codebase, asking a colleague, searching the web. Stigler framed it as the economic cost of information acquisition; in code work, it scales with how cleanly the existing separation of concerns lets the relevant context be located. Maps to the agent's retrieval cost.",
    citation: {
      text: 'Stigler, "The Economics of Information" (Journal of Political Economy, 1961)',
    },
  },

  "inference-step cost": {
    definition:
      "The mental effort and time a developer pays per step of reasoning — evaluating a branch, considering an edge case, applying a rule. Multi-step problems pay this cost N times. Maps to the agent's reasoning-step cost.",
  },

  "knowledge-decay cost": {
    definition:
      "The mental effort and time a developer pays to recover knowledge that has decayed since they last touched the code — relearning subsystems, reconstructing the original author's reasoning, rebuilding mental models that have drifted. Ebbinghaus's forgetting curve describes the underlying mechanism: retention drops sharply without rehearsal. Maps to the agent's cache-staleness cost.",
    citation: {
      text: 'Ebbinghaus, "Über das Gedächtnis: Untersuchungen zur experimentellen Psychologie" (1885)',
    },
  },

  // ============================================================
  // Cross-cutting design principles
  // ============================================================

  "signal-to-noise ratio": {
    definition:
      "The proportion of meaningful content (signal) to irrelevant or distracting content (noise) in a piece of code or prose. High signal-to-noise means most of what the reader sees matters; low signal-to-noise means readers must filter clutter to find the relevant parts.",
    citation: {
      text: 'Shannon & Weaver, "A Mathematical Theory of Communication" (1948)',
    },
  },

  "essential complexity": {
    definition:
      "Complexity inherent to the problem being solved, independent of any particular implementation. Brooks argued essential complexity cannot be reduced through technical means — only by changing what the software is being asked to do.",
    citation: {
      text: 'Brooks, "No Silver Bullet: Essence and Accidents of Software Engineering" (1987)',
    },
  },

  "accidental complexity": {
    definition:
      "Complexity introduced by the tools, languages, frameworks, or implementation choices used to solve a problem — not by the problem itself. Brooks argued order-of-magnitude productivity gains require attacking accidental complexity, since essential complexity cannot be reduced.",
    citation: {
      text: 'Brooks, "No Silver Bullet: Essence and Accidents of Software Engineering" (1987)',
    },
  },

  "cyclomatic complexity": {
    definition:
      "A measurement of how many linearly independent execution paths a function contains, equal to one plus the count of branching points (if/else, loops, switch cases). Higher cyclomatic complexity means more code paths the reader must trace and more test cases to cover the function fully.",
    citation: {
      text: 'McCabe, "A Complexity Measure" (IEEE Transactions on Software Engineering, 1976)',
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
      "A property of a system or value that must always hold true at well-defined points in execution. When an invariant breaks, every dependent read is suspect — debugging cost scales with the number of writers and readers that touch the state.",
  },

  "side effect": {
    definition:
      "An observable change a function produces beyond returning a value — writing to a file, sending a request, modifying a global, mutating a parameter. Side effects raise comprehension and debugging cost: every reader must trace each side effect's downstream consequences. Pure functions have none; impure functions do.",
  },

  precondition: {
    definition:
      "A condition that must be true when a function is invoked. The caller pays the precondition-check cost; the function's body relies on the condition without re-verifying. Violating a precondition is the caller's bug.",
  },

  postcondition: {
    definition:
      "A condition the function guarantees will be true after it executes. Reduces caller-side cost — downstream logic can be composed on the guarantee without re-verifying. Postconditions and preconditions together form the function's contract.",
  },

  "separation of concerns": {
    definition:
      "The design principle of dividing a system into parts where each handles one well-defined responsibility. Reduces every downstream cost — comprehension, verification, debugging, edit — by ensuring any single change touches one part, not many. Dijkstra called it the most important principle of software design.",
    citation: {
      text: 'Dijkstra, "On the role of scientific thought" (1974)',
    },
  },

  "type-checker visibility": {
    definition:
      "Whether a property of the code is visible to static analysis. Visible properties surface as compile-time errors any reader — human reviewer or agent — can catch in one read; invisible properties surface as runtime bugs that demand execution to discover. Drives verification cost on the human side and completeness-check cost on the agent side from the same structural property.",
  },

  // ============================================================
  // Cost to the agent
  // ============================================================

  // --- Project-endorsed phrases ---

  "context window": {
    definition:
      "The bounded input span the model attends to during one forward pass. Measured in tokens. Content outside the window is unavailable to the model without explicit retrieval.",
  },

  "token cost": {
    definition:
      "The per-step or per-operation token expense an agent pays for a read, write, or branch walk. Used as the unit of work for the agent's per-edit budget across the catalog.",
  },

  // --- Canonical LLM-research vocabulary ---

  tokens: {
    definition:
      "The discrete units the model consumes and produces. Typically a sub-word, word, or character fragment. Token count determines both input size and inference cost.",
  },

  "chain-of-thought": {
    definition:
      "A prompting pattern where the model emits explicit intermediate reasoning steps before the final answer. Improves accuracy on multi-step tasks at the cost of more output tokens.",
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

  // ============================================================
  // Failure modes
  // ============================================================

  // --- Human failure modes ---

  confabulation: {
    definition:
      "The act of filling gaps in memory with plausible but factually incorrect content, presented with conviction. Developers confabulate when they write code from a stale or incomplete mental model — the resulting code looks reasonable but breaks against the system's actual behavior. Maps to the agent's hallucinations: both ship ungrounded output as if it were grounded.",
    citation: {
      text: 'Schacter, "Memory distortion: History and current status" (Annual Review of Psychology, 1995)',
    },
  },

  "inattentional blindness": {
    definition:
      "The failure to notice an obvious feature, change, or event in the visual field because attention is directed elsewhere. In code review, inattentional blindness explains why reviewers miss bugs in code they are carefully reading — they are focused on the change and not seeing the surrounding consequences. Maps to the agent's lost-in-the-middle: both are attention-allocation failures, not memory failures.",
    citation: {
      text: 'Mack & Rock, "Inattentional Blindness" (MIT Press, 1998)',
    },
  },

  "cognitive overload": {
    definition:
      "The failure mode when total cognitive load exceeds the reader's working memory capacity — chains of reasoning break down, attention fragments, errors surface in spots the reader was carefully covering. Maps to the agent's context overflow: both name capacity exceeded, not capacity utilized.",
    citation: {
      text: 'Sweller, "Cognitive load during problem solving: Effects on learning" (1988) — overload framing carried forward in subsequent cognitive load theory work',
    },
  },

  // --- Agent failure modes ---

  hallucinations: {
    definition:
      "Model-generated content not grounded in the input. The model produces output that sounds plausible but is factually incorrect or unsupported by the prompt, retrieved context, or training data. Maps to the human's confabulation.",
  },

  "lost-in-the-middle": {
    definition:
      "The empirical finding that LLMs recall information near the start and end of a long context more reliably than information positioned in the middle. Maps to the human's inattentional blindness: attention allocation, not memory capacity, is the bite.",
    citation: {
      text: 'Liu et al., "Lost in the Middle: How Language Models Use Long Contexts" (2023)',
      url: "https://arxiv.org/abs/2307.03172",
    },
  },

  "context overflow": {
    definition:
      "The condition where the input prompt exceeds the model's context window. Behavior on overflow varies by model: some truncate the earliest content, some refuse the request, some silently drop content without notice.",
  },
};

export function lookupTerm(term: GlossaryTermKey): GlossaryEntry {
  return GLOSSARY[term];
}

export function isKnownTerm(term: string): term is GlossaryTermKey {
  return Object.prototype.hasOwnProperty.call(GLOSSARY, term);
}
