# Refactoring catalog

Centralized view of the 92 catalog skills. Each section below is the
full SKILL.md content of the matching per-entity download — the
content is identical at the section level. Use this single paste when
you want the whole vocabulary loaded; use the per-entity downloads
when you want auto-invocable skills under `~/.claude/skills/<slug>/SKILL.md`.


---

## Refactorings

### Basic Refactorings

---
name: rename-variable
description: Apply Rename Variable when you see Mysterious Name. Variable names carry enough disambiguating information that the agent can reason about each symbol without a lookup hop.
---

# Apply: 07 — Rename Variable

**Symptom:** The agent encounters a variable whose identifier doesn't disambiguate scope or domain; reasoning about any expression involving the variable requires loading the surrounding context first.

**Goal:** Variable names carry enough disambiguating information that the agent can reason about each symbol without a lookup hop.

```js
// Avoid:
const a = height * width;

// Prefer:
const area = height * width;
```

**Pressure:** Every reasoning pass re-derives meaning from surrounding context; chained edits compound the cost.

**Tradeoff:** Renames invalidate cached associations — commit history, RAG snippets, embedding indexes, and prior conversation context all carry the old name until they refresh.

**Relief:** Fewer context-lookup hops per reasoning step; planning loops run cheaper and resist drift.

**Trap:** Compulsive renaming generates spurious diffs that crowd the review surface and burn context the human reviewer has to skim past.

**Removes smells:** Mysterious Name

---
name: rename-field
description: Apply Rename Field when you see Mysterious Name. Field names carry domain meaning so the agent can interpret reads and writes without examining the class definition.
---

# Apply: 19 — Rename Field

**Symptom:** A class field the agent must contextualize against surrounding code to interpret; reasoning about any read/write touches the field plus the class-shape context.

**Goal:** Field names carry domain meaning so the agent can interpret reads and writes without examining the class definition.

```js
// Avoid:
class Position {
  name;          // role name? or person's name?
  hiringManager;
}
console.log(position.name);  // ambiguous

// Prefer:
class Position {
  title;
  hiringManager;
}
console.log(position.title);  // clearly the role
```

**Pressure:** The agent re-derives field meaning at every access site; ambiguity compounds with the number of consumers.

**Tradeoff:** Renaming a field invalidates more cached associations than a variable rename — persistence layers (DB columns, JSON schemas, API contracts) carry the old name until they update.

**Relief:** The agent reasons about field access with the field's name as ground truth; consumer-side reasoning becomes self-documenting.

**Trap:** Renaming fields purely for cosmetic preference creates churn across persistence + API surfaces the agent must coordinate without comprehension gain.

**Removes smells:** Mysterious Name

---
name: remove-dead-code
description: Apply Remove Dead Code when you see Speculative Generality, Comments. Every definition the agent encounters is reachable; reasoning about behavior doesn't have to consider phantom paths.
---

# Apply: 17 — Remove Dead Code

**Symptom:** The agent finds code (functions, branches, fields) with no inbound references the type system or grep can locate; reasoning about reachability requires assuming static analysis is complete.

**Goal:** Every definition the agent encounters is reachable; reasoning about behavior doesn't have to consider phantom paths.

```js
// Avoid:
function legacyDiscount(order) { /* unused since 2018 */ }
function modernDiscount(order) { /* the real one */ }

// Prefer:
function discount(order) { /* the real one */ }
```

**Pressure:** The agent's plan-and-execute loop has to consider dead branches as live until proven otherwise; tests pass while code-walking analyses include dead surface area.

**Tradeoff:** Deletion is one-way under static analysis but reachability can hide in reflection, dynamic dispatch, external callers, or runtime config — the agent that deletes without checking risks a regression nothing catches.

**Relief:** The agent's reasoning context shrinks; static analysis becomes ground truth; planning loops don't waste cycles on phantom paths.

**Trap:** Aggressive deletion based purely on grep/static-analysis evidence misses reflection-reachable, plugin-loaded, or externally-referenced code — the cleanup ships a silent regression the agent's tests don't catch.

**Removes smells:** Speculative Generality, Comments

---
name: replace-magic-literal
description: Apply Replace Magic Literal when you see Mysterious Name, Comments. Domain-meaningful values have named constants the agent can reference by name; the constant's name documents what the value represents.
---

# Apply: 43 — Replace Magic Literal

**Symptom:** The agent encounters a bare number or string whose meaning requires loading the surrounding context to interpret; refactoring the value means finding every occurrence by character match.

**Goal:** Domain-meaningful values have named constants the agent can reference by name; the constant's name documents what the value represents.

```js
// Avoid:
function trip(distance) {
  return distance * 1.609;
}

// Prefer:
const KM_PER_MILE = 1.609;
function trip(distance) {
  return distance * KM_PER_MILE;
}
```

**Pressure:** The agent must trace context to interpret bare literals; changing a value requires text-search across the codebase with no semantic guarantee of completeness.

**Tradeoff:** Each new named constant is an import the agent must locate and resolve; over-naming creates a vocabulary the agent must learn for marginal disambiguation benefit.

**Relief:** The agent reasons about values by name with the type system enforcing valid uses; changing the value is one edit the type checker confirms.

**Trap:** Naming every literal — including indices, loop bounds, and obvious status codes — bloats the agent's mental constant table without comprehension gain.

**Removes smells:** Mysterious Name, Comments

### Composing Methods

---
name: extract-function
description: Apply Extract Function when you see Long Function, Duplicated Code, Comments. Each function is a verifiable unit small enough that the agent can reason about its full behavior in a single reasoning step.
---

# Apply: 01 — Extract Function

**Symptom:** A function whose token count exceeds the agent's reliable chunk-reasoning budget; verifying behavior preservation requires re-reading the entire span on every edit.

**Goal:** Each function is a verifiable unit small enough that the agent can reason about its full behavior in a single reasoning step.

```js
// Avoid:
function invoiceTotal(invoice) {
  let total = 0;
  for (const line of invoice.lines) {
    total += line.qty * line.unitPrice;
    if (line.qty >= 100) total -= line.qty * line.unitPrice * 0.05;
  }
  total += total * invoice.taxRate;
  return Math.round(total * 100) / 100;
}

// Prefer:
function invoiceTotal(invoice) {
  const subtotal = subtotalAfterBulkDiscount(invoice);
  const withTax  = subtotal * (1 + invoice.taxRate);
  return roundToCents(withTax);
}
```

**Pressure:** Every edit pays full re-read cost; chained changes compound context usage and increase the chance of missing a cross-statement invariant.

**Tradeoff:** Each extracted helper inflates context-window cost by one definition the next reasoning step must load; over-extracting blows effective working memory.

**Relief:** Smaller diff surface per commit; behavior preservation verifiable per refactoring step; chained orchestrations work from named subroutines instead of re-derived semantics.

**Trap:** Forces the agent to chase a dozen function definitions to follow what was once a 20-line procedure — context cost inflates and cross-function invariants disappear.

**Removes smells:** Long Function, Duplicated Code, Comments

---
name: inline-function
description: Apply Inline Function when you see Lazy Element, Speculative Generality. Trivial wrappers disappear from the agent's working context; call sites read as exactly what's happening.
---

# Apply: 02 — Inline Function

**Symptom:** A function whose body the agent must trace through only to find no decisions or transformations — every reference site pays a context-load hop for no reasoning gain.

**Goal:** Trivial wrappers disappear from the agent's working context; call sites read as exactly what's happening.

```js
// Avoid:
function moreThanFive(n) {
  return n > 5;
}
function rating(driver) {
  return moreThanFive(driver.numberOfLateDeliveries) ? 2 : 1;
}

// Prefer:
function rating(driver) {
  return driver.numberOfLateDeliveries > 5 ? 2 : 1;
}
```

**Pressure:** The agent loads the wrapper definition to verify any change touching it; the indirection is a tax on every reasoning step.

**Tradeoff:** Inlining scatters the wrapper's body across call sites; if the wrapper was a seam (mocking boundary, extension point), removing it forecloses options the agent might need later.

**Relief:** Shorter call chains; the agent loads one fewer definition per reasoning step.

**Trap:** Mechanically inlining every short function — including ones that name a real domain concept — collapses semantic anchors the agent uses to reason about behavior.

**Removes smells:** Lazy Element, Speculative Generality

---
name: extract-variable
description: Apply Extract Variable when you see Mysterious Name, Comments. Intermediate values have names the agent can reference directly; reasoning about the expression decomposes into reasoning about named sub-values.
---

# Apply: 03 — Extract Variable

**Symptom:** An expression complex enough that the agent must parse it sub-step by sub-step to interpret; subsequent reasoning about the value requires re-parsing the full expression.

**Goal:** Intermediate values have names the agent can reference directly; reasoning about the expression decomposes into reasoning about named sub-values.

```js
// Avoid:
if (order.qty * order.price - Math.max(0, order.qty - 500) * order.price * 0.05 > 1000) { /* ... */ }

// Prefer:
const basePrice    = order.qty * order.price;
const bulkDiscount = Math.max(0, order.qty - 500) * order.price * 0.05;
if (basePrice - bulkDiscount > 1000) { /* ... */ }
```

**Pressure:** The agent re-parses complex expressions at every reference; debugging requires the agent to mentally evaluate the full subexpression chain.

**Tradeoff:** Each extracted variable is a name in the agent's local scope; over-extraction creates scope clutter the agent must navigate to find what's actually relevant.

**Relief:** The agent references named intermediate values; expression-level reasoning becomes reference-level reasoning, which is cheaper.

**Trap:** Extracting every sub-expression — including ones already obvious — bloats the agent's scope table with names that document nothing the agent didn't already know.

**Removes smells:** Mysterious Name, Comments

---
name: inline-variable
description: Apply Inline Variable when you see Lazy Element. Single-use variables that rename without semantic gain disappear; expressions speak for themselves.
---

# Apply: 04 — Inline Variable

**Symptom:** A local variable whose value is the same as its right-hand expression and whose name adds no semantic information beyond the expression itself.

**Goal:** Single-use variables that rename without semantic gain disappear; expressions speak for themselves.

```js
// Avoid:
const basePrice = order.basePrice;
return basePrice > 1000;

// Prefer:
return order.basePrice > 1000;
```

**Pressure:** The agent tracks an extra name in scope for no reasoning benefit; reference resolution becomes a tiny hop to a definition that adds nothing.

**Tradeoff:** Inlining a variable that did carry domain meaning forces the agent to interpret the bare expression every time instead of reading the named concept.

**Relief:** Less local clutter in the agent's scope table; expressions read as themselves.

**Trap:** Inlining variables that named non-obvious intermediate values forces the agent to repeatedly parse the same expression across every reference site.

**Removes smells:** Lazy Element

---
name: combine-functions-into-class
description: Apply Combine Functions into Class when you see Data Clumps, Primitive Obsession. Operations live with the data they act on; the agent loads one class to reason about both shape and behavior.
---

# Apply: 09 — Combine Functions into Class

**Symptom:** The agent finds multiple functions that all take the same data shape; reasoning about the data requires loading every operation that touches it scattered across files.

**Goal:** Operations live with the data they act on; the agent loads one class to reason about both shape and behavior.

```js
// Avoid:
function baseCharge(reading) {
  return reading.kwh * reading.tariff.baseRate;
}
function taxableCharge(reading) {
  return baseCharge(reading) + reading.kwh * reading.tariff.taxRate;
}

// Prefer:
class Reading {
  constructor({ kwh, tariff }) { this.kwh = kwh; this.tariff = tariff; }
  baseCharge()    { return this.kwh * this.tariff.baseRate; }
  taxableCharge() { return this.baseCharge() + this.kwh * this.tariff.taxRate; }
}
```

**Pressure:** The agent traces operations across modules to understand what the data can do; invariants the agent must respect aren't enforced at construction.

**Tradeoff:** Wrapping the data in a class adds construction ceremony at every entry point; for data only used in one place the class is more code than the original concern warranted.

**Relief:** The agent loads the class as a single unit; behavior, fields, and invariants all in one place with one import.

**Trap:** Wrapping data that nobody else operates on creates a class the agent must instantiate everywhere with no encapsulation gain — pure overhead.

**Removes smells:** Data Clumps, Primitive Obsession

---
name: combine-functions-into-transform
description: Apply Combine Functions into Transform when you see Data Clumps, Mutable Data. One transform produces the enriched record; the agent reasons about derivations in one place and consumers read named fields.
---

# Apply: 10 — Combine Functions into Transform

**Symptom:** The agent encounters consumers each independently computing the same derived values from the same source; reasoning about consistency requires tracing every derivation.

**Goal:** One transform produces the enriched record; the agent reasons about derivations in one place and consumers read named fields.

```js
// Avoid:
function baseCharge(reading)    { return reading.kwh * reading.tariff.baseRate; }
function taxableCharge(reading) { return reading.kwh * reading.tariff.taxRate; }
// every consumer recomputes:
const monthly  = baseCharge(reading) + taxableCharge(reading);
const discount = baseCharge(reading) * 0.95;

// Prefer:
function enrich(reading) {
  return {
    ...reading,
    baseCharge:    reading.kwh * reading.tariff.baseRate,
    taxableCharge: reading.kwh * reading.tariff.taxRate,
  };
}
const r = enrich(reading);
const monthly  = r.baseCharge + r.taxableCharge;
const discount = r.baseCharge * 0.95;
```

**Pressure:** Each consumer re-derives the same values; the agent can't trust them to be consistent and must verify equivalence on every change.

**Tradeoff:** Building the transform when only one consumer exists creates an intermediate type the agent must learn before its second use justifies it.

**Relief:** Derivations are consistent by construction; the agent reads field accesses on the enriched record instead of computing across the codebase.

**Trap:** Pre-building transforms for hypothetical consumers creates intermediate shapes the agent must understand and maintain with no active reuse.

**Removes smells:** Data Clumps, Mutable Data

---
name: split-phase
description: Apply Split Phase when you see Divergent Change, Long Function. Each phase reads and writes its own well-defined inputs and outputs; the agent reasons about phases independently with the intermediate shape as the contract.
---

# Apply: 11 — Split Phase

**Symptom:** The agent finds a function that conflates two concerns in interleaved code; reasoning about either concern requires tracing through the other.

**Goal:** Each phase reads and writes its own well-defined inputs and outputs; the agent reasons about phases independently with the intermediate shape as the contract.

```js
// Avoid:
function priceAndRender(input) {
  let total = 0;
  for (const item of input.items) total += item.qty * item.price;
  if (input.member) total *= 0.95;
  return `<p>Total: ${(total / 100).toFixed(2)} for ${input.items.length} items</p>`;
}

// Prefer:
function pricing(input) {
  let total = 0;
  for (const item of input.items) total += item.qty * item.price;
  if (input.member) total *= 0.95;
  return { items: input.items, totalCents: total };
}
function render({ items, totalCents }) {
  return `<p>Total: ${(totalCents / 100).toFixed(2)} for ${items.length} items</p>`;
}
```

**Pressure:** The agent must trace interleaved concerns through one function body; testing or modifying either requires reasoning about both.

**Tradeoff:** The intermediate data structure is overhead; for functions where the two phases are tightly coupled (shared mutable locals, observer effects), splitting adds a seam without buying isolation.

**Relief:** Each phase becomes the agent's unit of reasoning; the intermediate shape documents the contract; testing and modification isolate to one phase at a time.

**Trap:** Splitting tightly-coupled phases creates an artificial seam the agent must coordinate across — the intermediate shape leaks one phase's implementation into the next.

**Removes smells:** Divergent Change, Long Function

---
name: slide-statements
description: Apply Slide Statements when you see Long Function, Comments. Related statements sit next to each other; the agent reads the function as a sequence of cohesive blocks ready for extraction.
---

# Apply: 14 — Slide Statements

**Symptom:** A function whose related statements are interleaved with unrelated work; the agent reasoning about any sub-step must track state across non-adjacent lines.

**Goal:** Related statements sit next to each other; the agent reads the function as a sequence of cohesive blocks ready for extraction.

```js
// Avoid:
const basePrice = qty * itemPrice;
logPriceCalc(basePrice);
const tax = basePrice * 0.1;
logTaxCalc(tax);

// Prefer:
const basePrice = qty * itemPrice;
const tax = basePrice * 0.1;
logPriceCalc(basePrice);
logTaxCalc(tax);
```

**Pressure:** The agent holds partial sub-step state across non-adjacent lines; reasoning about any single concern requires tracking the others through the interleave.

**Tradeoff:** Sliding can silently change behavior if statements aren't truly independent (hidden side effects, timing dependencies, observer effects); the agent verifying the slide must confirm independence at every gap.

**Relief:** The function reads as cohesive blocks the agent can extract or reason about as units; setup for further refactoring becomes mechanical.

**Trap:** Aggressive sliding without verifying side-effect ordering — observer logs, time reads, async dispatch — silently changes behavior the agent's local tests may not catch.

**Removes smells:** Long Function, Comments

---
name: split-loop
description: Apply Split Loop when you see Long Function, Loops. Each loop does one thing; the agent reasons about one concern per loop and can replace each loop independently with a pipeline.
---

# Apply: 15 — Split Loop

**Symptom:** A single loop body that mixes filter, map, reduce, and side-effect concerns; the agent verifying any change must trace all concerns through the same iteration.

**Goal:** Each loop does one thing; the agent reasons about one concern per loop and can replace each loop independently with a pipeline.

```js
// Avoid:
let totalSalary = 0;
let youngest = Infinity;
for (const p of people) {
  if (p.age < youngest) youngest = p.age;
  totalSalary += p.salary;
}

// Prefer:
const totalSalary = people.reduce((s, p) => s + p.salary, 0);
const youngest    = Math.min(...people.map(p => p.age));
```

**Pressure:** The agent's per-line reasoning must account for every concern the loop body addresses; changing one concern risks silent interaction with the others.

**Tradeoff:** Two loops over the same collection cost more per iteration than one; for hot paths the runtime overhead matters and the agent verifying performance must measure.

**Relief:** Each loop becomes an independently-replaceable unit (pipeline candidate); the agent's edit surface per concern shrinks.

**Trap:** Splitting loops whose concerns share per-iteration state — accumulator-of-running-difference, look-behind logic — fragments coupled state the agent must now re-derive in each split.

**Removes smells:** Long Function, Loops

---
name: replace-loop-with-pipeline
description: Apply Replace Loop with Pipeline when you see Loops. Transformations read as named operation sequences (filter, map, reduce); the agent recognizes the shape without simulating the loop.
---

# Apply: 16 — Replace Loop with Pipeline

**Symptom:** Imperative for/while loops where the agent must mentally execute the body to learn the result; the loop's purpose isn't readable from its shape.

**Goal:** Transformations read as named operation sequences (filter, map, reduce); the agent recognizes the shape without simulating the loop.

```js
// Avoid:
const seniors = [];
for (const u of users) {
  if (u.age >= 65) seniors.push(u.name);
}

// Prefer:
const seniors = users
  .filter(u => u.age >= 65)
  .map(u => u.name);
```

**Pressure:** The agent must trace the loop body step by step to verify behavior; off-by-one bugs hide where the agent's mental simulation diverges from runtime.

**Tradeoff:** Pipeline form adds per-element call overhead and forces the agent to track intermediate collection types through the chain; for hot paths the runtime cost matters.

**Relief:** Intent is readable; the agent reasons about each pipeline stage independently with type signatures documenting the transformation.

**Trap:** Forcing every loop into a pipeline — including ones with early-exit, side-effects, or sequential dependencies — produces twisted .reduce() bodies the agent has to untangle to understand.

**Removes smells:** Loops

---
name: replace-derived-variable-with-query
description: Apply Replace Derived Variable with Query when you see Mutable Data. Derived values are computed on demand; the agent reasons about state by reading source fields and trusting derivations.
---

# Apply: 20 — Replace Derived Variable with Query

**Symptom:** The agent finds a field whose value mirrors a computation on other fields; every writer of the source field must update the derived field consistently or the values drift.

**Goal:** Derived values are computed on demand; the agent reasons about state by reading source fields and trusting derivations.

```js
// Avoid:
class Order {
  items;
  total;
  add(item) { this.items.push(item); this.total += item.price; }
}

// Prefer:
class Order {
  items;
  add(item)  { this.items.push(item); }
  total()    { return this.items.reduce((s, i) => s + i.price, 0); }
}
```

**Pressure:** The agent must trace every writer of the source field to verify the derived field stays in sync; bugs hide where one writer forgot to update the derivation.

**Tradeoff:** Recomputing on every read can multiply cost if the derivation is expensive and the source rarely changes; the agent verifying performance must measure before deciding.

**Relief:** Mutation scope shrinks to source fields; the agent reasons about state without modeling derivation update timing; consistency is by construction.

**Trap:** Replacing every derived field with a query — including ones wrapping expensive computations called many times — trades runtime cost for correctness without measuring the impact.

**Removes smells:** Mutable Data

---
name: split-variable
description: Apply Split Variable when you see Mysterious Name, Mutable Data. Each variable holds one role with a stable name; the agent reasons about names without tracking reassignment timeline.
---

# Apply: 18 — Split Variable

**Symptom:** The agent finds a variable reassigned with values of conceptually different types or domains; reasoning about any expression involving it requires knowing which role is currently active.

**Goal:** Each variable holds one role with a stable name; the agent reasons about names without tracking reassignment timeline.

```js
// Avoid:
let temp = 2 * (height + width);
console.log(temp);
temp = height * width;
console.log(temp);

// Prefer:
const perimeter = 2 * (height + width);
console.log(perimeter);
const area = height * width;
console.log(area);
```

**Pressure:** The agent must trace through reassignments to know what any reference currently means; type-narrowing in unions becomes guesswork at every read site.

**Tradeoff:** If the two uses were actually coupled (shared init, synchronized update), splitting forces the agent to re-derive the coupling across two variables.

**Relief:** The agent reasons about each variable as a stable name; the type system can narrow each role; each use becomes independently refactorable.

**Trap:** Splitting variables whose uses genuinely shared state forces the agent to re-establish the coupling outside the variable, complicating the original logic.

**Removes smells:** Mysterious Name, Mutable Data

---
name: move-statements-into-function
description: Apply Move Statements into Function when you see Duplicated Code. The function owns its setup and follow-up; the agent verifies behavior at the function definition instead of auditing every call site.
---

# Apply: 44 — Move Statements into Function

**Symptom:** The agent finds the same setup or follow-up code around every call to a function; consistency depends on every caller remembering the pattern.

**Goal:** The function owns its setup and follow-up; the agent verifies behavior at the function definition instead of auditing every call site.

```js
// Avoid:
log('start fetch');
const data  = fetch(url);
log('start fetch');
const data2 = fetch(url2);

// Prefer:
function fetchLogged(url) {
  log('start fetch');
  return fetch(url);
}
```

**Pressure:** Every caller is a chance to miss the boilerplate or misorder it; the agent verifying consistency must check every site individually.

**Tradeoff:** If some callers genuinely don't want the moved behavior, the function grows a flag argument and the agent must reason about which mode each caller wants.

**Relief:** The agent reasons about the function's full contract from its definition; consistency is enforced by the function, not by convention.

**Trap:** Moving statements into a function some callers don't want adds a flag argument the agent must thread through every call site — substitutes one boilerplate for another.

**Removes smells:** Duplicated Code

---
name: move-statements-to-callers
description: Apply Move Statements to Callers when you see Divergent Change. The function's body addresses one responsibility; callers express their differences at the call site.
---

# Apply: 45 — Move Statements to Callers

**Symptom:** The agent finds a function body whose statements vary by caller context — logging contexts, post-processing flags, metric labels baked into one body via branches.

**Goal:** The function's body addresses one responsibility; callers express their differences at the call site.

```js
// Avoid:
function emit(line) {
  log.write(line);
  metrics.tick();
}

// Prefer:
function emit(line) { log.write(line); }
emit('startup');
metrics.tick();
```

**Pressure:** Adding a new caller forces extending the function's branches; the agent must reason about which branch applies and verify branch coverage at every site.

**Tradeoff:** If most callers want the moved statements, the agent now sees duplicated boilerplate at every call site — the inverse smell.

**Relief:** The function's contract narrows to its single responsibility; callers express variation explicitly; the agent reasons about one body and one branch per caller.

**Trap:** Pushing statements to callers when most callers want them creates duplication the agent must keep in sync across every site — substitutes one smell for another.

**Removes smells:** Divergent Change

---
name: replace-inline-code-with-function-call
description: Apply Replace Inline Code with Function Call when you see Duplicated Code. One canonical implementation the agent loads once and references everywhere; the name labels the intent at every call site.
---

# Apply: 46 — Replace Inline Code with Function Call

**Symptom:** The agent finds inline code that reproduces the body of a named function elsewhere in the codebase; consistency depends on both implementations staying in sync.

**Goal:** One canonical implementation the agent loads once and references everywhere; the name labels the intent at every call site.

```js
// Avoid:
const inRange = candidate >= low && candidate <= high;

// Prefer:
const inRange = between(candidate, low, high);
```

**Pressure:** Two implementations drift over time; the agent verifying changes must update both or risk inconsistency the type checker doesn't catch.

**Tradeoff:** If the existing function's name doesn't quite match the local intent, the agent reads the call site as a near-miss and must verify the semantic match at every replacement.

**Relief:** The agent reasons about one definition; future improvements reach every site that used to inline; consistency is enforced by reference.

**Trap:** Replacing inline code with a call to a poorly-named function smears semantic mismatch across the codebase — the agent must constantly verify that the function's name still describes the local use.

**Removes smells:** Duplicated Code

---
name: replace-temp-with-query
description: Apply Replace Temp with Query when you see Long Function, Mutable Data. Computations become named queries the agent can reference by name from anywhere; functions decompose without dragging the temp's lifetime.
---

# Apply: 47 — Replace Temp with Query

**Symptom:** The agent finds a local variable assigned once from a computation and referenced multiple times; the temp's existence couples the rest of the function to the computation's locality.

**Goal:** Computations become named queries the agent can reference by name from anywhere; functions decompose without dragging the temp's lifetime.

```js
// Avoid:
function bill() {
  const basePrice = qty * itemPrice;
  if (basePrice > 1000) return basePrice * 0.95;
  return basePrice;
}

// Prefer:
function bill() {
  if (basePrice() > 1000) return basePrice() * 0.95;
  return basePrice();
}
function basePrice() { return qty * itemPrice; }
```

**Pressure:** The agent extracting parts of the function must thread the temp through every extracted helper; the named computation can't be reused outside the function.

**Tradeoff:** If the temp wraps an expensive calculation called many times, naive replacement multiplies cost; the agent verifying performance must measure or cache before substituting.

**Relief:** The agent's plan-and-execute loop for Extract Function becomes mechanical; the named query is reusable anywhere it makes sense.

**Trap:** Replacing temps that wrap expensive computations called many times multiplies runtime cost the agent's local tests may not catch.

**Removes smells:** Long Function, Mutable Data

---
name: replace-function-with-command
description: Apply Replace Function with Command when you see Long Function. Sub-steps become named methods sharing state via fields; the agent reasons about each step in isolation and extracts/tests them independently.
---

# Apply: 48 — Replace Function with Command

**Symptom:** A function whose body holds many shared locals across conceptually distinct sub-steps; the agent extracting any step must thread temps through helper parameters.

**Goal:** Sub-steps become named methods sharing state via fields; the agent reasons about each step in isolation and extracts/tests them independently.

```js
// Avoid:
function score(candidate) {
  let total = candidate.experience * 10;
  if (candidate.hasCertifications) total += 25;
  total -= candidate.gaps * 5;
  total += candidate.referrals * 8;
  return total;
}

// Prefer:
class Scorer {
  constructor(candidate) { this.candidate = candidate; }
  execute() {
    return this.base() + this.bonus() - this.penalty();
  }
  base()    { return this.candidate.experience * 10 + (this.candidate.hasCertifications ? 25 : 0); }
  bonus()   { return this.candidate.referrals * 8; }
  penalty() { return this.candidate.gaps * 5; }
}
new Scorer(candidate).execute();
```

**Pressure:** Every step the agent wants to extract drags shared state through parameter lists; the function's algorithm shape resists decomposition.

**Tradeoff:** Command ceremony (constructor + execute + named private methods) is overhead for functions without genuine multi-step state; the agent now navigates a class where one function used to suffice.

**Relief:** Each sub-step becomes a named method on the command; the agent extracts and tests them in pieces without rewiring shared state.

**Trap:** Promoting every long function to a command — including ones with no genuine shared state — adds class ceremony the agent must navigate without gaining any decomposition advantage.

**Removes smells:** Long Function

---
name: replace-command-with-function
description: Apply Replace Command with Function when you see Speculative Generality, Lazy Element. The command collapses to a plain function; the agent's call sites become direct invocations.
---

# Apply: 49 — Replace Command with Function

**Symptom:** A command class whose execute() does the work in one shot with no sub-step decomposition; callers go through construct-then-call ceremony for what could be one function.

**Goal:** The command collapses to a plain function; the agent's call sites become direct invocations.

```js
// Avoid:
class ChargeCalculator {
  constructor(c, o) { this.c = c; this.o = o; }
  execute() { return this.c.base + this.o.tax; }
}
new ChargeCalculator(c, o).execute();

// Prefer:
function charge(c, o) { return c.base + o.tax; }
charge(c, o);
```

**Pressure:** Every caller pays the construct-then-call hop; the agent reasoning about behavior loads a class to find a single function.

**Tradeoff:** If the command held genuinely useful intermediate state, collapsing regrows the temps it eliminated; the agent verifying the collapse must check whether any internal decomposition is load-bearing.

**Relief:** Fewer files; shorter call stacks; the agent's plan-and-execute loop touches the function directly without the construct-then-call hop.

**Trap:** Collapsing commands that genuinely decomposed into named sub-steps regrows the temps they eliminated and the function-with-many-locals smell returns.

**Removes smells:** Speculative Generality, Lazy Element

---
name: return-modified-value
description: Apply Return Modified Value when you see Mutable Data. The function returns the modified value; the agent reads the signature and knows the function is a transformation, not a mutator.
---

# Apply: 50 — Return Modified Value

**Symptom:** A function that mutates one of its parameters in place; the agent reading the signature can't tell which parameters get mutated without reading the body.

**Goal:** The function returns the modified value; the agent reads the signature and knows the function is a transformation, not a mutator.

```js
// Avoid:
function addTax(order) {
  order.total *= 1.1;
}
addTax(order);

// Prefer:
function withTax(order) {
  return { ...order, total: order.total * 1.1 };
}
order = withTax(order);
```

**Pressure:** The agent reasoning about any call must check the function body to identify which parameters mutate; equality, snapshotting, and composition all become guarded.

**Tradeoff:** Callers must remember to capture the returned value; if any forget they keep the unmodified original, which the agent verifying must check at every call site (or rely on a readonly parameter type).

**Relief:** Side effects on inputs disappear from the agent's contract reasoning; the function reads as a pure transformation; composition and snapshotting work.

**Trap:** Forcing return-modified-value on every in-place mutator — including ones where mutation is the contract callers want (performance-critical batch ops) — substitutes one mismatch for another.

**Removes smells:** Mutable Data

---
name: substitute-algorithm
description: Apply Substitute Algorithm when you see Long Function, Loops. The clearer algorithm replaces the bespoke; the agent reasons about a recognized pattern instead of reverse-engineering the original.
---

