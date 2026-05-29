# RITL skills index

Index of all 141 skills in the catalog — 1 workflow orchestrator, 66 Fowler refactorings, 24 Fowler smells, 27 Kerievsky composite refactorings, and 23 GoF design patterns. Each entry lists the skill's slug, its routing description, and the URL of the full SKILL.md to fetch when the description matches what you're working on.

## When to use this index

For coding agents with file or URL fetch (Cursor, Aider, Codex, Cline, Continue, custom agents). Read this index once, fetch only the matching skills on demand, work the cycle, repeat.

For Claude Code users, install the plugin instead — auto-loading via description match is strictly better than this index plus manual fetch:

    /plugin marketplace add wallacedrew/ritl
    /plugin install refactor@ritl

For agents that cannot fetch URLs at all, paste `refactoring-discipline.md` into your AGENTS.md or CLAUDE.md — it's a ~30-line behavior shape that does not depend on catalog lookup.

Do not concatenate every linked SKILL.md into one context. The whole point of this index is on-demand retrieval; loading the full 141 skills at once is the anti-pattern this catalog teaches against.


## Workflow

- **workflow** — Run the full refactoring cycle — sense the smell, locate its source, lay down safety-net tests, then apply the matching refactorings via the per-entity skills in this plugin. Trigger when the user says "refactoring", "ritl", "smell", "code-smell", "refactor this", "fix this smell", "clean this up", "this looks off", "what's wrong with this", or describes code that feels tangled, duplicated, mysteriously named, or otherwise unhealthy. Use the 24 per-entity smell skills (long-function, mysterious-name, duplicated-code, etc.) to identify which smell applies, then read that smell skill's apply-refactorings list to pick the refactoring skill (extract-function, inline-function, etc.) to follow next. Keep tests green throughout; revert if anything goes red.
  https://refactoringintheloop.com/snippets/workflow.md

## Refactorings (Fowler 2e)

### Basic Refactorings

- **rename-variable** — Apply Rename Variable when you see Mysterious Name. Variable names carry enough disambiguating information that the agent can reason about each symbol without a lookup hop.
  https://refactoringintheloop.com/snippets/refactorings/rename-variable.md

- **rename-field** — Apply Rename Field when you see Mysterious Name. Field names carry the domain term; read or write sites resolve to one token of name without loading the class definition for context recovery.
  https://refactoringintheloop.com/snippets/refactorings/rename-field.md

- **remove-dead-code** — Apply Remove Dead Code when you see Speculative Generality, Comments. Every definition the agent encounters is reachable; reasoning about behavior doesn't have to consider phantom paths.
  https://refactoringintheloop.com/snippets/refactorings/remove-dead-code.md

- **replace-magic-literal** — Apply Replace Magic Literal when you see Mysterious Name, Comments. Each domain value has a named constant at one declaration site; every usage resolves through the constant's name, and the value's meaning loads with the name instead of being inferred from context at every literal occurrence.
  https://refactoringintheloop.com/snippets/refactorings/replace-magic-literal.md

### Composing Methods

- **extract-function** — Apply Extract Function when you see Long Function, Duplicated Code, Comments. Each function is a verifiable unit small enough that the agent can reason about its full behavior in a single reasoning step.
  https://refactoringintheloop.com/snippets/refactorings/extract-function.md

- **inline-function** — Apply Inline Function when you see Lazy Element, Speculative Generality. Trivial wrappers disappear from the agent's working context; call sites read as exactly what's happening.
  https://refactoringintheloop.com/snippets/refactorings/inline-function.md

- **extract-variable** — Apply Extract Variable when you see Mysterious Name, Comments. Intermediate values carry domain names; subsequent reads resolve to one token of name instead of re-evaluating the expression at every use.
  https://refactoringintheloop.com/snippets/refactorings/extract-variable.md

- **inline-variable** — Apply Inline Variable when you see Lazy Element. Expressions sit at their use sites without an intervening binding; the agent reads the expression once at the use site instead of reading the variable name plus the binding's definition.
  https://refactoringintheloop.com/snippets/refactorings/inline-variable.md

- **combine-functions-into-class** — Apply Combine Functions into Class when you see Data Clumps, Primitive Obsession. Operations live with the data they act on; the agent loads one class to reason about both shape and behavior.
  https://refactoringintheloop.com/snippets/refactorings/combine-functions-into-class.md

- **combine-functions-into-transform** — Apply Combine Functions into Transform when you see Data Clumps, Mutable Data. One transform produces the enriched record from the input; the agent reads one input-to-shape contract and consumers read named output fields without simulating the derivation.
  https://refactoringintheloop.com/snippets/refactorings/combine-functions-into-transform.md

- **split-phase** — Apply Split Phase when you see Divergent Change, Long Function. Each phase reads and writes its own well-defined inputs and outputs; the agent reasons about phases independently with the intermediate shape as the contract.
  https://refactoringintheloop.com/snippets/refactorings/split-phase.md

- **slide-statements** — Apply Slide Statements when you see Long Function, Comments. Related statements sit next to each other; the agent reads the function as a sequence of cohesive blocks ready for extraction.
  https://refactoringintheloop.com/snippets/refactorings/slide-statements.md

- **split-loop** — Apply Split Loop when you see Long Function, Loops. Each loop does one thing; the agent reasons about one concern per loop and can replace each loop independently with a pipeline.
  https://refactoringintheloop.com/snippets/refactorings/split-loop.md

