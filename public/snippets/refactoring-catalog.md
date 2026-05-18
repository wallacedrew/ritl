# Refactoring catalog

Centralized view of the 90 catalog skills. Each section below is the
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

**Target state:** Variable names carry enough disambiguating information that the agent can reason about each symbol without a lookup hop.

**Why apply it:** Fewer context-lookup hops per reasoning step; planning loops run cheaper and resist drift.

**Tradeoff:** Renames invalidate cached associations — commit history, RAG snippets, embedding indexes, and prior conversation context all carry the old name until they refresh.

```js
// Avoid:
const a = height * width;

// Prefer:
const area = height * width;
```

**Removes smells:** Mysterious Name

---
name: rename-field
description: Apply Rename Field when you see Mysterious Name. Field names carry domain meaning so the agent can interpret reads and writes without examining the class definition.
---

# Apply: 19 — Rename Field

**Target state:** Field names carry domain meaning so the agent can interpret reads and writes without examining the class definition.

**Why apply it:** The agent reasons about field access with the field's name as ground truth; consumer-side reasoning becomes self-documenting.

**Tradeoff:** Renaming a field invalidates more cached associations than a variable rename — persistence layers (DB columns, JSON schemas, API contracts) carry the old name until they update.

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

**Removes smells:** Mysterious Name

---
name: remove-dead-code
description: Apply Remove Dead Code when you see Speculative Generality, Comments. Every definition the agent encounters is reachable; reasoning about behavior doesn't have to consider phantom paths.
---

# Apply: 17 — Remove Dead Code

**Target state:** Every definition the agent encounters is reachable; reasoning about behavior doesn't have to consider phantom paths.

**Why apply it:** The agent's reasoning context shrinks; static analysis becomes ground truth; planning loops don't waste cycles on phantom paths.

**Tradeoff:** Deletion is one-way under static analysis but reachability can hide in reflection, dynamic dispatch, external callers, or runtime config — the agent that deletes without checking risks a regression nothing catches.

```js
// Avoid:
function legacyDiscount(order) { /* unused since 2018 */ }
function modernDiscount(order) { /* the real one */ }

// Prefer:
function discount(order) { /* the real one */ }
```

**Removes smells:** Speculative Generality, Comments

---
name: replace-magic-literal
description: Apply Replace Magic Literal when you see Mysterious Name, Comments. Domain-meaningful values have named constants the agent can reference by name; the constant's name documents what the value represents.
---

# Apply: 43 — Replace Magic Literal

**Target state:** Domain-meaningful values have named constants the agent can reference by name; the constant's name documents what the value represents.

**Why apply it:** The agent reasons about values by name with the type system enforcing valid uses; changing the value is one edit the type checker confirms.

**Tradeoff:** Each new named constant is an import the agent must locate and resolve; over-naming creates a vocabulary the agent must learn for marginal disambiguation benefit.

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

**Removes smells:** Mysterious Name, Comments

### Composing Methods

---
name: extract-function
description: Apply Extract Function when you see Long Function, Duplicated Code, Comments. Each function is a verifiable unit small enough that the agent can reason about its full behavior in a single reasoning step.
---

# Apply: 01 — Extract Function

**Target state:** Each function is a verifiable unit small enough that the agent can reason about its full behavior in a single reasoning step.

**Why apply it:** Smaller diff surface per commit; behavior preservation verifiable per refactoring step; chained orchestrations work from named subroutines instead of re-derived semantics.

**Tradeoff:** Each extracted helper inflates context-window cost by one definition the next reasoning step must load; over-extracting blows effective working memory.

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

**Removes smells:** Long Function, Duplicated Code, Comments

---
name: inline-function
description: Apply Inline Function when you see Lazy Element, Speculative Generality. Trivial wrappers disappear from the agent's working context; call sites read as exactly what's happening.
---

# Apply: 02 — Inline Function

**Target state:** Trivial wrappers disappear from the agent's working context; call sites read as exactly what's happening.

**Why apply it:** Shorter call chains; the agent loads one fewer definition per reasoning step.

**Tradeoff:** Inlining scatters the wrapper's body across call sites; if the wrapper was a seam (mocking boundary, extension point), removing it forecloses options the agent might need later.

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

**Removes smells:** Lazy Element, Speculative Generality

---
name: extract-variable
description: Apply Extract Variable when you see Mysterious Name, Comments. Intermediate values have names the agent can reference directly; reasoning about the expression decomposes into reasoning about named sub-values.
---

# Apply: 03 — Extract Variable

**Target state:** Intermediate values have names the agent can reference directly; reasoning about the expression decomposes into reasoning about named sub-values.

**Why apply it:** The agent references named intermediate values; expression-level reasoning becomes reference-level reasoning, which is cheaper.

**Tradeoff:** Each extracted variable is a name in the agent's local scope; over-extraction creates scope clutter the agent must navigate to find what's actually relevant.

```js
// Avoid:
if (order.qty * order.price - Math.max(0, order.qty - 500) * order.price * 0.05 > 1000) { /* ... */ }

// Prefer:
const basePrice    = order.qty * order.price;
const bulkDiscount = Math.max(0, order.qty - 500) * order.price * 0.05;
if (basePrice - bulkDiscount > 1000) { /* ... */ }
```

**Removes smells:** Mysterious Name, Comments

---
name: inline-variable
description: Apply Inline Variable when you see Lazy Element. Single-use variables that rename without semantic gain disappear; expressions speak for themselves.
---

# Apply: 04 — Inline Variable

**Target state:** Single-use variables that rename without semantic gain disappear; expressions speak for themselves.

**Why apply it:** Less local clutter in the agent's scope table; expressions read as themselves.

**Tradeoff:** Inlining a variable that did carry domain meaning forces the agent to interpret the bare expression every time instead of reading the named concept.

```js
// Avoid:
const basePrice = order.basePrice;
return basePrice > 1000;

// Prefer:
return order.basePrice > 1000;
```

**Removes smells:** Lazy Element

---
name: combine-functions-into-class
description: Apply Combine Functions into Class when you see Data Clumps, Primitive Obsession. Operations live with the data they act on; the agent loads one class to reason about both shape and behavior.
---

# Apply: 09 — Combine Functions into Class

**Target state:** Operations live with the data they act on; the agent loads one class to reason about both shape and behavior.

**Why apply it:** The agent loads the class as a single unit; behavior, fields, and invariants all in one place with one import.

**Tradeoff:** Wrapping the data in a class adds construction ceremony at every entry point; for data only used in one place the class is more code than the original concern warranted.

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

**Removes smells:** Data Clumps, Primitive Obsession

---
name: combine-functions-into-transform
description: Apply Combine Functions into Transform when you see Data Clumps, Mutable Data. One transform produces the enriched record; the agent reasons about derivations in one place and consumers read named fields.
---

# Apply: 10 — Combine Functions into Transform

**Target state:** One transform produces the enriched record; the agent reasons about derivations in one place and consumers read named fields.

**Why apply it:** Derivations are consistent by construction; the agent reads field accesses on the enriched record instead of computing across the codebase.

**Tradeoff:** Building the transform when only one consumer exists creates an intermediate type the agent must learn before its second use justifies it.

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

**Removes smells:** Data Clumps, Mutable Data

---
name: split-phase
description: Apply Split Phase when you see Divergent Change, Long Function. Each phase reads and writes its own well-defined inputs and outputs; the agent reasons about phases independently with the intermediate shape as the contract.
---

# Apply: 11 — Split Phase

**Target state:** Each phase reads and writes its own well-defined inputs and outputs; the agent reasons about phases independently with the intermediate shape as the contract.

**Why apply it:** Each phase becomes the agent's unit of reasoning; the intermediate shape documents the contract; testing and modification isolate to one phase at a time.

**Tradeoff:** The intermediate data structure is overhead; for functions where the two phases are tightly coupled (shared mutable locals, observer effects), splitting adds a seam without buying isolation.

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

**Removes smells:** Divergent Change, Long Function

---
name: slide-statements
description: Apply Slide Statements when you see Long Function, Comments. Related statements sit next to each other; the agent reads the function as a sequence of cohesive blocks ready for extraction.
---

# Apply: 14 — Slide Statements

**Target state:** Related statements sit next to each other; the agent reads the function as a sequence of cohesive blocks ready for extraction.

**Why apply it:** The function reads as cohesive blocks the agent can extract or reason about as units; setup for further refactoring becomes mechanical.