# Apply: 51 — Substitute Algorithm

**Symptom:** The agent encounters a convoluted or hand-rolled algorithm where a well-known pattern produces the same outputs; reasoning about the bespoke version is expensive per read.

**Goal:** The clearer algorithm replaces the bespoke; the agent reasons about a recognized pattern instead of reverse-engineering the original.

```js
// Avoid:
function found(people, n) {
  for (const p of people) if (p.name === n) return p;
  return null;
}

// Prefer:
function found(people, n) {
  return people.find(p => p.name === n) ?? null;
}
```

**Pressure:** Every read of the bespoke algorithm pays the same decoding cost; the agent can't trust correctness without re-deriving the algorithm's invariants on every change.

**Tradeoff:** Swapping algorithms wholesale forfeits behavioral safety unless every input boundary is characterized first; the agent that substitutes without characterization tests ships silent regressions.

**Relief:** The agent recognizes the algorithm by name and reasons about it via its standard properties; correctness arguments become reusable.

**Trap:** Substituting without characterization tests at every input boundary ships silent regressions where the original quietly handled edge cases the substitute handles differently.

**Removes smells:** Long Function, Loops

### Encapsulation

---
name: encapsulate-variable
description: Apply Encapsulate Variable when you see Global Data, Mutable Data. All access goes through a small named function the agent can grep for, audit, and instrument as a single closed surface.
---

# Apply: 06 — Encapsulate Variable

**Symptom:** The agent finds a variable read and written from multiple consumers with no central function owning the access; reasoning about any read requires modeling every writer.

**Goal:** All access goes through a small named function the agent can grep for, audit, and instrument as a single closed surface.

```js
// Avoid:
let defaultOwner = { firstName: 'Martin', lastName: 'Fowler' };

// Prefer:
let _defaultOwner = { firstName: 'Martin', lastName: 'Fowler' };
function defaultOwner() { return _defaultOwner; }
function setDefaultOwner(o) { _defaultOwner = o; }
```

**Pressure:** Any change to validation, logging, or invariants requires the agent to update every consumer; concurrent edits compound the search-and-update cost.

**Tradeoff:** Indirection at every call site adds a hop; if any consumer leaks past the wrapper, the encapsulation's safety promise silently breaks and the agent assumes guarantees that don't hold.

**Relief:** The agent has one audit point for validation/logging/invariants; consumers don't need to change when the wrapper grows new behavior.

**Trap:** Wrapping the variable without enforcing wrapper-only access leaves leaks the agent doesn't see; the wrapper becomes a false safety signal.

**Removes smells:** Global Data, Mutable Data

---
name: hide-delegate
description: Apply Hide Delegate when you see Message Chains. Callers ask the closest object directly; the agent reasons about one boundary instead of traversing N.
---

# Apply: 41 — Hide Delegate

**Symptom:** The agent finds long dotted access paths through several object hops; renaming any intermediate field silently breaks every caller.

**Goal:** Callers ask the closest object directly; the agent reasons about one boundary instead of traversing N.

```js
// Avoid:
const street = order.customer.address.street;

// Prefer:
// inside Order: customerStreet() { return this.customer.address.street; }
const street = order.customerStreet();
```

**Pressure:** Every link in the chain is a coupling point the agent holds in working memory; refactoring any intermediate shape requires updating every chain access.

**Tradeoff:** Each hidden delegate adds a passthrough method on the host; for chains used in one place the passthrough is overhead the agent now maintains in two places.

**Relief:** Encapsulation tightens; the agent reasons about one boundary; intermediate objects can change shape without breaking callers.

**Trap:** Wrapping every dotted chain in passthroughs migrates the chain from call sites into the host's surface — the agent now wades through a wall of delegations to find real behavior.

**Removes smells:** Message Chains

---
name: remove-middle-man
description: Apply Remove Middle Man when you see Middle Man. Callers talk to the real object directly; the agent's call traces are shorter and the implementation's location is obvious.
---

# Apply: 42 — Remove Middle Man

**Symptom:** A class whose methods all delegate straight through to another object; the agent traces every call to the real implementation through the passthrough hop.

**Goal:** Callers talk to the real object directly; the agent's call traces are shorter and the implementation's location is obvious.

```js
// Avoid:
class Manager {
  reports() { return this.team.members(); }
}

// Prefer:
// Expose team directly when the wrapper adds nothing.
manager.team.members();
```

**Pressure:** The agent navigates the indirection on every reasoning step; refactoring the delegate's API requires the agent to update both classes in sync.

**Tradeoff:** Direct access exposes the real object's full surface to every consumer; the agent loses any encapsulation the middle man was providing (even if mostly cosmetic).

**Relief:** Fewer files; shorter call stacks; the agent's plan-and-execute loop touches the real implementation directly.

**Trap:** Deleting a passthrough that was doing real work — authorization, validation, auditing — removes a load-bearing layer the agent didn't recognize because the trivial-looking delegation masked it.

**Removes smells:** Middle Man

---
name: encapsulate-collection
description: Apply Encapsulate Collection when you see Mutable Data, Insider Trading. The owner exposes mutation methods (add, remove, replace); reads return snapshots or iterators; the agent reasons about collection invariants on the owner alone.
---

# Apply: 52 — Encapsulate Collection

**Symptom:** A class returns its internal collection directly; the agent reading any consumer cannot tell whether mutations will affect the owner without checking every consumer.

**Goal:** The owner exposes mutation methods (add, remove, replace); reads return snapshots or iterators; the agent reasons about collection invariants on the owner alone.

```js
// Avoid:
class Person {
  courses;
  getCourses() { return this.courses; }
}

// Prefer:
class Person {
  #courses = [];
  courses()       { return [...this.#courses]; }
  enroll(course)  { this.#courses.push(course); }
  drop(course)    { this.#courses = this.#courses.filter(c => c !== course); }
}
```

**Pressure:** Any consumer can mutate the collection in ways another consumer didn't expect; the agent verifying behavior must trace every read+mutation site to confirm invariants.

**Tradeoff:** Returning a shallow copy on every read can hide bugs where callers expected mutation-back; the agent must be explicit about the read contract or risk silent no-ops.

**Relief:** The owner enforces invariants in one place; the agent refactoring the collection's internal shape stays local to the owner.

**Trap:** Returning copies silently changes the contract callers depended on — the agent shipping the encapsulation must verify every reader doesn't rely on mutate-the-returned-collection semantics.

**Removes smells:** Mutable Data, Insider Trading

---
name: encapsulate-record
description: Apply Encapsulate Record when you see Data Class, Primitive Obsession. The record is a class with accessors; the agent reasons about its shape, invariants, and behavior in one definition.
---

# Apply: 53 — Encapsulate Record

**Symptom:** A plain object passed across the codebase; the agent reading any consumer must inspect every other consumer to learn what shape the record actually has.

**Goal:** The record is a class with accessors; the agent reasons about its shape, invariants, and behavior in one definition.

```js
// Avoid:
const org = { name: 'Acme', country: 'US' };
console.log(org.name);

// Prefer:
class Org {
  constructor({ name, country }) { this._name = name; this._country = country; }
  name()    { return this._name; }
  country() { return this._country; }
}
console.log(new Org(org).name());
```

**Pressure:** Field changes ripple through every consumer; the agent must coordinate updates and verify each consumer respects the (implicit) contract.

**Tradeoff:** Wrapping every record adds construction ceremony at every entry; for records without invariants or behavior to attract, the agent gains nothing for the per-call cost.

**Relief:** Field renames stay internal; invariants enforce in one place; the agent reasons about the class as a real domain object.

**Trap:** Wrapping records on principle without invariants or behavior to add creates classes the agent must instantiate everywhere with no encapsulation gain.

**Removes smells:** Data Class, Primitive Obsession

---
name: remove-setting-method
description: Apply Remove Setting Method when you see Mutable Data, Data Class. Construction is the only path to setting these fields; the agent reasons about the object as immutable-after-construction.
---

# Apply: 54 — Remove Setting Method

**Symptom:** The agent finds setters on a class whose values should only be set at construction; every late-mutation site is using setters for one-shot assignment.

**Goal:** Construction is the only path to setting these fields; the agent reasons about the object as immutable-after-construction.

```js
// Avoid:
class Person {
  setName(n) { this._name = n; }
}

// Prefer:
class Person {
  constructor(name) { this._name = name; }
  name() { return this._name; }
}
```

**Pressure:** Late mutations break the agent's reasoning about invariants between operations; the agent must trace every setter call to verify timing assumptions.

**Tradeoff:** Removing a setter forces every legitimate update through a more meaningful method; the agent must verify each setter call has a domain action that justifies replacing it.

**Relief:** The agent reasons about the class as immutable-after-construction; bugs from late mutation vanish; the API expresses what users can actually do.

**Trap:** Removing setters that meaningfully encoded a domain state change — like markPaid() coordinating paidAt+status — without replacing them with the equivalent domain method strips the semantic anchor.

**Removes smells:** Mutable Data, Data Class

### Moving Features

---
name: move-function
description: Apply Move Function when you see Feature Envy, Shotgun Surgery, Insider Trading, Divergent Change. Each function lives where its data lives; the agent loads one class to reason about one behavior.
---

# Apply: 12 — Move Function

**Symptom:** A function's body references foreign-class data more than its own; the agent loading the function must also load the foreign class to verify any change.

**Goal:** Each function lives where its data lives; the agent loads one class to reason about one behavior.

```js
// Avoid:
class Order {
  account;
  isVip() {
    return this.account.tier === 'gold' && this.account.yearsActive >= 3;
  }
}

// Prefer:
class Account {
  tier; yearsActive;
  isVip() { return this.tier === 'gold' && this.yearsActive >= 3; }
}
class Order { account; }
order.account.isVip();
```

**Pressure:** Each call to the envious function pulls a second class into the agent's working context; chained reasoning across the boundary compounds the load.

**Tradeoff:** Dependencies don't always travel cleanly — circular imports surface at the destination, and the agent's mental map of 'where does this live' briefly breaks until indices refresh.

**Relief:** The function's data sits inside the agent's current reasoning context; verifying behavior touches one class instead of two.

**Trap:** Mechanical move-the-function-to-the-data on every cross-class read creates a fan-out the agent must follow at every call site — the cure becomes a worse smell than the original.

**Removes smells:** Feature Envy, Shotgun Surgery, Insider Trading, Divergent Change

---
name: move-field
description: Apply Move Field when you see Shotgun Surgery, Insider Trading. Each field lives where its lifecycle is owned; the agent loads one class to reason about both the field and its determining data.
---

# Apply: 13 — Move Field

**Symptom:** The agent finds a field on class A whose value is determined by data on class B; reasoning about the field's value requires loading B to verify the derivation.

**Goal:** Each field lives where its lifecycle is owned; the agent loads one class to reason about both the field and its determining data.

```js
// Avoid:
class Customer {
  plan;
  discountRate;
}
// every customer in a given plan gets the same rate:
customers.forEach(c => c.discountRate = c.plan.kind === 'gold' ? 0.15 : 0.05);

// Prefer:
class Plan {
  kind;
  discountRate;
}
class Customer { plan; }
customer.plan.discountRate;
```

**Pressure:** Every consumer must maintain the cross-class invariant; the agent verifying any change must coordinate updates across both classes.

**Tradeoff:** Every reader of the original class now reaches across the new boundary; coupling drops at the field's new home but reappears at each consumer the agent must follow.

**Relief:** Class boundaries align with data ownership; the agent reasons about mutations locally; refactoring becomes safer because the field's true owner is visible.

**Trap:** Moving fields purely on derivation grounds — without checking whether the original class's identity depends on the field's presence — breaks consumer expectations the agent didn't model.

**Removes smells:** Shotgun Surgery, Insider Trading

---
name: extract-class
description: Apply Extract Class when you see Data Clumps, Temporary Field, Large Class, Primitive Obsession. Each class has one purpose; the agent loads a small focused file to reason about any single concept.
---

# Apply: 39 — Extract Class

**Symptom:** A class whose surface mixes multiple cohesive sub-concepts; the agent reasoning about any single concept must skim past the others to find what it needs.

**Goal:** Each class has one purpose; the agent loads a small focused file to reason about any single concept.

```js
// Avoid:
class Person {
  name;
  officeAreaCode;
  officeNumber;
  telephoneNumber() { return `(${this.officeAreaCode}) ${this.officeNumber}`; }
}

// Prefer:
class Phone {
  areaCode;
  number;
  toString() { return `(${this.areaCode}) ${this.number}`; }
}
class Person { name; phone; }
```

**Pressure:** The agent's reasoning context per method inflates with unrelated members; changes to one concept require reasoning about all of them.

**Tradeoff:** Extracting too eagerly — 1-2 fields with no behavior — adds a class file the agent must load with no encapsulation gain.

**Relief:** Smaller focused units; the agent tests one concept at a time and reasons about each class as a coherent whole.

**Trap:** Extracting candidate concepts that are just trivial field groups creates class files the agent must navigate without buying any encapsulation gain.

**Removes smells:** Data Clumps, Temporary Field, Large Class, Primitive Obsession

---
name: inline-class
description: Apply Inline Class when you see Lazy Element, Speculative Generality. The class folds into its primary collaborator; the agent loads one file for what was two.
---

# Apply: 55 — Inline Class

**Symptom:** A class with too few responsibilities for its own file; the agent loads the class to reason about behavior that would naturally live with the absorber.

**Goal:** The class folds into its primary collaborator; the agent loads one file for what was two.

```js
// Avoid:
class TrackingInformation {
  shippingCompany;
  trackingNumber;
  display() { return `${this.shippingCompany}: ${this.trackingNumber}`; }
}
class Shipment { tracking; }

// Prefer:
class Shipment {
  shippingCompany;
  trackingNumber;
  display() { return `${this.shippingCompany}: ${this.trackingNumber}`; }
}
```

**Pressure:** Every reference site costs a file-jump the agent must pay; the indirection is overhead for trivial behavior.

**Tradeoff:** If the absorber is already large, inlining pushes it past its complexity budget — the agent now loads a god-class to reason about what was previously separated.

**Relief:** Fewer files; shorter call paths; the absorber's coherence improves when it owns the methods it was orchestrating.

**Trap:** Inlining into an already-large class creates a worse Large Class smell — the agent must reason about a god-class instead of two focused ones.

**Removes smells:** Lazy Element, Speculative Generality

### Organizing Data

---
name: replace-primitive-with-object
description: Apply Replace Primitive with Object when you see Primitive Obsession. Each domain concept has its own typed wrapper; the agent's type checker catches wrong-primitive-in-wrong-slot before runtime.
---

# Apply: 40 — Replace Primitive with Object

**Symptom:** Function signatures use raw strings and numbers where domain concepts hide; the agent cannot tell from the type whether an argument is the right kind of thing.

**Goal:** Each domain concept has its own typed wrapper; the agent's type checker catches wrong-primitive-in-wrong-slot before runtime.

```js
// Avoid:
function priceFor(cents, currency) {
  // ...
}

// Prefer:
class Money { /* amount + currency, with arithmetic */ }
function priceFor(money) {
  // ...
}
```

**Pressure:** The agent must inspect call-site context (variable names, surrounding code) to verify a primitive is the right kind; validation and formatting scatter.

**Tradeoff:** Each wrapper is a class the agent must instantiate at every entry point; for primitives without domain rules the wrapper is overhead with no return.

**Relief:** Wrong-primitive misuse becomes a type error the agent catches without runtime testing; behavior accretes around the concept where the agent expects to find it.

**Trap:** Wrapping every primitive — including ones with no domain rules — adds boilerplate the agent must navigate at every signature with no reasoning benefit.

**Removes smells:** Primitive Obsession

---
name: change-reference-to-value
description: Apply Change Reference to Value when you see Mutable Data. The object is immutable + equal-by-content; the agent reasons about value semantics without modeling write timing.
---

# Apply: 56 — Change Reference to Value

**Symptom:** A class with public mutable fields used by many consumers; the agent reasoning about any read must consider every other writer.

**Goal:** The object is immutable + equal-by-content; the agent reasons about value semantics without modeling write timing.

```js
// Avoid:
class Phone {
  constructor() { this.area = null; this.number = null; }
}
phone.area = '617';

// Prefer:
class Phone {
  constructor(area, number) { this._area = area; this._number = number; }
  area()         { return this._area; }
  number()       { return this._number; }
  withArea(area) { return new Phone(area, this._number); }
}
```

**Pressure:** The agent must trace every writer to model state at any read; concurrent reasoning is practically impossible.

**Tradeoff:** Comparison semantics shift from identity to equality; every call site that depended on === or identity caches needs the agent's review and update.

**Relief:** Concurrency hazards disappear; the type system can mark fields readonly; the agent reasons about the object as a stable value.

**Trap:** Switching domain entities (Customer, Account) to value semantics strips the identity the agent's consumers depended on — equality replaces 'this specific thing' with 'anything that looks like it'.

**Removes smells:** Mutable Data

---
name: change-value-to-reference
description: Apply Change Value to Reference when you see Duplicated Code. The entity exists once; the agent reasons about one canonical object referenced everywhere.
---

# Apply: 57 — Change Value to Reference

**Symptom:** Duplicate copies of a logically-single entity scattered across the codebase; the agent updating the entity must find and update every copy consistently.

**Goal:** The entity exists once; the agent reasons about one canonical object referenced everywhere.

```js
// Avoid:
// every order carries its own Customer copy
orders.forEach(o => o.customer = { name: 'Acme' });

// Prefer:
const acme = customerRepository.find('Acme');
orders.forEach(o => o.customer = acme);
```

**Pressure:** The agent must coordinate updates across every copy; identity becomes ambiguous and the agent can't tell which copy is canonical.

**Tradeoff:** Sharing references introduces lifetime and visibility ambiguities (who owns this? when does it get freed?) the agent must reason about; the original value-copies sidestepped this.

**Relief:** Updates land in one place; storage shrinks; the agent reasons about the entity as a single referent with meaningful identity.

**Trap:** Sharing references without explicit ownership creates lifetime ambiguities the agent must model — the cure introduces a different category of bug than the original duplication.

**Removes smells:** Duplicated Code

### Simplifying Conditional Logic

---
name: decompose-conditional
description: Apply Decompose Conditional when you see Long Function, Comments. Conditions read as named domain decisions; the agent reasons about isSummer(date) instead of re-deriving the month range.
---

# Apply: 21 — Decompose Conditional

**Symptom:** Multi-clause conditional expressions whose domain meaning isn't readable from the syntax; the agent must parse the expression every time it encounters it.

**Goal:** Conditions read as named domain decisions; the agent reasons about isSummer(date) instead of re-deriving the month range.

```js
// Avoid:
if (date < SUMMER_START || date > SUMMER_END) {
  charge = qty * winterRate + winterFee;
} else {
  charge = qty * summerRate;
}

// Prefer:
charge = isSummer(date)
  ? summerCharge(qty)
  : winterCharge(qty);
```

**Pressure:** The agent re-parses the expression at every reference; debugging the condition's value requires the agent to mentally evaluate the full chain.

**Tradeoff:** Extracted names that aren't crisper than the original condition add a layer of indirection — the agent now follows a name to find the same expression.

**Relief:** The agent reasons about named domain decisions; the branching logic reads top-to-bottom as a story.

**Trap:** Extracting names that don't sharpen the condition — `isMonthBetweenFiveAndEight` instead of `isSummer` — adds indirection without revealing intent.

**Removes smells:** Long Function, Comments

---
name: consolidate-conditional-expression
description: Apply Consolidate Conditional Expression when you see Duplicated Code. The conditions collapse into one named predicate; the agent reasons about one rule with one action.
---

# Apply: 22 — Consolidate Conditional Expression

**Symptom:** Multiple conditions in sequence lead to the same action; the agent must verify each branch leads to identical behavior and that adding a new condition won't accidentally diverge.

**Goal:** The conditions collapse into one named predicate; the agent reasons about one rule with one action.

```js
// Avoid:
if (employee.seniority < 2)        return 0;
if (employee.monthsDisabled > 12)  return 0;
if (employee.isPartTime)           return 0;

// Prefer:
if (isIneligibleForBonus(employee)) return 0;
```

**Pressure:** Adding or modifying any branch's behavior requires the agent to update every branch consistently; the shared rationale is invisible.

**Tradeoff:** If the conditions encode independent reasons (different rules that happen to produce the same outcome today), collapsing them hides distinctions the agent will need to re-split later.

**Relief:** The agent reasons about one named predicate with one consequent; new conditions extend in one place.

**Trap:** Collapsing conditions that look the same but encode independent rules hides distinctions the agent will need to re-split when one rule evolves differently from the others.

**Removes smells:** Duplicated Code

---
name: replace-nested-conditional-with-guard-clauses
description: Apply Replace Nested Conditional with Guard Clauses when you see Long Function, Comments. Edge cases bail out early; the main flow is unindented and reads linearly as the dominant story.
---

# Apply: 23 — Replace Nested Conditional with Guard Clauses

**Symptom:** A function with deeply nested if/else where the happy path is buried under indentation; the agent must trace through edge-case branches to find the main flow.

**Goal:** Edge cases bail out early; the main flow is unindented and reads linearly as the dominant story.

```js
// Avoid:
function payAmount(employee) {
  if (employee.isSeparated) {
    return separationPay(employee);
  } else {
    if (employee.isRetired) {
      return retirementPay(employee);
    } else {
      return regularPay(employee);
    }
  }
}

// Prefer:
function payAmount(employee) {
  if (employee.isSeparated) return separationPay(employee);
  if (employee.isRetired)   return retirementPay(employee);
  return regularPay(employee);
}
```

**Pressure:** The agent's parsing of the function's intent is obscured by indentation; reasoning about the happy path requires tracking which edge cases have already been ruled out.

**Tradeoff:** Early returns can duplicate work if multiple paths share follow-up logic; the agent inlining guards must verify the shared work is genuinely separable.

**Relief:** The agent reads the happy path linearly with edge cases as exceptions; new edge cases land at the top without disturbing the main flow.

**Trap:** Inlining guards for every condition — including ones that shared follow-up work — fragments the shared logic across early-return branches the agent must keep consistent.

**Removes smells:** Long Function, Comments

---
name: replace-conditional-with-polymorphism
description: Apply Replace Conditional with Polymorphism when you see Repeated Switches, Primitive Obsession. Each case is a class implementing a shared interface; the agent adds a new case by adding one class, and the type system tells it what's still missing.
---

# Apply: 24 — Replace Conditional with Polymorphism

**Symptom:** A switch on a type code that appears in multiple files; the agent adding a new case must grep for every site and update each consistently or risk silent inconsistency.

**Goal:** Each case is a class implementing a shared interface; the agent adds a new case by adding one class, and the type system tells it what's still missing.

```js
// Avoid:
switch (event.kind) {
  case 'click': return onClick(event);
  case 'key':   return onKey(event);
}

// Prefer:
event.handle(); // ClickEvent and KeyEvent each implement handle()
```

**Pressure:** Dispatch logic duplicates across files; the agent must enumerate and update every switch on every addition, with no compile-time check that the set is complete.

**Tradeoff:** Polymorphic dispatch is implicit at call sites — the agent can no longer see the full set of branches in one place and must enumerate subclasses across files to reason about behavior.

**Relief:** Adding a new variant is mechanical and the type checker enforces completeness; the agent's plan-and-execute loop for new cases is bounded.

**Trap:** Replacing every switch with polymorphism — including ones with two stable cases — creates a class hierarchy the agent must navigate without buying any extension flexibility.

**Removes smells:** Repeated Switches, Primitive Obsession

---
name: introduce-special-case
description: Apply Introduce Special Case when you see Repeated Switches, Comments. The special case responds to the same interface as the real case; the agent reasons without branching at every call site.
---

# Apply: 25 — Introduce Special Case

**Symptom:** The agent finds the same null-or-special check repeating across multiple consumers; consistency depends on every consumer remembering the pattern.

**Goal:** The special case responds to the same interface as the real case; the agent reasons without branching at every call site.

```js
// Avoid:
const name = customer === 'unknown' ? 'occupant' : customer.name;

// Prefer:
const name = customer.name; // UnknownCustomer.name returns 'occupant'
```

**Pressure:** Every consumer is a chance to miss the check; the agent verifying consistency must audit every site.

**Tradeoff:** Adding a Null Object class for a special case used in only one place creates ceremony around what was a one-line check; the agent now loads a class to handle one branch.

**Relief:** The agent reasons polymorphically; the special behavior lives in one class and consumers don't branch.

**Trap:** Introducing a Null Object class for special checks used in only one place creates a class the agent must load and reason about with no consistency gain.

**Removes smells:** Repeated Switches, Comments

---
name: replace-control-flag-with-break
description: Apply Replace Control Flag with Break when you see Loops, Long Function. The exit happens at the moment it's decided via break/return/continue; the agent reads the loop's termination as a direct statement.
---

# Apply: 58 — Replace Control Flag with Break

**Symptom:** A loop maintaining a boolean flag to decide when to stop; the agent reasoning about termination must track the flag's state through every iteration.

**Goal:** The exit happens at the moment it's decided via break/return/continue; the agent reads the loop's termination as a direct statement.

```js
// Avoid:
let found = false;
for (const p of people) {
  if (!found && p.name === target) {
    matched = p;
    found = true;
  }
}

// Prefer:
for (const p of people) {
  if (p.name === target) {
    matched = p;
    break;
  }
}
```

**Pressure:** The agent must mentally simulate the flag's lifecycle across iterations; bugs hide where the flag isn't set when expected.

**Tradeoff:** If the loop body is large, the break point becomes hidden inside the body and the agent must scan to find termination; extract a function around the body to keep the exit obvious.

**Relief:** The agent reads termination as a direct statement at the point of decision; the loop's intent becomes literal.

**Trap:** Replacing flags with breaks in large loop bodies buries the exit point — the agent must scan the body to find termination, which can be harder than tracking the flag.

**Removes smells:** Loops, Long Function

### Refactoring APIs

---
name: change-function-declaration
description: Apply Change Function Declaration when you see Mysterious Name, Long Parameter List, Alternative Classes with Different Interfaces. Names and signatures express what the function does; the agent reasons about call sites from the signature alone.
---

# Apply: 05 — Change Function Declaration

**Symptom:** A function whose name or signature doesn't match its behavior; the agent inferring intent from the call site gets misled and must read the body to verify.

**Goal:** Names and signatures express what the function does; the agent reasons about call sites from the signature alone.

```js
// Avoid:
function circum(radius) {
  return 2 * Math.PI * radius;
}

// Prefer:
function circumference(radius) {
  return 2 * Math.PI * radius;
}
```

**Pressure:** The agent must read the function body to verify call-site intent; chained edits compound the cost as the agent re-derives intent at every site.

**Tradeoff:** Every caller pays for the change at once; for cross-team consumers, the agent must coordinate updates or risk breaking external code.

**Relief:** Call sites read fluently; the agent's signature-based reasoning becomes trustworthy; mismatches surface at the boundary.

**Trap:** Reshaping signatures across team boundaries without coordination forces other consumers to rebuild — the agent shipping the change may not see the downstream breakage.

**Removes smells:** Mysterious Name, Long Parameter List, Alternative Classes with Different Interfaces

---
name: introduce-parameter-object
description: Apply Introduce Parameter Object when you see Long Parameter List, Data Clumps. The clump becomes a named value object the agent passes through as a single token; structure validation happens once at construction.
---

# Apply: 08 — Introduce Parameter Object

**Symptom:** The agent sees the same field group appearing across multiple signatures; every site re-parses the same shape and verifies the same ordering.

**Goal:** The clump becomes a named value object the agent passes through as a single token; structure validation happens once at construction.

```js
// Avoid:
function recordTemperature(low, high, value) { /* ... */ }
function alertIfOutOfRange(low, high, reading) { /* ... */ }

// Prefer:
class NumberRange {
  constructor(low, high) { this.low = low; this.high = high; }
}
function recordTemperature(range, value)   { /* ... */ }
function alertIfOutOfRange(range, reading) { /* ... */ }
```

**Pressure:** Adding or reordering a field touches every signature; the agent must find and update each consistently or risk silent positional drift.

**Tradeoff:** Constructing the object at every call adds an allocation and a name the agent must learn; if the clump appears in <3 places the wrapper is overhead.

**Relief:** Operations on the clump (formatting, validation, equality) live with it; the agent reasons about one named concept instead of N coupled fields.

**Trap:** Wrapping coincidental field groups creates fake value objects the agent must construct and destructure with no comprehension gain.

**Removes smells:** Long Parameter List, Data Clumps

---
name: introduce-assertion
description: Apply Introduce Assertion when you see Comments, Mutable Data. Invariants are stated explicitly; the agent reads them and reasons about behavior under their guarantee.
---

# Apply: 26 — Introduce Assertion

**Symptom:** Code that depends on unwritten invariants the agent must reconstruct from context; bugs that violate the invariant surface far from the source.

**Goal:** Invariants are stated explicitly; the agent reads them and reasons about behavior under their guarantee.

```js
// Avoid:
// rate must be positive
const tax = base * rate;

// Prefer:
if (rate <= 0) throw new Error('rate must be positive');
const tax = base * rate;
```

**Pressure:** The agent must reconstruct invariants from surrounding code; bugs surface far from the source and tracing them costs reasoning hops.

**Tradeoff:** Assertions used as control flow couple production behavior to debug-mode invariants; the agent that conflates the two ships a flow-dependent change disguised as documentation.

**Relief:** Invariants fail loudly at the source; the agent's debugging traces are short; assumptions become enforceable contracts.

**Trap:** Coupling production behavior to assertion presence/absence — the agent reads them as documentation but the runtime depends on them firing or not.

**Removes smells:** Comments, Mutable Data

---
name: separate-query-from-modifier
description: Apply Separate Query from Modifier when you see Mutable Data. Functions either return or mutate, never both; the agent composes queries without surprise side effects.
---

# Apply: 27 — Separate Query from Modifier

**Symptom:** A function the agent calls for a query also mutates state; the agent reasoning about safety must trace the mutation across consumers.

**Goal:** Functions either return or mutate, never both; the agent composes queries without surprise side effects.

```js
// Avoid:
function findMiscreant(people) {
  for (const p of people) {
    if (p.isMiscreant) { alert(p); return p; }
  }
}

// Prefer:
function findMiscreant(people) { return people.find(p => p.isMiscreant); }
function alertMiscreant(people) {
  const m = findMiscreant(people);
  if (m) alert(m);
}
```

**Pressure:** Every call to the function pays for both contracts; the agent can't query without triggering mutation, which complicates testing and composition.

**Tradeoff:** If the modification and query are genuinely atomic (find-and-remove, compare-and-swap), splitting them introduces a race window the agent must close at every call site.

**Relief:** The agent reasons about side effects locally; queries compose cleanly; tests target each shape independently.

**Trap:** Splitting atomic query-and-modify operations introduces race windows the agent must reason about at every call site — the cure becomes worse than the smell.

**Removes smells:** Mutable Data

---
name: parameterize-function
description: Apply Parameterize Function when you see Duplicated Code. One canonical function with a parameter; the agent reasons about one body and verifies parameter values at call sites.
---

# Apply: 28 — Parameterize Function