- **replace-loop-with-pipeline** — Apply Replace Loop with Pipeline when you see Loops. Transformations read as named operation sequences (filter, map, reduce); the agent recognizes the shape without simulating the loop.
  https://refactoringintheloop.com/snippets/refactorings/replace-loop-with-pipeline.md

- **replace-derived-variable-with-query** — Apply Replace Derived Variable with Query when you see Mutable Data. Derived values are computed on demand; the agent reasons about state by reading source fields and trusting derivations.
  https://refactoringintheloop.com/snippets/refactorings/replace-derived-variable-with-query.md

- **split-variable** — Apply Split Variable when you see Mysterious Name, Mutable Data. Each variable holds one role with a stable name; the agent reasons about names without tracking reassignment timeline.
  https://refactoringintheloop.com/snippets/refactorings/split-variable.md

- **move-statements-into-function** — Apply Move Statements into Function when you see Duplicated Code. The function owns its setup and follow-up; the agent verifies behavior at the function definition instead of auditing every call site.
  https://refactoringintheloop.com/snippets/refactorings/move-statements-into-function.md

- **move-statements-to-callers** — Apply Move Statements to Callers when you see Divergent Change. The function's body addresses one responsibility; callers express their differences at the call site.
  https://refactoringintheloop.com/snippets/refactorings/move-statements-to-callers.md

- **replace-inline-code-with-function-call** — Apply Replace Inline Code with Function Call when you see Duplicated Code. One canonical implementation the agent loads once and references everywhere; the name labels the intent at every call site.
  https://refactoringintheloop.com/snippets/refactorings/replace-inline-code-with-function-call.md

- **replace-temp-with-query** — Apply Replace Temp with Query when you see Long Function, Mutable Data. Computations become named queries the agent can reference by name from anywhere; functions decompose without dragging the temp's lifetime.
  https://refactoringintheloop.com/snippets/refactorings/replace-temp-with-query.md

- **replace-function-with-command** — Apply Replace Function with Command when you see Long Function. Each sub-step becomes a named method on the command object; sub-step methods share state through fields the agent reads from one class file, and tests target one method at a time without simulating the full function body.
  https://refactoringintheloop.com/snippets/refactorings/replace-function-with-command.md

- **replace-command-with-function** — Apply Replace Command with Function when you see Speculative Generality, Lazy Element. The command collapses to a plain function; the agent's call sites become direct invocations.
  https://refactoringintheloop.com/snippets/refactorings/replace-command-with-function.md

- **return-modified-value** — Apply Return Modified Value when you see Mutable Data. The function returns the modified value; the agent reads the signature and knows the function is a transformation, not a mutator.
  https://refactoringintheloop.com/snippets/refactorings/return-modified-value.md

- **substitute-algorithm** — Apply Substitute Algorithm when you see Long Function, Loops. The clearer algorithm replaces the bespoke; the agent reasons about a recognized pattern instead of reverse-engineering the original.
  https://refactoringintheloop.com/snippets/refactorings/substitute-algorithm.md

### Encapsulation

- **encapsulate-variable** — Apply Encapsulate Variable when you see Global Data, Mutable Data. All access goes through a small named function the agent can grep for, audit, and instrument as a single closed surface.
  https://refactoringintheloop.com/snippets/refactorings/encapsulate-variable.md

- **hide-delegate** — Apply Hide Delegate when you see Message Chains. Callers reach for the wrapper's methods directly; the agent reads one type signature instead of walking the delegate chain to predict what the call returns.
  https://refactoringintheloop.com/snippets/refactorings/hide-delegate.md

- **remove-middle-man** — Apply Remove Middle Man when you see Middle Man. Callers talk to the real object directly; the agent's call traces are shorter and the implementation's location is obvious.
  https://refactoringintheloop.com/snippets/refactorings/remove-middle-man.md

- **encapsulate-collection** — Apply Encapsulate Collection when you see Mutable Data, Insider Trading. The owner exposes mutation methods (add, remove, replace); reads return snapshots or iterators; the agent reasons about collection invariants on the owner alone.
  https://refactoringintheloop.com/snippets/refactorings/encapsulate-collection.md

- **encapsulate-record** — Apply Encapsulate Record when you see Data Class, Primitive Obsession. The record is a class with accessors; the agent reasons about its shape, invariants, and behavior in one definition.
  https://refactoringintheloop.com/snippets/refactorings/encapsulate-record.md

- **remove-setting-method** — Apply Remove Setting Method when you see Mutable Data, Data Class. Construction is the only path to setting these fields; the agent reasons about the object as immutable-after-construction.
  https://refactoringintheloop.com/snippets/refactorings/remove-setting-method.md

### Moving Features

- **move-function** — Apply Move Function when you see Feature Envy, Shotgun Surgery, Insider Trading, Divergent Change. Each function lives where its data lives; the agent loads one class to reason about one behavior.
  https://refactoringintheloop.com/snippets/refactorings/move-function.md

- **move-field** — Apply Move Field when you see Shotgun Surgery, Insider Trading. Each field lives in the class that determines its value; reading the field and reading the data that determines it happen in the same class file.
  https://refactoringintheloop.com/snippets/refactorings/move-field.md