**Tradeoff:** Sliding can silently change behavior if statements aren't truly independent (hidden side effects, timing dependencies, observer effects); the agent verifying the slide must confirm independence at every gap.

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

**Removes smells:** Long Function, Comments

---
name: split-loop
description: Apply Split Loop when you see Long Function, Loops. Each loop does one thing; the agent reasons about one concern per loop and can replace each loop independently with a pipeline.
---

# Apply: 15 — Split Loop

**Target state:** Each loop does one thing; the agent reasons about one concern per loop and can replace each loop independently with a pipeline.

**Why apply it:** Each loop becomes an independently-replaceable unit (pipeline candidate); the agent's edit surface per concern shrinks.

**Tradeoff:** Two loops over the same collection cost more per iteration than one; for hot paths the runtime overhead matters and the agent verifying performance must measure.

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

**Removes smells:** Long Function, Loops

---
name: replace-loop-with-pipeline
description: Apply Replace Loop with Pipeline when you see Loops. Transformations read as named operation sequences (filter, map, reduce); the agent recognizes the shape without simulating the loop.
---

# Apply: 16 — Replace Loop with Pipeline

**Target state:** Transformations read as named operation sequences (filter, map, reduce); the agent recognizes the shape without simulating the loop.

**Why apply it:** Intent is readable; the agent reasons about each pipeline stage independently with type signatures documenting the transformation.

**Tradeoff:** Pipeline form adds per-element call overhead and forces the agent to track intermediate collection types through the chain; for hot paths the runtime cost matters.

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

**Removes smells:** Loops

---
name: replace-derived-variable-with-query
description: Apply Replace Derived Variable with Query when you see Mutable Data. Derived values are computed on demand; the agent reasons about state by reading source fields and trusting derivations.
---

# Apply: 20 — Replace Derived Variable with Query

**Target state:** Derived values are computed on demand; the agent reasons about state by reading source fields and trusting derivations.

**Why apply it:** Mutation scope shrinks to source fields; the agent reasons about state without modeling derivation update timing; consistency is by construction.

**Tradeoff:** Recomputing on every read can multiply cost if the derivation is expensive and the source rarely changes; the agent verifying performance must measure before deciding.

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

**Removes smells:** Mutable Data

---
name: split-variable
description: Apply Split Variable when you see Mysterious Name, Mutable Data. Each variable holds one role with a stable name; the agent reasons about names without tracking reassignment timeline.
---

# Apply: 18 — Split Variable

**Target state:** Each variable holds one role with a stable name; the agent reasons about names without tracking reassignment timeline.

**Why apply it:** The agent reasons about each variable as a stable name; the type system can narrow each role; each use becomes independently refactorable.

**Tradeoff:** If the two uses were actually coupled (shared init, synchronized update), splitting forces the agent to re-derive the coupling across two variables.

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

**Removes smells:** Mysterious Name, Mutable Data

---
name: move-statements-into-function
description: Apply Move Statements into Function when you see Duplicated Code. The function owns its setup and follow-up; the agent verifies behavior at the function definition instead of auditing every call site.
---

# Apply: 44 — Move Statements into Function

**Target state:** The function owns its setup and follow-up; the agent verifies behavior at the function definition instead of auditing every call site.

**Why apply it:** The agent reasons about the function's full contract from its definition; consistency is enforced by the function, not by convention.

**Tradeoff:** If some callers genuinely don't want the moved behavior, the function grows a flag argument and the agent must reason about which mode each caller wants.

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

**Removes smells:** Duplicated Code

---
name: move-statements-to-callers
description: Apply Move Statements to Callers when you see Divergent Change. The function's body addresses one responsibility; callers express their differences at the call site.
---

# Apply: 45 — Move Statements to Callers

**Target state:** The function's body addresses one responsibility; callers express their differences at the call site.

**Why apply it:** The function's contract narrows to its single responsibility; callers express variation explicitly; the agent reasons about one body and one branch per caller.

**Tradeoff:** If most callers want the moved statements, the agent now sees duplicated boilerplate at every call site — the inverse smell.

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

**Removes smells:** Divergent Change

---
name: replace-inline-code-with-function-call
description: Apply Replace Inline Code with Function Call when you see Duplicated Code. One canonical implementation the agent loads once and references everywhere; the name labels the intent at every call site.
---

# Apply: 46 — Replace Inline Code with Function Call

**Target state:** One canonical implementation the agent loads once and references everywhere; the name labels the intent at every call site.

**Why apply it:** The agent reasons about one definition; future improvements reach every site that used to inline; consistency is enforced by reference.

**Tradeoff:** If the existing function's name doesn't quite match the local intent, the agent reads the call site as a near-miss and must verify the semantic match at every replacement.

```js
// Avoid:
const inRange = candidate >= low && candidate <= high;

// Prefer:
const inRange = between(candidate, low, high);
```

**Removes smells:** Duplicated Code

---
name: replace-temp-with-query
description: Apply Replace Temp with Query when you see Long Function, Mutable Data. Computations become named queries the agent can reference by name from anywhere; functions decompose without dragging the temp's lifetime.
---

# Apply: 47 — Replace Temp with Query

**Target state:** Computations become named queries the agent can reference by name from anywhere; functions decompose without dragging the temp's lifetime.

**Why apply it:** The agent's plan-and-execute loop for Extract Function becomes mechanical; the named query is reusable anywhere it makes sense.

**Tradeoff:** If the temp wraps an expensive calculation called many times, naive replacement multiplies cost; the agent verifying performance must measure or cache before substituting.

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

**Removes smells:** Long Function, Mutable Data

---
name: replace-function-with-command
description: Apply Replace Function with Command when you see Long Function. Sub-steps become named methods sharing state via fields; the agent reasons about each step in isolation and extracts/tests them independently.
---

# Apply: 48 — Replace Function with Command

**Target state:** Sub-steps become named methods sharing state via fields; the agent reasons about each step in isolation and extracts/tests them independently.

**Why apply it:** Each sub-step becomes a named method on the command; the agent extracts and tests them in pieces without rewiring shared state.

**Tradeoff:** Command ceremony (constructor + execute + named private methods) is overhead for functions without genuine multi-step state; the agent now navigates a class where one function used to suffice.

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

**Removes smells:** Long Function

---
name: replace-command-with-function
description: Apply Replace Command with Function when you see Speculative Generality, Lazy Element. The command collapses to a plain function; the agent's call sites become direct invocations.
---

# Apply: 49 — Replace Command with Function

**Target state:** The command collapses to a plain function; the agent's call sites become direct invocations.

**Why apply it:** Fewer files; shorter call stacks; the agent's plan-and-execute loop touches the function directly without the construct-then-call hop.

**Tradeoff:** If the command held genuinely useful intermediate state, collapsing regrows the temps it eliminated; the agent verifying the collapse must check whether any internal decomposition is load-bearing.

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

**Removes smells:** Speculative Generality, Lazy Element

---
name: return-modified-value
description: Apply Return Modified Value when you see Mutable Data. The function returns the modified value; the agent reads the signature and knows the function is a transformation, not a mutator.
---

# Apply: 50 — Return Modified Value

**Target state:** The function returns the modified value; the agent reads the signature and knows the function is a transformation, not a mutator.

**Why apply it:** Side effects on inputs disappear from the agent's contract reasoning; the function reads as a pure transformation; composition and snapshotting work.

**Tradeoff:** Callers must remember to capture the returned value; if any forget they keep the unmodified original, which the agent verifying must check at every call site (or rely on a readonly parameter type).

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

**Removes smells:** Mutable Data

---
name: substitute-algorithm
description: Apply Substitute Algorithm when you see Long Function, Loops. The clearer algorithm replaces the bespoke; the agent reasons about a recognized pattern instead of reverse-engineering the original.
---

# Apply: 51 — Substitute Algorithm

**Target state:** The clearer algorithm replaces the bespoke; the agent reasons about a recognized pattern instead of reverse-engineering the original.

**Why apply it:** The agent recognizes the algorithm by name and reasons about it via its standard properties; correctness arguments become reusable.

**Tradeoff:** Swapping algorithms wholesale forfeits behavioral safety unless every input boundary is characterized first; the agent that substitutes without characterization tests ships silent regressions.

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

**Removes smells:** Long Function, Loops

### Encapsulation

---
name: encapsulate-variable
description: Apply Encapsulate Variable when you see Global Data, Mutable Data. All access goes through a small named function the agent can grep for, audit, and instrument as a single closed surface.
---