**Symptom:** The agent finds near-identical functions differing only in literal values; consistency depends on every variant staying in sync.

**Goal:** One canonical function with a parameter; the agent reasons about one body and verifies parameter values at call sites.

```js
// Avoid:
function tenPercentRaise(person)  { person.salary *= 1.10; }
function fivePercentRaise(person) { person.salary *= 1.05; }

// Prefer:
function raise(person, factor) { person.salary *= 1 + factor; }
```

**Pressure:** Bug fixes must land in every variant; the agent must find and update each consistently or risk drift.

**Tradeoff:** If the variations encode conceptually different operations, the parameterized function grows flags and special cases the agent must thread through — worse than the original duplication.

**Relief:** One canonical implementation the agent reasons about; new variations are new parameter values, not new code paths.

**Trap:** Parameterizing conceptually different operations accumulates flag-driven branches the agent must reason about — the function becomes a switch statement in disguise.

**Removes smells:** Duplicated Code

---
name: remove-flag-argument
description: Apply Remove Flag Argument when you see Long Parameter List. Each flag value becomes a named function; the agent reads call sites as direct invocations of the intended behavior.
---

# Apply: 29 — Remove Flag Argument

**Symptom:** A function with a flag parameter that dispatches to different internal behaviors; the agent must trace the flag's value through the body to verify which branch any call exercises.

**Goal:** Each flag value becomes a named function; the agent reads call sites as direct invocations of the intended behavior.

```js
// Avoid:
function setDimension(name, value) {
  if (name === 'height') /* ... */
  else if (name === 'width') /* ... */
}

// Prefer:
function setHeight(value) { /* ... */ }
function setWidth(value)  { /* ... */ }
```

**Pressure:** The agent must reason about flag values at every call site; the function's body conflates multiple concerns the agent must mentally split.

**Tradeoff:** If the branches share substantial body, splitting produces duplication the agent must keep in sync; pair this with Extract Function for shared internals.

**Relief:** Call sites read fluently; the agent reasons about one function per concern.

**Trap:** Splitting flag-dispatched functions without extracting shared body creates N copies of the same logic the agent must keep in sync — the cure becomes the duplication smell.

**Removes smells:** Long Parameter List

---
name: preserve-whole-object
description: Apply Preserve Whole Object when you see Long Parameter List, Data Clumps. The function takes the object; the agent updates one place when the function needs new fields.
---

# Apply: 30 — Preserve Whole Object

**Symptom:** The agent sees call sites unpacking multiple fields from an object to pass to a function; adding any field the function later needs touches every call site.

**Goal:** The function takes the object; the agent updates one place when the function needs new fields.

```js
// Avoid:
if (room.lowTemp < range.low || room.highTemp > range.high) { /* ... */ }

// Prefer:
if (range.includes(room)) { /* ... */ }
```

**Pressure:** Every call site is a coordination point; the agent verifying a signature change must update every unpacking explicitly.

**Tradeoff:** Passing the whole object couples the function to the object's full surface; the agent reasoning about the function must consider what other fields it might quietly read.

**Relief:** Signatures shrink; adding a needed field is an internal change; the agent reasons about one parameter at every call.

**Trap:** Passing whole objects when only one field is needed couples the function to the object's full surface the agent must consider as the function's input scope.

**Removes smells:** Long Parameter List, Data Clumps

---
name: replace-parameter-with-query
description: Apply Replace Parameter with Query when you see Long Parameter List. The function computes its own answer; the agent calls it without pre-computing the inputs.
---

# Apply: 31 — Replace Parameter with Query

**Symptom:** A function takes parameters its callers computed from data the function already has access to; the agent verifying any call must reproduce the caller's computation.

**Goal:** The function computes its own answer; the agent calls it without pre-computing the inputs.

```js
// Avoid:
const basePrice = order.qty * order.itemPrice;
const level = discountLevel(order);
const final = discounted(order, basePrice, level);

// Prefer:
const final = discounted(order); // computes basePrice and level itself
```

**Pressure:** Every caller pays the homework cost; the duplication of derivation logic scatters and the agent must keep callers in sync with the function's expectations.

**Tradeoff:** If the query is expensive or has side effects, replacing the parameter multiplies cost or introduces hidden coupling the agent must reason about.

**Relief:** Signatures shrink; the agent calls the function directly without reproducing caller-side derivations.

**Trap:** Replacing parameters with queries that are expensive or have side effects multiplies cost or introduces hidden coupling the agent reads as 'just a parameter swap'.

**Removes smells:** Long Parameter List

---
name: replace-query-with-parameter
description: Apply Replace Query with Parameter when you see Mutable Data, Insider Trading. Dependencies are visible in the signature; the agent reasons about the function as a pure transformation of its inputs.
---

# Apply: 59 — Replace Query with Parameter

**Symptom:** A function reads from a query (global, singleton, instance state) instead of accepting the value as a parameter; the agent reasoning about it must model the query's state.

**Goal:** Dependencies are visible in the signature; the agent reasons about the function as a pure transformation of its inputs.

```js
// Avoid:
function rebate(order) {
  return order.total * currency().rate;
}

// Prefer:
function rebate(order, rate) {
  return order.total * rate;
}
```

**Pressure:** The agent cannot test or compose the function without reproducing the query's state; reasoning about side effects requires modeling global timing.

**Tradeoff:** Pushing every internal query to a parameter bloats signatures the agent must thread through call sites — appropriate only for queries that touch global or volatile state.

**Relief:** The agent reasons about pure transformations; tests target the function in isolation; signatures document dependencies.

**Trap:** Externalizing every internal query — including ones reading stable encapsulated state — bloats signatures the agent must thread through every call site for marginal isolation benefit.

**Removes smells:** Mutable Data, Insider Trading

---
name: replace-constructor-with-factory-function
description: Apply Replace Constructor with Factory Function when you see Primitive Obsession, Speculative Generality. Construction goes through a named factory the agent can extend with validation, polymorphism, or caching as one location.
---

# Apply: 32 — Replace Constructor with Factory Function

**Symptom:** The agent finds constructors used directly where construction needs validation, subclass selection, or caching — none of which constructors can express.

**Goal:** Construction goes through a named factory the agent can extend with validation, polymorphism, or caching as one location.

```js
// Avoid:
const employee = new Employee(name, 'engineer', salary);

// Prefer:
function createEngineer(name, salary) {
  return new Employee(name, 'engineer', salary);
}
const employee = createEngineer(name, salary);
```

**Pressure:** The agent's reasoning about construction must consider pre-construction logic scattered at every call site; constructors hide the capability for the patterns the code actually needs.

**Tradeoff:** The factory hides the actual class from callers; the agent must ensure the factory's name still expresses the produced shape clearly or call sites become opaque.

**Relief:** The agent extends construction in one place; consumers don't depend on which concrete class they're getting.

**Trap:** Wrapping every constructor in a factory adds an indirection layer the agent must navigate without buying any new construction capability.

**Removes smells:** Primitive Obsession, Speculative Generality

---
name: replace-error-code-with-exception
description: Apply Replace Error Code with Exception when you see Comments. Failures throw exceptions the agent reasons about as separate control flow; the type system marks the failure path.
---

# Apply: 60 — Replace Error Code with Exception

**Symptom:** The agent finds functions returning numeric or string codes for failure; verifying error handling requires the agent to trace every caller and check whether the code is inspected.

**Goal:** Failures throw exceptions the agent reasons about as separate control flow; the type system marks the failure path.

```js
// Avoid:
function withdraw(amount) {
  if (amount > balance) return -1;
  balance -= amount;
  return 0;
}

// Prefer:
function withdraw(amount) {
  if (amount > balance) throw new InsufficientFunds();
  balance -= amount;
}
```

**Pressure:** Every caller is a chance to silently swallow the error; the agent verifying correctness must audit every call site for the check.

**Tradeoff:** Exceptions for predictable conditions misuse the mechanism; the agent ships try/catch around expected outcomes that should be values.

**Relief:** The agent reasons about success and failure paths separately; cleanup happens via finally / try-with; forgetting to handle no longer silently swallows.

**Trap:** Throwing for predictable conditions (not-found, validation failure) makes expected outcomes look like bugs to the agent reading the catch blocks.

**Removes smells:** Comments

---
name: replace-exception-with-precheck
description: Apply Replace Exception with Precheck when you see Comments. The precheck appears at the point of decision; the agent reads the code top-to-bottom as the rule, with exceptions reserved for truly exceptional cases.
---

# Apply: 61 — Replace Exception with Precheck

**Symptom:** The agent finds try/catch for conditions the caller could check directly; control flow via exceptions obscures the rule.

**Goal:** The precheck appears at the point of decision; the agent reads the code top-to-bottom as the rule, with exceptions reserved for truly exceptional cases.

```js
// Avoid:
try {
  return amounts[i] / 100;
} catch (e) {
  return 0;
}

// Prefer:
if (i >= amounts.length) return 0;
return amounts[i] / 100;
```

**Pressure:** The agent debugging exception flow must reason about catch handlers; benign throws fire breakpoints; the rule that 'should fire' isn't obvious from reading.

**Tradeoff:** Race conditions: the precheck may pass and the operation still fail (TOCTOU); the agent using prechecks must verify the caller can check the condition atomically.

**Relief:** The agent reads the rule top-to-bottom; debuggers stop catching benign throws; exception handlers reserve for truly exceptional cases.

**Trap:** Replacing exceptions with prechecks for conditions the caller can't atomically verify introduces race windows the agent's local tests won't catch.

**Removes smells:** Comments

### Dealing with Inheritance

---
name: pull-up-method
description: Apply Pull Up Method when you see Duplicated Code, Alternative Classes with Different Interfaces. The method lives on the shared superclass; the agent reasons about one implementation that all subclasses inherit.
---

# Apply: 33 — Pull Up Method

**Symptom:** Two or more subclasses implement the same method identically; the agent verifying behavior must check every subclass and confirm they actually agree.

**Goal:** The method lives on the shared superclass; the agent reasons about one implementation that all subclasses inherit.

```js
// Avoid:
class Manager  extends Employee { name() { return this._name; } }
class Engineer extends Employee { name() { return this._name; } }

// Prefer:
class Employee { name() { return this._name; } }
class Manager  extends Employee {}
class Engineer extends Employee {}
```

**Pressure:** Bug fixes must land in every copy; the agent verifying consistency must update every subclass and risk drift.

**Tradeoff:** If the methods only superficially resemble each other (same name, different semantics), pulling up creates a fake-shared abstraction the agent must constantly disambiguate.

**Relief:** One implementation; the agent reasons about one place for the shared behavior; subclasses focus on what's actually different.

**Trap:** Pulling up superficially-similar methods creates fake-shared behavior the agent must constantly verify means the same thing across subclasses.

**Removes smells:** Duplicated Code, Alternative Classes with Different Interfaces

---
name: push-down-method
description: Apply Push Down Method when you see Refused Bequest, Large Class. The method lives on the subclass that uses it; the agent's reasoning about the parent's surface is accurate to what most instances support.
---

# Apply: 34 — Push Down Method

**Symptom:** A method on the parent class used by only one subclass; the agent reading the parent's surface sees methods that don't apply to most instances.

**Goal:** The method lives on the subclass that uses it; the agent's reasoning about the parent's surface is accurate to what most instances support.

```js
// Avoid:
class Employee {
  quota() { /* used only by Salesperson */ }
}

// Prefer:
class Salesperson extends Employee {
  quota() { /* ... */ }
}
```

**Pressure:** The parent's interface is muddied with subclass-specific methods; the agent can't tell which methods apply to which subclass without inspecting usage.

**Tradeoff:** If the parent occasionally consults the method for type checks or polymorphic dispatch, pushing it down forces awkward downcasts at every consumer the agent must verify.

**Relief:** The parent's surface shrinks; subclasses that don't need the method aren't burdened; the agent reasons about each subclass's contract accurately.

**Trap:** Pushing down methods the parent occasionally needs for dispatch forces downcasts at every consumer the agent must add and verify.

**Removes smells:** Refused Bequest, Large Class

---
name: replace-type-code-with-subclasses
description: Apply Replace Type Code with Subclasses when you see Repeated Switches, Primitive Obsession. Each kind is a subclass; the agent adds a new kind by adding one class, and the type system tells it what's still missing.
---

# Apply: 35 — Replace Type Code with Subclasses

**Symptom:** A class with a kind field plus methods that switch on it; the agent adding a new kind must find every switch and update each consistently.

**Goal:** Each kind is a subclass; the agent adds a new kind by adding one class, and the type system tells it what's still missing.

```js
// Avoid:
class Employee {
  type; // 'engineer' | 'manager'
  bonus() {
    switch (this.type) {
      case 'engineer': return this.salary * 0.10;
      case 'manager':  return this.salary * 0.15 + this.reports.length * 100;
    }
  }
}

// Prefer:
class Employee {}
class Engineer extends Employee {
  bonus() { return this.salary * 0.10; }
}
class Manager extends Employee {
  bonus() { return this.salary * 0.15 + this.reports.length * 100; }
}
```

**Pressure:** The agent must enumerate every switch on every addition; the type system can't enforce completeness so the agent verifies by grep.

**Tradeoff:** If only one or two switches exist on the type code, the subclass hierarchy is over-design; the agent now navigates a class tree for what was a single switch.

**Relief:** Adding a new kind is mechanical and type-system-enforced; the agent's plan-and-execute loop for new variants is bounded.

**Trap:** Subclassing for type codes used in only one or two switches creates a hierarchy the agent must navigate for a coordination cost that was already small.

**Removes smells:** Repeated Switches, Primitive Obsession

---
name: extract-superclass
description: Apply Extract Superclass when you see Duplicated Code, Alternative Classes with Different Interfaces. The shared structure lives in a common parent; the agent reasons about shared behavior in one place.
---

# Apply: 36 — Extract Superclass

**Symptom:** Two classes with substantial shared structure (fields, methods); the agent verifying changes must update both consistently.

**Goal:** The shared structure lives in a common parent; the agent reasons about shared behavior in one place.

```js
// Avoid:
class Employee   { name; id; salary; }
class Department { name; id; budget; }

// Prefer:
class Party       { name; id; }
class Employee   extends Party { salary; }
class Department extends Party { budget; }
```

**Pressure:** Bug fixes must land in both classes; the agent's reasoning about shared invariants must verify they hold identically across both.

**Tradeoff:** Inheritance is inflexible; for shallow duplication, the agent's downstream changes are constrained by the parent in ways composition (Extract Class) would have avoided.

**Relief:** Shared behavior lives in one place; the agent's reasoning about the relationship is documented in code via the inheritance link.

**Trap:** Extracting superclasses for shallow duplication locks the agent into inheritance constraints when composition would have left both classes free to diverge.

**Removes smells:** Duplicated Code, Alternative Classes with Different Interfaces

---
name: collapse-hierarchy
description: Apply Collapse Hierarchy when you see Lazy Element, Speculative Generality. The subclass folds into the parent; the agent reads one class instead of a degenerate two-class hierarchy.
---

# Apply: 37 — Collapse Hierarchy

**Symptom:** A subclass that no longer differs meaningfully from its parent; the agent navigating the hierarchy traverses indirection for no behavioral variation.

**Goal:** The subclass folds into the parent; the agent reads one class instead of a degenerate two-class hierarchy.

```js
// Avoid:
class Employee {}
class FullTimeEmployee extends Employee {}

// Prefer:
class Employee {}
```

**Pressure:** The agent's reasoning pays the hierarchy ceremony cost on every reference; future maintenance touches both classes for any change.

**Tradeoff:** If the subclass documents a future variation (extension point, planned divergence), collapsing destroys it; the agent that collapses without checking forecloses options.

**Relief:** Smaller hierarchy; less ceremony; the agent loads one class instead of navigating a degenerate two-class chain.

**Trap:** Collapsing subclasses that document planned future variation destroys extension points the agent will need to re-introduce later at higher cost.

**Removes smells:** Lazy Element, Speculative Generality

---
name: replace-subclass-with-delegate
description: Apply Replace Subclass with Delegate when you see Refused Bequest, Insider Trading. Variants live in delegate objects swappable at runtime; the agent reasons about composition with explicit delegation calls.
---

# Apply: 38 — Replace Subclass with Delegate

**Symptom:** A subclass that overrides several methods to implement variant behavior; the agent reasoning about polymorphic dispatch must enumerate variants across the hierarchy.

**Goal:** Variants live in delegate objects swappable at runtime; the agent reasons about composition with explicit delegation calls.

```js
// Avoid:
class Booking { /* ... */ }
class PremiumBooking extends Booking {
  /* overrides several methods */
}

// Prefer:
class Booking {
  type; // 'standard' | premium delegate
  charge() { return this.type.charge(this); }
}
```

**Pressure:** Behavior can't change at runtime; combining variants requires multiple inheritance the agent must work around; Liskov violations hide in override behavior.

**Tradeoff:** Composition is more verbose at construction sites; the agent loses syntactic polymorphism and must verify behavior through explicit delegation calls.

**Relief:** Variants can be combined or swapped at runtime; Liskov violations vanish; the agent reasons about explicit delegation.

**Trap:** Replacing every subclass — including ones where Liskov genuinely holds — pays construction-site verbosity without buying flexibility the agent will actually use.

**Removes smells:** Refused Bequest, Insider Trading

---
name: pull-up-constructor-body
description: Apply Pull Up Constructor Body when you see Duplicated Code. The shared init lives in the parent's constructor and is called via super; the agent reasons about one initialization path.
---

# Apply: 62 — Pull Up Constructor Body

**Symptom:** Multiple subclass constructors initialize the same parent fields with the same logic; the agent verifying constructors must check every subclass for consistency.

**Goal:** The shared init lives in the parent's constructor and is called via super; the agent reasons about one initialization path.

```js
// Avoid:
class Manager  extends Employee { constructor(n, s) { this.name = n; this.salary = s; } }
class Engineer extends Employee { constructor(n, s) { this.name = n; this.salary = s; } }

// Prefer:
class Employee {
  constructor(name, salary) { this.name = name; this.salary = salary; }
}
class Manager  extends Employee {}
class Engineer extends Employee {}
```

**Pressure:** Bug fixes in init logic must land in every subclass; the agent must update each consistently or risk silent drift.

**Tradeoff:** If only some subclasses share the init logic, pulling it up forces the others to override or opt out; the agent verifying must check whether the shared init is genuinely common.

**Relief:** One canonical init; new subclasses inherit for free; the agent reasons about parent-state setup in one place.

**Trap:** Pulling up init logic only some subclasses need forces the others to override with awkward opt-outs the agent must reason about.

**Removes smells:** Duplicated Code

---
name: pull-up-field
description: Apply Pull Up Field when you see Duplicated Code. The field lives on the shared parent; the agent reasons about one declaration and one ownership story.
---

# Apply: 63 — Pull Up Field

**Symptom:** A field declared identically across multiple subclasses; the agent verifying changes to the field's shape must update every subclass consistently.

**Goal:** The field lives on the shared parent; the agent reasons about one declaration and one ownership story.

```js
// Avoid:
class Manager  extends Employee { _name; }
class Engineer extends Employee { _name; }

// Prefer:
class Employee { _name; }
class Manager  extends Employee {}
class Engineer extends Employee {}
```

**Pressure:** Refactoring the field's type or default requires the agent to touch every subclass; consistency drift hides bugs.

**Tradeoff:** If subclasses use the field with different defaults, visibility, or semantic role, pulling up creates surprise behavior the agent must constantly disambiguate.

**Relief:** One source of truth for the field's type and default; subclasses focus on what they actually specialize.

**Trap:** Pulling up fields with divergent semantic roles creates a shared declaration that masks subclass-specific behavior the agent must constantly re-verify.

**Removes smells:** Duplicated Code

---
name: push-down-field
description: Apply Push Down Field when you see Refused Bequest, Large Class. The field lives on the subclass that uses it; the agent's reasoning about the parent matches what most instances actually carry.
---

# Apply: 64 — Push Down Field

**Symptom:** A field on the parent class used by only one subclass; the agent reading the parent's shape sees storage that doesn't apply to most instances.

**Goal:** The field lives on the subclass that uses it; the agent's reasoning about the parent matches what most instances actually carry.

```js
// Avoid:
class Employee {
  quota; // only Salesperson uses this
}

// Prefer:
class Employee {}
class Salesperson extends Employee { quota; }
```

**Pressure:** The parent's storage carries dead weight; serialization includes ignored fields; the agent's reasoning about the parent's shape is muddied.

**Tradeoff:** If the parent occasionally consults the field for type checks, pushing it down forces awkward downcasts the agent must add and verify at every consumer.

**Relief:** Other subclasses no longer carry ignored storage; the parent's surface shrinks; the agent reasons about each subclass's shape accurately.

**Trap:** Pushing down fields the parent occasionally consults for dispatch forces downcasts the agent must add at every consumer.

**Removes smells:** Refused Bequest, Large Class

---
name: remove-subclass
description: Apply Remove Subclass when you see Lazy Element, Speculative Generality. The variant becomes a field on the parent; the agent reads variants as data instead of navigating a hierarchy.
---

# Apply: 65 — Remove Subclass

**Symptom:** Empty subclasses that encode a type code without behavior; the agent navigating the hierarchy traverses indirection for what could be a field.

**Goal:** The variant becomes a field on the parent; the agent reads variants as data instead of navigating a hierarchy.

```js
// Avoid:
class Person {}
class Female extends Person {}
class Male   extends Person {}

// Prefer:
class Person {
  constructor(gender) { this.gender = gender; }
}
```

**Pressure:** Every new variant is a new file the agent must create; the hierarchy ceremony costs reasoning without behavior payoff.

**Tradeoff:** If the subclass is referenced by name elsewhere (factories, registries, type-tests), removing it silently breaks those references the agent must find and update.

**Relief:** Smaller hierarchy; new variants are field values not new files; the agent reasons about variability as data.

**Trap:** Removing subclasses referenced by factories, registries, or type-tests breaks those references — the agent must find every such consumer before deletion.

**Removes smells:** Lazy Element, Speculative Generality

---
name: replace-superclass-with-delegate
description: Apply Replace Superclass with Delegate when you see Refused Bequest, Insider Trading. Composition replaces inheritance; the agent reasons about explicit delegation with no Liskov ambiguity.
---

# Apply: 66 — Replace Superclass with Delegate

**Symptom:** A subclass that overrides parent methods to no-ops or 'unsupported'; the agent reasoning about polymorphic calls on parent-typed references cannot trust the contract.

**Goal:** Composition replaces inheritance; the agent reasons about explicit delegation with no Liskov ambiguity.

```js
// Avoid:
class CategoryItem extends Scroll {
  // uses some Scroll methods, refuses others
}

// Prefer:
class CategoryItem {
  constructor() { this.scroll = new Scroll(); }
  date() { return this.scroll.date(); }
}
```

**Pressure:** Liskov violations break the agent's polymorphic reasoning; the agent must defensively check at every call site whether the subclass honors the parent's contract.

**Tradeoff:** Composition adds a forwarding method on the former subclass for every parent method exposed; the agent loses syntactic polymorphism and pays ceremony for explicit delegation.

**Relief:** The misleading is-a relationship disappears; the agent's polymorphic reasoning becomes trustworthy because every reference type honors its declared contract.

**Trap:** Replacing every inheritance — including ones where Liskov genuinely holds — pays forwarding ceremony at every method without buying any contract safety the agent actually needed.

**Removes smells:** Refused Bequest, Insider Trading

---

## Code smells

---
name: mysterious-name
description: Refuse Mysterious Name when token-level identifiers don't disambiguate scope or domain — the agent must load surrounding context to answer 'what does this variable hold?' before any reasoning step succeeds. Apply Change Function Declaration, Rename Variable.
---

# Refuse: 01 — Mysterious Name

**Symptom:** Token-level identifiers don't disambiguate scope or domain — the agent must load surrounding context to answer 'what does this variable hold?' before any reasoning step succeeds.

**Goal:** Identifiers carry enough disambiguating information that the agent can reason about each symbol without a lookup hop.

```js
// Smellier:
function calc(d, t) {
  return d * t;
}

// Fresher:
function distance(speed, time) {
  return speed * time;
}
```

**Pressure:** Every reasoning pass re-derives meaning from surrounding context; chained edits compound the cost and increase the chance of hallucinating a misread.

**Tradeoff:** Renames invalidate cached associations — commit history, RAG snippets, embedding indexes, and prior conversation context all carry the old name until they refresh.

**Relief:** Fewer context-lookup hops per reasoning step; planning loops run cheaper and resist drift.

**Trap:** Compulsive renaming generates spurious diffs that crowd the review surface and burn context the human reviewer has to skim past.

**Apply refactorings:** Change Function Declaration, Rename Variable, Rename Field

---
name: duplicated-code
description: Refuse Duplicated Code when near-identical code appears in multiple files; every reasoning step about one copy must either deliberately ignore the others or repeat itself across them. Apply Extract Function, Slide Statements.
---

# Refuse: 02 — Duplicated Code

**Symptom:** Near-identical code appears in multiple files; every reasoning step about one copy must either deliberately ignore the others or repeat itself across them.

**Goal:** One canonical implementation the agent loads once and reasons about once, with variation parameterized at the call site.

```js
// Smellier:
function totalUSD(items) {
  return items.reduce((s, i) => s + i.price * i.qty, 0);
}
function totalEUR(items) {
  return items.reduce((s, i) => s + i.price * i.qty, 0);
}

// Fresher:
function lineTotal(items) {
  return items.reduce((s, i) => s + i.price * i.qty, 0);
}
```

**Pressure:** Edits propagate by hand across copies; the agent must remember to find every clone or ship inconsistent behavior that silently passes unit tests targeting only one copy.

**Tradeoff:** The shared form introduces an indirection the agent must trace through; if the abstraction is wrong, every divergence becomes an exception that complicates reasoning at every call site.

**Relief:** Bug fixes and feature additions land in one place; the agent's plan-and-execute loop touches one definition instead of N.

**Trap:** Over-eager merging of superficially-similar code creates a leaky abstraction the agent must constantly special-case — reasoning becomes harder than reasoning about the original copies.

**Apply refactorings:** Extract Function, Slide Statements, Pull Up Method

---
name: long-function
description: Refuse Long Function when a function whose token count exceeds the agent's reliable chunk-reasoning budget; verifying behavior preservation requires re-reading the entire span on every edit. Apply Extract Function, Replace Temp with Query.
---

# Refuse: 03 — Long Function

**Symptom:** A function whose token count exceeds the agent's reliable chunk-reasoning budget; verifying behavior preservation requires re-reading the entire span on every edit.

**Goal:** Each function is a verifiable unit small enough that the agent can reason about its full behavior in a single reasoning step.

```js
// Smellier:
function ship(order) {
  if (!order.id) throw new Error('missing id');
  const tax = order.total * 0.1;
  const grand = order.total + tax;
  email(order.user, `Total ${grand}`);
  log(order);
}

// Fresher:
function ship(order) {
  validate(order);
  const grand = withTax(order);
  notify(order, grand);
}
```

**Pressure:** Every edit pays full re-read cost; chained changes compound context usage and increase the chance of missing a cross-statement invariant.

**Tradeoff:** Splitting inflates context-window usage at orchestration time — the agent now loads N function definitions to follow what was once one body. Worth it when the orchestration outline is clearer than the linear body.

**Relief:** Smaller diff surface per commit; behavior preservation verifiable per refactoring step; chained orchestrations work from named subroutines instead of re-derived semantics.

**Trap:** Forces the agent to chase a dozen function definitions for what was once a 20-line procedure — context cost inflates and cross-function invariants disappear.

**Apply refactorings:** Extract Function, Replace Temp with Query, Introduce Parameter Object, Preserve Whole Object, Replace Function with Command, Decompose Conditional, Split Loop, Replace Loop with Pipeline, Replace Control Flag with Break

---
name: long-parameter-list
description: Refuse Long Parameter List when a signature with so many positional parameters that the agent must look up the function definition (or call-site documentation) before any invocation succeeds. Apply Replace Parameter with Query, Preserve Whole Object.
---

# Refuse: 04 — Long Parameter List

**Symptom:** A signature with so many positional parameters that the agent must look up the function definition (or call-site documentation) before any invocation succeeds.

**Goal:** Each parameter is either a domain concept the agent recognizes, or it's bundled into a named object the agent can pass through without unpacking.

```js
// Smellier:
function book(name, email, street, city, zip, depart, arrive, seat) {
  // ...
}

// Fresher:
function book(traveler, address, trip) {
  // ...
}
```

**Pressure:** Every call site is a chance to misorder arguments or miss one entirely; even with a type checker the agent pays a lookup cost on every invocation.

**Tradeoff:** A new parameter object adds a class the agent must load to construct values; if used in only one place the cost is pure overhead.

**Relief:** Call sites become readable as named intent; the agent constructs and passes domain objects instead of remembering positional contracts.

**Trap:** Synthesizing parameter objects that don't represent real domain concepts forces the agent through extra wrapping and unwrapping with no comprehension payoff — pure ceremony.

**Apply refactorings:** Replace Parameter with Query, Preserve Whole Object, Introduce Parameter Object, Remove Flag Argument, Combine Functions into Class

---
name: global-data
description: Refuse Global Data when a module-level variable mutated from anywhere — the agent reading any single call site cannot bound its impact without scanning every consumer. Apply Encapsulate Variable.
---

# Refuse: 05 — Global Data

**Symptom:** A module-level variable mutated from anywhere — the agent reading any single call site cannot bound its impact without scanning every consumer.

**Goal:** All reads and writes go through a named function the agent can grep for, find every consumer of, and reason about as a closed surface.

```js
// Smellier:
let currentUser = null;
// ...some files later...
currentUser = newUser;

// Fresher:
function setCurrentUser(user) {
  currentUser = validate(user);
}
function getCurrentUser() {
  return currentUser;
}
```

**Pressure:** Behavior depends on hidden write-order between callers the agent must discover one at a time; tracing any bug requires reconstructing a global mutation timeline.

**Tradeoff:** Wrapping the global doesn't eliminate the coupling — every reader still depends on the same shared state, and the agent still has to model the timeline to reason about reads.

**Relief:** A single named function becomes the audit point; the agent can attach logging, validation, or cache logic in one place instead of chasing every consumer.

**Trap:** Wrapping globals without narrowing access creates a false safety signal — the agent assumes the wrapper guarantees something it doesn't, and silent leaks become harder to diagnose.

**Apply refactorings:** Encapsulate Variable

---
name: mutable-data
description: Refuse Mutable Data when fields the agent finds reassigned across multiple files with no obvious owner; reasoning about state at any moment requires tracing every writer. Apply Encapsulate Variable, Split Variable.
---

# Refuse: 06 — Mutable Data

**Symptom:** Fields the agent finds reassigned across multiple files with no obvious owner; reasoning about state at any moment requires tracing every writer.

**Goal:** Mutation happens behind a named function with a clear contract, or the data is replaced rather than modified — the agent can locate every change in one place.

```js
// Smellier:
const order = { total: 100 };
applyDiscount(order); // mutates total
addTax(order);        // mutates total

// Fresher:
const order = { total: 100 };
const final = addTax(applyDiscount(order));
```

**Pressure:** The agent cannot answer 'what is this value here?' without modeling the full timeline of writes; concurrent reasoning becomes practically impossible.