- **extract-class** — Apply Extract Class when you see Data Clumps, Temporary Field, Large Class, Primitive Obsession. Each class has one purpose; the agent loads a small focused file to reason about any single concept.
  https://refactoringintheloop.com/snippets/refactorings/extract-class.md

- **inline-class** — Apply Inline Class when you see Lazy Element, Speculative Generality. The class folds into its primary collaborator; the agent loads one file for what was two.
  https://refactoringintheloop.com/snippets/refactorings/inline-class.md

### Organizing Data

- **replace-primitive-with-object** — Apply Replace Primitive with Object when you see Primitive Obsession. Each domain concept has its own typed wrapper; the agent's type checker catches wrong-primitive-in-wrong-slot before runtime.
  https://refactoringintheloop.com/snippets/refactorings/replace-primitive-with-object.md

- **change-reference-to-value** — Apply Change Reference to Value when you see Mutable Data. The object is immutable + equal-by-content; the agent reasons about value semantics without modeling write timing.
  https://refactoringintheloop.com/snippets/refactorings/change-reference-to-value.md

- **change-value-to-reference** — Apply Change Value to Reference when you see Duplicated Code. The entity exists once; the agent reasons about one canonical object referenced everywhere.
  https://refactoringintheloop.com/snippets/refactorings/change-value-to-reference.md

### Simplifying Conditional Logic

- **decompose-conditional** — Apply Decompose Conditional when you see Long Function, Comments. Conditions read as named domain decisions; the agent reasons about isSummer(date) instead of re-deriving the month range.
  https://refactoringintheloop.com/snippets/refactorings/decompose-conditional.md

- **consolidate-conditional-expression** — Apply Consolidate Conditional Expression when you see Duplicated Code. The predicate lives at one named function the agent reads once; edits to the rule land at the function definition and propagate to every caller through reference.
  https://refactoringintheloop.com/snippets/refactorings/consolidate-conditional-expression.md

- **replace-nested-conditional-with-guard-clauses** — Apply Replace Nested Conditional with Guard Clauses when you see Long Function, Comments. Edge cases exit at the top of the function; the happy path runs at the function's base indent level, and adding a precondition is one new guard at the top instead of a rewrite of the nested branches.
  https://refactoringintheloop.com/snippets/refactorings/replace-nested-conditional-with-guard-clauses.md

- **replace-conditional-with-polymorphism** — Apply Replace Conditional with Polymorphism when you see Repeated Switches, Primitive Obsession. Each case is a class implementing a shared interface; the agent adds a new case by adding one class, and the type system tells it what's still missing.
  https://refactoringintheloop.com/snippets/refactorings/replace-conditional-with-polymorphism.md

- **introduce-special-case** — Apply Introduce Special Case when you see Repeated Switches, Comments. The special case responds to the same interface as the real case; the agent reasons without branching at every call site.
  https://refactoringintheloop.com/snippets/refactorings/introduce-special-case.md

- **replace-control-flag-with-break** — Apply Replace Control Flag with Break when you see Loops, Long Function. The exit happens at the moment it's decided via break/return/continue; the agent reads the loop's termination as a direct statement.
  https://refactoringintheloop.com/snippets/refactorings/replace-control-flag-with-break.md

### Refactoring APIs

- **change-function-declaration** — Apply Change Function Declaration when you see Mysterious Name, Long Parameter List, Alternative Classes with Different Interfaces. Names and signatures express what the function does; the agent reasons about call sites from the signature alone.
  https://refactoringintheloop.com/snippets/refactorings/change-function-declaration.md

- **introduce-parameter-object** — Apply Introduce Parameter Object when you see Long Parameter List, Data Clumps. The clump becomes a named value object the agent passes through as a single token; structure validation happens once at construction.
  https://refactoringintheloop.com/snippets/refactorings/introduce-parameter-object.md

- **introduce-assertion** — Apply Introduce Assertion when you see Comments, Mutable Data. Invariants live in code as runtime checks; the agent reads the assertion as a typed constraint that downstream code can take as a precondition without re-deriving it from caller context.
  https://refactoringintheloop.com/snippets/refactorings/introduce-assertion.md

- **separate-query-from-modifier** — Apply Separate Query from Modifier when you see Mutable Data. Functions either return or mutate, never both; the agent composes queries without surprise side effects.
  https://refactoringintheloop.com/snippets/refactorings/separate-query-from-modifier.md

- **parameterize-function** — Apply Parameterize Function when you see Duplicated Code. One canonical function with a parameter; the agent reasons about one body and verifies parameter values at call sites.
  https://refactoringintheloop.com/snippets/refactorings/parameterize-function.md

- **remove-flag-argument** — Apply Remove Flag Argument when you see Long Parameter List. Each flag value becomes a named function; the agent reads call sites as direct invocations of the intended behavior.
  https://refactoringintheloop.com/snippets/refactorings/remove-flag-argument.md

- **preserve-whole-object** — Apply Preserve Whole Object when you see Long Parameter List, Data Clumps. The function takes the object; the agent updates one place when the function needs new fields.
  https://refactoringintheloop.com/snippets/refactorings/preserve-whole-object.md

- **replace-parameter-with-query** — Apply Replace Parameter with Query when you see Long Parameter List. The function computes its own answer; the agent calls it without pre-computing the inputs.
  https://refactoringintheloop.com/snippets/refactorings/replace-parameter-with-query.md