# Apply: 06 — Encapsulate Variable

**Target state:** All access goes through a small named function the agent can grep for, audit, and instrument as a single closed surface.

**Why apply it:** The agent has one audit point for validation/logging/invariants; consumers don't need to change when the wrapper grows new behavior.

**Tradeoff:** Indirection at every call site adds a hop; if any consumer leaks past the wrapper, the encapsulation's safety promise silently breaks and the agent assumes guarantees that don't hold.

```js
// Avoid:
let defaultOwner = { firstName: 'Martin', lastName: 'Fowler' };

// Prefer:
let _defaultOwner = { firstName: 'Martin', lastName: 'Fowler' };
function defaultOwner() { return _defaultOwner; }
function setDefaultOwner(o) { _defaultOwner = o; }
```

**Removes smells:** Global Data, Mutable Data

---
name: hide-delegate
description: Apply Hide Delegate when you see Message Chains. Callers ask the closest object directly; the agent reasons about one boundary instead of traversing N.
---

# Apply: 41 — Hide Delegate

**Target state:** Callers ask the closest object directly; the agent reasons about one boundary instead of traversing N.

**Why apply it:** Encapsulation tightens; the agent reasons about one boundary; intermediate objects can change shape without breaking callers.

**Tradeoff:** Each hidden delegate adds a passthrough method on the host; for chains used in one place the passthrough is overhead the agent now maintains in two places.

```js
// Avoid:
const street = order.customer.address.street;

// Prefer:
// inside Order: customerStreet() { return this.customer.address.street; }
const street = order.customerStreet();
```

**Removes smells:** Message Chains

---
name: remove-middle-man
description: Apply Remove Middle Man when you see Middle Man. Callers talk to the real object directly; the agent's call traces are shorter and the implementation's location is obvious.
---

# Apply: 42 — Remove Middle Man

**Target state:** Callers talk to the real object directly; the agent's call traces are shorter and the implementation's location is obvious.

**Why apply it:** Fewer files; shorter call stacks; the agent's plan-and-execute loop touches the real implementation directly.

**Tradeoff:** Direct access exposes the real object's full surface to every consumer; the agent loses any encapsulation the middle man was providing (even if mostly cosmetic).

```js
// Avoid:
class Manager {
  reports() { return this.team.members(); }
}

// Prefer:
// Expose team directly when the wrapper adds nothing.
manager.team.members();
```

**Removes smells:** Middle Man

---
name: encapsulate-collection
description: Apply Encapsulate Collection when you see Mutable Data, Insider Trading. The owner exposes mutation methods (add, remove, replace); reads return snapshots or iterators; the agent reasons about collection invariants on the owner alone.
---

# Apply: 52 — Encapsulate Collection

**Target state:** The owner exposes mutation methods (add, remove, replace); reads return snapshots or iterators; the agent reasons about collection invariants on the owner alone.

**Why apply it:** The owner enforces invariants in one place; the agent refactoring the collection's internal shape stays local to the owner.

**Tradeoff:** Returning a shallow copy on every read can hide bugs where callers expected mutation-back; the agent must be explicit about the read contract or risk silent no-ops.

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

**Removes smells:** Mutable Data, Insider Trading

---
name: encapsulate-record
description: Apply Encapsulate Record when you see Data Class, Primitive Obsession. The record is a class with accessors; the agent reasons about its shape, invariants, and behavior in one definition.
---

# Apply: 53 — Encapsulate Record

**Target state:** The record is a class with accessors; the agent reasons about its shape, invariants, and behavior in one definition.

**Why apply it:** Field renames stay internal; invariants enforce in one place; the agent reasons about the class as a real domain object.

**Tradeoff:** Wrapping every record adds construction ceremony at every entry; for records without invariants or behavior to attract, the agent gains nothing for the per-call cost.

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

**Removes smells:** Data Class, Primitive Obsession

---
name: remove-setting-method
description: Apply Remove Setting Method when you see Mutable Data, Data Class. Construction is the only path to setting these fields; the agent reasons about the object as immutable-after-construction.
---

# Apply: 54 — Remove Setting Method

**Target state:** Construction is the only path to setting these fields; the agent reasons about the object as immutable-after-construction.

**Why apply it:** The agent reasons about the class as immutable-after-construction; bugs from late mutation vanish; the API expresses what users can actually do.

**Tradeoff:** Removing a setter forces every legitimate update through a more meaningful method; the agent must verify each setter call has a domain action that justifies replacing it.

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

**Removes smells:** Mutable Data, Data Class

### Moving Features

---
name: move-function
description: Apply Move Function when you see Feature Envy, Shotgun Surgery, Insider Trading, Divergent Change. Each function lives where its data lives; the agent loads one class to reason about one behavior.
---

# Apply: 12 — Move Function

**Target state:** Each function lives where its data lives; the agent loads one class to reason about one behavior.

**Why apply it:** The function's data sits inside the agent's current reasoning context; verifying behavior touches one class instead of two.

**Tradeoff:** Dependencies don't always travel cleanly — circular imports surface at the destination, and the agent's mental map of 'where does this live' briefly breaks until indices refresh.

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

**Removes smells:** Feature Envy, Shotgun Surgery, Insider Trading, Divergent Change

---
name: move-field
description: Apply Move Field when you see Shotgun Surgery, Insider Trading. Each field lives where its lifecycle is owned; the agent loads one class to reason about both the field and its determining data.
---

# Apply: 13 — Move Field

**Target state:** Each field lives where its lifecycle is owned; the agent loads one class to reason about both the field and its determining data.

**Why apply it:** Class boundaries align with data ownership; the agent reasons about mutations locally; refactoring becomes safer because the field's true owner is visible.

**Tradeoff:** Every reader of the original class now reaches across the new boundary; coupling drops at the field's new home but reappears at each consumer the agent must follow.

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

**Removes smells:** Shotgun Surgery, Insider Trading

---
name: extract-class
description: Apply Extract Class when you see Data Clumps, Temporary Field, Large Class, Primitive Obsession. A cohesive sub-concept inside a class becomes its own class with its own name, fields, and methods.
---

# Apply: 39 — Extract Class

**Target state:** A cohesive sub-concept inside a class becomes its own class with its own name, fields, and methods.

**Why apply it:** Each class has one purpose; tests target the small unit; the parent class shrinks.

**Tradeoff:** Premature class extraction adds ceremony — extract when 3+ fields and at least one operation cluster around a single concept that the parent class doesn't own.

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

**Removes smells:** Data Clumps, Temporary Field, Large Class, Primitive Obsession

---
name: inline-class
description: Apply Inline Class when you see Lazy Element, Speculative Generality. A class with too few responsibilities to deserve its own file folds into a class it collaborates with most.
---

# Apply: 55 — Inline Class

**Target state:** A class with too few responsibilities to deserve its own file folds into a class it collaborates with most.

**Why apply it:** Fewer files, fewer constructors, shorter call paths; the absorbing class's coherence improves when it gains the methods it was already orchestrating.

**Tradeoff:** If the absorbing class was already large, inlining piles more onto it — fold in only when the absorber stays under its complexity budget afterward.

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

**Removes smells:** Lazy Element, Speculative Generality

### Organizing Data

---
name: replace-primitive-with-object
description: Apply Replace Primitive with Object when you see Primitive Obsession. Each domain concept has a small typed home — Money, PhoneNumber, OrderId — that knows its rules.
---

# Apply: 40 — Replace Primitive with Object

**Target state:** Each domain concept has a small typed home — Money, PhoneNumber, OrderId — that knows its rules.

**Why apply it:** Misuse becomes a type error; behavior accretes around the concept; refactoring is local to the wrapper.

**Tradeoff:** Wrapping every primitive is overkill — wrap when the concept needs validation, formatting, or domain-specific behavior beyond what the primitive offers.

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

**Removes smells:** Primitive Obsession

---
name: change-reference-to-value
description: Apply Change Reference to Value when you see Mutable Data. An object treated as a sharable record (with setters) becomes a value object — immutable, equal by content, replaced rather than mutated.
---

# Apply: 56 — Change Reference to Value

**Target state:** An object treated as a sharable record (with setters) becomes a value object — immutable, equal by content, replaced rather than mutated.

**Why apply it:** Concurrency hazards disappear; the type system can mark fields readonly; the object can travel safely across boundaries.

**Tradeoff:** Comparison semantics shift from identity to equality — every call site that depended on `===` or identity caches needs review.

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

**Removes smells:** Mutable Data

