# Refactoring catalog — agent guidance

Paste this whole section into AGENTS.md to give a coding agent the catalog vocabulary and cross-references in one block.

**How to use this:**

- When writing new code in this project, **refuse** to introduce any pattern listed under **Code smells** below.
- When the trigger of a smell appears in code you're editing, **apply** one of the named refactorings before adding new behavior.
- For Before/After code on any entry, see `docs/snippets/refactorings.md` and `docs/snippets/smells.md`.

Source: https://refactoring.com/catalog/ (Fowler 2e).

---

## Code smells — refuse these patterns

| #   | Smell                                             | Trigger (refuse when you see)                                                                                                                                             | Apply                                                                                                                                                                                                                                                         |
| --- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 01  | **Mysterious Name**                               | Identifiers that don't reveal intent — names like aFunc(), x, theData, temp, or one-letter loop variables that force every reader to reverse-engineer the code's purpose. | Change Function Declaration, Rename Variable, Rename Field                                                                                                                                                                                                    |
| 02  | **Duplicated Code**                               | The same code structure appears in two or more places — same shape with cosmetic variations, or copy-paste-modify patterns that drift over time.                          | Extract Function, Slide Statements, Pull Up Method                                                                                                                                                                                                            |
| 03  | **Long Function**                                 | Functions whose body has dozens of lines and a mix of concerns — fetching, calculating, formatting, and logging all interwoven.                                           | Extract Function, Replace Temp with Query, Introduce Parameter Object, Preserve Whole Object, Replace Function with Command, Decompose Conditional, Split Loop, Replace Loop with Pipeline, Replace Control Flag with Break                                   |
| 04  | **Long Parameter List**                           | Functions taking five, six, or more parameters — especially when several travel together as a logical group.                                                              | Replace Parameter with Query, Preserve Whole Object, Introduce Parameter Object, Remove Flag Argument, Combine Functions into Class                                                                                                                           |
| 05  | **Global Data**                                   | Module-level variables, singletons, or shared mutable state that any code can read or mutate from anywhere.                                                               | Encapsulate Variable                                                                                                                                                                                                                                          |
| 06  | **Mutable Data**                                  | Data structures whose fields are reassigned across the codebase, with no clear owner of the mutation.                                                                     | Encapsulate Variable, Split Variable, Slide Statements, Extract Function, Separate Query from Modifier, Remove Setting Method, Replace Derived Variable with Query, Combine Functions into Class, Combine Functions into Transform, Change Reference to Value |
| 07  | **Divergent Change**                              | One module changes for many unrelated reasons — one part for tax law updates, another for UI changes, another for API shape drift.                                        | Split Phase, Move Function, Extract Function, Extract Class                                                                                                                                                                                                   |
| 08  | **Shotgun Surgery**                               | A single conceptual change forces edits in many small places — adding a logging field means touching 17 files.                                                            | Move Function, Move Field, Combine Functions into Class, Combine Functions into Transform, Split Phase, Inline Function, Inline Class                                                                                                                         |
| 09  | **Feature Envy**                                  | A method on class A reaches deeply into class B's data via getters, then computes something B should compute.                                                             | Move Function, Extract Function                                                                                                                                                                                                                               |
| 10  | **Data Clumps**                                   | The same group of fields travels together everywhere — (street, city, zip), (start, end), (firstName, lastName) — appearing as parameters, fields, or method args.        | Extract Class, Introduce Parameter Object, Preserve Whole Object                                                                                                                                                                                              |
| 11  | **Primitive Obsession**                           | Domain concepts represented as raw strings, numbers, or booleans — phone number is a string, money is a number, status is a code.                                         | Replace Primitive with Object, Replace Type Code with Subclasses, Replace Conditional with Polymorphism, Extract Class, Introduce Parameter Object                                                                                                            |
| 12  | **Repeated Switches**                             | The same switch (or if/else chain) over a type code appears in multiple places — adding a new case means hunting them all down.                                           | Replace Conditional with Polymorphism                                                                                                                                                                                                                         |
| 13  | **Loops**                                         | Imperative for/while loops obscuring what the loop is producing — filter, map, reduce mixed together by hand.                                                             | Replace Loop with Pipeline                                                                                                                                                                                                                                    |
| 14  | **Lazy Element**                                  | A class, function, or namespace that exists but does nothing meaningful — a one-line wrapper, an empty subclass, a passthrough method.                                    | Inline Function, Inline Class, Collapse Hierarchy                                                                                                                                                                                                             |
| 15  | **Speculative Generality**                        | Hooks, abstract base classes, configuration knobs, and parameters added 'in case we need them' — but no real call site uses them.                                         | Collapse Hierarchy, Inline Function, Inline Class, Change Function Declaration, Remove Dead Code                                                                                                                                                              |
| 16  | **Temporary Field**                               | A class field used by only one method, set to null or default the rest of the time.                                                                                       | Extract Class, Move Function, Introduce Special Case                                                                                                                                                                                                          |
| 17  | **Message Chains**                                | Long dotted access paths: a.b.c.d.e — every callsite walks the entire object graph.                                                                                       | Hide Delegate, Extract Function, Move Function                                                                                                                                                                                                                |
| 18  | **Middle Man**                                    | A class whose methods all delegate straight through to another object — no decisions, no transformations.                                                                 | Remove Middle Man, Inline Function, Replace Superclass with Delegate, Replace Subclass with Delegate                                                                                                                                                          |
| 19  | **Insider Trading**                               | Modules reach into each other's internals to coordinate behavior, bypassing public interfaces.                                                                            | Move Function, Move Field, Hide Delegate, Replace Subclass with Delegate, Replace Superclass with Delegate                                                                                                                                                    |
| 20  | **Large Class**                                   | A class with too many fields and methods — multiple unrelated responsibilities under one type.                                                                            | Extract Class, Extract Superclass, Replace Type Code with Subclasses                                                                                                                                                                                          |
| 21  | **Alternative Classes with Different Interfaces** | Two classes do similar things but with mismatched method names and signatures — sortBy() vs orderUsing(), valueOf() vs evaluate().                                        | Change Function Declaration, Move Function, Extract Superclass                                                                                                                                                                                                |
| 22  | **Data Class**                                    | A class that holds fields with getters and setters but no behavior — and consumers do all the operations on it externally.                                                | Encapsulate Record, Remove Setting Method, Move Function, Extract Function, Split Phase                                                                                                                                                                       |
| 23  | **Refused Bequest**                               | A subclass inherits methods or fields it doesn't actually use — overriding to no-ops, throwing 'unsupported', or just ignoring the inheritance.                           | Push Down Method, Push Down Field, Replace Subclass with Delegate, Replace Superclass with Delegate                                                                                                                                                           |
| 24  | **Comments**                                      | Comments explaining what the next block of code does, what a function returns, or how a parameter is meant to be used.                                                    | Extract Function, Change Function Declaration, Introduce Assertion                                                                                                                                                                                            |