- **replace-query-with-parameter** — Apply Replace Query with Parameter when you see Mutable Data, Insider Trading. Dependencies are visible in the signature; the agent reasons about the function as a pure transformation of its inputs.
  https://refactoringintheloop.com/snippets/refactorings/replace-query-with-parameter.md

- **replace-constructor-with-factory-function** — Apply Replace Constructor with Factory Function when you see Primitive Obsession, Speculative Generality. Construction goes through a named factory the agent can extend with validation, polymorphism, or caching as one location.
  https://refactoringintheloop.com/snippets/refactorings/replace-constructor-with-factory-function.md

- **replace-error-code-with-exception** — Apply Replace Error Code with Exception when you see Comments. Failures throw exceptions the agent reasons about as separate control flow; the type system marks the failure path.
  https://refactoringintheloop.com/snippets/refactorings/replace-error-code-with-exception.md

- **replace-exception-with-precheck** — Apply Replace Exception with Precheck when you see Comments. The precheck appears at the point of decision; the agent reads the code top-to-bottom as the rule, with exceptions reserved for truly exceptional cases.
  https://refactoringintheloop.com/snippets/refactorings/replace-exception-with-precheck.md

### Dealing with Inheritance

- **pull-up-method** — Apply Pull Up Method when you see Duplicated Code, Alternative Classes with Different Interfaces. The method lives on the parent with one implementation; queries about behavior across subclasses load one method body instead of paying the token cost of loading N near-identical bodies.
  https://refactoringintheloop.com/snippets/refactorings/pull-up-method.md

- **push-down-method** — Apply Push Down Method when you see Refused Bequest, Large Class. The method lives on the subclass that uses it; reading the parent's interface returns only the methods every instance supports, dropping the irrelevant declaration from the agent's window.
  https://refactoringintheloop.com/snippets/refactorings/push-down-method.md

- **replace-type-code-with-subclasses** — Apply Replace Type Code with Subclasses when you see Repeated Switches, Primitive Obsession. Each kind is a subclass; the agent adds a new kind by adding one class, and the type system tells it what's still missing.
  https://refactoringintheloop.com/snippets/refactorings/replace-type-code-with-subclasses.md

- **extract-superclass** — Apply Extract Superclass when you see Duplicated Code, Alternative Classes with Different Interfaces. Shared structure lives on the parent with one declaration; queries about either subclass load the parent's contract once instead of paying the cost of loading N near-identical subclass declarations.
  https://refactoringintheloop.com/snippets/refactorings/extract-superclass.md

- **collapse-hierarchy** — Apply Collapse Hierarchy when you see Lazy Element, Speculative Generality. The subclass folds into the parent; the agent reads one class instead of a degenerate two-class hierarchy.
  https://refactoringintheloop.com/snippets/refactorings/collapse-hierarchy.md

- **replace-subclass-with-delegate** — Apply Replace Subclass with Delegate when you see Refused Bequest, Insider Trading. Variants live in delegate objects the host holds and forwards to; the agent reads one host class plus the held delegate's interface instead of climbing an inheritance chain to predict behavior.
  https://refactoringintheloop.com/snippets/refactorings/replace-subclass-with-delegate.md

- **pull-up-constructor-body** — Apply Pull Up Constructor Body when you see Duplicated Code. Shared initialization lives in the parent's constructor and runs via super; subclass constructors hold only their specific setup, and the agent reads one canonical init for parent-state setup.
  https://refactoringintheloop.com/snippets/refactorings/pull-up-constructor-body.md

- **pull-up-field** — Apply Pull Up Field when you see Duplicated Code. The field lives on the parent with one declaration; reading any subclass's storage resolves through inheritance to the parent's one field instead of paying the cost of loading every subclass to verify the declaration matches.
  https://refactoringintheloop.com/snippets/refactorings/pull-up-field.md

- **push-down-field** — Apply Push Down Field when you see Refused Bequest, Large Class. The field lives on the subclass that uses it; the parent's storage declaration carries only the fields every instance holds, dropping the irrelevant declaration from the agent's window.
  https://refactoringintheloop.com/snippets/refactorings/push-down-field.md

- **remove-subclass** — Apply Remove Subclass when you see Lazy Element, Speculative Generality. The variant becomes a field on the parent; the agent reads variants as data instead of navigating a hierarchy.
  https://refactoringintheloop.com/snippets/refactorings/remove-subclass.md

- **replace-superclass-with-delegate** — Apply Replace Superclass with Delegate when you see Refused Bequest, Insider Trading. The former subclass holds a delegate of the former parent's role; the agent reads the new class's interface as the contract instead of loading the former parent to filter out methods the subclass refused.
  https://refactoringintheloop.com/snippets/refactorings/replace-superclass-with-delegate.md

## Code smells (Fowler 2e)

- **mysterious-name** — Refuse Mysterious Name when token-level identifiers don't disambiguate scope or domain — the agent must load surrounding context to answer 'what does this variable hold?' before any reasoning step succeeds. Apply Change Function Declaration, Rename Variable.
  https://refactoringintheloop.com/snippets/smells/mysterious-name.md

- **duplicated-code** — Refuse Duplicated Code when near-identical code appears in multiple files; every reasoning step about one copy must either deliberately ignore the others or repeat itself across them. Apply Extract Function, Slide Statements.
  https://refactoringintheloop.com/snippets/smells/duplicated-code.md