---
name: change-value-to-reference
description: Apply Change Value to Reference when you see Duplicated Code. Duplicate copies of a logically-single entity collapse into one shared object that everyone references.
---

# Apply: 57 — Change Value to Reference

**Target state:** Duplicate copies of a logically-single entity collapse into one shared object that everyone references.

**Why apply it:** Updates to the entity are visible everywhere; storage shrinks; identity becomes meaningful again.

**Tradeoff:** Sharing introduces the question 'who owns this?' — make sure the lifetime and visibility of the shared reference are well-defined.

```js
// Avoid:
// every order carries its own Customer copy
orders.forEach(o => o.customer = { name: 'Acme' });

// Prefer:
const acme = customerRepository.find('Acme');
orders.forEach(o => o.customer = acme);
```

**Removes smells:** Duplicated Code

### Simplifying Conditional Logic

---
name: decompose-conditional
description: Apply Decompose Conditional when you see Long Function, Comments. Conditions and their consequents read as named domain decisions; isInSummer(), discountFor(date), etc.
---

# Apply: 21 — Decompose Conditional

**Target state:** Conditions and their consequents read as named domain decisions: isInSummer(), discountFor(date), etc.

**Why apply it:** The branching logic reads top-to-bottom as a story; bugs concentrate in the named pieces.

**Tradeoff:** Names that aren't crisper than the underlying condition add ceremony — only extract when the named function/variable says something the condition can't.

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

**Removes smells:** Long Function, Comments

---
name: consolidate-conditional-expression
description: Apply Consolidate Conditional Expression when you see Duplicated Code. Multiple conditions leading to the same action collapse into one named predicate.
---

# Apply: 22 — Consolidate Conditional Expression

**Target state:** Multiple conditions leading to the same action collapse into one named predicate.

**Why apply it:** The shared rationale becomes visible and namable; new conditions extend one place instead of N.

**Tradeoff:** Combining conditions can hide their independent reasons — only consolidate when they truly express the same business rule.

```js
// Avoid:
if (employee.seniority < 2)        return 0;
if (employee.monthsDisabled > 12)  return 0;
if (employee.isPartTime)           return 0;

// Prefer:
if (isIneligibleForBonus(employee)) return 0;
```

**Removes smells:** Duplicated Code

---
name: replace-nested-conditional-with-guard-clauses
description: Apply Replace Nested Conditional with Guard Clauses when you see Long Function, Comments. Edge cases bail out early at the top of the function; the main flow is unindented and tells the happy path linearly.
---

# Apply: 23 — Replace Nested Conditional with Guard Clauses

**Target state:** Edge cases bail out early at the top of the function; the main flow is unindented and tells the happy path linearly.

**Why apply it:** Indentation drops; the dominant case is obvious; new edge cases land at the top without disturbing the rest.

**Tradeoff:** If multiple paths share work, premature returns can duplicate that work — extract first, then guard.

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

**Removes smells:** Long Function, Comments

---
name: replace-conditional-with-polymorphism
description: Apply Replace Conditional with Polymorphism when you see Repeated Switches, Primitive Obsession. Each case is a class implementing a shared interface; the agent adds a new case by adding one class, and the type system tells it what's still missing.
---

# Apply: 24 — Replace Conditional with Polymorphism

**Target state:** Each case is a class implementing a shared interface; the agent adds a new case by adding one class, and the type system tells it what's still missing.

**Why apply it:** Adding a new variant is mechanical and the type checker enforces completeness; the agent's plan-and-execute loop for new cases is bounded.

**Tradeoff:** Polymorphic dispatch is implicit at call sites — the agent can no longer see the full set of branches in one place and must enumerate subclasses across files to reason about behavior.

```js
// Avoid:
switch (event.kind) {
  case 'click': return onClick(event);
  case 'key':   return onKey(event);
}

// Prefer:
event.handle(); // ClickEvent and KeyEvent each implement handle()
```

**Removes smells:** Repeated Switches, Primitive Obsession

---
name: introduce-special-case
description: Apply Introduce Special Case when you see Repeated Switches, Comments. A repeating null-or-special check becomes a Null Object (or Special Case) that responds sensibly to the same interface.
---

# Apply: 25 — Introduce Special Case

**Target state:** A repeating null-or-special check becomes a Null Object (or Special Case) that responds sensibly to the same interface.

**Why apply it:** Callers stop branching on identity; the special behavior lives in one place.

**Tradeoff:** Adds a tiny class for one case; only worthwhile when the special case appears in 2+ consumers.

```js
// Avoid:
const name = customer === 'unknown' ? 'occupant' : customer.name;

// Prefer:
const name = customer.name; // UnknownCustomer.name returns 'occupant'
```

**Removes smells:** Repeated Switches, Comments

---
name: replace-control-flag-with-break
description: Apply Replace Control Flag with Break when you see Loops, Long Function. Loops that maintain a boolean to decide when to stop replace it with a direct `break`, `return`, or `continue`.
---

# Apply: 58 — Replace Control Flag with Break

**Target state:** Loops that maintain a boolean to decide when to stop replace it with a direct `break`, `return`, or `continue`.

**Why apply it:** The exit condition appears at the moment it's decided, not as a delayed effect of a flag check; the loop's intent becomes literal.

**Tradeoff:** If the loop body is large, the break can hide the early-exit semantics — extract a function around the loop's body to keep the exit obvious.

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

**Removes smells:** Loops, Long Function

### Refactoring APIs

---
name: change-function-declaration
description: Apply Change Function Declaration when you see Mysterious Name, Long Parameter List, Alternative Classes with Different Interfaces. Function names match what they actually do; parameter lists carry only what the function needs, in the order callers expect.
---

# Apply: 05 — Change Function Declaration

**Target state:** Function names match what they actually do; parameter lists carry only what the function needs, in the order callers expect.

**Why apply it:** Call sites read fluently; mismatches between expectation and behavior surface immediately at the boundary.

**Tradeoff:** Every caller pays for the signature change at once, even those whose call sites were already fine; other-team callers get forced coordination.

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

**Removes smells:** Mysterious Name, Long Parameter List, Alternative Classes with Different Interfaces

---
name: introduce-parameter-object
description: Apply Introduce Parameter Object when you see Long Parameter List, Data Clumps. Related arguments travel together as one well-named value object that the function (and callers) refer to by name.
---

# Apply: 08 — Introduce Parameter Object

**Target state:** Related arguments travel together as one well-named value object that the function (and callers) refer to by name.

**Why apply it:** Adding a related field is one type change instead of touching every call site; intent is named.

**Tradeoff:** Premature parameter objects hide which fields are actually needed by which method — wait until the clump appears in 3+ places before extracting.

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

**Removes smells:** Long Parameter List, Data Clumps

---
name: introduce-assertion
description: Apply Introduce Assertion when you see Comments, Mutable Data. Invariants the code assumes are stated explicitly; readers don't need to deduce them.
---

# Apply: 26 — Introduce Assertion

**Target state:** Invariants the code assumes are stated explicitly; readers don't need to deduce them.

**Why apply it:** Bugs that violate the invariant fail loudly at the source instead of bubbling out as mysterious downstream errors.

**Tradeoff:** Assertions used as control flow couple production behavior to debug-mode invariants — keep them as runtime contracts that should never fire.

```js
// Avoid:
// rate must be positive
const tax = base * rate;

// Prefer:
if (rate <= 0) throw new Error('rate must be positive');
const tax = base * rate;
```

**Removes smells:** Comments, Mutable Data

---
name: separate-query-from-modifier
description: Apply Separate Query from Modifier when you see Mutable Data. Functions either return a value or mutate state, never both — callers can compose them without surprise.
---

# Apply: 27 — Separate Query from Modifier

**Target state:** Functions either return a value or mutate state, never both — callers can compose them without surprise.

**Why apply it:** Reasoning about side effects is local; tests target each shape independently.

**Tradeoff:** If the modification and the query truly cannot be separated (e.g. find-and-remove on a queue), the constraint is fundamental — leave the combined operation but document it.

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

**Removes smells:** Mutable Data

---
name: parameterize-function
description: Apply Parameterize Function when you see Duplicated Code. Two near-identical functions that differ only in literal values combine into one with a parameter.
---

# Apply: 28 — Parameterize Function

**Target state:** Two near-identical functions that differ only in literal values combine into one with a parameter.

**Why apply it:** One canonical implementation; new variations are new parameter values, not new functions.