**Tradeoff:** Switching to immutable or encapsulated mutation can force the agent to construct new objects on every change; for hot-path mutation this trades reasoning clarity for runtime overhead.

**Relief:** State changes become locatable and bisectable; the agent reasoning about behavior traces one entry point instead of N writers.

**Trap:** Wrapping writes in setters that don't enforce anything (no validation, no event, no copy-on-write) keeps the mutation everywhere while pretending it's encapsulated — the agent is now misled by the API.

**Apply refactorings:** Encapsulate Variable, Split Variable, Slide Statements, Extract Function, Separate Query from Modifier, Remove Setting Method, Replace Derived Variable with Query, Combine Functions into Class, Combine Functions into Transform, Change Reference to Value

---
name: divergent-change
description: Refuse Divergent Change when reading the module, the agent constantly switches between conceptually unrelated regions (tax logic, UI logic, API logic); every cross-axis edit requires loading and reasoning about all of them. Apply Split Phase, Move Function.
---

# Refuse: 07 — Divergent Change

**Symptom:** Reading the module, the agent constantly switches between conceptually unrelated regions (tax logic, UI logic, API logic); every cross-axis edit requires loading and reasoning about all of them.

**Goal:** Each module varies along one axis; the agent loading it can predict what kinds of changes will touch it and bring only the relevant context.

```js
// Smellier:
function checkout(cart) {
  const tax = computeTax(cart, jurisdiction); // tax churn
  const html = renderInvoice(cart, tax);      // UI churn
  return postToGateway(html);                 // API churn
}

// Fresher:
function priced(cart) { return { ...cart, tax: computeTax(cart) }; }
function rendered(cart) { return renderInvoice(cart); }
function sent(html)    { return postToGateway(html); }
```

**Pressure:** Any single conceptual change touches code that also implements unrelated concerns; the agent must verify it didn't break the other axes on every edit.

**Tradeoff:** Splitting introduces a seam between modules; cross-cutting changes now require the agent to load and synchronize edits across both, raising context cost for those specific cases.

**Relief:** One axis of change per module means the agent loads exactly the context relevant to the request, and concurrent edits along different axes don't interfere.

**Trap:** Splitting on every minor distinction creates a fan-out of tiny modules the agent must navigate to reason about any meaningful behavior — abstraction overhead exceeds comprehension gain.

**Apply refactorings:** Split Phase, Move Function, Extract Function, Extract Class

---
name: shotgun-surgery
description: Refuse Shotgun Surgery when a single conceptual edit forces the agent to identify, load, and modify many small sites — each one cheap individually but the search and completeness check is expensive. Apply Move Function, Move Field.
---

# Refuse: 08 — Shotgun Surgery

**Symptom:** A single conceptual edit forces the agent to identify, load, and modify many small sites — each one cheap individually but the search and completeness check is expensive.

**Goal:** All code that varies together sits in one place; the agent loads one module to make any change along this axis and verifies completeness in one read.

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

**Pressure:** Every change carries a risk of missing a site the agent didn't grep for; reviewers (human or agent) can't easily verify completeness without re-running the same search.

**Tradeoff:** Consolidation creates a new boundary the agent must respect; previously-independent sites now route through one module that can become a contention point for unrelated edits.

**Relief:** Change cost becomes proportional to the conceptual change; the agent reasons about one location instead of N scattered ones.

**Trap:** Pulling every superficially-related edit into one module creates a god-module the agent now must reason about as a tangle of unrelated concerns — the smell migrated, not vanished.

**Apply refactorings:** Move Function, Move Field, Combine Functions into Class, Combine Functions into Transform, Split Phase, Inline Function, Inline Class

---
name: feature-envy
description: Refuse Feature Envy when a method's body references foreign-class data more than its own; the agent loading this method must also load the foreign class to verify any change. Apply Move Function, Extract Function.
---

# Refuse: 09 — Feature Envy

**Symptom:** A method's body references foreign-class data more than its own; the agent loading this method must also load the foreign class to verify any change.

**Goal:** Method bodies stay close to the data they read — the agent loads one class to reason about one behavior.

```js
// Smellier:
class Order {
  totalWeight() {
    return this.items.reduce((s, i) => s + i.unitWeight * i.qty, 0);
  }
}

// Fresher:
class Item  { weight()      { return this.unitWeight * this.qty; } }
class Order { totalWeight() { return this.items.reduce((s, i) => s + i.weight(), 0); } }
```

**Pressure:** Each call to the envious method pulls a second class into the agent's working context; chained reasoning across the boundary compounds the load.

**Tradeoff:** Moving the method may force additional cross-class dependencies the original boundary hid; the agent verifying the move must trace the new coupling at the destination class.

**Relief:** The method's data sits inside the agent's current reasoning context; verifying behavior touches one class instead of two.

**Trap:** Mechanical move-the-method-to-the-data on every cross-class read creates a fan-out the agent must follow at every call site — the cure becomes a worse smell than the original.

**Apply refactorings:** Move Function, Extract Function

---
name: data-clumps
description: Refuse Data Clumps when the agent sees the same field group appearing across multiple signatures (parameters, fields, args) — every site re-parses the same shape and verifies the same ordering. Apply Extract Class, Introduce Parameter Object.
---

# Refuse: 10 — Data Clumps

**Symptom:** The agent sees the same field group appearing across multiple signatures (parameters, fields, args) — every site re-parses the same shape and verifies the same ordering.

**Goal:** The clump becomes a named value object the agent passes through as a single token; structure validation happens once at construction.

```js
// Smellier:
function send(name, email, street, city, zip) {
  // ...
}

// Fresher:
class Address { /* street, city, zip */ }
function send(name, email, address) {
  // ...
}
```

**Pressure:** Adding or removing a field of the clump means touching every site; the agent must find them all and update each consistently or risk silent shape drift.

**Tradeoff:** Constructing the value object on every call adds an allocation and a name the agent must learn; if the bundle isn't reused it's pure ceremony.

**Relief:** Operations on the clump (formatting, validation, equality) live with it; signatures shrink and the agent reasons about one named concept instead of N coupled fields.

**Trap:** Wrapping coincidental field groups creates fake value objects the agent must construct and destructure with no comprehension gain — naming what isn't a concept doesn't help reason.

**Apply refactorings:** Extract Class, Introduce Parameter Object, Preserve Whole Object

---
name: primitive-obsession
description: Refuse Primitive Obsession when function signatures use raw strings and numbers where domain concepts hide; the agent cannot tell from the type whether an argument is the right kind of thing. Apply Replace Primitive with Object, Replace Type Code with Subclasses.
---

# Refuse: 11 — Primitive Obsession

**Symptom:** Function signatures use raw strings and numbers where domain concepts hide; the agent cannot tell from the type whether an argument is the right kind of thing.

**Goal:** Each domain concept has its own typed wrapper; the agent's type checker catches wrong-primitive-in-wrong-slot mistakes before runtime.

```js
// Smellier:
function priceFor(cents, currency) {
  // ...
}

// Fresher:
class Money { /* amount + currency, with arithmetic */ }
function priceFor(money) {
  // ...
}
```

**Pressure:** The agent must inspect call-site context (variable names, surrounding code) to verify a primitive is the right kind; validation and formatting logic scatters across consumers.

**Tradeoff:** Each wrapper is a class the agent must load and instantiate; for primitives used in only one place, the wrapper is more code than the original concern warranted.

**Relief:** Wrong-primitive misuse becomes a type error the agent catches without runtime testing; behavior and rules accrete around the concept where the agent expects to find them.

**Trap:** Wrapping every primitive — including ones with no domain rules or behavior — adds boilerplate the agent must navigate at every signature with no reasoning benefit.

**Apply refactorings:** Replace Primitive with Object, Replace Type Code with Subclasses, Replace Conditional with Polymorphism, Extract Class, Introduce Parameter Object

---
name: repeated-switches
description: Refuse Repeated Switches when the agent finds the same switch (or if/else chain) over a type code in multiple files; adding a new case requires the agent to grep for every site and update each consistently. Apply Replace Conditional with Polymorphism.
---

# Refuse: 12 — Repeated Switches

**Symptom:** The agent finds the same switch (or if/else chain) over a type code in multiple files; adding a new case requires the agent to grep for every site and update each consistently.

**Goal:** Each case is a class implementing a shared interface; the agent adds a new case by adding one class, and the type checker tells it what's still missing.

```js
// Smellier:
switch (event.kind) {
  case 'click': return onClick(event);
  case 'key':   return onKey(event);
  case 'drag':  return onDrag(event);
}

// Fresher:
event.handle(); // ClickEvent, KeyEvent, DragEvent each implement handle()
```

**Pressure:** Dispatch logic duplicates across files; new cases are easy to miss; chained edits across all switch sites compound the agent's review burden per change.

**Tradeoff:** Polymorphic dispatch is implicit at call sites — the agent can no longer see the full set of branches in one place and must enumerate subclasses across files to reason about behavior.

**Relief:** Adding a new variant is mechanical and the type checker enforces completeness; the agent's plan-and-execute loop for new cases is bounded.

**Trap:** Replacing every switch with polymorphism, even ones with two stable cases, creates a class hierarchy the agent must navigate without buying any extension flexibility.

**Apply refactorings:** Replace Conditional with Polymorphism

---
name: loops
description: Refuse Loops when imperative for/while loops where filter, map, and reduce concerns are mixed by hand; the agent cannot tell what the loop is producing without mentally executing it. Apply Replace Loop with Pipeline.
---

# Refuse: 13 — Loops

**Symptom:** Imperative for/while loops where filter, map, and reduce concerns are mixed by hand; the agent cannot tell what the loop is producing without mentally executing it.

**Goal:** The transformation reads as a sequence of named operations; the agent recognizes the shape (filter, map, reduce) without simulating the loop.

```js
// Smellier:
const seniors = [];
for (const u of users) {
  if (u.age >= 65) seniors.push(u.name);
}

// Fresher:
const seniors = users
  .filter(u => u.age >= 65)
  .map(u => u.name);
```

**Pressure:** The agent must mentally execute the loop to learn its result; off-by-one and accumulator bugs hide in the body and only surface at test time.

**Tradeoff:** Pipeline form adds per-element call overhead and forces the agent to track intermediate collection types through the chain; for hot paths the runtime cost matters.

**Relief:** Intent jumps off the page; the agent reasons about each step independently and the type signatures at each pipeline stage document the transformation.

**Trap:** Forcing every loop into a pipeline — including ones with early-exit, side-effecting accumulators, or sequential dependencies — produces twisted .reduce() bodies the agent has to untangle to understand.

**Apply refactorings:** Replace Loop with Pipeline

---
name: lazy-element
description: Refuse Lazy Element when a class, function, or namespace whose body the agent traces through only to find no decisions or transformations — every hop is pure overhead in reasoning context. Apply Inline Function, Inline Class.
---

# Refuse: 14 — Lazy Element

**Symptom:** A class, function, or namespace whose body the agent traces through only to find no decisions or transformations — every hop is pure overhead in reasoning context.

**Goal:** Trivial wrappers disappear; the call site reads exactly as what's happening and the agent skips the indirection.

```js
// Smellier:
function getName(user) {
  return user.name;
}
const n = getName(user);

// Fresher:
const n = user.name;
```

**Pressure:** The agent navigates through layers that add nothing; future maintainers (human or agent) face a choice between leaving dead weight or extracting a real reason for it.

**Tradeoff:** Inlining scatters the wrapper's body across call sites; if the wrapper was a seam (mocking boundary, extension point), removing it forecloses options the agent might need later.

**Relief:** Shorter call chains; the agent loads one fewer definition per reasoning step; the call site reads as exactly what's happening.

**Trap:** Mechanically inlining everything that looks trivial — including wrappers that mark a real seam — collapses extension points the agent will need to re-introduce later at higher cost.

**Apply refactorings:** Inline Function, Inline Class, Collapse Hierarchy

---
name: speculative-generality
description: Refuse Speculative Generality when abstract base classes, hooks, configuration knobs, or parameters with no real call site exercising them — the agent must learn vocabulary it never gets to use. Apply Collapse Hierarchy, Inline Function.
---

# Refuse: 15 — Speculative Generality

**Symptom:** Abstract base classes, hooks, configuration knobs, or parameters with no real call site exercising them — the agent must learn vocabulary it never gets to use.

**Goal:** The code expresses exactly what it does today; the agent's mental model has no concepts that don't correspond to active behavior.

```js
// Smellier:
class Strategy { execute() {} }
class OnlyStrategy extends Strategy { execute() { /* the real one */ } }
new OnlyStrategy().execute();

// Fresher:
function execute() {
  // the real one
}
execute();
```

**Pressure:** Tests cover branches no one exercises; readers (human and agent) learn dead vocabulary; refactoring proposals must consider phantom users that aren't real.

**Tradeoff:** Removing speculative scaffolding is sometimes a real loss — the abstraction may document a coming feature or a deliberately-preserved seam; the agent collapsing it must verify no current or imminent caller relies on the option.

**Relief:** Smaller surface; fewer concepts the agent must hold in its reasoning context; tests align with actual behavior so green tests mean live coverage.

**Trap:** Collapsing every unused hook on sight removes options the team had reason to hold; the agent must judge intent before deleting, or risk shipping cleanups the maintainers reject.

**Apply refactorings:** Collapse Hierarchy, Inline Function, Inline Class, Change Function Declaration, Remove Dead Code

---
name: temporary-field
description: Refuse Temporary Field when a class field the agent finds set to null or default for most of the object's lifetime, populated only inside one method's flow — the agent must verify which methods care. Apply Extract Class, Move Function.
---

# Refuse: 16 — Temporary Field

**Symptom:** A class field the agent finds set to null or default for most of the object's lifetime, populated only inside one method's flow — the agent must verify which methods care.

**Goal:** Temporary state lives in a dedicated class that exists only when relevant; the agent loads the temporary type only when reasoning about that flow.

```js
// Smellier:
class Order {
  shippingTrack = null;
  ship() {
    this.shippingTrack = computeTrack();
  }
}

// Fresher:
class Order    { ship() { return new Shipment(this); } }
class Shipment { /* owns the track */ }
```

**Pressure:** The agent must trace the conditions under which the field is meaningful; null-checks scatter across consumers; class invariants weaken because the field has no defined lifecycle.

**Tradeoff:** Extracting a new class adds a type the agent must load to reason about the flow; for genuinely one-shot uses the class is more code than the original field warranted.

**Relief:** Null-checks vanish; the agent reasons about a class with a clear lifecycle; class invariants tighten so reasoning about the host class doesn't have to consider the unused state.

**Trap:** Extracting a class for every short-lived field — including ones with truly local use — creates new types the agent must load with no comprehension gain over the original encapsulated field.

**Apply refactorings:** Extract Class, Move Function, Introduce Special Case

---
name: message-chains
description: Refuse Message Chains when long dotted access paths the agent must trace through several object hops to understand any single read; renaming any intermediate field breaks every caller silently. Apply Hide Delegate, Extract Function.
---

# Refuse: 17 — Message Chains

**Symptom:** Long dotted access paths the agent must trace through several object hops to understand any single read; renaming any intermediate field breaks every caller silently.

**Goal:** Callers ask the closest object for what they want; the agent reasons about one boundary instead of traversing N.

```js
// Smellier:
const street = order.customer.address.street;

// Fresher:
const street = order.customerStreet();
```

**Pressure:** Every link in the chain is a coupling point the agent must hold in working memory; refactoring any intermediate shape requires the agent to find and update every chained access.

**Tradeoff:** Adding passthrough methods on the host class grows its surface; for chains used in one place the passthrough is overhead the agent now maintains in two places.

**Relief:** Encapsulation tightens; intermediate objects can change shape without breaking callers; the agent reasoning about a caller doesn't load every link in the chain.

**Trap:** Wrapping every dotted chain in passthroughs migrates the smell from call sites into the host class's surface — the agent now reads a wall of delegation methods to find any real behavior.

**Apply refactorings:** Hide Delegate, Extract Function, Move Function

---
name: middle-man
description: Refuse Middle Man when a class whose methods all delegate straight through to another object — the agent traces every call to the real implementation, paying a hop for no decision. Apply Remove Middle Man, Inline Function.
---

# Refuse: 18 — Middle Man

**Symptom:** A class whose methods all delegate straight through to another object — the agent traces every call to the real implementation, paying a hop for no decision.

**Goal:** Callers talk to the real object directly; the agent's call traces are shorter and the real implementation's location is obvious.

```js
// Smellier:
class Manager {
  reports() {
    return this.team.members();
  }
}

// Fresher:
// Expose team directly when the wrapper adds nothing.
manager.team.members();
```

**Pressure:** An entire indirection layer the agent must navigate per method; the agent reading code through the middle man re-traces the delegation on every reasoning step.

**Tradeoff:** Direct access exposes the underlying object's full surface to every consumer; the agent loses any encapsulation the middle man was providing (even if mostly cosmetic).

**Relief:** Fewer files; shorter call stacks; the agent's plan-and-execute loop touches the real implementation directly without the passthrough hop.

**Trap:** Deleting a passthrough that was actually doing real work — authorization, validation, auditing — removes a load-bearing layer the agent didn't recognize because the trivial-looking delegation masked it.

**Apply refactorings:** Remove Middle Man, Inline Function, Replace Superclass with Delegate, Replace Subclass with Delegate

---
name: insider-trading
description: Refuse Insider Trading when module A reaches into module B's private fields or undocumented behavior; the agent reasoning about A must also load B's internals to make any change. Apply Move Function, Move Field.
---

# Refuse: 19 — Insider Trading

**Symptom:** Module A reaches into module B's private fields or undocumented behavior; the agent reasoning about A must also load B's internals to make any change.

**Goal:** Cooperation flows through a narrow named interface the agent can read once; A's reasoning context excludes B's implementation details.

```js
// Smellier:
class A { _data; }
class B {
  read(a) {
    return a._data.value;
  }
}

// Fresher:
class A { value() { return this._data.value; } }
class B { read(a) { return a.value(); } }
```

**Pressure:** Refactoring one module silently breaks the other in ways the type system doesn't catch; the agent must trace cross-module assumptions on every edit.

**Tradeoff:** Defining a real public interface adds a contract the agent must respect at both ends; until the interface stabilizes, every change forces synchronized edits across both modules.

**Relief:** Module boundaries become real seams the agent can reason about independently; tests exercise the public surface and refactoring stays local.

**Trap:** Erecting elaborate public APIs between modules that genuinely belong together creates a fake boundary the agent must navigate at every interaction with no isolation gain.

**Apply refactorings:** Move Function, Move Field, Hide Delegate, Replace Subclass with Delegate, Replace Superclass with Delegate

---
name: large-class
description: Refuse Large Class when a class file with so many fields and methods that the agent cannot load it as a coherent unit; multiple unrelated responsibilities sit under one name. Apply Extract Class, Extract Superclass.
---

# Refuse: 20 — Large Class

**Symptom:** A class file with so many fields and methods that the agent cannot load it as a coherent unit; multiple unrelated responsibilities sit under one name.

**Goal:** Each class has one cohesive purpose; the agent loads a small focused file to reason about any single behavior.

```js
// Smellier:
class Order {
  // lineItems, totals, customer info, shipping address, audit log, ...
}

// Fresher:
class Order    { /* lineItems, totals */ }
class Customer { /* name, email */ }
class Shipping { /* address, track */ }
```

**Pressure:** Cognitive context inflates with every irrelevant member; the agent reading any single method must skim past unrelated fields and helpers to find what it needs.

**Tradeoff:** Splitting creates new collaborator relationships the agent must trace across files; what was one load now becomes N loads and the agent must understand how the pieces interact.

**Relief:** Smaller, focused units; the agent's reasoning context per method is tight; tests target one concern at a time.

**Trap:** Splitting on superficial groupings produces fragments that don't cohere on their own — the agent now navigates several files to understand what was previously one coherent (if large) concept.

**Apply refactorings:** Extract Class, Extract Superclass, Replace Type Code with Subclasses

---
name: alternative-classes-with-different-interfaces
description: Refuse Alternative Classes with Different Interfaces when two classes the agent recognizes as doing similar things but with mismatched method names and signatures; the agent must learn both vocabularies and translate between them. Apply Change Function Declaration, Move Function.
---

# Refuse: 21 — Alternative Classes with Different Interfaces

**Symptom:** Two classes the agent recognizes as doing similar things but with mismatched method names and signatures; the agent must learn both vocabularies and translate between them.

**Goal:** Equivalent operations have equivalent signatures; the agent uses one mental model and the type system enforces substitutability.

```js
// Smellier:
class CSVExporter  { writeAll(rows) {} }
class JSONExporter { dump(data)     {} }

// Fresher:
class CSVExporter  implements Exporter { write(rows) {} }
class JSONExporter implements Exporter { write(rows) {} }
```

**Pressure:** Substitution becomes copy-paste; abstraction over the two is impossible; the agent must hold both interfaces in working memory to use either.

**Tradeoff:** Aligning the interfaces forces renames across both classes and every consumer; the agent verifying the alignment must update every call site and confirm the new common contract holds for both.

**Relief:** Polymorphic use becomes possible; new alternatives plug in without bespoke adapters; the agent reasons about the operation once.

**Trap:** Forcing two classes into a shared interface despite genuinely different contracts produces an abstraction the agent must constantly special-case — important distinctions hide behind a fake polymorphism.

**Apply refactorings:** Change Function Declaration, Move Function, Extract Superclass

---
name: data-class
description: Refuse Data Class when a class whose surface is only getters and setters; all real behavior lives in consumers, scattered across files the agent must locate to reason about anything domain-meaningful. Apply Encapsulate Record, Remove Setting Method.
---

# Refuse: 22 — Data Class

**Symptom:** A class whose surface is only getters and setters; all real behavior lives in consumers, scattered across files the agent must locate to reason about anything domain-meaningful.

**Goal:** Behavior that belongs with the data lives on the class; the agent loading the class finds the operations and invariants it expects, in one place.

```js
// Smellier:
class Address { street; city; zip; }
function format(a) {
  return `${a.street}, ${a.city} ${a.zip}`;
}

// Fresher:
class Address {
  format() {
    return `${this.street}, ${this.city} ${this.zip}`;
  }
}
```

**Pressure:** Domain logic scatters across consumers; the agent must search the codebase to find any operation; class invariants aren't enforced so the agent must defensively check them at every consumer.

**Tradeoff:** Migrating behavior onto the class can pull new collaborators into its definition; consumers shrink but the class's surface grows and its dependencies multiply.

**Relief:** Invariants are enforceable in one place; the agent reasons about the class as a real domain object instead of chasing operations across consumers.

**Trap:** Attaching every operation that touches the data — including ones that belong to use cases or services — turns the data class into a god object the agent must load to reason about anything in the surrounding domain.

**Apply refactorings:** Encapsulate Record, Remove Setting Method, Move Function, Extract Function, Split Phase

---
name: refused-bequest
description: Refuse Refused Bequest when a subclass overriding parent methods to no-ops, throwing 'unsupported', or quietly ignoring inherited behavior — the agent cannot trust polymorphic calls on parent-typed references. Apply Push Down Method, Push Down Field.
---

# Refuse: 23 — Refused Bequest

**Symptom:** A subclass overriding parent methods to no-ops, throwing 'unsupported', or quietly ignoring inherited behavior — the agent cannot trust polymorphic calls on parent-typed references.

**Goal:** Sharing happens via composition (a held delegate) instead of forced inheritance; every reference type honors its contract.

```js
// Smellier:
class Animal { fly() {} swim() {} }
class Dog extends Animal {
  fly() { throw new Error('no'); }
}

// Fresher:
class Dog {
  // composes a Mover delegate that knows it's a swimmer
}
```

**Pressure:** Liskov violations: the agent cannot trust subclass instances to honor the parent contract, so polymorphism becomes a trap that the agent must defensively check at every call site.

**Tradeoff:** Composition is more verbose at construction; the agent loses syntactic polymorphism and must verify behavior through explicit delegation calls instead of relying on inheritance dispatch.

**Relief:** Each class has only what it needs; the agent's polymorphic reasoning becomes trustworthy because every reference type honors its declared contract.

**Trap:** Replacing every inheritance relationship with composition, including ones where Liskov genuinely holds, pays construction verbosity at every site without buying any safety the original inheritance didn't provide.

**Apply refactorings:** Push Down Method, Push Down Field, Replace Subclass with Delegate, Replace Superclass with Delegate

---
name: comments
description: Refuse Comments when comments explaining what the next block does or what a function returns; the agent loading the comment plus the code carries two sources of truth that may have drifted apart. Apply Extract Function, Change Function Declaration.
---

# Refuse: 24 — Comments

**Symptom:** Comments explaining what the next block does or what a function returns; the agent loading the comment plus the code carries two sources of truth that may have drifted apart.

**Goal:** Names tell the agent what the comment was trying to say; comments survive only when they document a non-obvious WHY (hidden constraint, invariant, workaround).

```js
// Smellier:
// charge the customer's stored payment method, including tax
charge(c, t * 1.1);

// Fresher:
chargeWithTax(customer, total);
```

**Pressure:** The code didn't reveal its intent so the comment is patching an unnamed function or unclear variable; the agent must reconcile both sources and risk acting on the stale one.

**Tradeoff:** Renaming to express the comment's content ripples across consumers (cross-repo greps, embedding indexes, prior conversation context) the agent must accept will drift stale for a window.

**Relief:** The agent trusts names as the source of truth; reasoning steps don't need to cross-reference comments that might be wrong; the code is the documentation.

**Trap:** Deleting every comment in a cleanup pass — including ones documenting hidden constraints, historical context, or invariants names can't express — strips load-bearing context the agent will need later.

**Apply refactorings:** Extract Function, Change Function Declaration, Introduce Assertion

---

## Patterns (Kerievsky — Refactoring to Patterns)

---
name: chain-constructors
description: Apply Chain Constructors when you see Duplicated Code, Extract Function, Combine Functions into Class. One construction path the agent reads to know what a fully-initialized object looks like; all other paths are one-line delegations the agent can skip past during reasoning.
---

# Apply: 01 — Chain Constructors

**Symptom:** Multiple construction paths the agent must scan in parallel to confirm field initialization is consistent. Behavioral preservation on every field-related edit requires verifying every path, multiplying context cost by path count.

**Goal:** One construction path the agent reads to know what a fully-initialized object looks like; all other paths are one-line delegations the agent can skip past during reasoning. Field-set drift is impossible by construction.

```js
// Before:
class Loan {
  static newTermLoan(commitment, customer, maturity) {
    const loan = new Loan();
    if (commitment < 0) throw new Error('commitment must be non-negative');
    loan.commitment = commitment;
    loan.customer = customer;
    loan.maturity = maturity;
    loan.expiry = null;
    loan.unusedPercentage = 0.0;
    return loan;
  }
  static newRevolver(commitment, customer, expiry) {
    const loan = new Loan();
    if (commitment < 0) throw new Error('commitment must be non-negative');
    loan.commitment = commitment;
    loan.customer = customer;
    loan.maturity = null;
    loan.expiry = expiry;
    loan.unusedPercentage = 1.0;
    return loan;
  }
  static newAdvisedLine(commitment, customer, expiry) {
    const loan = new Loan();
    if (commitment < 0) throw new Error('commitment must be non-negative');
    loan.commitment = commitment;
    loan.customer = customer;
    loan.maturity = null;
    loan.expiry = expiry;
    loan.unusedPercentage = 0.5;
    return loan;
  }
}

// After:
class Loan {
  constructor(commitment, customer, expiry, maturity, unusedPercentage) {
    if (commitment < 0) throw new Error('commitment must be non-negative');
    this.commitment = commitment;
    this.customer = customer;
    this.expiry = expiry;
    this.maturity = maturity;
    this.unusedPercentage = unusedPercentage;
  }
  static newTermLoan(commitment, customer, maturity) {
    return new Loan(commitment, customer, null, maturity, 0.0);
  }
  static newRevolver(commitment, customer, expiry) {
    return new Loan(commitment, customer, expiry, null, 1.0);
  }
  static newAdvisedLine(commitment, customer, expiry) {
    return new Loan(commitment, customer, expiry, null, 0.5);
  }
}
```

_Example source: Adapted from Joshua Kerievsky's Loan-class example in Refactoring to Patterns (Addison-Wesley, 2004), chapter 6. The Java original used overloaded constructors; this JavaScript translation uses static creation methods delegating to one canonical constructor — same shape, same single-point-of-initialization payoff._

**Pressure:** N construction paths × M fields = N×M cells the agent must verify match on every field-related edit. Field additions cascade across all paths; per-path duplication consumes context budget that could be spent on the calling code.

**Tradeoff:** A long canonical parameter list is itself a context-load tax — the agent must remember positional argument order on every reading of a delegating factory. Wrong-position bugs become subtler than missing-field bugs.

**Relief:** Each delegating factory is one line; the agent reads the canonical constructor once and treats all variants as parameterized calls. Diff surface for adding a new field is one place; tests for the canonical constructor cover all variants transitively.

**Trap:** The canonical constructor balloons into a many-parameter signature where the agent loses track of which combinations are legal. Context cost moves from per-path duplication to per-parameter combination explosion; a parameter object or named-argument shape becomes overdue.

**Triggered by:** Duplicated Code (smells), Extract Function (refactorings), Combine Functions into Class (refactorings)

---
name: compose-method
description: Apply Compose Method when you see Long Function, Extract Function, Replace Temp with Query. The method reads as a sequence of named operations the agent can verify against without re-deriving the algorithm.
---

# Apply: 02 — Compose Method

**Symptom:** A method whose body the agent must trace line-by-line to understand the algorithm; the high-level shape is obscured by interleaved details. Verifying behavior preservation requires re-reading the entire span on every edit.

**Goal:** The method reads as a sequence of named operations the agent can verify against without re-deriving the algorithm. Each helper is small enough to reason about in a single step.

```js
// Before:
function add(item, quantity) {
  if (this.readOnly) throw new Error('list is read-only');
  const existing = this.items.find(line => line.product.id === item.id);
  if (existing) {
    existing.quantity += quantity;
  } else {
    this.items.push({ product: item, quantity });
    this.items.sort((a, b) => a.product.id - b.product.id);
  }
  this.recalculateTotal();
}

// After:
function add(item, quantity) {
  assertWritable(this);
  const existing = findLineFor(this.items, item);
  if (existing) {
    increaseQuantity(existing, quantity);
  } else {
    insertNewLine(this.items, item, quantity);
  }
  this.recalculateTotal();
}
```

_Example source: Illustrative example written for this site, not a quotation from the book. The pattern itself is Joshua Kerievsky's, from Refactoring to Patterns (Addison-Wesley, 2004)._

**Pressure:** Every edit re-loads the full method body to confirm behavior preservation. Chained orchestration changes compound context cost; reasoning about cross-step invariants gets harder as the method grows.

**Tradeoff:** Each helper inflates context-window cost by one definition the next reasoning step must load. Over-decomposing fragments a single procedure across many files.

**Relief:** The composed method captures the algorithm in named steps; helpers are independently verifiable; refactoring orchestration is a localized change. Smaller diff surface per commit.

**Trap:** A deeply-nested hierarchy of helpers where the agent must chase multiple definitions to understand a single original method — context cost multiplies and cross-helper invariants vanish from view.