- **long-function** — Refuse Long Function when a function whose token count exceeds the agent's reliable chunk-reasoning budget; verifying behavior preservation requires re-reading the entire span on every edit. Apply Extract Function, Replace Temp with Query.
  https://refactoringintheloop.com/snippets/smells/long-function.md

- **long-parameter-list** — Refuse Long Parameter List when a signature with so many positional parameters that the agent must look up the function definition (or call-site documentation) before any invocation succeeds. Apply Replace Parameter with Query, Preserve Whole Object.
  https://refactoringintheloop.com/snippets/smells/long-parameter-list.md

- **global-data** — Refuse Global Data when a module-level variable mutated from anywhere — the agent reading any single call site cannot bound its impact without scanning every consumer. Apply Encapsulate Variable.
  https://refactoringintheloop.com/snippets/smells/global-data.md

- **mutable-data** — Refuse Mutable Data when fields the agent finds reassigned across multiple files with no obvious owner; reasoning about state at any moment requires tracing every writer. Apply Encapsulate Variable, Split Variable.
  https://refactoringintheloop.com/snippets/smells/mutable-data.md

- **divergent-change** — Refuse Divergent Change when reading the module, the agent constantly switches between conceptually unrelated regions (tax logic, UI logic, API logic); every cross-axis edit requires loading and reasoning about all of them. Apply Split Phase, Move Function.
  https://refactoringintheloop.com/snippets/smells/divergent-change.md

- **shotgun-surgery** — Refuse Shotgun Surgery when a single conceptual edit forces the agent to identify, load, and modify many small sites — each one cheap individually but the search and completeness check is expensive. Apply Move Function, Move Field.
  https://refactoringintheloop.com/snippets/smells/shotgun-surgery.md

- **feature-envy** — Refuse Feature Envy when a method's body references foreign-class data more than its own; the agent loading this method must also load the foreign class to verify any change. Apply Move Function, Extract Function.
  https://refactoringintheloop.com/snippets/smells/feature-envy.md

- **data-clumps** — Refuse Data Clumps when the agent sees the same field group appearing across multiple signatures (parameters, fields, args) — every site re-parses the same shape and verifies the same ordering. Apply Extract Class, Introduce Parameter Object.
  https://refactoringintheloop.com/snippets/smells/data-clumps.md

- **primitive-obsession** — Refuse Primitive Obsession when function signatures use raw strings and numbers where domain concepts hide; the agent cannot tell from the type whether an argument is the right kind of thing. Apply Replace Primitive with Object, Replace Type Code with Subclasses.
  https://refactoringintheloop.com/snippets/smells/primitive-obsession.md

- **repeated-switches** — Refuse Repeated Switches when the agent finds the same switch (or if/else chain) over a type code in multiple files; adding a new case requires the agent to grep for every site and update each consistently. Apply Replace Conditional with Polymorphism.
  https://refactoringintheloop.com/snippets/smells/repeated-switches.md

- **loops** — Refuse Loops when imperative for/while loops where filter, map, and reduce concerns are mixed by hand; the agent cannot tell what the loop is producing without mentally executing it. Apply Replace Loop with Pipeline.
  https://refactoringintheloop.com/snippets/smells/loops.md

- **lazy-element** — Refuse Lazy Element when a class, function, or namespace whose body the agent traces through only to find no decisions or transformations — every hop is pure overhead in reasoning context. Apply Inline Function, Inline Class.
  https://refactoringintheloop.com/snippets/smells/lazy-element.md

- **speculative-generality** — Refuse Speculative Generality when abstract base classes, hooks, configuration knobs, or parameters with no real call site exercising them — the agent must learn vocabulary it never gets to use. Apply Collapse Hierarchy, Inline Function.
  https://refactoringintheloop.com/snippets/smells/speculative-generality.md

- **temporary-field** — Refuse Temporary Field when a class field the agent finds set to null or default for most of the object's lifetime, populated only inside one method's flow — the agent must verify which methods care. Apply Extract Class, Move Function.
  https://refactoringintheloop.com/snippets/smells/temporary-field.md

- **message-chains** — Refuse Message Chains when long dotted access paths the agent must trace through several object hops to understand any single read; renaming any intermediate field breaks every caller silently. Apply Hide Delegate, Extract Function.
  https://refactoringintheloop.com/snippets/smells/message-chains.md

- **middle-man** — Refuse Middle Man when a class whose methods all delegate straight through to another object — the agent traces every call to the real implementation, paying a hop for no decision. Apply Remove Middle Man, Inline Function.
  https://refactoringintheloop.com/snippets/smells/middle-man.md

- **insider-trading** — Refuse Insider Trading when module A reaches into module B's private fields or undocumented behavior; the agent reasoning about A must also load B's internals to make any change. Apply Move Function, Move Field.
  https://refactoringintheloop.com/snippets/smells/insider-trading.md

- **large-class** — Refuse Large Class when a class file with so many fields and methods that the agent cannot load it as a coherent unit; multiple unrelated responsibilities sit under one name. Apply Extract Class, Extract Superclass.
  https://refactoringintheloop.com/snippets/smells/large-class.md