---

## Refactorings — apply these patterns

Grouped by Fowler chapter. Numbers match the in-app catalog ordering.

### Basic Refactorings

- **07 Rename Variable** — Variable names match the domain role they play, not their implementation type or scratch nature.
- **19 Rename Field** — Field names match the domain role they play; readers don't need to inspect usage to know what a field means.
- **17 Remove Dead Code** — Every line in the codebase is reachable and used; readers don't waste cycles on phantom branches.
- **43 Replace Magic Literal** — Bare numbers and strings that encode domain concepts become named constants whose name says what the value represents.

### Composing Methods

- **01 Extract Function** — Each function reads as a single named domain step — what it does, not how.
- **02 Inline Function** — Trivial wrappers vanish; the call site reads as exactly what's happening.
- **03 Extract Variable** — A complex expression earns a name that says what it represents in the domain.
- **04 Inline Variable** — Single-use variables that just rename their right-hand side disappear; the expression speaks for itself.
- **09 Combine Functions into Class** — Functions that all act on the same data live alongside it as methods; calls become method calls on a domain object.
- **10 Combine Functions into Transform** — Multiple derived values from the same source come from one transform that produces an enriched record.
- **11 Split Phase** — Each phase reads and writes its own well-defined inputs and outputs; the seam between them is data, not control flow.
- **14 Slide Statements** — Related statements sit next to each other; the function reads as a sequence of cohesive sub-steps that are easy to extract.
- **15 Split Loop** — Each loop does one thing; mixed-purpose loops separate into named single-purpose passes.
- **16 Replace Loop with Pipeline** — Filter / map / reduce expresses the transformation as a sequence of named operations; intent jumps off the page.
- **20 Replace Derived Variable with Query** — Values computed from other state are computed on demand; no separate field needs to be kept in sync.
- **18 Split Variable** — Each variable has one role; reassignment patterns reflect distinct purposes rather than reused storage.
- **44 Move Statements into Function** — Setup or follow-up that happens around every call to a function moves inside the function, so the caller's contract shrinks.
- **45 Move Statements to Callers** — Statements that vary by caller move out of the function so each caller chooses its own setup or follow-up.
- **46 Replace Inline Code with Function Call** — When inline code reproduces what a named function already does, the inline copy is replaced by a call.
- **47 Replace Temp with Query** — A local variable assigned once from a computation becomes a function that returns that computation on demand.
- **48 Replace Function with Command** — A function with rich internal state becomes an object whose methods can share that state — easier to extract, name, and test in pieces.
- **49 Replace Command with Function** — A command object whose execute() does everything in one shot collapses back to a plain function.
- **50 Return Modified Value** — Instead of mutating a parameter in place, the function returns the modified value so the caller reassigns.
- **51 Substitute Algorithm** — An opaque or convoluted algorithm gets replaced by a clearer one (often from a library or well-known pattern) that produces the same outputs.

### Encapsulation