**Tradeoff:** If the variations are conceptually different operations, one parameterized function will accumulate flags and special cases — keep them separate then.

```js
// Avoid:
function tenPercentRaise(person)  { person.salary *= 1.10; }
function fivePercentRaise(person) { person.salary *= 1.05; }

// Prefer:
function raise(person, factor) { person.salary *= 1 + factor; }
```

**Removes smells:** Duplicated Code

---
name: remove-flag-argument
description: Apply Remove Flag Argument when you see Long Parameter List. Each flag value becomes its own well-named function; callers say what they mean rather than passing booleans.
---

# Apply: 29 — Remove Flag Argument

**Target state:** Each flag value becomes its own well-named function; callers say what they mean rather than passing booleans.

**Why apply it:** Call sites read fluently; new variations land as new functions instead of new switch cases.

**Tradeoff:** Two replacement functions with similar bodies introduce duplication — pair this with Extract Function for shared internals.

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

**Removes smells:** Long Parameter List

---
name: preserve-whole-object
description: Apply Preserve Whole Object when you see Long Parameter List, Data Clumps. Instead of pulling several values out of an object to pass them in, pass the object itself.
---

# Apply: 30 — Preserve Whole Object

**Target state:** Instead of pulling several values out of an object to pass them in, pass the object itself.

**Why apply it:** Signatures shrink; adding a needed field is internal; consumers don't have to plumb new arguments through.

**Tradeoff:** Passing the whole object adds coupling to its full surface — only do this when the called function might reasonably need other parts of the object.

```js
// Avoid:
if (room.lowTemp < range.low || room.highTemp > range.high) { /* ... */ }

// Prefer:
if (range.includes(room)) { /* ... */ }
```

**Removes smells:** Long Parameter List, Data Clumps

---
name: replace-parameter-with-query
description: Apply Replace Parameter with Query when you see Long Parameter List. When a function can compute its own answer from already-available state, callers don't have to pre-compute it.
---

# Apply: 31 — Replace Parameter with Query

**Target state:** When a function can compute its own answer from already-available state, callers don't have to pre-compute it.

**Why apply it:** Signatures shrink; consumers stop doing the function's homework.

**Tradeoff:** If the query has side effects or is expensive, passing the value is genuinely better — only replace when the query is pure and cheap.

```js
// Avoid:
const basePrice = order.qty * order.itemPrice;
const level = discountLevel(order);
const final = discounted(order, basePrice, level);

// Prefer:
const final = discounted(order); // computes basePrice and level itself
```

**Removes smells:** Long Parameter List

---
name: replace-query-with-parameter
description: Apply Replace Query with Parameter when you see Mutable Data, Insider Trading. A function that reads from a query (global, singleton, instance state) instead accepts the value as a parameter and becomes referentially transparent.
---

# Apply: 59 — Replace Query with Parameter

**Target state:** A function that reads from a query (global, singleton, instance state) instead accepts the value as a parameter and becomes referentially transparent.

**Why apply it:** The function becomes testable in isolation; its dependencies are visible in its signature; pure-function reasoning becomes possible.

**Tradeoff:** Passing the value pushes the responsibility onto callers; for many call sites, signatures grow noisily — prefer this when the query touches global or volatile state.

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

**Removes smells:** Mutable Data, Insider Trading

---
name: replace-constructor-with-factory-function
description: Apply Replace Constructor with Factory Function when you see Primitive Obsession, Speculative Generality. Object creation goes through a named function that can validate, choose subclasses, or return cached instances.
---

# Apply: 32 — Replace Constructor with Factory Function

**Target state:** Object creation goes through a named function that can validate, choose subclasses, or return cached instances.

**Why apply it:** Construction can vary per case; consumers don't depend on which concrete class they're getting.

**Tradeoff:** Hides the actual class from callers — make sure your factory's name still expresses the produced shape clearly.

```js
// Avoid:
const employee = new Employee(name, 'engineer', salary);

// Prefer:
function createEngineer(name, salary) {
  return new Employee(name, 'engineer', salary);
}
const employee = createEngineer(name, salary);
```

**Removes smells:** Primitive Obsession, Speculative Generality

---
name: replace-error-code-with-exception
description: Apply Replace Error Code with Exception when you see Comments. Numeric or string error codes that callers must remember to check are replaced with exceptions that propagate by default.
---

# Apply: 60 — Replace Error Code with Exception

**Target state:** Numeric or string error codes that callers must remember to check are replaced with exceptions that propagate by default.

**Why apply it:** Forgetting to check no longer silently swallows the error; the type system marks the failure path; cleanup happens via finally / try-with.

**Tradeoff:** Exceptions for predictable conditions misuse the mechanism — only convert codes that represent genuine, exceptional, unrecoverable failures.

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

**Removes smells:** Comments

---
name: replace-exception-with-precheck
description: Apply Replace Exception with Precheck when you see Comments. Exceptions used for predictable, checkable conditions become an explicit precheck the caller can perform, leaving exceptions for truly exceptional cases.
---

# Apply: 61 — Replace Exception with Precheck

**Target state:** Exceptions used for predictable, checkable conditions become an explicit precheck the caller can perform, leaving exceptions for truly exceptional cases.

**Why apply it:** The error path is local and visible; reading code top-to-bottom describes the rules rather than the failure response; debuggers stop catching benign throws.

**Tradeoff:** Race conditions: the precheck may pass and the operation still fail (TOCTOU). Use prechecks only for conditions the caller can verify without a race.

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

**Removes smells:** Comments

### Dealing with Inheritance

---
name: pull-up-method
description: Apply Pull Up Method when you see Duplicated Code, Alternative Classes with Different Interfaces. Methods that subclasses implement identically move to the shared superclass.
---

# Apply: 33 — Pull Up Method

**Target state:** Methods that subclasses implement identically move to the shared superclass.

**Why apply it:** One implementation, one place to fix; subclasses focus on what's actually different.

**Tradeoff:** If the methods only superficially resemble each other, pulling up creates a fake-shared abstraction — unify only when behavior is actually identical.

```js
// Avoid:
class Manager  extends Employee { name() { return this._name; } }
class Engineer extends Employee { name() { return this._name; } }

// Prefer:
class Employee { name() { return this._name; } }
class Manager  extends Employee {}
class Engineer extends Employee {}
```

**Removes smells:** Duplicated Code, Alternative Classes with Different Interfaces

---
name: push-down-method
description: Apply Push Down Method when you see Refused Bequest, Large Class. Methods used by only one subclass live with that subclass, not on the shared superclass.
---

# Apply: 34 — Push Down Method

**Target state:** Methods used by only one subclass live with that subclass, not on the shared superclass.

**Why apply it:** The superclass surface shrinks; subclasses that don't need the method aren't burdened by it.

**Tradeoff:** If the method is occasionally needed in the parent, pushing it down forces awkward type checks back at consumers — verify usage first.

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

**Removes smells:** Refused Bequest, Large Class

---
name: replace-type-code-with-subclasses
description: Apply Replace Type Code with Subclasses when you see Repeated Switches, Primitive Obsession. A 'kind' string field becomes a real subclass type; the type system enforces the legal set.
---

# Apply: 35 — Replace Type Code with Subclasses

**Target state:** A 'kind' string field becomes a real subclass type; the type system enforces the legal set.

**Why apply it:** Compile-time checks that no kind is missed; per-kind behavior lives where it belongs.

**Tradeoff:** If only one or two switches exist on the type code, subclassing is over-design; combine with Replace Conditional with Polymorphism only when dispatch repeats.

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

**Removes smells:** Repeated Switches, Primitive Obsession

---
name: extract-superclass
description: Apply Extract Superclass when you see Duplicated Code, Alternative Classes with Different Interfaces. Two classes with substantial shared structure get a common parent that owns the shared bits.
---

# Apply: 36 — Extract Superclass

**Target state:** Two classes with substantial shared structure get a common parent that owns the shared bits.

**Why apply it:** Bug fixes and new shared behavior land in one place; the relationship between the classes is documented in code.

**Tradeoff:** Inheritance is inflexible — if the duplication is shallow, prefer Extract Class (composition) over Extract Superclass.

```js
// Avoid:
class Employee   { name; id; salary; }
class Department { name; id; budget; }

// Prefer:
class Party       { name; id; }
class Employee   extends Party { salary; }
class Department extends Party { budget; }
```

**Removes smells:** Duplicated Code, Alternative Classes with Different Interfaces