- **alternative-classes-with-different-interfaces** — Refuse Alternative Classes with Different Interfaces when two classes the agent recognizes as doing similar things but with mismatched method names and signatures; the agent must learn both vocabularies and translate between them. Apply Change Function Declaration, Move Function.
  https://refactoringintheloop.com/snippets/smells/alternative-classes-with-different-interfaces.md

- **data-class** — Refuse Data Class when a class whose surface is only getters and setters; all real behavior lives in consumers, scattered across files the agent must locate to reason about anything domain-meaningful. Apply Encapsulate Record, Remove Setting Method.
  https://refactoringintheloop.com/snippets/smells/data-class.md

- **refused-bequest** — Refuse Refused Bequest when a subclass overrides parent methods with no-ops or 'unsupported' throws; code generated against the parent's interface that calls the inherited method against this subclass produces a runtime failure the type checker accepted. Apply Push Down Method, Push Down Field.
  https://refactoringintheloop.com/snippets/smells/refused-bequest.md

- **comments** — Refuse Comments when comments explaining what the next block does or what a function returns; the agent loading the comment plus the code carries two sources of truth that may have drifted apart. Apply Extract Function, Change Function Declaration.
  https://refactoringintheloop.com/snippets/smells/comments.md

## Patterns — Refactoring to Patterns (Kerievsky 2004)

- **chain-constructors** — Apply Chain Constructors when you see Duplicated Code, Extract Function, Combine Functions into Class. One construction path the agent reads to know what a fully-initialized object looks like; all other paths are one-line delegations the agent can skip past during reasoning.
  https://refactoringintheloop.com/snippets/patterns/chain-constructors.md

- **compose-method** — Apply Compose Method when you see Long Function, Extract Function, Replace Temp with Query. The method reads as a sequence of named operations the agent can verify against without re-deriving the algorithm.
  https://refactoringintheloop.com/snippets/patterns/compose-method.md

- **encapsulate-classes-with-factory** — Apply Encapsulate Classes With Factory when you see Shotgun Surgery, Replace Constructor with Factory Function, Hide Delegate. One factory module the agent verifies once; all construction sites read as named factory calls the agent can treat opaquely.
  https://refactoringintheloop.com/snippets/patterns/encapsulate-classes-with-factory.md

- **encapsulate-composite-with-builder** — Apply Encapsulate Composite With Builder when you see Long Function, Hide Delegate, Extract Class. A construction site that reads as a tree literal the agent can parse structurally in one pass.
  https://refactoringintheloop.com/snippets/patterns/encapsulate-composite-with-builder.md

- **extract-adapter** — Apply Extract Adapter when you see Divergent Change, Extract Class, Replace Conditional with Polymorphism. One adapter file per variant; the agent verifies each adapter independently against the external API.
  https://refactoringintheloop.com/snippets/patterns/extract-adapter.md

- **extract-composite** — Apply Extract Composite when you see Duplicated Code, Extract Superclass, Pull Up Method. One Composite superclass the agent reads once and trusts thereafter.
  https://refactoringintheloop.com/snippets/patterns/extract-composite.md

- **extract-parameter** — Apply Extract Parameter when you see Duplicated Code, Parameterize Function, Extract Function. One method the agent reads once; callers supply the varying value at the call site.
  https://refactoringintheloop.com/snippets/patterns/extract-parameter.md

- **form-template-method** — Apply Form Template Method when you see Duplicated Code, Pull Up Method, Extract Function. One template body the agent reads to know the algorithm; primitives are short, locally readable, individually verifiable.
  https://refactoringintheloop.com/snippets/patterns/form-template-method.md

- **inline-singleton** — Apply Inline Singleton when you see Global Data, Inline Function, Remove Dead Code. Constructor signatures carry every dependency the class uses; the agent reads one signature to enumerate what the class touches instead of grepping for static accessor calls across the codebase.
  https://refactoringintheloop.com/snippets/patterns/inline-singleton.md

- **introduce-null-object** — Apply Introduce Null Object when you see Repeated Switches, Introduce Special Case, Replace Conditional with Polymorphism. One Null Object class the agent verifies once; all call sites unconditionally invoke the collaborator interface.
  https://refactoringintheloop.com/snippets/patterns/introduce-null-object.md

- **introduce-polymorphic-creation-with-factory-method** — Apply Introduce Polymorphic Creation With Factory Method when you see Repeated Switches, Replace Conditional with Polymorphism, Replace Constructor with Factory Function. Each subclass's Factory Method is locally verifiable; the base algorithm has no construction-conditional for the agent to load.
  https://refactoringintheloop.com/snippets/patterns/introduce-polymorphic-creation-with-factory-method.md

- **limit-instantiation-with-singleton** — Apply Limit Instantiation With Singleton when you see Mutable Data, Encapsulate Variable, Replace Constructor with Factory Function. One static accessor the agent verifies once; all references resolve to the same identity.
  https://refactoringintheloop.com/snippets/patterns/limit-instantiation-with-singleton.md

- **move-accumulation-to-collecting-parameter** — Apply Move Accumulation To Collecting Parameter when you see Duplicated Code, Parameterize Function, Substitute Algorithm. One collecting parameter the agent reads as a single mutable accumulator; recursion bodies become small and locally verifiable.
  https://refactoringintheloop.com/snippets/patterns/move-accumulation-to-collecting-parameter.md