**Triggered by:** Long Function (smells), Extract Function (refactorings), Replace Temp with Query (refactorings)

---
name: encapsulate-classes-with-factory
description: Apply Encapsulate Classes With Factory when you see Shotgun Surgery, Replace Constructor with Factory Function, Hide Delegate. One factory module the agent verifies once; all construction sites read as named factory calls the agent can treat opaquely.
---

# Apply: 03 — Encapsulate Classes With Factory

**Symptom:** Concrete subclass type names appear at every construction site the agent must scan. Renaming or restructuring a subclass requires the agent to enumerate every `new SubclassName(...)` call in scope and update each one; static type-name coupling is brittle across files.

**Goal:** One factory module the agent verifies once; all construction sites read as named factory calls the agent can treat opaquely. Restructuring the hierarchy is a one-file diff verified locally.

```js
// Before:
// Concrete subclasses exported and constructed by clients everywhere.
export class Loan {
  capital() { throw new Error('abstract'); }
}
export class TermLoan extends Loan {
  constructor(commitment, maturity) { super(); this.commitment = commitment; this.maturity = maturity; }
  capital() { return this.commitment * this.duration() * 0.05; }
}
export class Revolver extends Loan {
  constructor(commitment, expiry) { super(); this.commitment = commitment; this.expiry = expiry; }
  capital() { return this.commitment * 0.7 * this.duration() * 0.05; }
}
export class AdvisedLine extends Loan {
  constructor(commitment, expiry) { super(); this.commitment = commitment; this.expiry = expiry; }
  capital() { return this.outstanding() * this.duration() + this.unused() * this.duration() * 0.5; }
}

// Client code (in many files):
const loan1 = new TermLoan(100000, '2027-01-01');
const loan2 = new Revolver(50000, '2026-06-30');
const loan3 = new AdvisedLine(75000, '2026-06-30');

// After:
// Only Loan is exported. Concrete subclasses stay module-local.
export class Loan {
  static newTermLoan(commitment, maturity) {
    return new TermLoan(commitment, maturity);
  }
  static newRevolver(commitment, expiry) {
    return new Revolver(commitment, expiry);
  }
  static newAdvisedLine(commitment, expiry) {
    return new AdvisedLine(commitment, expiry);
  }
  capital() { throw new Error('abstract'); }
}
class TermLoan extends Loan { /* ... */ }
class Revolver extends Loan { /* ... */ }
class AdvisedLine extends Loan { /* ... */ }

// Client code:
const loan1 = Loan.newTermLoan(100000, '2027-01-01');
const loan2 = Loan.newRevolver(50000, '2026-06-30');
const loan3 = Loan.newAdvisedLine(75000, '2026-06-30');
```

_Example source: Adapted from Joshua Kerievsky's Loan-hierarchy example in Refactoring to Patterns (Addison-Wesley, 2004), chapter 6. The Java original used package-private constructors and a public factory; this JavaScript translation relies on module-local class declarations to achieve the same hiding of concrete subclasses from clients._

**Pressure:** Every client-side `new SubclassName(...)` couples the call site to the concrete identity. The agent must hold the subclass taxonomy in working context across many files just to verify construction sites are consistent with the hierarchy's current shape.

**Tradeoff:** Factory methods are an extra indirection the agent must hop through to know what kind of object a call returns. Static call-graph analysis loses precision; the agent may need to read the factory body to determine which concrete type comes back from a given factory call.

**Relief:** The factory is the single source of truth for the taxonomy. Adding a subclass touches one file; the agent verifies one new factory method instead of N construction sites. Hierarchy reshaping is locally observable.

**Trap:** A factory with one method per subclass and no other logic just renames `new` to `factory.new`. Context cost rises by one definition layer without proportional reasoning gain; the encapsulation pays only when the factory can hide non-trivial creation choices.

**Triggered by:** Shotgun Surgery (smells), Replace Constructor with Factory Function (refactorings), Hide Delegate (refactorings)

---
name: encapsulate-composite-with-builder
description: Apply Encapsulate Composite With Builder when you see Long Function, Hide Delegate, Extract Class. A construction site that reads as a tree literal the agent can parse structurally in one pass.
---

# Apply: 04 — Encapsulate Composite With Builder

**Symptom:** A construction site the agent must trace line-by-line across many intermediate variable assignments to reconstruct the tree's shape. Behavioural preservation on tree-shape edits requires loading the full construction span and following cross-variable references to verify which child lives under which parent.

**Goal:** A construction site that reads as a tree literal the agent can parse structurally in one pass. Edits to one subtree don't require loading the rest; the chain's indentation tells the agent which method calls operate on which node.

```js
// Before:
// Client constructs the XML tree by wiring TagNodes manually.
const order = new TagNode('Order');
const customer = new TagNode('Customer');
customer.setAttribute('id', 'C-901');
order.addChild(customer);
const items = new TagNode('Items');
const item1 = new TagNode('Item');
item1.setAttribute('sku', '123');
item1.setAttribute('qty', '2');
items.addChild(item1);
const item2 = new TagNode('Item');
item2.setAttribute('sku', '456');
item2.setAttribute('qty', '1');
items.addChild(item2);
order.addChild(items);
const xml = order.toXML();

// After:
// Client reads as an outline of the tree it builds.
const xml = new XMLBuilder('Order')
  .addChild('Customer').addAttribute('id', 'C-901').end()
  .addChild('Items')
    .addChild('Item').addAttribute('sku', '123').addAttribute('qty', '2').end()
    .addChild('Item').addAttribute('sku', '456').addAttribute('qty', '1').end()
  .end()
  .toXML();
```

_Example source: Adapted from Joshua Kerievsky's XML-builder example in Refactoring to Patterns (Addison-Wesley, 2004), chapter 6. The Java original used a TagNode composite + XMLBuilder fluent API; this JavaScript translation keeps the same shape — TagNode for the composite, a chained builder for the construction grammar._

**Pressure:** Tree wiring across N intermediate variables × M tree nodes consumes context budget proportional to the tree's size. Renaming a variable risks breaking the wiring; the data flow is brittle in a way static analysis cannot fully catch.

**Tradeoff:** A fluent chain is one large expression the agent must keep coherent — losing track of `.end()` placement silently produces a different tree shape. Long chains evade static analysis of intermediate states, and partial failures inside the chain are hard to attribute.

**Relief:** The builder's method chain reads structurally; nested calls visually mirror nested nodes. Verifying a tree edit is a localized diff inside the chain rather than a cross-variable trace; the build is a single expression with one rooted result.

**Trap:** A builder that returns `this` everywhere becomes one massive expression; the agent's reasoning about partial-state failures degrades because there are no intermediate names to anchor on. Debugging requires re-reading the entire chain to localize where the failure happened.

**Triggered by:** Long Function (smells), Hide Delegate (refactorings), Extract Class (refactorings)

---
name: extract-adapter
description: Apply Extract Adapter when you see Divergent Change, Extract Class, Replace Conditional with Polymorphism. One adapter file per variant; the agent verifies each adapter independently against the external API.
---

# Apply: 05 — Extract Adapter

**Symptom:** Host class methods the agent must scan twice — once for the host logic, once for each variant branch — to determine what executes in a given environment. Library-version edits ripple to host class methods even when host behaviour is unchanged.

**Goal:** One adapter file per variant; the agent verifies each adapter independently against the external API. The host class becomes a thin delegator the agent reads once and trusts thereafter.

```js
// Before:
// One class branches on library version internally.
class ChartGenerator {
  draw(data, libraryVersion) {
    if (libraryVersion === 1) {
      const ctx = OldChartLib.createContext();
      ctx.setData(data.map(d => ({ x: d.label, y: d.value })));
      ctx.setTitle(this.title);
      ctx.render();
      return ctx;
    }
    if (libraryVersion === 2) {
      const renderer = new NewChartLib.Renderer({ data, title: this.title });
      renderer.render();
      return renderer;
    }
    throw new Error(`unsupported version ${libraryVersion}`);
  }
}

// After:
// One adapter per version; ChartGenerator no longer knows the library.
class ChartGenerator {
  constructor(chartAdapter) {
    this.chartAdapter = chartAdapter;
  }
  draw(data) {
    return this.chartAdapter.draw(data, this.title);
  }
}

class V1ChartAdapter {
  draw(data, title) {
    const ctx = OldChartLib.createContext();
    ctx.setData(data.map(d => ({ x: d.label, y: d.value })));
    ctx.setTitle(title);
    ctx.render();
    return ctx;
  }
}

class V2ChartAdapter {
  draw(data, title) {
    const renderer = new NewChartLib.Renderer({ data, title });
    renderer.render();
    return renderer;
  }
}
```

_Example source: Adapted from Joshua Kerievsky's third-party-library-version example in Refactoring to Patterns (Addison-Wesley, 2004), chapter 6. The Java original wrapped two versions of a charting library; this JavaScript translation keeps the same shape — a host class delegating to a per-version adapter._

**Pressure:** Mixed variant + host code consumes context budget on every host-class edit. The agent must hold all variant branches in working memory to verify that a host change doesn't break a variant code path; cross-variant invariants are easy to miss.

**Tradeoff:** Adapter extraction multiplies file count and may obscure the agent's static call-graph view of how data flows from host through to external API. Mocking adapters in host tests requires duplicating the adapter interface in the test setup.

**Relief:** Host class tests stop loading external-library mocks; adapter tests load only the one external surface they wrap. Diff surface for a library upgrade is one adapter file; the agent's context cost on host edits drops linearly with variant count.

**Trap:** An adapter for a single, stable variant is dead weight — one extra file the agent must learn before reading the host. The pattern pays only when adapter count > 1 or when adapter-level test isolation buys verifiability the host couldn't achieve alone.

**Triggered by:** Divergent Change (smells), Extract Class (refactorings), Replace Conditional with Polymorphism (refactorings)

---
name: extract-composite
description: Apply Extract Composite when you see Duplicated Code, Extract Superclass, Pull Up Method. One Composite superclass the agent reads once and trusts thereafter.
---

# Apply: 06 — Extract Composite

**Symptom:** N copies of identical collection-management methods the agent must verify match on every edit. A bug fix in one copy must be ported to all others; the agent has no static guarantee the copies stayed consistent.

**Goal:** One Composite superclass the agent reads once and trusts thereafter. Sibling classes are short enough to load entirely in context; the agent verifies only the distinctive surface.

```js
// Before:
// Two sibling classes each carry the same line-item collection logic.
class Order {
  constructor(customer) {
    this.customer = customer;
    this.lineItems = [];
  }
  addLineItem(item) { this.lineItems.push(item); }
  removeLineItem(item) {
    const index = this.lineItems.indexOf(item);
    if (index >= 0) this.lineItems.splice(index, 1);
  }
  total() { return this.lineItems.reduce((sum, i) => sum + i.amount, 0); }
  ship() { /* Order-specific */ }
}
class Invoice {
  constructor(customer, dueDate) {
    this.customer = customer;
    this.dueDate = dueDate;
    this.lineItems = [];
  }
  addLineItem(item) { this.lineItems.push(item); }
  removeLineItem(item) {
    const index = this.lineItems.indexOf(item);
    if (index >= 0) this.lineItems.splice(index, 1);
  }
  total() { return this.lineItems.reduce((sum, i) => sum + i.amount, 0); }
  markPaid() { /* Invoice-specific */ }
}

// After:
// Collection management lives once in a Composite superclass.
class LineItemContainer {
  constructor(customer) {
    this.customer = customer;
    this.lineItems = [];
  }
  addLineItem(item) { this.lineItems.push(item); }
  removeLineItem(item) {
    const index = this.lineItems.indexOf(item);
    if (index >= 0) this.lineItems.splice(index, 1);
  }
  total() { return this.lineItems.reduce((sum, i) => sum + i.amount, 0); }
}
class Order extends LineItemContainer {
  ship() { /* Order-specific */ }
}
class Invoice extends LineItemContainer {
  constructor(customer, dueDate) {
    super(customer);
    this.dueDate = dueDate;
  }
  markPaid() { /* Invoice-specific */ }
}
```

_Example source: Illustrative example written for this site, adapted from Kerievsky's pattern description in Refactoring to Patterns (Addison-Wesley, 2004), chapter 6. The book's Java example pulled tax-calculation collection logic up to a Composite superclass; this JavaScript version uses line-item collections, same pattern shape._

**Pressure:** Duplicated collection logic across N siblings × M methods = N×M cells the agent must hold to verify consistency. The agent's edit budget on a single collection-method change is N times what it would be with the Composite in place.

**Tradeoff:** Inheritance hides behaviour in the superclass that callers may not know to look for; the agent must traverse the class hierarchy to know what a sibling can do. Method resolution order issues complicate static reasoning when subclasses override partial behaviours.

**Relief:** Diff surface for a collection-logic change collapses to one file. Sibling class files become short and locally readable; tests can target Composite behaviour without per-sibling duplication.

**Trap:** A bloated Composite forces the agent to load a large superclass before reading any sibling. If sibling behaviours diverge later, the agent must constantly cross-check superclass methods against per-sibling overrides — context cost migrates from duplication to inheritance traversal.

**Triggered by:** Duplicated Code (smells), Extract Superclass (refactorings), Pull Up Method (refactorings)

---
name: extract-parameter
description: Apply Extract Parameter when you see Duplicated Code, Parameterize Function, Extract Function. One method the agent reads once; callers supply the varying value at the call site.
---

# Apply: 07 — Extract Parameter

**Symptom:** N near-duplicate method definitions the agent must verify match on every edit. The single difference between them is mechanical; the rest is copy-pasted. The agent must re-read all N to verify a change in one was correctly propagated.

**Goal:** One method the agent reads once; callers supply the varying value at the call site. Verification of behaviour reduces from N×assertion to 1×assertion + parameter coverage tests.

```js
// Before:
// Three near-identical methods, differing only by which book field they search.
class BookSearch {
  constructor(repo) {
    this.repo = repo;
  }
  searchByAuthor(query) {
    return this.repo.where(book => book.author.toLowerCase().includes(query.toLowerCase()));
  }
  searchByTitle(query) {
    return this.repo.where(book => book.title.toLowerCase().includes(query.toLowerCase()));
  }
  searchByPublisher(query) {
    return this.repo.where(book => book.publisher.toLowerCase().includes(query.toLowerCase()));
  }
}

// After:
// One method; the varying field is a parameter.
class BookSearch {
  constructor(repo) {
    this.repo = repo;
  }
  searchBy(field, query) {
    return this.repo.where(book => book[field].toLowerCase().includes(query.toLowerCase()));
  }
}
```

_Example source: Illustrative example written for this site, adapted from Kerievsky's pattern description in Refactoring to Patterns (Addison-Wesley, 2004), chapter 6. The book frames Extract Parameter as the structural move that prepares a method for Form Template Method by isolating what varies between near-duplicate methods._

**Pressure:** Per-method duplication multiplies the agent's edit cost on every shared-logic change. The agent's static reasoning cannot guarantee that N copies of a closure stayed identical without re-inspecting each.

**Tradeoff:** A parameterized method obscures static call-graph analysis — the agent cannot tell from the call site alone which behaviour fires. Stringy parameters (`'author'`) defeat static type-checking; misspellings ship to runtime.

**Relief:** Diff surface for shared logic collapses to one method body. Per-parameter behaviour is covered by table-driven tests the agent can read and reason about in one block; new variants are one new test row.

**Trap:** Replacing N methods with a method that takes a stringy parameter pushes the type information out of the type system and into runtime. The agent must verify caller intent by tracing the literal across files, which costs more context than reading N distinct method names.

**Triggered by:** Duplicated Code (smells), Parameterize Function (refactorings), Extract Function (refactorings)

---
name: form-template-method
description: Apply Form Template Method when you see Duplicated Code, Pull Up Method, Extract Function. One template body the agent reads to know the algorithm; primitives are short, locally readable, individually verifiable.
---

# Apply: 08 — Form Template Method

**Symptom:** N near-identical algorithm bodies the agent must verify match step-for-step on every edit. A control-flow bug fixed in one body must be ported to N-1 others, with no static guarantee the ports stayed faithful.

**Goal:** One template body the agent reads to know the algorithm; primitives are short, locally readable, individually verifiable. The agent's edit budget for an algorithmic change scales with template length, not with subclass count.

```js
// Before:
// Two reports follow the same outline but each open-codes the whole algorithm.
class HtmlReport {
  generate(data) {
    let output = '<html><body>';
    output += `<h1>${data.title}</h1>`;
    output += '<table>';
    for (const row of data.rows) {
      output += `<tr><td>${row.name}</td><td>${row.value}</td></tr>`;
    }
    output += '</table>';
    output += '</body></html>';
    return output;
  }
}
class TextReport {
  generate(data) {
    let output = '';
    output += data.title.toUpperCase() + '\n';
    output += '='.repeat(data.title.length) + '\n';
    for (const row of data.rows) {
      output += row.name + ': ' + row.value + '\n';
    }
    return output;
  }
}

// After:
// The algorithm lives once in Report; subclasses supply the per-format primitives.
class Report {
  generate(data) {
    let output = this.openSection();
    output += this.formatTitle(data.title);
    output += this.openRows();
    for (const row of data.rows) {
      output += this.formatRow(row);
    }
    output += this.closeRows();
    output += this.closeSection();
    return output;
  }
}
class HtmlReport extends Report {
  openSection() { return '<html><body>'; }
  closeSection() { return '</body></html>'; }
  formatTitle(t) { return `<h1>${t}</h1>`; }
  openRows() { return '<table>'; }
  closeRows() { return '</table>'; }
  formatRow(row) { return `<tr><td>${row.name}</td><td>${row.value}</td></tr>`; }
}
class TextReport extends Report {
  openSection() { return ''; }
  closeSection() { return ''; }
  formatTitle(t) { return t.toUpperCase() + '\n' + '='.repeat(t.length) + '\n'; }
  openRows() { return ''; }
  closeRows() { return ''; }
  formatRow(row) { return row.name + ': ' + row.value + '\n'; }
}
```

_Example source: Illustrative example written for this site, faithful to Kerievsky's pattern shape in Refactoring to Patterns (Addison-Wesley, 2004), chapter 8. The book uses tax-calculator subclasses with a shared compute outline; this JavaScript version uses report generators with a shared layout outline — same shape, same Template Method payoff._

**Pressure:** Algorithmic duplication across N subclasses × M steps = N×M cells the agent must hold in context to verify consistency. The agent cannot statically detect when one copy drifts from the others; the drift only surfaces when a subclass-specific test fails — assuming there is one.

**Tradeoff:** Template Method splits behaviour across the superclass (algorithm) and subclasses (primitives); the agent must traverse the hierarchy to know what a single call produces. Method resolution order issues complicate static reasoning when intermediate subclasses partially override primitives.

**Relief:** Algorithmic diffs collapse to one method body. Per-subclass tests verify only the primitives; the algorithm is exercised by superclass tests once. Diff surface for adding a step is one new abstract primitive + N implementations — visible and bounded.

**Trap:** A long Template Method with many fine-grained primitives forces the agent to read across many small methods to reconstruct what the algorithm does in any given subclass. Context cost migrates from inline duplication to hierarchy traversal; per-step debugging requires loading the relevant primitive override before the template makes sense.

**Triggered by:** Duplicated Code (smells), Pull Up Method (refactorings), Extract Function (refactorings)

---
name: inline-singleton
description: Apply Inline Singleton when you see Global Data, Inline Function, Remove Dead Code. Constructor signatures encode the dependency graph the agent can read statically.
---

# Apply: 09 — Inline Singleton

**Symptom:** Singleton accessors (`Class.getInstance()`) hide the agent's view of which classes depend on the collaborator. The agent must grep the codebase for every static-accessor call to know the real dependency graph; test setup requires resetting global state between cases.

**Goal:** Constructor signatures encode the dependency graph the agent can read statically. Per-test construction makes setup/teardown explicit; the agent verifies one wiring at the composition root rather than chasing static accessors.

```js
// Before:
// Singleton machinery for what is effectively a regular collaborator.
class Logger {
  static instance = null;
  static getInstance() {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }
  constructor() {
    this.entries = [];
  }
  log(message) {
    this.entries.push({ time: Date.now(), message });
  }
}

// Client code reaches into the global accessor.
function processOrder(order) {
  Logger.getInstance().log(`Processing order ${order.id}`);
  // ...
}

// After:
// Regular class; callers receive a logger through their constructor.
class Logger {
  constructor() {
    this.entries = [];
  }
  log(message) {
    this.entries.push({ time: Date.now(), message });
  }
}

class OrderProcessor {
  constructor(logger) {
    this.logger = logger;
  }
  processOrder(order) {
    this.logger.log(`Processing order ${order.id}`);
    // ...
  }
}
```

_Example source: Illustrative example written for this site, adapted from Kerievsky's pattern description in Refactoring to Patterns (Addison-Wesley, 2004), chapter 5. The book demonstrates inlining a configuration Singleton; this JavaScript version inlines a Logger Singleton in favour of constructor injection — same payoff: testability and explicit dependencies._

**Pressure:** Static accessors defeat static call-graph analysis at the dependency level; the agent cannot infer from a class's interface what it actually uses. Test-order flakiness from shared static state is invisible to local reasoning and only surfaces under CI.

**Tradeoff:** Inlining pushes wiring code outward; the agent must reason about a composition root or DI container to verify production behaviour. Without one, the inlining may produce duplicated wiring across callers that the agent now has to verify match.

**Relief:** Constructor parameters are statically visible dependencies the agent can verify without grepping. Per-test isolation makes test failures attributable to the test itself rather than to a stale global state.

**Trap:** Inlining without a composition root forces the agent to scatter `new Logger()` calls across the codebase, each implicitly creating independent state. The agent then has to verify intent (one logger or many?) at every call site, which is harder than reading one global accessor.

**Triggered by:** Global Data (smells), Inline Function (refactorings), Remove Dead Code (refactorings)

---
name: introduce-null-object
description: Apply Introduce Null Object when you see Repeated Switches, Introduce Special Case, Replace Conditional with Polymorphism. One Null Object class the agent verifies once; all call sites unconditionally invoke the collaborator interface.
---

# Apply: 10 — Introduce Null Object

**Symptom:** Null-check branches the agent must trace at every collaborator-using call site. The agent cannot statically verify all check sites stay consistent; new callers risk omitting the check and shipping NullPointerExceptions.

**Goal:** One Null Object class the agent verifies once; all call sites unconditionally invoke the collaborator interface. The agent's edit budget on a collaborator-using method drops because there's no per-call branch to reason about.

```js
// Before:
// Every consumer of Customer.discount and Customer.loyaltyProgram must check for null first.
class Order {
  constructor(customer) {
    this.customer = customer;
  }
  finalPrice() {
    let price = this.subtotal();
    if (this.customer.discount !== null) {
      price = this.customer.discount.applyTo(price);
    }
    if (this.customer.loyaltyProgram !== null) {
      price -= this.customer.loyaltyProgram.pointsValue();
    }
    return price;
  }
  subtotal() { /* ... */ }
}

// After:
// Null Objects implement the same interface with safe defaults; callers stop branching.
class NoDiscount {
  applyTo(price) {
    return price;
  }
}
class NoLoyaltyProgram {
  pointsValue() {
    return 0;
  }
}

class Order {
  constructor(customer) {
    // customer.discount and customer.loyaltyProgram are never null;
    // they are NoDiscount/NoLoyaltyProgram when absent.
    this.customer = customer;
  }
  finalPrice() {
    let price = this.subtotal();
    price = this.customer.discount.applyTo(price);
    price -= this.customer.loyaltyProgram.pointsValue();
    return price;
  }
  subtotal() { /* ... */ }
}
```

_Example source: Illustrative example written for this site, faithful to Kerievsky's pattern shape in Refactoring to Patterns (Addison-Wesley, 2004), chapter 9. The book uses a Customer hierarchy with a NullCustomer; this JavaScript version uses NoDiscount and NoLoyaltyProgram — same pattern, scaled to two collaborators to show how callers stop branching._

**Pressure:** N call sites × M methods × the null check = the agent's per-edit verification cost. Static analysis catches some missing checks but not all (especially after refactors that change which fields can be null).

**Tradeoff:** A Null Object collapses two distinct runtime states (absent / present) into one type at the call site. The agent loses the ability to statically distinguish a real collaborator from its null stand-in; debugging requires reading the constructor / factory to know which is which.

**Relief:** Branch count at call sites drops to zero; the agent reads the Null Object's body once to know what 'absent' does, and trusts the type system thereafter. Adding a new caller is one method call, not one method-call-plus-branch.

**Trap:** A Null Object that quietly returns the wrong neutral element (zero where one was needed, identity where blocking was needed) produces silent failures the agent cannot detect from static reading. The pattern requires careful semantic alignment between 'absent' and the chosen default.

**Triggered by:** Repeated Switches (smells), Introduce Special Case (refactorings), Replace Conditional with Polymorphism (refactorings)

---
name: introduce-polymorphic-creation-with-factory-method
description: Apply Introduce Polymorphic Creation With Factory Method when you see Repeated Switches, Replace Conditional with Polymorphism, Replace Constructor with Factory Function. Each subclass's Factory Method is locally verifiable; the base algorithm has no construction-conditional for the agent to load.
---

# Apply: 11 — Introduce Polymorphic Creation With Factory Method

**Symptom:** A conditional construction block the agent must scan to know which collaborator gets built for a given type code. Adding a variant requires the agent to enumerate every such construction site in scope and add a branch — Shotgun Surgery in static reasoning.

**Goal:** Each subclass's Factory Method is locally verifiable; the base algorithm has no construction-conditional for the agent to load. The agent's per-edit budget on a variant addition is one new subclass, not N edits to construction sites.

```js
// Before:
// Branching on a type code to decide which collaborator to construct.
class DocumentReader {
  constructor(format) {
    this.format = format;
  }
  read(text) {
    let parser;
    if (this.format === 'xml') {
      parser = new XmlParser();
    } else if (this.format === 'json') {
      parser = new JsonParser();
    } else if (this.format === 'csv') {
      parser = new CsvParser();
    } else {
      throw new Error(`unsupported format ${this.format}`);
    }
    return parser.parse(text);
  }
}

// After:
// Each subclass owns its createParser primitive; the base class is conditional-free.
class DocumentReader {
  read(text) {
    return this.createParser().parse(text);
  }
  createParser() {
    throw new Error('abstract: subclasses must implement createParser');
  }
}
class XmlReader extends DocumentReader {
  createParser() {
    return new XmlParser();
  }
}
class JsonReader extends DocumentReader {
  createParser() {
    return new JsonParser();
  }
}
class CsvReader extends DocumentReader {
  createParser() {
    return new CsvParser();
  }
}
```

_Example source: Illustrative example written for this site, adapted from Kerievsky's pattern description in Refactoring to Patterns (Addison-Wesley, 2004), chapter 6. The book frames this as the polymorphic alternative to type-code-driven construction; this JavaScript version uses document readers and parsers, same Factory Method shape._

**Pressure:** Construction conditionals couple the base class to the full variant taxonomy; the agent must hold every variant in working memory to verify any edit to the base. Cross-variant invariants (e.g., that every parser implements `.parse`) are not statically enforceable when construction goes through type-code strings.

**Tradeoff:** Factory Method spreads creation across the inheritance hierarchy; the agent must traverse subclasses to know which concrete type a base-class call produces. Static call-graph analysis loses precision on the return type of `createParser()`.

**Relief:** Diff surface for a new variant is one subclass file. The base algorithm reads as polymorphic call-and-use; agent reasoning about the algorithm stays independent of the variant count.

**Trap:** A hierarchy with one trivial Factory Method per subclass forces the agent to load the inheritance chain to know what a single base-class call returns. The pattern's context-cost gain materializes only when each Factory Method does non-trivial work — otherwise the indirection adds cost without proportional clarity.

**Triggered by:** Repeated Switches (smells), Replace Conditional with Polymorphism (refactorings), Replace Constructor with Factory Function (refactorings)

---
name: limit-instantiation-with-singleton
description: Apply Limit Instantiation With Singleton when you see Mutable Data, Encapsulate Variable, Replace Constructor with Factory Function. One static accessor the agent verifies once; all references resolve to the same identity.
---

# Apply: 12 — Limit Instantiation With Singleton

**Symptom:** Multiple instances of a class that should be unique appear at construction sites the agent must trace to confirm state coherence. State-fragmentation bugs are invisible to local reasoning — each instance looks correct, but their sum is wrong.

**Goal:** One static accessor the agent verifies once; all references resolve to the same identity. The agent can statically reason about 'same instance' rather than tracking which constructor produced which instance.

```js
// Before:
// Anyone can construct a MetricsRegistry; each instance has its own state.
// Counts reported to one registry are invisible to another.
class MetricsRegistry {
  constructor() {
    this.counters = new Map();
  }
  increment(name) {
    this.counters.set(name, (this.counters.get(name) ?? 0) + 1);
  }
  snapshot() {
    return Object.fromEntries(this.counters);
  }
}

const registryA = new MetricsRegistry();
registryA.increment('orders.created');
const registryB = new MetricsRegistry();
registryB.snapshot(); // {} — does not see registryA's increment.

// After:
// One instance for the whole process; getInstance() is the only way to obtain it.
class MetricsRegistry {
  static #instance = null;
  static getInstance() {
    if (!MetricsRegistry.#instance) {
      MetricsRegistry.#instance = new MetricsRegistry(MetricsRegistry.#construction);
    }
    return MetricsRegistry.#instance;
  }
  static #construction = Symbol('private construction key');
  constructor(key) {
    if (key !== MetricsRegistry.#construction) {
      throw new Error('MetricsRegistry is a singleton; use getInstance()');
    }
    this.counters = new Map();
  }
  increment(name) {
    this.counters.set(name, (this.counters.get(name) ?? 0) + 1);
  }
  snapshot() {
    return Object.fromEntries(this.counters);
  }
}

MetricsRegistry.getInstance().increment('orders.created');
MetricsRegistry.getInstance().snapshot(); // { 'orders.created': 1 }
```

_Example source: Illustrative example written for this site, faithful to Kerievsky's pattern shape in Refactoring to Patterns (Addison-Wesley, 2004), chapter 5. The book is careful that Singleton is for cases where instance uniqueness is part of the contract — this metrics-registry example fits that frame: every contributor must report into one place or the snapshot lies._

**Pressure:** Multiple-instance fragmentation cannot be statically diagnosed — the agent needs runtime introspection or holistic test coverage to detect when two callers hold different instances of what should be one. Verification cost is high; bugs are subtle.

**Tradeoff:** Singletons defeat the agent's static dependency analysis: constructor signatures no longer reveal what a class uses. Test isolation requires the agent to inject a reset hook or restructure to allow per-test instances; tests can become order-sensitive without obvious indicators.

**Relief:** Identity is statically guaranteed; the agent can verify that all callers refer to the same conceptual instance without runtime introspection. Cross-cutting invariants (one cache, one registry) become enforceable at construction.

**Trap:** Singletons hide dependencies from the agent's static view; the agent must grep for static accessors to enumerate consumers. Test-order flakiness from leaked state is invisible until it manifests; the agent cannot statically detect Singletons that should have been per-instance.

**Triggered by:** Mutable Data (smells), Encapsulate Variable (refactorings), Replace Constructor with Factory Function (refactorings)