---
name: collapse-hierarchy
description: Apply Collapse Hierarchy when you see Lazy Element, Speculative Generality. A subclass that no longer differs meaningfully from its parent merges back in.
---

# Apply: 37 — Collapse Hierarchy

**Target state:** A subclass that no longer differs meaningfully from its parent merges back in.

**Why apply it:** Smaller hierarchy, less ceremony, fewer files to navigate.

**Tradeoff:** Collapsing too eagerly destroys an extension point you'll later want — only collapse when the variant has been zero-sum for a sustained period.

```js
// Avoid:
class Employee {}
class FullTimeEmployee extends Employee {}

// Prefer:
class Employee {}
```

**Removes smells:** Lazy Element, Speculative Generality

---
name: replace-subclass-with-delegate
description: Apply Replace Subclass with Delegate when you see Refused Bequest, Insider Trading. Behavior that varied via inheritance now varies via a delegate object that implements the variant interface.
---

# Apply: 38 — Replace Subclass with Delegate

**Target state:** Behavior that varied via inheritance now varies via a delegate object that implements the variant interface.

**Why apply it:** Variants can be combined or swapped at runtime; Liskov violations vanish; the hierarchy tree flattens.

**Tradeoff:** Composition is more verbose at construction sites — accept the verbosity in exchange for the flexibility.

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

**Removes smells:** Refused Bequest, Insider Trading

---
name: pull-up-constructor-body
description: Apply Pull Up Constructor Body when you see Duplicated Code. Initialization code repeated across subclass constructors moves into the parent class's constructor and is called via super.
---

# Apply: 62 — Pull Up Constructor Body

**Target state:** Initialization code repeated across subclass constructors moves into the parent class's constructor and is called via super.

**Why apply it:** One canonical home for parent-state init; new subclasses inherit the setup for free; bug fixes apply uniformly.

**Tradeoff:** If only some subclasses share the init logic, pulling it up forces the others to opt out — verify the body is genuinely common.

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

**Removes smells:** Duplicated Code

---
name: pull-up-field
description: Apply Pull Up Field when you see Duplicated Code. A field declared identically in two or more subclasses moves to the shared superclass.
---

# Apply: 63 — Pull Up Field

**Target state:** A field declared identically in two or more subclasses moves to the shared superclass.

**Why apply it:** One source of truth for the field's type and default; subclasses focus on what they actually specialize.

**Tradeoff:** Pulling up a field that subclasses use differently (different default, different visibility) creates surprise — verify the field semantics are identical.

```js
// Avoid:
class Manager  extends Employee { _name; }
class Engineer extends Employee { _name; }

// Prefer:
class Employee { _name; }
class Manager  extends Employee {}
class Engineer extends Employee {}
```

**Removes smells:** Duplicated Code

---
name: push-down-field
description: Apply Push Down Field when you see Refused Bequest, Large Class. A field used by only one subclass moves out of the parent and into that subclass.
---

# Apply: 64 — Push Down Field

**Target state:** A field used by only one subclass moves out of the parent and into that subclass.

**Why apply it:** Other subclasses no longer carry storage they ignore; the parent's surface shrinks; the field's meaning becomes local.

**Tradeoff:** If the field is occasionally consulted in the parent for type checks, pushing it down forces awkward downcasts — verify usage first.

```js
// Avoid:
class Employee {
  quota; // only Salesperson uses this
}

// Prefer:
class Employee {}
class Salesperson extends Employee { quota; }
```

**Removes smells:** Refused Bequest, Large Class

---
name: remove-subclass
description: Apply Remove Subclass when you see Lazy Element, Speculative Generality. A subclass whose only purpose was to encode a type code or add nothing collapses back into a field on the parent.
---

# Apply: 65 — Remove Subclass

**Target state:** A subclass whose only purpose was to encode a type code or add nothing collapses back into a field on the parent.

**Why apply it:** Smaller hierarchy; new variants are field values instead of new files; the parent regains its variability point as data.

**Tradeoff:** Removing a subclass referenced by name elsewhere (factories, registries) breaks those references — confirm no consumer is type-testing the subclass.

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

**Removes smells:** Lazy Element, Speculative Generality

---
name: replace-superclass-with-delegate
description: Apply Replace Superclass with Delegate when you see Refused Bequest, Insider Trading. Inheritance from a superclass that doesn't really fit (Liskov violations, awkward methods) becomes composition; the former subclass holds an instance and delegates explicitly.
---

# Apply: 66 — Replace Superclass with Delegate

**Target state:** Inheritance from a superclass that doesn't really fit (Liskov violations, awkward methods) becomes composition: the former subclass holds an instance and delegates explicitly.

**Why apply it:** The misleading is-a relationship disappears; the former subclass can change its delegate's class without affecting its callers.

**Tradeoff:** Adds a forwarding method on the former subclass for every method the old superclass exposed — only worth it when the superclass relationship is misleading.

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

**Removes smells:** Refused Bequest, Insider Trading

---

## Code smells

---
name: mysterious-name
description: Refuse Mysterious Name when token-level identifiers don't disambiguate scope or domain — the agent must load surrounding context to answer 'what does this variable hold?' before any reasoning step succeeds. Apply Change Function Declaration, Rename Variable.
---

# Refuse: 01 — Mysterious Name

**Trigger (refuse when you see):** Token-level identifiers don't disambiguate scope or domain — the agent must load surrounding context to answer 'what does this variable hold?' before any reasoning step succeeds.

**Cost of leaving it in:** Every reasoning pass re-derives meaning from surrounding context; chained edits compound the cost and increase the chance of hallucinating a misread.

**Target shape after refactoring:** Identifiers carry enough disambiguating information that the agent can reason about each symbol without a lookup hop.

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

**Apply refactorings:** Change Function Declaration, Rename Variable, Rename Field

---
name: duplicated-code
description: Refuse Duplicated Code when near-identical code appears in multiple files; every reasoning step about one copy must either deliberately ignore the others or repeat itself across them. Apply Extract Function, Slide Statements.
---

# Refuse: 02 — Duplicated Code

**Trigger (refuse when you see):** Near-identical code appears in multiple files; every reasoning step about one copy must either deliberately ignore the others or repeat itself across them.

**Cost of leaving it in:** Edits propagate by hand across copies; the agent must remember to find every clone or ship inconsistent behavior that silently passes unit tests targeting only one copy.

**Target shape after refactoring:** One canonical implementation the agent loads once and reasons about once, with variation parameterized at the call site.

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

**Apply refactorings:** Extract Function, Slide Statements, Pull Up Method

---
name: long-function
description: Refuse Long Function when a function whose token count exceeds the agent's reliable chunk-reasoning budget; verifying behavior preservation requires re-reading the entire span on every edit. Apply Extract Function, Replace Temp with Query.
---

# Refuse: 03 — Long Function

**Trigger (refuse when you see):** A function whose token count exceeds the agent's reliable chunk-reasoning budget; verifying behavior preservation requires re-reading the entire span on every edit.

**Cost of leaving it in:** Every edit pays full re-read cost; chained changes compound context usage and increase the chance of missing a cross-statement invariant.

**Target shape after refactoring:** Each function is a verifiable unit small enough that the agent can reason about its full behavior in a single reasoning step.

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

**Apply refactorings:** Extract Function, Replace Temp with Query, Introduce Parameter Object, Preserve Whole Object, Replace Function with Command, Decompose Conditional, Split Loop, Replace Loop with Pipeline, Replace Control Flag with Break

---
name: long-parameter-list
description: Refuse Long Parameter List when a signature with so many positional parameters that the agent must look up the function definition (or call-site documentation) before any invocation succeeds. Apply Replace Parameter with Query, Preserve Whole Object.
---

# Refuse: 04 — Long Parameter List

**Trigger (refuse when you see):** A signature with so many positional parameters that the agent must look up the function definition (or call-site documentation) before any invocation succeeds.

**Cost of leaving it in:** Every call site is a chance to misorder arguments or miss one entirely; even with a type checker the agent pays a lookup cost on every invocation.

**Target shape after refactoring:** Each parameter is either a domain concept the agent recognizes, or it's bundled into a named object the agent can pass through without unpacking.

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

**Apply refactorings:** Replace Parameter with Query, Preserve Whole Object, Introduce Parameter Object, Remove Flag Argument, Combine Functions into Class

---
name: global-data
description: Refuse Global Data when a module-level variable mutated from anywhere — the agent reading any single call site cannot bound its impact without scanning every consumer. Apply Encapsulate Variable.
---

# Refuse: 05 — Global Data