- **move-accumulation-to-visitor** — Apply Move Accumulation To Visitor when you see Divergent Change, Extract Class, Move Function. One file per operation; the agent verifies a Visitor against its declared interface in isolation.
  https://refactoringintheloop.com/snippets/patterns/move-accumulation-to-visitor.md

- **move-creation-knowledge-to-factory** — Apply Move Creation Knowledge To Factory when you see Long Function, Extract Class, Move Function. One factory file the agent reads as the construction contract; callers are short delegations the agent treats opaquely.
  https://refactoringintheloop.com/snippets/patterns/move-creation-knowledge-to-factory.md

- **move-embellishment-to-decorator** — Apply Move Embellishment To Decorator when you see Long Parameter List, Extract Class, Replace Subclass with Delegate. One file per behaviour the agent reads in isolation; the core class is short and verifiable on its own.
  https://refactoringintheloop.com/snippets/patterns/move-embellishment-to-decorator.md

- **replace-conditional-dispatcher-with-command** — Apply Replace Conditional Dispatcher With Command when you see Repeated Switches, Replace Function with Command, Replace Conditional with Polymorphism. One file per command the agent reads in isolation; the dispatcher reads a registry of commands instead of a switch over IDs, and adding a command is one new class plus one registry entry rather than an edit across every dispatcher branch.
  https://refactoringintheloop.com/snippets/patterns/replace-conditional-dispatcher-with-command.md

- **replace-conditional-logic-with-strategy** — Apply Replace Conditional Logic with Strategy when you see Repeated Switches, Replace Conditional with Polymorphism, Decompose Conditional. Each variant lives in its own class; the agent can verify one strategy's behavior without loading the others.
  https://refactoringintheloop.com/snippets/patterns/replace-conditional-logic-with-strategy.md

- **replace-constructors-with-creation-methods** — Apply Replace Constructors With Creation Methods when you see Mysterious Name, Replace Constructor with Factory Function, Change Function Declaration. Each static creation method has a clear, statically-typed signature.
  https://refactoringintheloop.com/snippets/patterns/replace-constructors-with-creation-methods.md

- **replace-hard-coded-notifications-with-observer** — Apply Replace Hard-Coded Notifications With Observer when you see Insider Trading, Extract Class, Move Function. The publisher is short and consumer-agnostic; the agent reads it once and trusts it.
  https://refactoringintheloop.com/snippets/patterns/replace-hard-coded-notifications-with-observer.md

- **replace-implicit-language-with-interpreter** — Apply Replace Implicit Language With Interpreter when you see Primitive Obsession, Replace Primitive with Object, Substitute Algorithm. Each grammar node is one class the agent verifies independently.
  https://refactoringintheloop.com/snippets/patterns/replace-implicit-language-with-interpreter.md

- **replace-implicit-tree-with-composite** — Apply Replace Implicit Tree With Composite when you see Primitive Obsession, Replace Primitive with Object, Encapsulate Record. A concrete Composite the agent reads as a typed recursive structure.
  https://refactoringintheloop.com/snippets/patterns/replace-implicit-tree-with-composite.md

- **replace-onemany-distinctions-with-composite** — Apply Replace One/Many Distinctions With Composite when you see Repeated Switches, Replace Conditional with Polymorphism, Extract Class. Polymorphic dispatch on the value's type; the agent verifies each subtype's implementation in isolation.
  https://refactoringintheloop.com/snippets/patterns/replace-onemany-distinctions-with-composite.md

- **replace-state-altering-conditionals-with-state** — Apply Replace State-Altering Conditionals with State when you see Repeated Switches, Replace Conditional with Polymorphism, Extract Class. Per-state class the agent reads as the full operation surface for that state.
  https://refactoringintheloop.com/snippets/patterns/replace-state-altering-conditionals-with-state.md

- **replace-type-code-with-class** — Apply Replace Type Code With Class when you see Primitive Obsession, Replace Primitive with Object, Replace Type Code with Subclasses. Static type-checking enforces that comparisons are only against the named instances.
  https://refactoringintheloop.com/snippets/patterns/replace-type-code-with-class.md

- **unify-interfaces-with-adapter** — Apply Unify Interfaces With Adapter when you see Alternative Classes with Different Interfaces, Change Function Declaration, Move Function. One adapter file the agent verifies once; consumers are uniform calls against a single interface.
  https://refactoringintheloop.com/snippets/patterns/unify-interfaces-with-adapter.md

- **unify-interfaces** — Apply Unify Interfaces when you see Alternative Classes with Different Interfaces, Change Function Declaration, Pull Up Method. Each operation has one name across every class that exposes it; a grep for the name returns every call site, and the agent enumerates consumers without paying for an alias map.
  https://refactoringintheloop.com/snippets/patterns/unify-interfaces.md

## Patterns — Design Patterns (Gamma/Helm/Johnson/Vlissides 1994)

- **abstract-factory** — Apply Abstract Factory when you see Shotgun Surgery, Repeated Switches, Replace Constructor with Factory Function. The agent reads one factory interface to know what products exist; concrete factories are short and exhaustive; client code is one factory pointer away from the right family.
  https://refactoringintheloop.com/snippets/patterns/abstract-factory.md

- **builder** — Apply Builder when you see Long Parameter List, Primitive Obsession, Introduce Parameter Object. Self-describing construction the agent can read top-to-bottom without cross-file lookup.
  https://refactoringintheloop.com/snippets/patterns/builder.md