- **06 Encapsulate Variable** — All reads and writes pass through a small named function that owns validation, logging, and invariants.
- **41 Hide Delegate** — Callers ask the closest object for what they want; the object delegates internally without exposing its collaborators.
- **42 Remove Middle Man** — Callers talk directly to the real object; trivial passthroughs are deleted.
- **52 Encapsulate Collection** — A class's internal collection is never returned directly; callers add or remove via methods on the class, and reads return a snapshot or iterator.
- **53 Encapsulate Record** — A bare record (plain object with public fields) becomes a class whose properties are accessed through methods that can validate, log, or derive.
- **54 Remove Setting Method** — Fields whose values should only be set at construction lose their setters; callers either construct a new object or call a domain method that changes the field as a side effect of doing real work.

### Moving Features

- **12 Move Function** — Each function lives where its data lives; coupling between modules drops.
- **13 Move Field** — Each field belongs to the class that owns its lifecycle; cross-class reaching disappears.
- **39 Extract Class** — A cohesive sub-concept inside a class becomes its own class with its own name, fields, and methods.
- **55 Inline Class** — A class with too few responsibilities to deserve its own file folds into a class it collaborates with most.

### Organizing Data

- **40 Replace Primitive with Object** — Each domain concept has a small typed home — Money, PhoneNumber, OrderId — that knows its rules.
- **56 Change Reference to Value** — An object treated as a sharable record (with setters) becomes a value object — immutable, equal by content, replaced rather than mutated.
- **57 Change Value to Reference** — Duplicate copies of a logically-single entity collapse into one shared object that everyone references.

### Simplifying Conditional Logic

- **21 Decompose Conditional** — Conditions and their consequents read as named domain decisions: isInSummer(), discountFor(date), etc.
- **22 Consolidate Conditional Expression** — Multiple conditions leading to the same action collapse into one named predicate.
- **23 Replace Nested Conditional with Guard Clauses** — Edge cases bail out early at the top of the function; the main flow is unindented and tells the happy path linearly.
- **24 Replace Conditional with Polymorphism** — Each case becomes a class implementing a shared interface; dispatch happens once via virtual call.
- **25 Introduce Special Case** — A repeating null-or-special check becomes a Null Object (or Special Case) that responds sensibly to the same interface.
- **58 Replace Control Flag with Break** — Loops that maintain a boolean to decide when to stop replace it with a direct `break`, `return`, or `continue`.

### Refactoring APIs

- **05 Change Function Declaration** — Function names match what they actually do; parameter lists carry only what the function needs, in the order callers expect.
- **08 Introduce Parameter Object** — Related arguments travel together as one well-named value object that the function (and callers) refer to by name.
- **26 Introduce Assertion** — Invariants the code assumes are stated explicitly; readers don't need to deduce them.
- **27 Separate Query from Modifier** — Functions either return a value or mutate state, never both — callers can compose them without surprise.
- **28 Parameterize Function** — Two near-identical functions that differ only in literal values combine into one with a parameter.
- **29 Remove Flag Argument** — Each flag value becomes its own well-named function; callers say what they mean rather than passing booleans.
- **30 Preserve Whole Object** — Instead of pulling several values out of an object to pass them in, pass the object itself.
- **31 Replace Parameter with Query** — When a function can compute its own answer from already-available state, callers don't have to pre-compute it.
- **59 Replace Query with Parameter** — A function that reads from a query (global, singleton, instance state) instead accepts the value as a parameter and becomes referentially transparent.
- **32 Replace Constructor with Factory Function** — Object creation goes through a named function that can validate, choose subclasses, or return cached instances.
- **60 Replace Error Code with Exception** — Numeric or string error codes that callers must remember to check are replaced with exceptions that propagate by default.
- **61 Replace Exception with Precheck** — Exceptions used for predictable, checkable conditions become an explicit precheck the caller can perform, leaving exceptions for truly exceptional cases.

### Dealing with Inheritance

- **33 Pull Up Method** — Methods that subclasses implement identically move to the shared superclass.
- **34 Push Down Method** — Methods used by only one subclass live with that subclass, not on the shared superclass.
- **35 Replace Type Code with Subclasses** — A 'kind' string field becomes a real subclass type; the type system enforces the legal set.
- **36 Extract Superclass** — Two classes with substantial shared structure get a common parent that owns the shared bits.
- **37 Collapse Hierarchy** — A subclass that no longer differs meaningfully from its parent merges back in.
- **38 Replace Subclass with Delegate** — Behavior that varied via inheritance now varies via a delegate object that implements the variant interface.
- **62 Pull Up Constructor Body** — Initialization code repeated across subclass constructors moves into the parent class's constructor and is called via super.
- **63 Pull Up Field** — A field declared identically in two or more subclasses moves to the shared superclass.
- **64 Push Down Field** — A field used by only one subclass moves out of the parent and into that subclass.
- **65 Remove Subclass** — A subclass whose only purpose was to encode a type code or add nothing collapses back into a field on the parent.
- **66 Replace Superclass with Delegate** — Inheritance from a superclass that doesn't really fit (Liskov violations, awkward methods) becomes composition: the former subclass holds an instance and delegates explicitly.