**Trigger (refuse when you see):** A module-level variable mutated from anywhere — the agent reading any single call site cannot bound its impact without scanning every consumer.

**Cost of leaving it in:** Behavior depends on hidden write-order between callers the agent must discover one at a time; tracing any bug requires reconstructing a global mutation timeline.

**Target shape after refactoring:** All reads and writes go through a named function the agent can grep for, find every consumer of, and reason about as a closed surface.

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

**Apply refactorings:** Encapsulate Variable

---
name: mutable-data
description: Refuse Mutable Data when fields the agent finds reassigned across multiple files with no obvious owner; reasoning about state at any moment requires tracing every writer. Apply Encapsulate Variable, Split Variable.
---

# Refuse: 06 — Mutable Data

**Trigger (refuse when you see):** Fields the agent finds reassigned across multiple files with no obvious owner; reasoning about state at any moment requires tracing every writer.

**Cost of leaving it in:** The agent cannot answer 'what is this value here?' without modeling the full timeline of writes; concurrent reasoning becomes practically impossible.

**Target shape after refactoring:** Mutation happens behind a named function with a clear contract, or the data is replaced rather than modified — the agent can locate every change in one place.

```js
// Smellier:
const order = { total: 100 };
applyDiscount(order); // mutates total
addTax(order);        // mutates total

// Fresher:
const order = { total: 100 };
const final = addTax(applyDiscount(order));
```

**Apply refactorings:** Encapsulate Variable, Split Variable, Slide Statements, Extract Function, Separate Query from Modifier, Remove Setting Method, Replace Derived Variable with Query, Combine Functions into Class, Combine Functions into Transform, Change Reference to Value

---
name: divergent-change
description: Refuse Divergent Change when reading the module, the agent constantly switches between conceptually unrelated regions (tax logic, UI logic, API logic); every cross-axis edit requires loading and reasoning about all of them. Apply Split Phase, Move Function.
---

# Refuse: 07 — Divergent Change

**Trigger (refuse when you see):** Reading the module, the agent constantly switches between conceptually unrelated regions (tax logic, UI logic, API logic); every cross-axis edit requires loading and reasoning about all of them.

**Cost of leaving it in:** Any single conceptual change touches code that also implements unrelated concerns; the agent must verify it didn't break the other axes on every edit.

**Target shape after refactoring:** Each module varies along one axis; the agent loading it can predict what kinds of changes will touch it and bring only the relevant context.

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

**Apply refactorings:** Split Phase, Move Function, Extract Function, Extract Class

---
name: shotgun-surgery
description: Refuse Shotgun Surgery when a single conceptual edit forces the agent to identify, load, and modify many small sites — each one cheap individually but the search and completeness check is expensive. Apply Move Function, Move Field.
---

# Refuse: 08 — Shotgun Surgery

**Trigger (refuse when you see):** A single conceptual edit forces the agent to identify, load, and modify many small sites — each one cheap individually but the search and completeness check is expensive.

**Cost of leaving it in:** Every change carries a risk of missing a site the agent didn't grep for; reviewers (human or agent) can't easily verify completeness without re-running the same search.

**Target shape after refactoring:** All code that varies together sits in one place; the agent loads one module to make any change along this axis and verifies completeness in one read.

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

**Apply refactorings:** Move Function, Move Field, Combine Functions into Class, Combine Functions into Transform, Split Phase, Inline Function, Inline Class

---
name: feature-envy
description: Refuse Feature Envy when a method's body references foreign-class data more than its own; the agent loading this method must also load the foreign class to verify any change. Apply Move Function, Extract Function.
---

# Refuse: 09 — Feature Envy

**Trigger (refuse when you see):** A method's body references foreign-class data more than its own; the agent loading this method must also load the foreign class to verify any change.

**Cost of leaving it in:** Each call to the envious method pulls a second class into the agent's working context; chained reasoning across the boundary compounds the load.

**Target shape after refactoring:** Method bodies stay close to the data they read — the agent loads one class to reason about one behavior.

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

**Apply refactorings:** Move Function, Extract Function

---
name: data-clumps
description: Refuse Data Clumps when the agent sees the same field group appearing across multiple signatures (parameters, fields, args) — every site re-parses the same shape and verifies the same ordering. Apply Extract Class, Introduce Parameter Object.
---

# Refuse: 10 — Data Clumps

**Trigger (refuse when you see):** The agent sees the same field group appearing across multiple signatures (parameters, fields, args) — every site re-parses the same shape and verifies the same ordering.

**Cost of leaving it in:** Adding or removing a field of the clump means touching every site; the agent must find them all and update each consistently or risk silent shape drift.

**Target shape after refactoring:** The clump becomes a named value object the agent passes through as a single token; structure validation happens once at construction.

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

**Apply refactorings:** Extract Class, Introduce Parameter Object, Preserve Whole Object

---
name: primitive-obsession
description: Refuse Primitive Obsession when function signatures use raw strings and numbers where domain concepts hide; the agent cannot tell from the type whether an argument is the right kind of thing. Apply Replace Primitive with Object, Replace Type Code with Subclasses.
---

# Refuse: 11 — Primitive Obsession

**Trigger (refuse when you see):** Function signatures use raw strings and numbers where domain concepts hide; the agent cannot tell from the type whether an argument is the right kind of thing.

**Cost of leaving it in:** The agent must inspect call-site context (variable names, surrounding code) to verify a primitive is the right kind; validation and formatting logic scatters across consumers.

**Target shape after refactoring:** Each domain concept has its own typed wrapper; the agent's type checker catches wrong-primitive-in-wrong-slot mistakes before runtime.

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

**Apply refactorings:** Replace Primitive with Object, Replace Type Code with Subclasses, Replace Conditional with Polymorphism, Extract Class, Introduce Parameter Object

---
name: repeated-switches
description: Refuse Repeated Switches when the agent finds the same switch (or if/else chain) over a type code in multiple files; adding a new case requires the agent to grep for every site and update each consistently. Apply Replace Conditional with Polymorphism.
---

# Refuse: 12 — Repeated Switches

**Trigger (refuse when you see):** The agent finds the same switch (or if/else chain) over a type code in multiple files; adding a new case requires the agent to grep for every site and update each consistently.

**Cost of leaving it in:** Dispatch logic duplicates across files; new cases are easy to miss; chained edits across all switch sites compound the agent's review burden per change.

**Target shape after refactoring:** Each case is a class implementing a shared interface; the agent adds a new case by adding one class, and the type checker tells it what's still missing.

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

**Apply refactorings:** Replace Conditional with Polymorphism

---
name: loops
description: Refuse Loops when imperative for/while loops where filter, map, and reduce concerns are mixed by hand; the agent cannot tell what the loop is producing without mentally executing it. Apply Replace Loop with Pipeline.
---

# Refuse: 13 — Loops

**Trigger (refuse when you see):** Imperative for/while loops where filter, map, and reduce concerns are mixed by hand; the agent cannot tell what the loop is producing without mentally executing it.

**Cost of leaving it in:** The agent must mentally execute the loop to learn its result; off-by-one and accumulator bugs hide in the body and only surface at test time.

**Target shape after refactoring:** The transformation reads as a sequence of named operations; the agent recognizes the shape (filter, map, reduce) without simulating the loop.

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

**Apply refactorings:** Replace Loop with Pipeline

---
name: lazy-element
description: Refuse Lazy Element when a class, function, or namespace whose body the agent traces through only to find no decisions or transformations — every hop is pure overhead in reasoning context. Apply Inline Function, Inline Class.
---

# Refuse: 14 — Lazy Element

**Trigger (refuse when you see):** A class, function, or namespace whose body the agent traces through only to find no decisions or transformations — every hop is pure overhead in reasoning context.

**Cost of leaving it in:** The agent navigates through layers that add nothing; future maintainers (human or agent) face a choice between leaving dead weight or extracting a real reason for it.

**Target shape after refactoring:** Trivial wrappers disappear; the call site reads exactly as what's happening and the agent skips the indirection.

```js
// Smellier:
function getName(user) {
  return user.name;
}
const n = getName(user);

// Fresher:
const n = user.name;
```

**Apply refactorings:** Inline Function, Inline Class, Collapse Hierarchy

---
name: speculative-generality
description: Refuse Speculative Generality when abstract base classes, hooks, configuration knobs, or parameters with no real call site exercising them — the agent must learn vocabulary it never gets to use. Apply Collapse Hierarchy, Inline Function.
---