---
name: move-accumulation-to-collecting-parameter
description: Apply Move Accumulation To Collecting Parameter when you see Duplicated Code, Parameterize Function, Substitute Algorithm. One collecting parameter the agent reads as a single mutable accumulator; recursion bodies become small and locally verifiable.
---

# Apply: 13 — Move Accumulation To Collecting Parameter

**Symptom:** Recursive methods the agent must trace at every level to verify the accumulate-and-merge sequence preserves order and content. Each level allocates and copies; the agent's reasoning about the final result requires composing N merge operations mentally.

**Goal:** One collecting parameter the agent reads as a single mutable accumulator; recursion bodies become small and locally verifiable. Final-result verification is one read of the accumulator, not a recursive trace.

```js
// Before:
// Each node builds a fragment and the parent concatenates.
// The accumulate-then-merge step is duplicated through the recursion.
class Section {
  constructor(title) {
    this.title = title;
    this.children = [];
  }
  toLines() {
    let lines = [this.title];
    for (const child of this.children) {
      lines = lines.concat(child.toLines().map((line) => '  ' + line));
    }
    return lines;
  }
}

const output = root.toLines();

// After:
// One collecting parameter; each node writes directly into it.
class Section {
  constructor(title) {
    this.title = title;
    this.children = [];
  }
  printTo(lines, indent = '') {
    lines.push(indent + this.title);
    for (const child of this.children) {
      child.printTo(lines, indent + '  ');
    }
  }
}

const output = [];
root.printTo(output);
```

_Example source: Illustrative example written for this site, faithful to Kerievsky's pattern shape in Refactoring to Patterns (Addison-Wesley, 2004), chapter 8. The book uses a recursive tag-printing example with a StringBuffer collecting parameter; this JavaScript version uses a Section composite collecting lines into an array — same pattern, idiomatic JS host._

**Pressure:** Per-step intermediate allocations multiply both runtime cost and reasoning cost — the agent must verify each level's merge logic is consistent with the others. Memory churn on deep recursions is invisible until profiling surfaces it.

**Tradeoff:** Mutable accumulators defeat the agent's static reasoning about purity. Method signatures change semantics — what looked like a query now mutates a parameter; static-analysis tools that classify methods as pure must be retaught. Tests must verify the accumulator's final state, not the method's return value.

**Relief:** Recursion bodies shrink; verification of correctness localizes to one append-per-level; static reasoning about the algorithm's shape becomes straightforward. The traversal is observable through one accumulator snapshot.

**Trap:** An accumulator that escapes the traversal is a shared mutable reference the agent must trace through subsequent code to verify safety. The pattern's verifiability gain inside the traversal is partially undone by the safety analysis required outside it.

**Triggered by:** Duplicated Code (smells), Parameterize Function (refactorings), Substitute Algorithm (refactorings)

---
name: move-accumulation-to-visitor
description: Apply Move Accumulation To Visitor when you see Divergent Change, Extract Class, Move Function. One file per operation; the agent verifies a Visitor in isolation.
---

# Apply: 14 — Move Accumulation To Visitor

**Symptom:** An operation's logic the agent must trace across N node classes to reconstruct what happens on a recursive call. The structure's source files are large because each one carries every operation; adding an operation requires the agent to coordinate edits across the full type hierarchy.

**Goal:** One file per operation; the agent verifies a Visitor in isolation. Node classes shrink to data + one accept method; the structure's complexity drops to its actual shape rather than the cumulative weight of every operation it has accumulated.

```js
// Before:
// Each operation (compute, print, depth) is a method on every node;
// adding an operation means editing every class.
class NumberExpr {
  constructor(value) { this.value = value; }
  compute() { return this.value; }
  print() { return String(this.value); }
  depth() { return 1; }
}
class AddExpr {
  constructor(left, right) { this.left = left; this.right = right; }
  compute() { return this.left.compute() + this.right.compute(); }
  print() { return '(' + this.left.print() + ' + ' + this.right.print() + ')'; }
  depth() { return 1 + Math.max(this.left.depth(), this.right.depth()); }
}
class MultiplyExpr {
  constructor(left, right) { this.left = left; this.right = right; }
  compute() { return this.left.compute() * this.right.compute(); }
  print() { return this.left.print() + ' * ' + this.right.print(); }
  depth() { return 1 + Math.max(this.left.depth(), this.right.depth()); }
}

// After:
// Nodes accept visitors; each operation is a visitor class.
// New operations land as new visitors; the node classes stay closed.
class NumberExpr {
  constructor(value) { this.value = value; }
  accept(visitor) { return visitor.visitNumber(this); }
}
class AddExpr {
  constructor(left, right) { this.left = left; this.right = right; }
  accept(visitor) { return visitor.visitAdd(this); }
}
class MultiplyExpr {
  constructor(left, right) { this.left = left; this.right = right; }
  accept(visitor) { return visitor.visitMultiply(this); }
}

class ComputeVisitor {
  visitNumber(n) { return n.value; }
  visitAdd(a) { return a.left.accept(this) + a.right.accept(this); }
  visitMultiply(m) { return m.left.accept(this) * m.right.accept(this); }
}

class PrintVisitor {
  visitNumber(n) { return String(n.value); }
  visitAdd(a) { return '(' + a.left.accept(this) + ' + ' + a.right.accept(this) + ')'; }
  visitMultiply(m) { return m.left.accept(this) + ' * ' + m.right.accept(this); }
}
```

_Example source: Illustrative example written for this site, faithful to Kerievsky's pattern shape in Refactoring to Patterns (Addison-Wesley, 2004), chapter 8. Per ADR-0004, the bookend contrasts the accept/visit shape — not the intermediate steps. The book uses a parse-tree example with multiple accumulations; this JavaScript version uses an expression tree with Compute and Print visitors as the most legible bookend._