- **factory-method** — Apply Factory Method when you see Repeated Switches, Replace Conditional with Polymorphism, Replace Type Code with Subclasses. Structural completeness via the type system; every subclass of the creator must implement the factory method, so missing-variant bugs surface as construction-time errors the agent can see during static reading.
  https://refactoringintheloop.com/snippets/patterns/factory-method.md

- **prototype** — Apply Prototype when you see Duplicated Code, Speculative Generality, Replace Subclass with Delegate. One prototype-registry table the agent reads once to enumerate every variant and its defaults.
  https://refactoringintheloop.com/snippets/patterns/prototype.md

- **singleton** — Apply Singleton when you see Global Data, Duplicated Code, Encapsulate Variable. A single getInstance() access point the agent can grep for to enumerate every consumer.
  https://refactoringintheloop.com/snippets/patterns/singleton.md

- **adapter** — Apply Adapter when you see Alternative Classes with Different Interfaces, Change Function Declaration, Replace Subclass with Delegate. The canonical interface is the agent's single anchor for reasoning about how the system uses payments; the adapter is a thin file the agent reads once to understand the translation rules.
  https://refactoringintheloop.com/snippets/patterns/adapter.md

- **bridge** — Apply Bridge when you see Shotgun Surgery, Replace Subclass with Delegate, Extract Class. Two independent surfaces the agent reads separately.
  https://refactoringintheloop.com/snippets/patterns/bridge.md

- **composite** — Apply Composite when you see Repeated Switches, Replace Conditional with Polymorphism, Replace Type Code with Subclasses. A typed interface where adding a new node kind forces the type system to demand an implementation of every operation.
  https://refactoringintheloop.com/snippets/patterns/composite.md

- **decorator** — Apply Decorator when you see Large Class, Divergent Change, Replace Subclass with Delegate. N small wrapper classes the agent reads one at a time.
  https://refactoringintheloop.com/snippets/patterns/decorator.md

- **facade** — Apply Facade when you see Message Chains, Insider Trading, Hide Delegate. One Facade method the agent reads end-to-end to understand the full choreography.
  https://refactoringintheloop.com/snippets/patterns/facade.md

- **flyweight** — Apply Flyweight when you see Duplicated Code, Large Class, Extract Class. A structural separation between kind-shared data (TreeType) and per-instance data (Tree).
  https://refactoringintheloop.com/snippets/patterns/flyweight.md

- **proxy** — Apply Proxy when you see Insider Trading, Encapsulate Variable, Replace Subclass with Delegate. One Proxy class the agent reads to know the policy.
  https://refactoringintheloop.com/snippets/patterns/proxy.md

- **chain-of-responsibility** — Apply Chain of Responsibility when you see Long Function, Divergent Change, Replace Conditional with Polymorphism. N small handler classes the agent reads one at a time.
  https://refactoringintheloop.com/snippets/patterns/chain-of-responsibility.md

- **command** — Apply Command when you see Repeated Switches, Primitive Obsession, Replace Function with Command. One Command interface (execute + undo) the agent reads as the structural commitment.
  https://refactoringintheloop.com/snippets/patterns/command.md

- **interpreter** — Apply Interpreter when you see Primitive Obsession, Repeated Switches, Replace Conditional with Polymorphism. One class per grammar rule, each with interpret(env).
  https://refactoringintheloop.com/snippets/patterns/interpreter.md

- **iterator** — Apply Iterator when you see Insider Trading, Message Chains, Encapsulate Collection. One iterator protocol the agent reads to understand traversal semantics.
  https://refactoringintheloop.com/snippets/patterns/iterator.md

- **mediator** — Apply Mediator when you see Insider Trading, Shotgun Surgery, Move Function. One Mediator the agent reads to understand all relationships.
  https://refactoringintheloop.com/snippets/patterns/mediator.md

- **memento** — Apply Memento when you see Insider Trading, Mutable Data, Extract Class. One save / restore pair the agent reads inside the editor class.
  https://refactoringintheloop.com/snippets/patterns/memento.md

- **observer** — Apply Observer when you see Shotgun Surgery, Divergent Change, Hide Delegate. One subscribe/notify protocol the agent reads once per subject.
  https://refactoringintheloop.com/snippets/patterns/observer.md

- **state** — Apply State when you see Repeated Switches, Primitive Obsession, Replace Conditional with Polymorphism. One class per state, each owning its operation set exhaustively.
  https://refactoringintheloop.com/snippets/patterns/state.md

- **strategy** — Apply Strategy when you see Repeated Switches, Replace Conditional with Polymorphism, Move Function. One strategy interface and N small implementations the agent reads independently.
  https://refactoringintheloop.com/snippets/patterns/strategy.md

- **template-method** — Apply Template Method when you see Duplicated Code, Shotgun Surgery, Pull Up Method. One template method in a base class the agent reads to understand the algorithm shape.
  https://refactoringintheloop.com/snippets/patterns/template-method.md

- **visitor** — Apply Visitor when you see Divergent Change, Shotgun Surgery, Move Function. Per-operation visitors the agent reads as one file; per-node node classes the agent reads as small data + accept-dispatch.
  https://refactoringintheloop.com/snippets/patterns/visitor.md