# Refuse: 15 — Speculative Generality

**Trigger (refuse when you see):** Abstract base classes, hooks, configuration knobs, or parameters with no real call site exercising them — the agent must learn vocabulary it never gets to use.

**Cost of leaving it in:** Tests cover branches no one exercises; readers (human and agent) learn dead vocabulary; refactoring proposals must consider phantom users that aren't real.

**Target shape after refactoring:** The code expresses exactly what it does today; the agent's mental model has no concepts that don't correspond to active behavior.

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

**Apply refactorings:** Collapse Hierarchy, Inline Function, Inline Class, Change Function Declaration, Remove Dead Code

---
name: temporary-field
description: Refuse Temporary Field when a class field the agent finds set to null or default for most of the object's lifetime, populated only inside one method's flow — the agent must verify which methods care. Apply Extract Class, Move Function.
---

# Refuse: 16 — Temporary Field

**Trigger (refuse when you see):** A class field the agent finds set to null or default for most of the object's lifetime, populated only inside one method's flow — the agent must verify which methods care.

**Cost of leaving it in:** The agent must trace the conditions under which the field is meaningful; null-checks scatter across consumers; class invariants weaken because the field has no defined lifecycle.

**Target shape after refactoring:** Temporary state lives in a dedicated class that exists only when relevant; the agent loads the temporary type only when reasoning about that flow.

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

**Apply refactorings:** Extract Class, Move Function, Introduce Special Case

---
name: message-chains
description: Refuse Message Chains when long dotted access paths the agent must trace through several object hops to understand any single read; renaming any intermediate field breaks every caller silently. Apply Hide Delegate, Extract Function.
---

# Refuse: 17 — Message Chains

**Trigger (refuse when you see):** Long dotted access paths the agent must trace through several object hops to understand any single read; renaming any intermediate field breaks every caller silently.

**Cost of leaving it in:** Every link in the chain is a coupling point the agent must hold in working memory; refactoring any intermediate shape requires the agent to find and update every chained access.

**Target shape after refactoring:** Callers ask the closest object for what they want; the agent reasons about one boundary instead of traversing N.

```js
// Smellier:
const street = order.customer.address.street;

// Fresher:
const street = order.customerStreet();
```

**Apply refactorings:** Hide Delegate, Extract Function, Move Function

---
name: middle-man
description: Refuse Middle Man when a class whose methods all delegate straight through to another object — the agent traces every call to the real implementation, paying a hop for no decision. Apply Remove Middle Man, Inline Function.
---

# Refuse: 18 — Middle Man

**Trigger (refuse when you see):** A class whose methods all delegate straight through to another object — the agent traces every call to the real implementation, paying a hop for no decision.

**Cost of leaving it in:** An entire indirection layer the agent must navigate per method; the agent reading code through the middle man re-traces the delegation on every reasoning step.

**Target shape after refactoring:** Callers talk to the real object directly; the agent's call traces are shorter and the real implementation's location is obvious.

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

**Apply refactorings:** Remove Middle Man, Inline Function, Replace Superclass with Delegate, Replace Subclass with Delegate

---
name: insider-trading
description: Refuse Insider Trading when module A reaches into module B's private fields or undocumented behavior; the agent reasoning about A must also load B's internals to make any change. Apply Move Function, Move Field.
---

# Refuse: 19 — Insider Trading

**Trigger (refuse when you see):** Module A reaches into module B's private fields or undocumented behavior; the agent reasoning about A must also load B's internals to make any change.

**Cost of leaving it in:** Refactoring one module silently breaks the other in ways the type system doesn't catch; the agent must trace cross-module assumptions on every edit.

**Target shape after refactoring:** Cooperation flows through a narrow named interface the agent can read once; A's reasoning context excludes B's implementation details.

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

**Apply refactorings:** Move Function, Move Field, Hide Delegate, Replace Subclass with Delegate, Replace Superclass with Delegate

---
name: large-class
description: Refuse Large Class when a class file with so many fields and methods that the agent cannot load it as a coherent unit; multiple unrelated responsibilities sit under one name. Apply Extract Class, Extract Superclass.
---

# Refuse: 20 — Large Class

**Trigger (refuse when you see):** A class file with so many fields and methods that the agent cannot load it as a coherent unit; multiple unrelated responsibilities sit under one name.

**Cost of leaving it in:** Cognitive context inflates with every irrelevant member; the agent reading any single method must skim past unrelated fields and helpers to find what it needs.

**Target shape after refactoring:** Each class has one cohesive purpose; the agent loads a small focused file to reason about any single behavior.

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

**Apply refactorings:** Extract Class, Extract Superclass, Replace Type Code with Subclasses

---
name: alternative-classes-with-different-interfaces
description: Refuse Alternative Classes with Different Interfaces when two classes the agent recognizes as doing similar things but with mismatched method names and signatures; the agent must learn both vocabularies and translate between them. Apply Change Function Declaration, Move Function.
---

# Refuse: 21 — Alternative Classes with Different Interfaces

**Trigger (refuse when you see):** Two classes the agent recognizes as doing similar things but with mismatched method names and signatures; the agent must learn both vocabularies and translate between them.

**Cost of leaving it in:** Substitution becomes copy-paste; abstraction over the two is impossible; the agent must hold both interfaces in working memory to use either.

**Target shape after refactoring:** Equivalent operations have equivalent signatures; the agent uses one mental model and the type system enforces substitutability.

```js
// Smellier:
class CSVExporter  { writeAll(rows) {} }
class JSONExporter { dump(data)     {} }

// Fresher:
class CSVExporter  implements Exporter { write(rows) {} }
class JSONExporter implements Exporter { write(rows) {} }
```

**Apply refactorings:** Change Function Declaration, Move Function, Extract Superclass

---
name: data-class
description: Refuse Data Class when a class whose surface is only getters and setters; all real behavior lives in consumers, scattered across files the agent must locate to reason about anything domain-meaningful. Apply Encapsulate Record, Remove Setting Method.
---

# Refuse: 22 — Data Class

**Trigger (refuse when you see):** A class whose surface is only getters and setters; all real behavior lives in consumers, scattered across files the agent must locate to reason about anything domain-meaningful.

**Cost of leaving it in:** Domain logic scatters across consumers; the agent must search the codebase to find any operation; class invariants aren't enforced so the agent must defensively check them at every consumer.

**Target shape after refactoring:** Behavior that belongs with the data lives on the class; the agent loading the class finds the operations and invariants it expects, in one place.

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

**Apply refactorings:** Encapsulate Record, Remove Setting Method, Move Function, Extract Function, Split Phase

---
name: refused-bequest
description: Refuse Refused Bequest when a subclass overriding parent methods to no-ops, throwing 'unsupported', or quietly ignoring inherited behavior — the agent cannot trust polymorphic calls on parent-typed references. Apply Push Down Method, Push Down Field.
---

# Refuse: 23 — Refused Bequest

**Trigger (refuse when you see):** A subclass overriding parent methods to no-ops, throwing 'unsupported', or quietly ignoring inherited behavior — the agent cannot trust polymorphic calls on parent-typed references.

**Cost of leaving it in:** Liskov violations: the agent cannot trust subclass instances to honor the parent contract, so polymorphism becomes a trap that the agent must defensively check at every call site.

**Target shape after refactoring:** Sharing happens via composition (a held delegate) instead of forced inheritance; every reference type honors its contract.

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

**Apply refactorings:** Push Down Method, Push Down Field, Replace Subclass with Delegate, Replace Superclass with Delegate

---
name: comments
description: Refuse Comments when comments explaining what the next block does or what a function returns; the agent loading the comment plus the code carries two sources of truth that may have drifted apart. Apply Extract Function, Change Function Declaration.
---

# Refuse: 24 — Comments

**Trigger (refuse when you see):** Comments explaining what the next block does or what a function returns; the agent loading the comment plus the code carries two sources of truth that may have drifted apart.

**Cost of leaving it in:** The code didn't reveal its intent so the comment is patching an unnamed function or unclear variable; the agent must reconcile both sources and risk acting on the stale one.

**Target shape after refactoring:** Names tell the agent what the comment was trying to say; comments survive only when they document a non-obvious WHY (hidden constraint, invariant, workaround).

```js
// Smellier:
// charge the customer's stored payment method, including tax
charge(c, t * 1.1);

// Fresher:
chargeWithTax(customer, total);
```

**Apply refactorings:** Extract Function, Change Function Declaration, Introduce Assertion