**Pressure:** Each operation × N node classes = N×M cells the agent must verify match for the operation to behave consistently across the structure. Cross-node invariants (every node implements compute, every node's compute is consistent with its print) are not statically enforceable.

**Tradeoff:** Visitor splits a single conceptual operation across two layers (accept + visit); the agent must follow the double dispatch to trace what runs for a given node + operation pair. Adding a node type requires the agent to edit every visitor — Shotgun Surgery shifts from operations to nodes.

**Relief:** Per-operation diff surface is one file the agent reads end-to-end. Static-analysis tools can verify each Visitor implements every visitX method (whereas the inline-method version had no such guarantee). Tests target Visitor classes directly.

**Trap:** A visitor hierarchy applied to an unstable node set forces the agent to chase a Shotgun Surgery across visitor files every time a node is added. Per-edit context cost goes up linearly with operation count when nodes change — the inverse of the pattern's intended cost shape.

**Triggered by:** Divergent Change (smells), Extract Class (refactorings), Move Function (refactorings)

---
name: move-creation-knowledge-to-factory
description: Apply Move Creation Knowledge To Factory when you see Long Function, Extract Class, Move Function. One factory file the agent reads as the construction contract; callers are short delegations the agent treats opaquely.
---

# Apply: 15 — Move Creation Knowledge To Factory

**Symptom:** Construction recipes duplicated across N caller sites the agent must verify match on every recipe change. Each call site assembles the object with its own subset of defaults; the agent cannot statically guarantee the assemblies stay consistent.

**Goal:** One factory file the agent reads as the construction contract; callers are short delegations the agent treats opaquely. Per-edit budget for a recipe change collapses to one file.

```js
// Before:
// The caller knows the entire assembly recipe.
function placeOrder(customerId, line1, city, postal, items, jurisdiction) {
  const customer = new Customer(customerId);
  const address = new Address(line1, city, postal);
  customer.setShippingAddress(address);
  customer.setBillingAddress(address);
  const order = new Order(customer);
  for (const item of items) {
    const lineItem = new LineItem(item.product, item.quantity);
    lineItem.applyDiscount(customer.discountRate);
    order.addLineItem(lineItem);
  }
  order.calculateTotal();
  order.applyTax(jurisdiction);
  return order;
}

// After:
// The factory owns the recipe; the caller asks for a finished order.
class OrderFactory {
  constructor(taxJurisdiction) {
    this.taxJurisdiction = taxJurisdiction;
  }
  createOrder(customerId, line1, city, postal, items) {
    const customer = this.buildCustomer(customerId, line1, city, postal);
    const order = new Order(customer);
    items.forEach((item) => order.addLineItem(this.buildLineItem(item, customer)));
    order.calculateTotal();
    order.applyTax(this.taxJurisdiction);
    return order;
  }
  buildCustomer(customerId, line1, city, postal) {
    const customer = new Customer(customerId);
    const address = new Address(line1, city, postal);
    customer.setShippingAddress(address);
    customer.setBillingAddress(address);
    return customer;
  }
  buildLineItem(item, customer) {
    const lineItem = new LineItem(item.product, item.quantity);
    lineItem.applyDiscount(customer.discountRate);
    return lineItem;
  }
}

// Client:
const factory = new OrderFactory(jurisdiction);
const order = factory.createOrder(customerId, line1, city, postal, items);
```

_Example source: Illustrative example written for this site, faithful to Kerievsky's pattern shape in Refactoring to Patterns (Addison-Wesley, 2004), chapter 6. The book pulls complex assembly out of client code into a dedicated factory; this JavaScript version uses an order-with-line-items + customer-with-addresses assembly, distinct from Encapsulate Classes With Factory whose focus is subclass hiding._

**Pressure:** Recipe duplication × N callers × M recipe steps inflates the agent's context cost on every assembly-related edit. Subtle inconsistencies between caller-side recipes are invisible until they manifest as bugs; static reasoning cannot enforce 'every caller applies the discount'.

**Tradeoff:** A factory hides construction details from the call site; the agent must read the factory to know what the returned object actually carries. Static type information at the call site narrows to the return type, with construction-level invariants pushed inside the factory.

**Relief:** Diff surface for a recipe change is one file. Tests cover the factory's contract once; per-call-site behaviour reduces to verifying the intent, not the assembly. Recipe drift across callers becomes statically impossible.

**Trap:** A factory whose recipe is itself a long sequence of conditional steps can become as opaque as the duplicated callers were — the agent must trace the factory body line-by-line to know what came out. The pattern's gain materializes when the factory's recipe is itself decomposed into named build steps.

**Triggered by:** Long Function (smells), Extract Class (refactorings), Move Function (refactorings)

---
name: move-embellishment-to-decorator
description: Apply Move Embellishment To Decorator when you see Long Parameter List, Extract Class, Replace Subclass with Delegate. One file per behaviour the agent reads in isolation; the core class is short and verifiable on its own.
---

# Apply: 16 — Move Embellishment To Decorator

**Symptom:** A core class peppered with optional-behaviour conditionals the agent must trace on every method-edit to verify which features are active in a given configuration. Flag combinations are not statically enumerable; the agent must hold the option-space in working memory across every read.

**Goal:** One file per behaviour the agent reads in isolation; the core class is short and verifiable on its own. Composition order is statically observable at the construction site; the agent can reason about wrapper effects sequentially.

```js
// Before:
// One class accumulates optional embellishments via flags + inline conditionals.
class HttpClient {
  constructor(options = {}) {
    this.baseUrl = options.baseUrl;
    this.timeout = options.timeout;
    this.retries = options.retries;
    this.logger = options.logger;
    this.authToken = options.authToken;
  }
  async get(path) {
    if (this.logger) this.logger.log(`GET ${path}`);
    let attempt = 0;
    while (true) {
      try {
        const headers = {};
        if (this.authToken) headers.Authorization = `Bearer ${this.authToken}`;
        const response = await fetch(this.baseUrl + path, {
          headers,
          signal: this.timeout ? AbortSignal.timeout(this.timeout) : undefined,
        });
        return await response.json();
      } catch (e) {
        if (attempt >= (this.retries ?? 0)) throw e;
        attempt++;
      }
    }
  }
}

// After:
// Each embellishment is a decorator wrapping the core client.
class HttpClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }
  async get(path) {
    const response = await fetch(this.baseUrl + path);
    return await response.json();
  }
}
class LoggingClient {
  constructor(inner, logger) { this.inner = inner; this.logger = logger; }
  async get(path) {
    this.logger.log(`GET ${path}`);
    return this.inner.get(path);
  }
}
class RetryingClient {
  constructor(inner, retries) { this.inner = inner; this.retries = retries; }
  async get(path) {
    for (let attempt = 0; ; attempt++) {
      try { return await this.inner.get(path); }
      catch (e) { if (attempt >= this.retries) throw e; }
    }
  }
}
class AuthClient {
  constructor(inner, authToken) { this.inner = inner; this.authToken = authToken; }
  async get(path) {
    // adds Authorization header; simplified for illustration
    return this.inner.get(path);
  }
}

const client = new RetryingClient(
  new AuthClient(
    new LoggingClient(new HttpClient('https://api.example.com'), logger),
    authToken,
  ),
  3,
);
```

_Example source: Illustrative example written for this site, faithful to Kerievsky's pattern shape in Refactoring to Patterns (Addison-Wesley, 2004), chapter 7. Per ADR-0004, the bookend contrasts the flag-laden construction site with the explicit decorator chain — the intermediate moves (Extract Class on each embellishment, in turn) live in the linked Fowler refactorings._

**Pressure:** The combinatorial flag-space defeats static reasoning — the agent cannot enumerate which combinations have been tested or which are reachable. Per-feature behaviour change requires editing the core class, which the agent then has to re-verify against all flag combinations.

**Tradeoff:** Decorator chains spread the call-path across multiple files; the agent must traverse the chain to know what a single method call does. Wrapping-order is not statically declared anywhere; the agent must read the construction site to recover the intent.

**Relief:** Diff surface for adding or removing a feature is one decorator file or one chain edit at the construction site. Per-feature tests are isolated; static analysis of the core class is unburdened by optional-behaviour conditionals.

**Trap:** Five-deep decorator chains require the agent to load five definitions before reading the call. Stack traces obscure where in the chain a failure occurred; the agent's debugging cost goes up with depth. A composition-style API that names the intended capability set can be more legible than the raw chain.

**Triggered by:** Long Parameter List (smells), Extract Class (refactorings), Replace Subclass with Delegate (refactorings)

---
name: replace-conditional-dispatcher-with-command
description: Apply Replace Conditional Dispatcher With Command when you see Repeated Switches, Replace Function with Command, Replace Conditional with Polymorphism. One file per command the agent reads in isolation; the dispatcher is short and command-set-agnostic.
---

# Apply: 17 — Replace Conditional Dispatcher With Command

**Symptom:** A dispatcher conditional + N inline handler methods the agent must scan together to know what runs for a given command. Adding a command requires the agent to edit two places (dispatcher + host class); the diff surface scales linearly with handler complexity.

**Goal:** One file per command the agent reads in isolation; the dispatcher is short and command-set-agnostic. Per-command diff surface collapses to one Command class + one registry entry.

```js
// Before:
// One processor with a long dispatch conditional plus all handler bodies.
class CommandProcessor {
  execute(command, payload) {
    if (command === 'create-user') return this.createUser(payload);
    if (command === 'delete-user') return this.deleteUser(payload);
    if (command === 'reset-password') return this.resetPassword(payload);
    if (command === 'update-profile') return this.updateProfile(payload);
    throw new Error(`unknown command ${command}`);
  }
  createUser(payload) { /* ... */ }
  deleteUser(payload) { /* ... */ }
  resetPassword(payload) { /* ... */ }
  updateProfile(payload) { /* ... */ }
}

// After:
// Each handler is a Command object; the registry replaces the conditional.
class CreateUserCommand {
  execute(payload) { /* ... */ }
}
class DeleteUserCommand {
  execute(payload) { /* ... */ }
}
class ResetPasswordCommand {
  execute(payload) { /* ... */ }
}
class UpdateProfileCommand {
  execute(payload) { /* ... */ }
}

class CommandProcessor {
  constructor() {
    this.commands = new Map([
      ['create-user', new CreateUserCommand()],
      ['delete-user', new DeleteUserCommand()],
      ['reset-password', new ResetPasswordCommand()],
      ['update-profile', new UpdateProfileCommand()],
    ]);
  }
  execute(command, payload) {
    const handler = this.commands.get(command);
    if (!handler) throw new Error(`unknown command ${command}`);
    return handler.execute(payload);
  }
}
```

_Example source: Illustrative example written for this site, faithful to Kerievsky's pattern shape in Refactoring to Patterns (Addison-Wesley, 2004), chapter 7. Distinct from Replace Conditional Logic With Strategy: Strategy varies *how* one algorithm computes its result; Command varies *which action* is invoked. The book uses an HTTP-style request dispatcher; this JavaScript version keeps that shape._

**Pressure:** Cross-command invariants (e.g., 'every command logs') cannot be statically enforced when handlers are loose methods on the dispatcher. The agent must hold the full handler set in context to verify any cross-command concern; refactoring one handler risks unintended impact on neighbouring branches that share helpers.

**Tradeoff:** Command spreads handler logic across N files; the agent must traverse the registry to know which class handles a given command name. Stringy registry keys defeat static type analysis — typo-driven bugs slip past the type system.

**Relief:** Diff surface for a new command is one file. Static analysis can verify every Command implements `execute`; the dispatcher's behaviour is statically uniform. Cross-cutting concerns can live as a wrapping decorator on the registry rather than duplicated per handler.

**Trap:** Many trivial Commands (`class XCommand { execute() { return X(); } }`) raise context cost without buying anything — the agent loads one definition per command name to verify what it does. The pattern's gain materializes when commands carry meaningful state or when cross-cutting concerns reuse the uniform interface.

**Triggered by:** Repeated Switches (smells), Replace Function with Command (refactorings), Replace Conditional with Polymorphism (refactorings)

---
name: replace-conditional-logic-with-strategy
description: Apply Replace Conditional Logic with Strategy when you see Repeated Switches, Replace Conditional with Polymorphism, Decompose Conditional. Each variant lives in its own class; the agent can verify one strategy's behavior without loading the others.
---

# Apply: 18 — Replace Conditional Logic with Strategy

**Symptom:** A method whose body the agent must trace through a chain of branches to determine what runs. Each branch hides domain logic; verifying behavior requires loading every branch in scope on every edit.

**Goal:** Each variant lives in its own class; the agent can verify one strategy's behavior without loading the others. The dispatch site is a one-line call that needs no per-variant reasoning.

```js
// Before:
class Loan {
  capital() {
    if (this.expiry === null && this.maturity !== null) {
      // term loan
      return this.commitment * this.duration() * this.riskFactor();
    }
    if (this.expiry !== null && this.maturity === null) {
      if (this.unusedPercentage !== 1.0) {
        // revolver
        return this.commitment * this.unusedPercentage * this.duration() * this.riskFactor();
      }
      // advised line
      return this.outstandingRiskAmount() * this.duration()
        + this.unusedRiskAmount() * this.duration() * this.unusedPercentage;
    }
    return 0;
  }
}

// After:
class Loan {
  constructor(strategy) {
    this.capitalStrategy = strategy;
  }
  capital() {
    return this.capitalStrategy.capital(this);
  }
}

class TermLoanStrategy {
  capital(loan) {
    return loan.commitment * loan.duration() * loan.riskFactor();
  }
}

class RevolverStrategy {
  capital(loan) {
    return loan.commitment * loan.unusedPercentage * loan.duration() * loan.riskFactor();
  }
}

class AdvisedLineStrategy {
  capital(loan) {
    return loan.outstandingRiskAmount() * loan.duration()
      + loan.unusedRiskAmount() * loan.duration() * loan.unusedPercentage;
  }
}
```

_Example source: Adapted from Joshua Kerievsky's loan-calculator example in Refactoring to Patterns (Addison-Wesley, 2004). The Java original is translated to JavaScript and the three loan kinds are preserved as TermLoan, Revolver, and AdvisedLine strategies — same shape, different language._

**Pressure:** Every edit to one branch re-loads the entire conditional. Cross-branch invariants compound context cost; reasoning about which branch fires when requires holding the type-code rules in working memory across the full method body.

**Tradeoff:** Strategy fragments related logic across files, increasing context-load cost when reasoning about the system end-to-end. Vtable dispatch obscures static call-graph analysis — the agent has to enumerate strategy classes by hand.

**Relief:** Each strategy is independently verifiable. Adding a variant is one new file, not a multi-file change. The dispatching site stays trivial regardless of variant count; per-variant tests pin exactly the behavior they own.

**Trap:** A maze of one-method strategy classes that exist only to satisfy the pattern — the agent loads N files to understand what a single conditional once expressed in one. Context cost multiplies without proportional reasoning gain.

**Triggered by:** Repeated Switches (smells), Replace Conditional with Polymorphism (refactorings), Decompose Conditional (refactorings)

---
name: replace-constructors-with-creation-methods
description: Apply Replace Constructors With Creation Methods when you see Mysterious Name, Replace Constructor with Factory Function, Change Function Declaration. Each static creation method has a clear, statically-typed signature.
---

# Apply: 19 — Replace Constructors With Creation Methods

**Symptom:** Constructor-overloading-via-sniffing where the agent must reason about argument shapes to know what the constructor does for a given call. Static type information is partial at best; the agent has to read the constructor body to verify which branch fires per call site.

**Goal:** Each static creation method has a clear, statically-typed signature. The agent verifies the canonical constructor's invariants once; per-creation-method behaviour is one named entry point with one return type.

```js
// Before:
// One constructor handling three different intentions through argument-shape sniffing.
class Money {
  constructor(amountOrOther, currency) {
    if (amountOrOther instanceof Money) {
      this.amount = amountOrOther.amount;
      this.currency = amountOrOther.currency;
    } else if (typeof currency === 'string') {
      this.amount = amountOrOther;
      this.currency = currency;
    } else {
      this.amount = amountOrOther;
      this.currency = 'USD';
    }
  }
}

const m1 = new Money(100);            // dollars (default)
const m2 = new Money(100, 'EUR');     // euros
const m3 = new Money(m1);             // copy

// After:
// One canonical constructor; named creation methods carry the intent.
class Money {
  constructor(amount, currency) {
    this.amount = amount;
    this.currency = currency;
  }
  static dollars(amount) {
    return new Money(amount, 'USD');
  }
  static of(amount, currency) {
    return new Money(amount, currency);
  }
  static copyOf(other) {
    return new Money(other.amount, other.currency);
  }
}

const m1 = Money.dollars(100);
const m2 = Money.of(100, 'EUR');
const m3 = Money.copyOf(m1);
```

_Example source: Illustrative example written for this site, faithful to Kerievsky's pattern shape in Refactoring to Patterns (Addison-Wesley, 2004), chapter 6. The book uses a Loan class with overloaded Java constructors; this JavaScript version uses a Money class whose single constructor performed argument-shape sniffing to support three intentions — replaced with named static creation methods._

**Pressure:** Argument-sniffing constructors defeat the agent's ability to statically classify call sites by intent. Per-call-site verification requires reading the receiver's constructor body and reproducing the sniffing logic; cross-call invariants are nearly impossible to enforce statically.

**Tradeoff:** Multiple creation methods expand the class's static API surface; the agent must learn them all to know which to call for a given intent. For agents working from a SKILL or doc rather than full source, the proliferation is a real cost.

**Relief:** Static analysis identifies creation-method usage by name; intent at the call site is statically visible. Diff surface for adding an intent is one new method; the canonical constructor stays narrow.

**Trap:** A wall of nearly-identical static creation methods that differ only in defaults can become harder to scan than one constructor with documented defaults. The pattern's clarity gain depends on each method representing a genuinely distinct intention.

**Triggered by:** Mysterious Name (smells), Replace Constructor with Factory Function (refactorings), Change Function Declaration (refactorings)

---
name: replace-hard-coded-notifications-with-observer
description: Apply Replace Hard-Coded Notifications With Observer when you see Insider Trading, Extract Class, Move Function. The publisher is short and consumer-agnostic; the agent reads it once and trusts it.
---

# Apply: 20 — Replace Hard-Coded Notifications With Observer

**Symptom:** Publisher methods the agent must trace through to know what side effects occur. Adding a new consumer requires editing the publisher; per-edit context cost grows with consumer count; tests for the publisher load every consumer's mock.

**Goal:** The publisher is short and consumer-agnostic; the agent reads it once and trusts it. Each consumer is one file with one event-handling concern; the agent verifies each consumer in isolation.

```js
// Before:
// Cart knows which collaborators to notify and how.
class Cart {
  constructor(inventory, analytics, shipping) {
    this.items = [];
    this.inventory = inventory;
    this.analytics = analytics;
    this.shipping = shipping;
  }
  addItem(item, quantity) {
    this.items.push({ item, quantity });
    this.inventory.reserve(item, quantity);
    this.analytics.recordAdd(item, quantity);
    this.shipping.updateEstimate(this.items);
  }
}

// After:
// Cart publishes events; listeners subscribe at the composition root.
class Cart {
  constructor() {
    this.items = [];
    this.listeners = [];
  }
  subscribe(listener) {
    this.listeners.push(listener);
  }
  addItem(item, quantity) {
    this.items.push({ item, quantity });
    this.notify({ type: 'item-added', item, quantity, cart: this });
  }
  notify(event) {
    this.listeners.forEach((listener) => listener.handle(event));
  }
}

class InventoryListener {
  constructor(inventory) { this.inventory = inventory; }
  handle(event) {
    if (event.type === 'item-added') this.inventory.reserve(event.item, event.quantity);
  }
}
class AnalyticsListener {
  constructor(analytics) { this.analytics = analytics; }
  handle(event) {
    if (event.type === 'item-added') this.analytics.recordAdd(event.item, event.quantity);
  }
}
class ShippingListener {
  constructor(shipping) { this.shipping = shipping; }
  handle(event) {
    if (event.type === 'item-added') this.shipping.updateEstimate(event.cart.items);
  }
}

const cart = new Cart();
cart.subscribe(new InventoryListener(inventory));
cart.subscribe(new AnalyticsListener(analytics));
cart.subscribe(new ShippingListener(shipping));
```

_Example source: Illustrative example written for this site, faithful to Kerievsky's pattern shape in Refactoring to Patterns (Addison-Wesley, 2004), chapter 10. The book uses a Stock class with hard-coded calls to InvestmentTracker and PortfolioView; this JavaScript version uses a Cart with three listeners — same pattern, e-commerce host._

**Pressure:** Hard-coded notifications couple the publisher to the full consumer surface. The agent's per-publisher-edit verification cost scales with consumer count; static analysis cannot enforce that the publisher's events fully describe its state changes.

**Tradeoff:** Observer's dynamic dispatch defeats static call-graph analysis at the event boundary. The agent cannot statically determine which listeners fire on which events without reading the subscription wiring; ordering assumptions are invisible in the code.

**Relief:** Diff surface for adding a consumer is one new file. Publisher tests don't load consumer mocks; consumer tests don't load the publisher. Static analysis of the publisher's surface is unburdened by downstream collaborators.

**Trap:** Subscription wiring scattered across the composition root requires the agent to grep for `subscribe(` calls to enumerate the consumer set. Stale subscriptions (uncleaned references) cause hard-to-debug memory and behaviour leaks the agent cannot detect statically.

**Triggered by:** Insider Trading (smells), Extract Class (refactorings), Move Function (refactorings)

---
name: replace-implicit-language-with-interpreter
description: Apply Replace Implicit Language With Interpreter when you see Primitive Obsession, Replace Primitive with Object, Substitute Algorithm. Each grammar node is one class the agent verifies independently.
---

# Apply: 21 — Replace Implicit Language With Interpreter

**Symptom:** String-DSL parsing and dispatch entangled in one method body the agent must trace per call. The grammar is implicit in regex patterns and conditionals; the agent cannot statically enumerate valid expressions or verify that all paths handle malformed input.

**Goal:** Each grammar node is one class the agent verifies independently. The composed expression tree is a statically-typed data structure the agent reads structurally; per-node tests pin per-node behaviour.

```js
// Before:
// A string-based DSL carries the filter; parsing and dispatch are coupled in one method.
class TaskFilter {
  matches(task, expression) {
    // expression like 'tag=urgent AND priority>3'
    const clauses = expression.split(' AND ');
    return clauses.every((clause) => {
      const equalsMatch = clause.match(/^(\w+)=(\S+)$/);
      if (equalsMatch) return task[equalsMatch[1]] === equalsMatch[2];
      const greaterMatch = clause.match(/^(\w+)>(\S+)$/);
      if (greaterMatch) return task[greaterMatch[1]] > Number(greaterMatch[2]);
      throw new Error(`unparseable clause: ${clause}`);
    });
  }
}

// After:
// Domain objects compose into an expression tree; each node knows how to evaluate itself.
class Equals {
  constructor(field, value) { this.field = field; this.value = value; }
  matches(task) { return task[this.field] === this.value; }
}
class GreaterThan {
  constructor(field, value) { this.field = field; this.value = value; }
  matches(task) { return task[this.field] > this.value; }
}
class And {
  constructor(left, right) { this.left = left; this.right = right; }
  matches(task) { return this.left.matches(task) && this.right.matches(task); }
}
class Or {
  constructor(left, right) { this.left = left; this.right = right; }
  matches(task) { return this.left.matches(task) || this.right.matches(task); }
}

const filter = new And(new Equals('tag', 'urgent'), new GreaterThan('priority', 3));
tasks.filter((task) => filter.matches(task));
```

_Example source: Illustrative example written for this site, faithful to Kerievsky's pattern shape in Refactoring to Patterns (Addison-Wesley, 2004), chapter 11. Per ADR-0004, the bookend contrasts the implicit string DSL with the explicit AST — the intermediate grammar-extraction steps live in the linked Fowler refactorings. The book uses a query-language example; this JavaScript version uses task-filtering predicates._

**Pressure:** Implicit DSLs defeat static analysis at the string boundary — the agent's verification cost spans both parser and evaluator. Adding a syntactic form requires the agent to coordinate parser, evaluator, and tests; misalignments between the three are silent and ship to runtime.

**Tradeoff:** Interpreter spreads a single conceptual query across multiple class files; the agent traverses the tree to know what an expression does. Static call-graph analysis loses precision on polymorphic `matches` calls — the agent must enumerate concrete node types.

**Relief:** Diff surface for a new operator is one class. The grammar's surface is the type hierarchy — the agent can enumerate operators by inspecting the class declarations. Parser and evaluator concerns separate cleanly; tests target evaluation only.

**Trap:** A grammar with many nodes representing fine-grained syntactic variations forces the agent to load a large hierarchy to reason about any expression. Per-node specialization (NumericEquals vs. StringEquals vs. DateEquals) can multiply file count without proportional reasoning gain.

**Triggered by:** Primitive Obsession (smells), Replace Primitive with Object (refactorings), Substitute Algorithm (refactorings)

---
name: replace-implicit-tree-with-composite
description: Apply Replace Implicit Tree With Composite when you see Primitive Obsession, Replace Primitive with Object, Encapsulate Record. A concrete Composite the agent reads as a typed recursive structure.
---

# Apply: 22 — Replace Implicit Tree With Composite

**Symptom:** Tree traversals expressed as filters over flat records the agent must trace per call to verify tree-shape invariants. Cycles, orphans, and disconnected subtrees are runtime concerns; the agent cannot statically verify a 'tree' is acyclic from the flat form.

**Goal:** A concrete Composite the agent reads as a typed recursive structure. Static analysis can verify that traversal methods cover all node types; tree-shape invariants live in the constructor.

```js
// Before:
// Tree shape encoded as flat records joined by parentId pointers.
const items = [
  { id: 1, label: 'File', parentId: null },
  { id: 2, label: 'Edit', parentId: null },
  { id: 3, label: 'New', parentId: 1 },
  { id: 4, label: 'Open', parentId: 1 },
  { id: 5, label: 'Recent', parentId: 4 },
  { id: 6, label: 'Cut', parentId: 2 },
];

function render(items) {
  const roots = items.filter((i) => i.parentId === null);
  return roots.map((root) => renderItem(root, items)).join('\n');
}
function renderItem(item, items, depth = 0) {
  const children = items.filter((i) => i.parentId === item.id);
  let line = '  '.repeat(depth) + item.label;
  for (const child of children) {
    line += '\n' + renderItem(child, items, depth + 1);
  }
  return line;
}

// After:
// Explicit composite: each node holds its children directly.
class MenuItem {
  constructor(label) {
    this.label = label;
    this.children = [];
  }
  add(child) {
    this.children.push(child);
    return this;
  }
  render(depth = 0) {
    return (
      '  '.repeat(depth) +
      this.label +
      this.children.map((child) => '\n' + child.render(depth + 1)).join('')
    );
  }
}

const file = new MenuItem('File')
  .add(new MenuItem('New'))
  .add(new MenuItem('Open').add(new MenuItem('Recent')));
const edit = new MenuItem('Edit').add(new MenuItem('Cut'));
const menus = [file, edit];

menus.map((menu) => menu.render()).join('\n');
```

_Example source: Illustrative example written for this site, faithful to Kerievsky's pattern shape in Refactoring to Patterns (Addison-Wesley, 2004), chapter 9. The book uses an XML-ish document tree encoded implicitly; this JavaScript version uses a menu hierarchy encoded as flat parentId-joined records — same shape, accessible domain._

**Pressure:** Filtering-based traversals consume context budget proportional to record count, not tree depth. The agent cannot statically distinguish a malformed flat representation (cycles, missing parents) from a valid one without simulating the parent-pointer resolution.

**Tradeoff:** Composite construction is itself a translation step the agent must verify against the flat form. Persistence boundaries require the agent to keep two representations in mind — the in-memory tree and the on-disk flat form. Serialization round-trips are a new bug surface.

**Relief:** Traversal code shrinks to one-line recursive calls; static analysis verifies node-type coverage; per-method tests target tree behaviour without record-soup setup. Diff surface for tree operations is the Composite class itself.

**Trap:** If the on-disk form remains the flat record set, the agent has to verify the in-memory tree stays consistent with it across edits. The pattern's gain materializes when the tree owns the canonical form; when it's a transient view over a relational store, the implicit form may stay authoritative.

**Triggered by:** Primitive Obsession (smells), Replace Primitive with Object (refactorings), Encapsulate Record (refactorings)

---
name: replace-onemany-distinctions-with-composite
description: Apply Replace One/Many Distinctions With Composite when you see Repeated Switches, Replace Conditional with Polymorphism, Extract Class. Polymorphic dispatch on the value's type; the agent verifies each subtype's implementation in isolation.
---

# Apply: 23 — Replace One/Many Distinctions With Composite

**Symptom:** Per-operation `Array.isArray` branches the agent must verify match across N operations. The agent cannot statically guarantee that every operation handles both shapes consistently; subtle inconsistencies surface only when a one-only operation receives a many value.

**Goal:** Polymorphic dispatch on the value's type; the agent verifies each subtype's implementation in isolation. Per-operation analysis no longer requires holding 'what shape is this value?' in working memory.

```js
// Before:
// Every operation branches on whether the value is one or many.
class Form {
  setValue(name, valueOrValues) {
    if (Array.isArray(valueOrValues)) {
      this.fields[name] = valueOrValues.map((v) => sanitize(v));
    } else {
      this.fields[name] = sanitize(valueOrValues);
    }
  }
  getDisplay(name) {
    const value = this.fields[name];
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    return value;
  }
  isMultivalued(name) {
    return Array.isArray(this.fields[name]);
  }
}

// After:
// Both single and many implement the same Field interface; callers stop branching.
class Field {
  asString() { throw new Error('abstract'); }
  isMultivalued() { return false; }
}
class SingleField extends Field {
  constructor(raw) {
    super();
    this.value = sanitize(raw);
  }
  asString() { return this.value; }
}
class MultiField extends Field {
  constructor(items) {
    super();
    this.children = items.map((item) => new SingleField(item));
  }
  asString() { return this.children.map((child) => child.asString()).join(', '); }
  isMultivalued() { return true; }
}

class Form {
  setValue(name, field) {
    this.fields[name] = field; // already a SingleField or MultiField
  }
  getDisplay(name) {
    return this.fields[name].asString();
  }
  isMultivalued(name) {
    return this.fields[name].isMultivalued();
  }
}
```

_Example source: Illustrative example written for this site, faithful to Kerievsky's pattern shape in Refactoring to Patterns (Addison-Wesley, 2004), chapter 9. The book uses a graphics-system Shape/Group example; this JavaScript version uses form Field/MultiField — the same Composite shape applied to a one-or-many distinction._

**Pressure:** One-vs-many branch checks duplicate across every consumer; the agent's per-edit verification cost scales with operation count. Static type information is shallow when JavaScript allows both shapes to flow through the same variable.

**Tradeoff:** Composite spreads behaviour across a type hierarchy; the agent must traverse subtypes to know what a method does for a given value. Subtype construction at boundaries is itself a place the agent must verify the one-vs-many decision lands correctly.

**Relief:** Diff surface for a new operation is one method per subtype. Static analysis verifies subtype coverage; per-subtype tests exercise their implementations independently. The shape decision moves out of operation bodies and into the construction boundary.

**Trap:** A Composite applied to a distinction that is actually load-bearing context (e.g., when callers need to know cardinality to render differently) ends up restoring the `if (isMulti)` branches at the call site, just with `.isMultivalued()` instead of `Array.isArray`. The pattern pays when callers genuinely don't care which shape they have.

**Triggered by:** Repeated Switches (smells), Replace Conditional with Polymorphism (refactorings), Extract Class (refactorings)

---
name: replace-state-altering-conditionals-with-state
description: Apply Replace State-Altering Conditionals with State when you see Repeated Switches, Replace Conditional with Polymorphism, Extract Class. Per-state class the agent reads as the full operation surface for that state.
---

# Apply: 24 — Replace State-Altering Conditionals with State

**Symptom:** Per-operation state branches the agent must verify cover every state × operation combination consistently. The state machine's transition graph is invisible from any single method body; the agent has to read all operations to reconstruct legal transitions.

**Goal:** Per-state class the agent reads as the full operation surface for that state. The transition graph is recoverable by inspecting state-assignment statements; per-state tests pin per-state behaviour.

```js
// Before:
// Every operation branches on the same state string; transitions are scattered.
class Document {
  constructor() {
    this.state = 'draft';
    this.content = '';
  }
  edit(newContent) {
    if (this.state === 'draft') {
      this.content = newContent;
    } else if (this.state === 'in-review') {
      throw new Error('cannot edit while in review');
    } else if (this.state === 'published') {
      throw new Error('cannot edit a published document');
    }
  }
  submit() {
    if (this.state === 'draft') {
      this.state = 'in-review';
    } else if (this.state === 'in-review') {
      throw new Error('already in review');
    } else {
      throw new Error('cannot submit from ' + this.state);
    }
  }
  publish() {
    if (this.state === 'in-review') {
      this.state = 'published';
    } else {
      throw new Error('cannot publish from ' + this.state);
    }
  }
}

// After:
// Each state is a class; the document delegates and transitions polymorphically.
class DraftState {
  edit(doc, newContent) { doc.content = newContent; }
  submit(doc) { doc.state = new InReviewState(); }
  publish(doc) { throw new Error('cannot publish from draft'); }
}
class InReviewState {
  edit() { throw new Error('cannot edit while in review'); }
  submit() { throw new Error('already in review'); }
  publish(doc) { doc.state = new PublishedState(); }
}
class PublishedState {
  edit() { throw new Error('cannot edit a published document'); }
  submit() { throw new Error('cannot resubmit'); }
  publish() { throw new Error('already published'); }
}

class Document {
  constructor() {
    this.state = new DraftState();
    this.content = '';
  }
  edit(newContent) { this.state.edit(this, newContent); }
  submit() { this.state.submit(this); }
  publish() { this.state.publish(this); }
}
```

_Example source: Illustrative example written for this site, faithful to Kerievsky's pattern shape in Refactoring to Patterns (Addison-Wesley, 2004), chapter 7. Per ADR-0004, the bookend contrasts the state-string dispatcher with polymorphic state transition — the intermediate Extract Class + Move Function steps live in the linked Fowler refactorings. The book uses a media-player state-machine; this JavaScript version uses a document publishing flow._

**Pressure:** N states × M operations = N×M cells the agent must verify match the expected transition graph. Cross-state invariants (every state implements every operation; transitions only go forward) cannot be statically enforced from the conditional form.

**Tradeoff:** State pattern spreads the machine across N files; the agent traverses them to reconstruct the full transition graph. State assignments inside operations are imperative side effects that complicate static reasoning about which state comes next.

**Relief:** Static analysis verifies every state implements every operation; diff surface for adding a state is one new file. Per-state behaviour is locally readable; transition assignments are the only places the agent must trace to recover the graph.

**Trap:** A state machine with many states that mostly throw makes the agent load N files to discover that operation X is only legal in state Y. A state-transition table (data, not code) may be more economical for the agent to scan than N state classes.

**Triggered by:** Repeated Switches (smells), Replace Conditional with Polymorphism (refactorings), Extract Class (refactorings)

---
name: replace-type-code-with-class
description: Apply Replace Type Code With Class when you see Primitive Obsession, Replace Primitive with Object, Replace Type Code with Subclasses. Static type-checking enforces that comparisons are only against the named instances.
---

# Apply: 25 — Replace Type Code With Class

**Symptom:** Magic-literal comparisons across N consumers the agent must verify match a documented (or undocumented) set of valid values. The type system cannot enforce membership; typos and stale literals ship silently to runtime.

**Goal:** Static type-checking enforces that comparisons are only against the named instances. The agent verifies consumers by class membership; per-status behaviour is locally readable as methods on the class.

```js
// Before:
// Status is an integer; every consumer comparisons it against magic literals.
class Order {
  constructor() {
    this.status = 0; // 0=pending, 1=paid, 2=shipped, 3=delivered, 4=cancelled
  }
  describe() {
    if (this.status === 0) return 'Pending';
    if (this.status === 1) return 'Paid';
    if (this.status === 2) return 'Shipped';
    if (this.status === 3) return 'Delivered';
    if (this.status === 4) return 'Cancelled';
    return 'Unknown';
  }
  canCancel() {
    return this.status === 0 || this.status === 1;
  }
}

// After:
// Status is a typed value object; comparisons and behaviour live on the class.
class OrderStatus {
  static PENDING = new OrderStatus('Pending', true);
  static PAID = new OrderStatus('Paid', true);
  static SHIPPED = new OrderStatus('Shipped', false);
  static DELIVERED = new OrderStatus('Delivered', false);
  static CANCELLED = new OrderStatus('Cancelled', false);
  constructor(label, cancellable) {
    this.label = label;
    this.cancellable = cancellable;
  }
  describe() { return this.label; }
  canCancel() { return this.cancellable; }
}

class Order {
  constructor() {
    this.status = OrderStatus.PENDING;
  }
  describe() { return this.status.describe(); }
  canCancel() { return this.status.canCancel(); }
}
```

_Example source: Illustrative example written for this site, faithful to Kerievsky's pattern shape in Refactoring to Patterns (Addison-Wesley, 2004), chapter 9. Distinct from Fowler's Replace Type Code With Subclasses (which makes the type code drive a hierarchy): this pattern is the lower-ceremony first move — turn the primitive into a value object that can carry methods and validation; subclasses come later if behaviour diverges enough to warrant them._

**Pressure:** Magic literals defeat static analysis at every comparison site. The agent's verification cost on a new status × M consumers scales with consumer count; cross-consumer consistency requires holistic test coverage that may not exist.

**Tradeoff:** Value-object instances are reference-equality-checked in JavaScript; serialization round-trips require explicit handling. The agent must verify that deserialization produces the same canonical instances, not new equivalents, or `===` comparisons silently fail.

**Relief:** Diff surface for adding a status is one new instance + tests. Static type-checking (in TypeScript / JSDoc) verifies consumers handle all statuses; per-method behaviour is locally readable.

**Trap:** Value objects relying on reference equality across serialization boundaries (HTTP, persistence, message queues) require careful canonicalization; getting it wrong produces runtime equality bugs the agent cannot detect statically. The pattern is straightforward in pure-runtime code; thornier across persistence boundaries.

**Triggered by:** Primitive Obsession (smells), Replace Primitive with Object (refactorings), Replace Type Code with Subclasses (refactorings)

---
name: unify-interfaces-with-adapter
description: Apply Unify Interfaces With Adapter when you see Alternative Classes with Different Interfaces, Change Function Declaration, Move Function. One adapter file the agent verifies once; consumers are uniform calls against a single interface.
---

# Apply: 26 — Unify Interfaces With Adapter

**Symptom:** `instanceof` branches at every consumer site the agent must verify match consistently. Per-consumer translation logic is duplicated; the agent's per-edit cost on a translation-rule change is proportional to consumer count.

**Goal:** One adapter file the agent verifies once; consumers are uniform calls against a single interface. Translation rules are centralized; consumer-side code is generic over the adapted type.

```js
// Before:
// Two classes do similar work through different shapes; callers branch on which they have.
class Logger {
  log(level, message) { /* writes to internal log */ }
}
class ThirdPartyReporter {
  report(severityName, text, context) { /* delivers to vendor */ }
}

function emitDiagnostic(emitter, level, message) {
  if (emitter instanceof Logger) {
    emitter.log(level, message);
  } else if (emitter instanceof ThirdPartyReporter) {
    emitter.report(level.toUpperCase(), message, {});
  } else {
    throw new Error('unknown emitter');
  }
}

// After:
// One adapter gives the vendor class the internal interface; callers stop branching.
class Logger {
  log(level, message) { /* writes to internal log */ }
}
class ThirdPartyReporter {
  report(severityName, text, context) { /* delivers to vendor */ }
}

class ReporterAsLogger {
  constructor(reporter) {
    this.reporter = reporter;
  }
  log(level, message) {
    this.reporter.report(level.toUpperCase(), message, {});
  }
}

function emitDiagnostic(logger, level, message) {
  logger.log(level, message);
}

// At the composition root:
const adaptedReporter = new ReporterAsLogger(new ThirdPartyReporter());
emitDiagnostic(adaptedReporter, 'error', 'something failed');
```

_Example source: Illustrative example written for this site, faithful to Kerievsky's pattern shape in Refactoring to Patterns (Addison-Wesley, 2004), chapter 6. Distinct from Extract Adapter (#5): that pattern pulls per-variant code from one host class into adapters; this pattern wraps an existing class so it conforms to a different existing interface._

**Pressure:** Per-consumer translation defeats static typing — the consumer's interface contract is implicit in the branches rather than declared. Adding a third variant means another branch at every consumer site (Shotgun Surgery scales with consumer × variant count).

**Tradeoff:** Adapter spreads the boundary across one extra class; the agent must trace from consumer through adapter to vendor to understand a single call's full path. Vendor-API changes ripple to the adapter — usually the right place — but the agent must remember to re-verify the adapter when the vendor updates.

**Relief:** Static type-checking of the canonical interface enforces consumer-side uniformity. Diff surface for a new vendor variant is one new adapter file; consumers don't move. Tests for the adapter are isolated from consumer logic.

**Trap:** An adapter that smuggles non-trivial logic (validation, error remapping, retries) hides behaviour the agent might expect to see at the consumer or at the vendor — neither location is now authoritative. When the adapter is doing more than shape-conversion, its name should reflect that (Gateway, Anti-Corruption Layer).

**Triggered by:** Alternative Classes with Different Interfaces (smells), Change Function Declaration (refactorings), Move Function (refactorings)

---
name: unify-interfaces
description: Apply Unify Interfaces when you see Alternative Classes with Different Interfaces, Change Function Declaration, Pull Up Method. One canonical name per operation across the codebase; the agent's static reasoning about 'where is X called?' returns a complete answer.
---

# Apply: 27 — Unify Interfaces

**Symptom:** Accidental name divergence across N classes the agent must remember when reading or editing code. Search results for one operation miss the variants under different names; refactoring tools can't unify the rename without manual mapping.

**Goal:** One canonical name per operation across the codebase; the agent's static reasoning about 'where is X called?' returns a complete answer. Per-class behaviour is verified once against the canonical interface.

```js
// Before:
// Two repositories do the same work with accidentally divergent names.
class UserRepository {
  findOne(id) { /* ... */ }
  insert(user) { /* ... */ }
  updateById(id, fields) { /* ... */ }
  remove(id) { /* ... */ }
}

class OrderRepository {
  getById(id) { /* ... */ }
  create(order) { /* ... */ }
  update(id, fields) { /* ... */ }
  delete(id) { /* ... */ }
}

function loadEntity(repo, id) {
  if (repo instanceof UserRepository) return repo.findOne(id);
  return repo.getById(id);
}

// After:
// One method name per operation; both repositories conform.
class UserRepository {
  findById(id) { /* ... */ }
  create(user) { /* ... */ }
  update(id, fields) { /* ... */ }
  delete(id) { /* ... */ }
}

class OrderRepository {
  findById(id) { /* ... */ }
  create(order) { /* ... */ }
  update(id, fields) { /* ... */ }
  delete(id) { /* ... */ }
}

function loadEntity(repo, id) {
  return repo.findById(id);
}
```

_Example source: Illustrative example written for this site, faithful to Kerievsky's pattern shape in Refactoring to Patterns (Addison-Wesley, 2004), chapter 6. Distinct from Unify Interfaces With Adapter (#26): that pattern is for when you cannot edit one of the classes (typically a vendor); Unify Interfaces is for when both classes are yours and the divergence is accidental._

**Pressure:** Inconsistent naming forces the agent to enumerate aliases on every cross-class change. The cost compounds — `find usages` returns partial results; semantic edits miss aliased variants; the agent's confidence in completeness drops.

**Tradeoff:** Renames break external consumers who depend on the old names; the agent must verify the rename's blast radius before applying it. For library code with documented APIs, the rename cost may exceed the consistency gain.

**Relief:** Static analysis returns complete results; the agent's verification budget on cross-class edits drops to the unified surface. Diff surface for future variants is well-defined: implement the canonical names.

**Trap:** Unifying names across two classes whose operations only superficially match silently misleads future readers. The agent reads `findById` on both and assumes equivalent behaviour; when one has implicit side effects the other doesn't, the trap is hard to detect statically. Verify behaviour matches before unifying names.

**Triggered by:** Alternative Classes with Different Interfaces (smells), Change Function Declaration (refactorings), Pull Up Method (refactorings)

---
name: abstract-factory
description: Apply Abstract Factory when you see Shotgun Surgery, Repeated Switches, Replace Constructor with Factory Function. The agent reads one factory interface to know what products exist; concrete factories are short and exhaustive; client code is one factory pointer away from the right family.
---

# Apply: 28 — Abstract Factory

**Symptom:** The agent must scan multiple call sites to verify theme consistency on any UI-construction edit. Type-tag dispatch on theme is structurally invisible — from one call site the agent cannot tell whether all sibling sites have been kept in sync, so verification balloons to the full file set.

**Goal:** The agent reads one factory interface to know what products exist; concrete factories are short and exhaustive; client code is one factory pointer away from the right family. Cross-call-site family consistency becomes structurally guaranteed, not inspection-required.

```js
// Before:
function renderToolbar(theme) {
  let button;
  let textField;
  if (theme === 'light') {
    button = new LightButton();
    textField = new LightTextField();
  } else if (theme === 'dark') {
    button = new DarkButton();
    textField = new DarkTextField();
  } else {
    throw new Error(`unknown theme: ${theme}`);
  }
  return [button, textField];
}

// After:
class LightWidgetFactory {
  createButton() { return new LightButton(); }
  createTextField() { return new LightTextField(); }
}
class DarkWidgetFactory {
  createButton() { return new DarkButton(); }
  createTextField() { return new DarkTextField(); }
}
function renderToolbar(factory) {
  return [factory.createButton(), factory.createTextField()];
}
```

_Example source: Illustrative example written for this site in the spirit of Design Patterns (Gamma, Helm, Johnson, Vlissides, Addison-Wesley, 1994), chapter 3. The book's running example is a UI toolkit with multiple look-and-feel families; this JavaScript adaptation keeps the family-of-products structure with two concrete factories (light/dark theme) producing matching button and text-field widgets._

**Pressure:** N call sites × M theme branches = N×M cells the agent must verify on every theme-related edit. Adding a theme requires the agent to find every switch and prove no branch was missed — high context cost, high verification load, and the proof is fragile because nothing structural anchors it.

**Tradeoff:** A new product method requires the agent to update every concrete factory in lockstep. The factory interface becomes a single mutation surface the agent must understand fully before any product edit; partial knowledge produces compile errors, but compile errors that surface late in the iteration cycle.

**Relief:** Edits scoped to one factory implementation; type system enforces interface completeness; the agent reasons about one client call site (the one taking the factory) rather than every place that constructs widgets. Diff surface for a new theme is bounded and locally verifiable.

**Trap:** Factory interface bloat — over many edits the agent loses sight of which products are still in use. Dead factory methods accumulate because no client demands them but the interface contract still requires them; cleanup requires touching every concrete factory together, exactly the cross-cutting edit the pattern was supposed to eliminate.

**Triggered by:** Shotgun Surgery (smells), Repeated Switches (smells), Replace Constructor with Factory Function (refactorings)

---
name: builder
description: Apply Builder when you see Long Parameter List, Primitive Obsession, Introduce Parameter Object. Self-describing construction the agent can read top-to-bottom without cross-file lookup.
---

# Apply: 29 — Builder

**Symptom:** The agent reads a multi-parameter constructor call and must consult the constructor signature (often elsewhere in the codebase) to know which positional slot means what. Editing the call site requires keeping the positional alignment manually correct on every parameter change.

**Goal:** Self-describing construction the agent can read top-to-bottom without cross-file lookup. Each chained method names what it sets; the build() terminator marks the point where the product is verified. Static analysis can enumerate what the spec contains by listing the builder's chainable methods.

```js
// Before:
const request = new HttpRequest(
  'GET',
  '/api/users/42',
  { 'Accept': 'application/json', 'Authorization': 'Bearer xyz' },
  null,
  30000,
  3,
  true
);

// After:
const request = new HttpRequestBuilder('GET', '/api/users/42')
  .accept('application/json')
  .bearer('xyz')
  .timeoutMs(30000)
  .retries(3)
  .followRedirects(true)
  .build();

class HttpRequestBuilder {
  constructor(method, url) {
    this.spec = { method, url, headers: {}, body: null, timeoutMs: 0, retries: 0, followRedirects: false };
  }
  accept(mediaType) { this.spec.headers['Accept'] = mediaType; return this; }
  bearer(token) { this.spec.headers['Authorization'] = `Bearer ${token}`; return this; }
  body(value) { this.spec.body = value; return this; }
  timeoutMs(ms) { this.spec.timeoutMs = ms; return this; }
  retries(count) { this.spec.retries = count; return this; }
  followRedirects(flag) { this.spec.followRedirects = flag; return this; }
  build() { return new HttpRequest(this.spec); }
}
```

_Example source: Illustrative example written for this site in the spirit of Design Patterns (Gamma, Helm, Johnson, Vlissides, Addison-Wesley, 1994), chapter 3. The book's running example is a maze builder; this JavaScript adaptation uses HTTP request construction to show the same step-by-step assembly with named, optional inputs and a single terminating build() that produces the immutable product._

**Pressure:** Positional argument lists are the worst-case input shape for context budget — the agent must hold the parameter order in working memory while reading every call. Mis-aligned arguments produce type-compatible bugs the compiler does not catch, exactly the bug class that demands the most verification effort.

**Tradeoff:** The builder's chainable method set is a second surface the agent must understand alongside the product itself. Tests for the builder cover construction paths, not the product's behaviour; the agent must distinguish 'did I build the right spec?' from 'did the spec behave correctly?' when investigating regressions.

**Relief:** Call-site edits become append-or-remove single-line operations on the chain. The build() step is a structural commit the agent can rely on as the moment of validation; partial-construction bugs surface as builder-test failures, not runtime mysteries scattered across consumers of the product.

**Trap:** Inconsistent builder discipline — some builders enforce required-input checks at build(), others tolerate missing inputs and produce half-built products with default sentinels — forces the agent to verify enforcement on every new builder it encounters. The pattern stops being a structural promise and becomes a per-class convention to look up.

**Triggered by:** Long Parameter List (smells), Primitive Obsession (smells), Introduce Parameter Object (refactorings)

---
name: factory-method
description: Apply Factory Method when you see Repeated Switches, Replace Conditional with Polymorphism, Replace Type Code with Subclasses. Structural completeness via the type system; every subclass of the creator must implement the factory method, so missing-variant bugs surface as construction-time errors the agent can see during static reading.
---

# Apply: 30 — Factory Method

**Symptom:** Type-code dispatch in a constructor or initializer means the agent must hold the full enumeration of variants in working memory while reading or editing the class. New variants land as edits to the switch; missed variants ship as runtime errors the agent had no structural reason to catch.

**Goal:** Structural completeness via the type system: every subclass of the creator must implement the factory method, so missing-variant bugs surface as construction-time errors the agent can see during static reading. The creator's workflow becomes a stable surface the agent never re-reads as products multiply.

```js
// Before:
class Document {
  open(format) {
    let page;
    if (format === 'pdf') {
      page = new PdfPage();
    } else if (format === 'html') {
      page = new HtmlPage();
    } else if (format === 'markdown') {
      page = new MarkdownPage();
    } else {
      throw new Error(`unknown format: ${format}`);
    }
    this.pages = [page];
  }
}

// After:
class Document {
  open() {
    const page = this.createPage();
    this.pages = [page];
  }
  createPage() {
    throw new Error('createPage must be implemented by subclass');
  }
}
class PdfDocument extends Document {
  createPage() { return new PdfPage(); }
}
class HtmlDocument extends Document {
  createPage() { return new HtmlPage(); }
}
class MarkdownDocument extends Document {
  createPage() { return new MarkdownPage(); }
}
```

_Example source: Illustrative example written for this site in the spirit of Design Patterns (Gamma, Helm, Johnson, Vlissides, Addison-Wesley, 1994), chapter 3. The book's running example is a Document framework with Pages; this JavaScript adaptation keeps the canonical Creator (Document) + Product (Page) hierarchy and shows the factory-method hook deferring product instantiation to subclasses._

**Pressure:** The agent's verification budget on creator edits scales linearly with the number of variants in the switch. Every variant must be checked for consistent treatment; partial updates produce type-compatible silent bugs the test suite may not exercise. Context cost climbs faster than feature value.

**Tradeoff:** A parallel hierarchy doubles the file count the agent must navigate to understand the system. 'Which Document am I dealing with?' becomes an additional step in every reasoning trace, and refactoring across the hierarchy requires editing N files in lockstep — exactly the cross-cutting pattern the agent struggles with most.

**Relief:** Per-variant edits scope to one subclass; the creator's workflow is read-once. Tests for the creator cover all variants transitively; tests for each variant cover one method. Diff surface for a new variant is a single new file the agent generates by mirroring an existing sibling.

**Trap:** Subclasses that override more than the factory method (extra hooks, extra state, extra invariants) reintroduce the cross-cutting verification problem in a different shape — now the agent must verify N subclasses each implement M hooks consistently. The parallel hierarchy becomes the same N×M cell-check problem the switch had, only spread across more files.

**Triggered by:** Repeated Switches (smells), Replace Conditional with Polymorphism (refactorings), Replace Type Code with Subclasses (refactorings)

---
name: prototype
description: Apply Prototype when you see Duplicated Code, Speculative Generality, Replace Subclass with Delegate. One prototype-registry table the agent reads once to enumerate every variant and its defaults.
---

# Apply: 31 — Prototype

**Symptom:** N near-identical create methods the agent must scan in parallel to verify field-setting consistency. Adding a shared field requires the agent to find and update every method; missing one is a structurally-invisible bug the type checker doesn't see.

**Goal:** One prototype-registry table the agent reads once to enumerate every variant and its defaults. Cloning is a structural operation: the agent verifies clone() once, then trusts every per-variant change is data-only.

```js
// Before:
class GraphicEditor {
  createCircle(x, y) {
    const c = new Shape();
    c.kind = 'circle';
    c.fill = '#3498db';
    c.stroke = '#2c3e50';
    c.strokeWidth = 2;
    c.x = x; c.y = y; c.r = 20;
    return c;
  }
  createSquare(x, y) {
    const s = new Shape();
    s.kind = 'square';
    s.fill = '#e74c3c';
    s.stroke = '#2c3e50';
    s.strokeWidth = 2;
    s.x = x; s.y = y; s.side = 30;
    return s;
  }
  createStar(x, y) {
    const s = new Shape();
    s.kind = 'star';
    s.fill = '#f1c40f';
    s.stroke = '#2c3e50';
    s.strokeWidth = 2;
    s.x = x; s.y = y; s.points = 5; s.r = 25;
    return s;
  }
}

// After:
class Shape {
  clone() {
    return Object.assign(new Shape(), this);
  }
}
const SHAPE_PROTOTYPES = {
  circle: Object.assign(new Shape(), { kind: 'circle', fill: '#3498db', stroke: '#2c3e50', strokeWidth: 2, r: 20 }),
  square: Object.assign(new Shape(), { kind: 'square', fill: '#e74c3c', stroke: '#2c3e50', strokeWidth: 2, side: 30 }),
  star:   Object.assign(new Shape(), { kind: 'star',   fill: '#f1c40f', stroke: '#2c3e50', strokeWidth: 2, points: 5, r: 25 }),
};
function createShape(kind, x, y) {
  const shape = SHAPE_PROTOTYPES[kind].clone();
  shape.x = x;
  shape.y = y;
  return shape;
}
```

_Example source: Illustrative example written for this site in the spirit of Design Patterns (Gamma, Helm, Johnson, Vlissides, Addison-Wesley, 1994), chapter 3. The book's running example is a graphic editor's shape palette; this JavaScript adaptation keeps the registry-of-prototypes shape so adding a new shape variant is data, not a new createX method._

**Pressure:** Field additions cascade across every create method; the agent's edit cost grows linearly with variant count. The shared-by-convention shape is invisible to static analysis; the agent must compare methods pairwise to be sure they stay in sync.

**Tradeoff:** Shallow-clone aliasing bugs are the worst kind for the agent — symptoms appear far from the cause, in code that 'just reads a field'. Verifying clone semantics requires reasoning across the full clone graph; partial verification produces flaky-looking tests.

**Relief:** The registry table is one place to read and edit; clone is a generic operation the agent verifies once; per-variant changes have a single-line diff surface. Test coverage for one variant becomes coverage-by-construction for every variant.

**Trap:** Optional fields and conditional cloning logic accreting onto the prototype mask divergent variant shapes. The agent reading the registry sees a uniform table; the runtime sees branching behaviour that depends on which fields a prototype happens to have set. The structural promise the pattern made stops holding.

**Triggered by:** Duplicated Code (smells), Speculative Generality (smells), Replace Subclass with Delegate (refactorings)

---
name: singleton
description: Apply Singleton when you see Global Data, Duplicated Code, Encapsulate Variable. A single getInstance() access point the agent can grep for to enumerate every consumer.
---

# Apply: 32 — Singleton

**Symptom:** The agent sees `new Config()` scattered across modules and cannot tell from reading whether the consumers share state. Test-isolation reasoning requires the agent to enumerate every construction site; assumptions about 'one config' are unverifiable at static read time.

**Goal:** A single getInstance() access point the agent can grep for to enumerate every consumer. Construction is structurally one-shot; the agent's reasoning about 'who owns this state' has exactly one answer; tests against shared state are explicit about reset.

```js
// Before:
class Config {
  constructor() {
    this.values = loadFromDisk();
  }
}
// every consumer constructs its own:
const databaseModule = { config: new Config() };
const httpModule = { config: new Config() };
const loggerModule = { config: new Config() };
// three disk reads; three copies that drift if the file changes;
// no canonical 'current configuration' anywhere in the system.

// After:
class Config {
  static instance = null;
  static getInstance() {
    if (Config.instance === null) {
      Config.instance = new Config(Config.#TOKEN);
    }
    return Config.instance;
  }
  static #TOKEN = Symbol('Config.constructor');
  constructor(token) {
    if (token !== Config.#TOKEN) {
      throw new Error('Use Config.getInstance() — Config is a singleton');
    }
    this.values = loadFromDisk();
  }
}
const databaseModule = { config: Config.getInstance() };
const httpModule = { config: Config.getInstance() };
const loggerModule = { config: Config.getInstance() };
```

_Example source: Illustrative example written for this site in the spirit of Design Patterns (Gamma, Helm, Johnson, Vlissides, Addison-Wesley, 1994), chapter 3. The book's running example is a printer-spooler; this JavaScript adaptation uses a configuration registry where the expensive disk load happens at most once. The private-token guard makes new Config() unconstructable from outside, mirroring the book's private-constructor enforcement in languages that have it._

**Pressure:** Per-consumer copies multiply the agent's state-graph reasoning by consumer count. Cross-module bugs caused by stale copies are nearly impossible to localize statically — the agent must trace runtime construction order, which is invisible in the source.

**Tradeoff:** Singleton state survives across tests by default; the agent must remember per-test reset discipline that the test framework does not enforce. Coupling consumers to a static getter hides the dependency in a way linters cannot warn about — the agent's 'who depends on what' graph is structurally incomplete.

**Relief:** Construction grep returns one site (the getter); 'who calls Config.getInstance' enumerates every consumer; reset semantics are localizable to the getter's reset method. Diff surface for changing the loading strategy is one class.

**Trap:** When tests rely on Config.getInstance() returning a real (live) instance, the agent's edits to Config silently break unrelated tests through the shared-state coupling. The pattern's convenience hides exactly the kind of cross-cutting dependency the agent needs structural visibility into.

**Triggered by:** Global Data (smells), Duplicated Code (smells), Encapsulate Variable (refactorings)

---
name: adapter
description: Apply Adapter when you see Alternative Classes with Different Interfaces, Change Function Declaration, Replace Subclass with Delegate. The canonical interface is the agent's single anchor for reasoning about how the system uses payments; the adapter is a thin file the agent reads once to understand the translation rules.
---

# Apply: 33 — Adapter

**Symptom:** Inline conversion code scattered across call sites means the agent must spot the convention mismatch at every consumer and verify the conversion is consistent. Unit-of-measure bugs (cents vs dollars, ms vs seconds) are type-compatible — the compiler will not catch them — but they produce wrong-by-100x outputs.

**Goal:** The canonical interface is the agent's single anchor for reasoning about how the system uses payments; the adapter is a thin file the agent reads once to understand the translation rules. Conversion bugs surface as adapter-test failures, not as scattered consumer-side errors.

```js
// Before:
class LegacyStripeClient {
  charge_card(amount_cents, card_token) {
    return fetch('https://stripe.legacy/charge', { method: 'POST', body: `${amount_cents}|${card_token}` });
  }
}
// The rest of the app expects: processor.charge({ amount, source })
// Adapters are sprinkled inline at every consumer:
function checkout(cart) {
  const client = new LegacyStripeClient();
  return client.charge_card(Math.round(cart.total * 100), cart.token);
}
function refundOrder(order) {
  const client = new LegacyStripeClient();
  return client.charge_card(-Math.round(order.amount * 100), order.token);
}

// After:
class StripeAdapter {
  constructor(legacy) {
    this.legacy = legacy;
  }
  charge({ amount, source }) {
    return this.legacy.charge_card(Math.round(amount * 100), source);
  }
}
const processor = new StripeAdapter(new LegacyStripeClient());
function checkout(cart) {
  return processor.charge({ amount: cart.total, source: cart.token });
}
function refundOrder(order) {
  return processor.charge({ amount: -order.amount, source: order.token });
}
```

_Example source: Illustrative example written for this site in the spirit of Design Patterns (Gamma, Helm, Johnson, Vlissides, Addison-Wesley, 1994), chapter 4. The book's running example is a graphic toolkit adapting Shape to TextView; this JavaScript adaptation uses a payment-gateway integration where a legacy snake_case + cents API gets adapted to a modern camelCase + dollars interface._

**Pressure:** N consumers × M conversion rules = N×M cells the agent verifies on every unit-related change. Inconsistent conventions across consumers (some pass cents, some pass dollars) produce subtle data-shape bugs the agent struggles to localize statically.

**Tradeoff:** The agent must navigate adapter + underlying client to trace a runtime error end-to-end. Stack traces span both layers; partial-failure modes (legacy client returns a half-broken response that the adapter passes through unchanged) require the agent to verify error handling at both layers.

**Relief:** Edits scoped to the adapter; consumer code unchanged; tests for the adapter cover unit conversion exhaustively. Replacing the underlying client is a one-file diff the agent can verify in isolation.

**Trap:** Adapters that accumulate non-translation logic (retries, caching, metrics) become god objects the agent must understand fully before any payment-related edit. The pattern's promise of 'thin translation layer' degrades into a black box where the agent loses confidence about which layer owns which behaviour.

**Triggered by:** Alternative Classes with Different Interfaces (smells), Change Function Declaration (refactorings), Replace Subclass with Delegate (refactorings)

---
name: bridge
description: Apply Bridge when you see Shotgun Surgery, Replace Subclass with Delegate, Extract Class. Two independent surfaces the agent reads separately.
---

# Apply: 34 — Bridge

**Symptom:** Cross-product class hierarchies the agent must reason about as N×M cells. Editing one method's contract requires updating every cell; missing cells produce silent type-compatible inconsistencies the test suite may not catch until a customer hits an unexercised combination.

**Goal:** Two independent surfaces the agent reads separately. The abstraction's contract is one file; each implementation is one file; composition is structurally typed and verifiable by the type system. Diff surface for adding an axis value is one file.

```js
// Before:
class CanvasCircle {
  constructor(x, y, r) { this.x = x; this.y = y; this.r = r; }
  draw(ctx) { ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI); ctx.stroke(); }
}
class SvgCircle {
  constructor(x, y, r) { this.x = x; this.y = y; this.r = r; }
  draw() { return `<circle cx="${this.x}" cy="${this.y}" r="${this.r}"/>`; }
}
class CanvasSquare {
  constructor(x, y, side) { this.x = x; this.y = y; this.side = side; }
  draw(ctx) { ctx.strokeRect(this.x, this.y, this.side, this.side); }
}
class SvgSquare {
  constructor(x, y, side) { this.x = x; this.y = y; this.side = side; }
  draw() { return `<rect x="${this.x}" y="${this.y}" width="${this.side}" height="${this.side}"/>`; }
}
// Adding Triangle = 2 new classes. Adding WebglRenderer = 3 new classes.
// Two shapes × two renderers = 4 classes; N × M scales combinatorially.

// After:
class CanvasRenderer {
  drawCircle(x, y, r)   { this.ctx.beginPath(); this.ctx.arc(x, y, r, 0, 2 * Math.PI); this.ctx.stroke(); }
  drawSquare(x, y, side) { this.ctx.strokeRect(x, y, side, side); }
}
class SvgRenderer {
  drawCircle(x, y, r)    { return `<circle cx="${x}" cy="${y}" r="${r}"/>`; }
  drawSquare(x, y, side) { return `<rect x="${x}" y="${y}" width="${side}" height="${side}"/>`; }
}
class Circle {
  constructor(renderer, x, y, r) { this.renderer = renderer; this.x = x; this.y = y; this.r = r; }
  draw() { return this.renderer.drawCircle(this.x, this.y, this.r); }
}
class Square {
  constructor(renderer, x, y, side) { this.renderer = renderer; this.x = x; this.y = y; this.side = side; }
  draw() { return this.renderer.drawSquare(this.x, this.y, this.side); }
}
// Adding Triangle = 1 new shape + 1 new method per renderer.
// Adding WebglRenderer = 1 new class. Two shapes + two renderers = 4 classes; N + M scales linearly.
```

_Example source: Illustrative example written for this site in the spirit of Design Patterns (Gamma, Helm, Johnson, Vlissides, Addison-Wesley, 1994), chapter 4. The book's running example is a cross-platform Window hierarchy with XWindow / PMWindow implementations; this JavaScript adaptation uses Shape × Renderer to make the N+M vs N×M class-count payoff visible in code, not just in prose._

**Pressure:** N×M cell verification on every cross-axis edit. The agent's reasoning load grows multiplicatively with both axes; static analysis of 'is this shape×renderer combination supported' requires enumerating the full cross-product, which is expensive in context budget.

**Tradeoff:** Two-surface comprehension cost is higher per-read than a single hierarchy. The agent must hold the abstraction's expected interface and the implementation's actual interface in mind simultaneously; mismatches surface as runtime errors at the delegation site, not at compile time in older type systems.

**Relief:** Per-axis edits scope to one file; the type system enforces the contract; combination behaviour is testable as 'this shape × this renderer' without needing a new class. The agent's edit/verify cycle on adding an axis value is bounded and local.

**Trap:** Premature bridging doubles the file count and adds an indirection the agent must navigate on every read, with zero pay-off until the second axis variant ships. Watch for 'bridge with one implementation' as a sign the pattern was applied too early; the agent's reading cost is paid forever, even if the predicted second axis never arrives.

**Triggered by:** Shotgun Surgery (smells), Replace Subclass with Delegate (refactorings), Extract Class (refactorings)

---
name: composite
description: Apply Composite when you see Repeated Switches, Replace Conditional with Polymorphism, Replace Type Code with Subclasses. A typed interface where adding a new node kind forces the type system to demand an implementation of every operation.
---

# Apply: 35 — Composite

**Symptom:** Untyped tree records the agent must reason about as discriminated unions enforced by convention, not by type. Every traversal is a switch the agent verifies for exhaustiveness; static analysis cannot prove no kind was forgotten.

**Goal:** A typed interface where adding a new node kind forces the type system to demand an implementation of every operation. The agent's edit-verify cycle on a new kind is bounded by the interface; static analysis returns complete results.

```js
// Before:
function totalSize(node) {
  if (node.type === 'file') {
    return node.bytes;
  } else if (node.type === 'directory') {
    let total = 0;
    for (const child of node.children) {
      total += totalSize(child);
    }
    return total;
  }
  throw new Error(`unknown node type: ${node.type}`);
}
function nameOf(node) {
  if (node.type === 'file' || node.type === 'directory') return node.name;
  throw new Error(`unknown node type: ${node.type}`);
}
// Every traversal repeats the if/else; new node types touch every function.

// After:
class FileNode {
  constructor(name, bytes) {
    this.name = name;
    this.bytes = bytes;
  }
  totalSize() { return this.bytes; }
}
class DirectoryNode {
  constructor(name, children) {
    this.name = name;
    this.children = children;
  }
  totalSize() {
    return this.children.reduce((sum, child) => sum + child.totalSize(), 0);
  }
}
// Client treats leaf and composite uniformly:
const root = new DirectoryNode('project', [
  new FileNode('README.md', 1024),
  new DirectoryNode('src', [new FileNode('index.js', 2048)]),
]);
const size = root.totalSize();
```

_Example source: Illustrative example written for this site in the spirit of Design Patterns (Gamma, Helm, Johnson, Vlissides, Addison-Wesley, 1994), chapter 4. The book's running example is a graphics editor's drawing primitives + groups; this JavaScript adaptation uses filesystem nodes (file + directory) because the leaf/composite uniformity is more recognizable and the recursive aggregation is easier to picture._

**Pressure:** Discriminated-record traversals scatter the kind-handling logic across every operation; the agent's reasoning load grows with operation count × kind count. Missed branches surface as runtime exceptions on paths the test suite did not happen to exercise.

**Tradeoff:** Uniform interfaces force the agent to recognize 'this operation is a no-op on leaves' or 'this throws on leaves' as patterns separate from the interface itself. Stack traces from a leaf rejecting add() require the agent to trace through the interface contract to understand why the rejection happened.

**Relief:** Per-kind edits scope to one class file; per-operation edits scope to adding one method across N classes (mechanical, scriptable). The composite traversal is a one-line reduce; recursion verification is local to the composite class.

**Trap:** Leaves implementing add()/remove() as throws turns the type system's promise of uniformity into a runtime trap. The agent reading the interface expects the operation to work; the runtime experience contradicts the static read. Prefer the discriminated-union form when leaf and composite diverge on more than two operations.

**Triggered by:** Repeated Switches (smells), Replace Conditional with Polymorphism (refactorings), Replace Type Code with Subclasses (refactorings)

---
name: decorator
description: Apply Decorator when you see Large Class, Divergent Change, Replace Subclass with Delegate. N small wrapper classes the agent reads one at a time.
---

# Apply: 36 — Decorator

**Symptom:** Combinatorial subclass explosion or feature-flag-laden monoliths the agent must verify exhaustively on every behavioural change. 2^N combinations means N×(N-1) feature-interaction cells the agent reasons about; feature flags inside one class make the class's behaviour parametric on flag combinations.

**Goal:** N small wrapper classes the agent reads one at a time. Feature composition is explicit in the construction expression; each wrapper's behaviour is its own one-file unit; tests cover each wrapper × wrappee combination compositionally.

```js
// Before:
class EmailNotifier {
  send(message) { /* email */ }
}
class EmailAndSmsNotifier {
  send(message) { /* email + sms */ }
}
class EmailAndSlackNotifier {
  send(message) { /* email + slack */ }
}
class EmailAndSmsAndSlackNotifier {
  send(message) { /* email + sms + slack */ }
}
// N channels → 2^N notifier classes. Adding 'Discord' doubles the
// hierarchy. Each new combination repeats the orchestration logic.

// After:
class EmailNotifier {
  send(message) { /* email */ }
}
class SmsDecorator {
  constructor(wrapped) { this.wrapped = wrapped; }
  send(message) {
    this.wrapped.send(message);
    /* also send sms */
  }
}
class SlackDecorator {
  constructor(wrapped) { this.wrapped = wrapped; }
  send(message) {
    this.wrapped.send(message);
    /* also post to slack */
  }
}
// Compose at the call site:
const notifier = new SlackDecorator(new SmsDecorator(new EmailNotifier()));
notifier.send('Build failed');
// N channels → N classes. Adding 'Discord' = 1 new decorator.
```

_Example source: Illustrative example written for this site in the spirit of Design Patterns (Gamma, Helm, Johnson, Vlissides, Addison-Wesley, 1994), chapter 4. The book's running example is a windowing toolkit with scroll-bars and borders as decorators; this JavaScript adaptation uses a multi-channel notifier because the composability of channels makes the 2^N → N collapse visible in code._

**Pressure:** Combinatorial hierarchy growth turns 'add a feature' into 'edit every existing combination'. Feature-flag monoliths concentrate the verification burden into one mega-class whose behaviour the agent must trace through every flag-permutation. Both shapes consume context budget that should be spent on the calling code.

**Tradeoff:** Wrapping chains are stack-allocated indirection the agent must navigate per operation. Tracing why `notifier.send(msg)` produced a specific side effect requires the agent to walk the wrapping chain — and the chain's composition is dynamic, set at the construction site that may live in a different module.

**Relief:** Per-feature edits scope to one decorator file; verification scales linearly with feature count. Stack traces map decorators 1:1 to call frames; the agent can localize bugs by reading one wrapper at a time. Compositional tests cover combinations without enumerating them.

**Trap:** Decorators whose semantics depend on wrapping order (RetryDecorator(LoggingDecorator(X)) vs LoggingDecorator(RetryDecorator(X))) force the agent to verify order-correctness on every construction site. The construction expression becomes part of the spec; PR review must catch wrong-order regressions the type system cannot.

**Triggered by:** Large Class (smells), Divergent Change (smells), Replace Subclass with Delegate (refactorings)

---
name: facade
description: Apply Facade when you see Message Chains, Insider Trading, Hide Delegate. One Facade method the agent reads end-to-end to understand the full choreography.
---

# Apply: 37 — Facade

**Symptom:** Multi-subsystem orchestration scattered across consumers means the agent must reason about subsystem ordering, error handling, and failure recovery at every call site. Verifying 'do all consumers correctly release inventory on payment-fail' requires enumerating every consumer; static analysis cannot prove uniformity.

**Goal:** One Facade method the agent reads end-to-end to understand the full choreography. Per-consumer reasoning collapses to 'this consumer calls submitOrder(cart, customer)' — the agent does not re-verify orchestration at each consumer site.

```js
// Before:
function checkout(cart, customer) {
  if (!inventory.reserve(cart.items)) {
    throw new Error('out of stock');
  }
  const charge = payment.charge(cart.total, customer.cardToken);
  if (!charge.success) {
    inventory.release(cart.items);
    throw new Error('payment failed');
  }
  const shipment = shipping.createShipment(cart.items, customer.address);
  notifications.sendOrderConfirmation(customer.email, shipment.trackingNumber);
  audit.recordPurchase(customer.id, cart.total);
  return { orderId: shipment.trackingNumber, total: cart.total };
}
// Every consumer that calls checkout knows about 5 subsystems
// and the right ordering. Forgetting inventory.release on payment-fail
// silently leaks reserved inventory.

// After:
class CheckoutFacade {
  constructor(inventory, payment, shipping, notifications, audit) {
    this.inventory = inventory;
    this.payment = payment;
    this.shipping = shipping;
    this.notifications = notifications;
    this.audit = audit;
  }
  submitOrder(cart, customer) {
    if (!this.inventory.reserve(cart.items)) {
      throw new Error('out of stock');
    }
    const charge = this.payment.charge(cart.total, customer.cardToken);
    if (!charge.success) {
      this.inventory.release(cart.items);
      throw new Error('payment failed');
    }
    const shipment = this.shipping.createShipment(cart.items, customer.address);
    this.notifications.sendOrderConfirmation(customer.email, shipment.trackingNumber);
    this.audit.recordPurchase(customer.id, cart.total);
    return { orderId: shipment.trackingNumber, total: cart.total };
  }
}
// Client: checkout.submitOrder(cart, customer)
```

_Example source: Illustrative example written for this site in the spirit of Design Patterns (Gamma, Helm, Johnson, Vlissides, Addison-Wesley, 1994), chapter 4. The book's running example is a compiler with parser/lexer/codegen subsystems; this JavaScript adaptation uses an e-commerce checkout because the multi-subsystem choreography (inventory + payment + shipping + notifications + audit) makes the encapsulation payoff more visible._

**Pressure:** Per-consumer orchestration is N consumers × M subsystems × K error-modes = N×M×K cells the agent verifies on every change. Insider Trading is the worst input shape for the agent's verification budget: every consumer must be checked for correctness against every subsystem's contract.

**Tradeoff:** Facade opacity means runtime errors from inside the facade surface to the consumer as 'submitOrder failed' with no structural breadcrumb. The agent investigating a regression must trace into the facade implementation; stack traces span the facade + subsystem boundary, and the consumer's mental model is one level removed from the actual failure.

**Relief:** Edits scoped to the Facade; consumer code unchanged when subsystems are added or refactored; one set of tests covers orchestration and error recovery exhaustively. The agent's cross-consumer verification budget drops to zero on subsystem changes.

**Trap:** When the Facade grows to N user tasks (submitOrder + refund + modify + audit + ...), it becomes a god object the agent must read fully before any edit. The pattern's clarity wins were proportional to focused scope; god-facade scope reintroduces the verification problem at a higher level.

**Triggered by:** Message Chains (smells), Insider Trading (smells), Hide Delegate (refactorings)

---
name: flyweight
description: Apply Flyweight when you see Duplicated Code, Large Class, Extract Class. A structural separation between kind-shared data (TreeType) and per-instance data (Tree).
---

# Apply: 38 — Flyweight

**Symptom:** Instances of the same kind hold identical bytes for kind-shared fields. The agent reading the Tree class sees a constructor doing expensive work (loadTexture, loadMesh) per instance and must verify the duplication is intentional or a bug; static reads cannot distinguish 'cached lookup' from 'fresh load' without per-call instrumentation.

**Goal:** A structural separation between kind-shared data (TreeType) and per-instance data (Tree). The agent verifies expensive setup is in TreeType.constructor (runs once per species); per-instance construction is cheap and obvious. Memory characteristics are statically derivable.

```js
// Before:
class Tree {
  constructor(species, x, y, age, scale) {
    this.species = species;
    this.texture = loadTexture(species);
    this.mesh = loadMesh(species);
    this.animation = loadAnimation(species);
    this.x = x;
    this.y = y;
    this.age = age;
    this.scale = scale;
  }
  render(ctx) {
    /* uses this.texture, this.mesh, this.x, this.y */
  }
}
const forest = [];
for (let i = 0; i < 10000; i++) {
  forest.push(new Tree('oak', randomX(), randomY(), randomAge(), 1.0));
}
// 10000 × 7MB of texture/mesh data per tree = catastrophic memory cost.

// After:
class TreeType {
  constructor(species) {
    this.species = species;
    this.texture = loadTexture(species);
    this.mesh = loadMesh(species);
    this.animation = loadAnimation(species);
  }
  render(ctx, x, y, age, scale) {
    /* uses this.texture, this.mesh, x, y, scale */
  }
}
class TreeTypeRegistry {
  static cache = new Map();
  static get(species) {
    if (!TreeTypeRegistry.cache.has(species)) {
      TreeTypeRegistry.cache.set(species, new TreeType(species));
    }
    return TreeTypeRegistry.cache.get(species);
  }
}
class Tree {
  constructor(species, x, y, age, scale) {
    this.type = TreeTypeRegistry.get(species);
    this.x = x;
    this.y = y;
    this.age = age;
    this.scale = scale;
  }
  render(ctx) {
    this.type.render(ctx, this.x, this.y, this.age, this.scale);
  }
}
// 10000 Trees × ~40 bytes each + one shared TreeType per species.
```

_Example source: Illustrative example written for this site in the spirit of Design Patterns (Gamma, Helm, Johnson, Vlissides, Addison-Wesley, 1994), chapter 4. The book's running example is a text editor's per-character glyph objects; this JavaScript adaptation uses a forest of game-engine trees because the texture/mesh-sharing payoff (and the intrinsic/extrinsic split) reads more concretely in modern terms._

**Pressure:** N×M memory cost is invisible at static-read time but devastating at runtime; the agent reasoning about scaling characteristics must run instrumentation to surface it. Per-instance heavy state is a bug shape the agent cannot easily detect from the source.

**Tradeoff:** Two-class structure (Flyweight + per-instance wrapper) doubles the file count the agent navigates per kind. Methods on Tree that delegate to TreeType are one-line passes that consume read budget; deep call chains for trivial behaviour confuse 'where does this actually do work' reasoning.

**Relief:** Memory and load-time characteristics become structurally provable from a single-file read of TreeType + its registry. The agent verifies kind-load semantics once; per-instance reasoning collapses to the four extrinsic fields. Cost-of-scale predictions are reliable from source alone.

**Trap:** Premature flyweighting at low N adds indirection the agent pays for at every read with no memory payoff. Watch for 'Flyweight with one or two instances per kind' as a sign the pattern was speculative — the cost is paid forever, the benefit is hypothetical.

**Triggered by:** Duplicated Code (smells), Large Class (smells), Extract Class (refactorings)

---
name: proxy
description: Apply Proxy when you see Insider Trading, Encapsulate Variable, Replace Subclass with Delegate. One Proxy class the agent reads to know the policy.
---

# Apply: 39 — Proxy

**Symptom:** Scattered per-client policy checks (auth, init, cache) the agent must verify uniformly on every change. Eager construction of expensive resources the agent must trace through the constructor at every reading to understand load semantics.

**Goal:** One Proxy class the agent reads to know the policy. Clients are uniform calls to the interface; the agent's verification budget on access policy collapses to one file. Load and access semantics are statically derivable from the Proxy's implementation.

```js
// Before:
class Image {
  constructor(url) {
    this.url = url;
    this.pixels = downloadAndDecode(url);
  }
  draw(ctx, x, y) {
    ctx.putImageData(this.pixels, x, y);
  }
}
// Building a gallery thumbnail row:
const images = thumbnailUrls.map((url) => new Image(url));
// 100 thumbnails × 50MB decoded pixels = 5GB up front,
// even if the user only ever scrolls past 10 of them.

// After:
class Image {
  constructor(url) {
    this.url = url;
    this.pixels = downloadAndDecode(url);
  }
  draw(ctx, x, y) {
    ctx.putImageData(this.pixels, x, y);
  }
}
class ImageProxy {
  constructor(url) {
    this.url = url;
    this.real = null;
  }
  draw(ctx, x, y) {
    if (this.real === null) {
      this.real = new Image(this.url);
    }
    this.real.draw(ctx, x, y);
  }
}
const images = thumbnailUrls.map((url) => new ImageProxy(url));
// ~24 bytes per proxy. Only the images that draw() is called on materialize.
```

_Example source: Illustrative example written for this site in the spirit of Design Patterns (Gamma, Helm, Johnson, Vlissides, Addison-Wesley, 1994), chapter 4. The book's running example is a document with embedded images that load on demand; this JavaScript adaptation uses a thumbnail gallery because the lazy-loading payoff is concrete and the same-interface contract between Image and ImageProxy reads in code._

**Pressure:** Per-client policy is N×M cells (N clients × M policy aspects); each cell is a potential miss the agent verifies independently. Eager construction hides load cost in constructor side effects, which the agent cannot localize from a single-file read.

**Tradeoff:** The agent must trace through Subject + Proxy to understand any operation's full behaviour; stack traces span both layers; runtime errors require the agent to disambiguate 'did the Proxy or the Subject raise this?' Same-interface contracts depend on subtle behavioural conformance the type system does not enforce.

**Relief:** Policy edits scope to the Proxy; client code unchanged; cross-client uniformity is structurally guaranteed. The agent's reasoning about access semantics is one-file-bounded; tests for the Proxy cover policy exhaustively without per-client repetition.

**Trap:** Subject and Proxy diverging on subtle semantics (concurrency, error types, side-effect timing) produces type-compatible bugs the agent struggles to localize. The agent reading client code trusts the interface contract; the runtime experience contradicts that trust intermittently, exactly the bug shape that survives review and ships.

**Triggered by:** Insider Trading (smells), Encapsulate Variable (refactorings), Replace Subclass with Delegate (refactorings)

---
name: chain-of-responsibility
description: Apply Chain of Responsibility when you see Long Function, Divergent Change, Replace Conditional with Polymorphism. N small handler classes the agent reads one at a time.
---

# Apply: 40 — Chain of Responsibility

**Symptom:** A single-function dispatcher with multiple concerns the agent must verify against on every concern-related edit. Edits to one concern's logic touch the same source span as every other concern; merge conflicts and unintended side effects are routine.

**Goal:** N small handler classes the agent reads one at a time. Edits to a concern scope to one file; chain ordering is one expression at the construction site; the agent's verification budget on a concern-specific change drops from full-function-scan to one-file-scan.

```js
// Before:
function handleRequest(req, res) {
  if (!req.headers.authorization) {
    res.status = 401;
    res.body = 'unauthorized';
    return;
  }
  if (rateLimiter.exceeded(req.ip)) {
    res.status = 429;
    res.body = 'too many requests';
    return;
  }
  logger.info(`${req.method} ${req.path}`);
  if (req.path === '/api/users') {
    res.status = 200;
    res.body = listUsers();
    return;
  }
  res.status = 404;
}
// One function changes for auth reasons, rate-limit reasons, logging reasons,
// routing reasons — every concern is a Divergent Change pressure on the same body.

// After:
class Handler {
  constructor(next) {
    this.next = next;
  }
  handle(req, res) {
    if (this.next) this.next.handle(req, res);
  }
}
class AuthHandler extends Handler {
  handle(req, res) {
    if (!req.headers.authorization) {
      res.status = 401;
      res.body = 'unauthorized';
      return;
    }
    super.handle(req, res);
  }
}
class RateLimitHandler extends Handler {
  handle(req, res) {
    if (rateLimiter.exceeded(req.ip)) {
      res.status = 429;
      res.body = 'too many requests';
      return;
    }
    super.handle(req, res);
  }
}
class LoggingHandler extends Handler {
  handle(req, res) {
    logger.info(`${req.method} ${req.path}`);
    super.handle(req, res);
  }
}
class RoutingHandler extends Handler {
  handle(req, res) {
    if (req.path === '/api/users') {
      res.status = 200;
      res.body = listUsers();
      return;
    }
    res.status = 404;
  }
}
const chain = new AuthHandler(new RateLimitHandler(new LoggingHandler(new RoutingHandler(null))));
chain.handle(req, res);
```

_Example source: Illustrative example written for this site in the spirit of Design Patterns (Gamma, Helm, Johnson, Vlissides, Addison-Wesley, 1994), chapter 5. The book's running example is a context-sensitive help system where help requests bubble up a widget tree; this JavaScript adaptation uses HTTP middleware because the chain-of-handlers shape is recognizable to most modern readers._

**Pressure:** A long sequential handler function is O(concerns) read cost per edit and O(concerns²) verification cost for concern interactions. The agent's working memory is consumed by the full concern set rather than the change's actual scope.

**Tradeoff:** Chain composition is implicit in the construction expression's nesting order. The agent investigating a runtime issue must trace through N handlers; stack traces span N frames; concern interactions (handler-A short-circuits before handler-B logs the failure) require explicit chain-aware reasoning the type system cannot enforce.

**Relief:** Per-concern edits scope to one handler class; tests for each handler are unit-sized; chain composition tests cover ordering exhaustively at one construction site. Diff surface for adding a concern is a new file + a one-line edit to the chain.

**Trap:** Handlers that peek at chain neighbors or skip ahead by mutating the request reintroduce cross-handler coupling. The agent reading one handler can no longer reason about its behaviour in isolation; chain-aware verification becomes mandatory on every handler edit, defeating the per-handler isolation the pattern promised.

**Triggered by:** Long Function (smells), Divergent Change (smells), Replace Conditional with Polymorphism (refactorings)
