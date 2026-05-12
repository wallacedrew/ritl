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
description: Apply Rename Variable when you see Mysterious Name. Variable names match the domain role they play, not their implementation type or scratch nature.
---

# Apply: 07 — Rename Variable

**Target state:** Variable names match the domain role they play, not their implementation type or scratch nature.

**Why apply it:** Reading the variable's name tells you everything you need without checking its definition.

**Pitfall:** A rename is small but cross-file; ensure your tooling catches every reference (including string templates and comments).

```js
// Avoid:
const a = height * width;

// Prefer:
const area = height * width;
```

**Removes smells:** Mysterious Name

---
name: rename-field
description: Apply Rename Field when you see Mysterious Name. Field names match the domain role they play; readers don't need to inspect usage to know what a field means.
---

# Apply: 19 — Rename Field

**Target state:** Field names match the domain role they play; readers don't need to inspect usage to know what a field means.

**Why apply it:** Stronger encapsulation; future-you reads the class definition and immediately understands its shape.

**Pitfall:** Field renames cross every reader/writer of the class — refactor in tooling-supported steps and update tests with each batch.

```js
// Avoid:
class Org { name; }

// Prefer:
class Org { title; }
```

**Removes smells:** Mysterious Name

---
name: remove-dead-code
description: Apply Remove Dead Code when you see Speculative Generality, Comments. Every line in the codebase is reachable and used; readers don't waste cycles on phantom branches.
---

# Apply: 17 — Remove Dead Code

**Target state:** Every line in the codebase is reachable and used; readers don't waste cycles on phantom branches.

**Why apply it:** Smaller surface, faster reading, fewer false leads when debugging.

**Pitfall:** Code that looks dead may be reachable via reflection, dynamic dispatch, or external callers — delete in version control where it can be recovered.

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
description: Apply Replace Magic Literal when you see Mysterious Name, Comments. Bare numbers and strings that encode domain concepts become named constants whose name says what the value represents.
---

# Apply: 43 — Replace Magic Literal

**Target state:** Bare numbers and strings that encode domain concepts become named constants whose name says what the value represents.

**Why apply it:** Searches by domain term find every callsite; changing the value is one edit; the constant invites code-side documentation when it's truly load-bearing.

**Pitfall:** Naming every literal can drown the file in trivia — only name literals that carry domain meaning the surrounding code can't speak.

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
description: Apply Extract Function when you see Long Function, Duplicated Code, Comments. Each function reads as a single named domain step — what it does, not how.
---

# Apply: 01 — Extract Function

**Target state:** Each function reads as a single named domain step — what it does, not how.

**Why apply it:** Calling code becomes a sequence of named intentions; bugs concentrate inside the now-named subroutines.

**Pitfall:** Over-eager extraction can produce a maze of one-line functions; aim for extractions that earn their name with at least one decision or one transformation.

```js
// Avoid:
function ship(order) {
  if (!order.id) throw new Error('missing id');
  const grand = order.total * 1.1;
  email(order.user, `Total ${grand}`);
}

// Prefer:
function ship(order) {
  validate(order);
  const grand = withTax(order);
  notify(order, grand);
}
```

**Removes smells:** Long Function, Duplicated Code, Comments

---
name: inline-function
description: Apply Inline Function when you see Lazy Element, Speculative Generality. Trivial wrappers vanish; the call site reads as exactly what's happening.
---

# Apply: 02 — Inline Function

**Target state:** Trivial wrappers vanish; the call site reads as exactly what's happening.

**Why apply it:** One fewer indirection to follow when reading; smaller surface to maintain.

**Pitfall:** If the function had a meaningful name covering several call sites, inlining can scatter the intent — only inline when the body is as clear as the wrapper.

```js
// Avoid:
function getRating(driver) {
  return moreThanFiveLateDeliveries(driver) ? 2 : 1;
}
function moreThanFiveLateDeliveries(driver) {
  return driver.numberOfLateDeliveries > 5;
}

// Prefer:
function getRating(driver) {
  return driver.numberOfLateDeliveries > 5 ? 2 : 1;
}
```

**Removes smells:** Lazy Element, Speculative Generality

---
name: extract-variable
description: Apply Extract Variable when you see Mysterious Name, Comments. A complex expression earns a name that says what it represents in the domain.
---

# Apply: 03 — Extract Variable

**Target state:** A complex expression earns a name that says what it represents in the domain.

**Why apply it:** Reusable in nearby code; debugging shows the intermediate value; comments explaining the expression become unnecessary.

**Pitfall:** Over-extracting tiny expressions clutters scope with one-shot names; extract when the expression carries domain meaning the surrounding code can't speak.

```js
// Avoid:
if (order.qty * order.price - Math.max(0, order.qty - 500) * order.price * 0.05 > 1000) { /* ... */ }

// Prefer:
const basePrice = order.qty * order.price;
const discount  = Math.max(0, order.qty - 500) * order.price * 0.05;
if (basePrice - discount > 1000) { /* ... */ }
```

**Removes smells:** Mysterious Name, Comments

---
name: inline-variable
description: Apply Inline Variable when you see Lazy Element. Single-use variables that just rename their right-hand side disappear; the expression speaks for itself.
---

# Apply: 04 — Inline Variable

**Target state:** Single-use variables that just rename their right-hand side disappear; the expression speaks for itself.

**Why apply it:** Less local clutter, fewer redundant names, smaller scopes to track.

**Pitfall:** Inlining a name that did carry domain meaning costs readability — only inline when the expression is already self-explanatory.

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
description: Apply Combine Functions into Class when you see Data Clumps, Primitive Obsession. Functions that all act on the same data live alongside it as methods; calls become method calls on a domain object.
---

# Apply: 09 — Combine Functions into Class

**Target state:** Functions that all act on the same data live alongside it as methods; calls become method calls on a domain object.

**Why apply it:** Encapsulation tightens; tests target the class; new operations land in one obvious place.

**Pitfall:** Wrapping passive data in a class that nobody else uses adds ceremony — only combine when 2+ functions take the same data and would benefit from co-located behavior.

```js
// Avoid:
function baseCharge(reading)    { /* uses reading */ }
function taxableCharge(reading) { /* uses reading */ }

// Prefer:
class Reading {
  baseCharge()    { /* ... */ }
  taxableCharge() { /* ... */ }
}
```

**Removes smells:** Data Clumps, Primitive Obsession

---
name: combine-functions-into-transform
description: Apply Combine Functions into Transform when you see Data Clumps, Mutable Data. Multiple derived values from the same source come from one transform that produces an enriched record.
---

# Apply: 10 — Combine Functions into Transform

**Target state:** Multiple derived values from the same source come from one transform that produces an enriched record.

**Why apply it:** Derivations stay consistent (no two callers compute slightly different versions); cache invalidation becomes obvious.

**Pitfall:** Building a transform up-front when only one derivation exists is BDUF — wait for the second derivation before introducing the transform.

```js
// Avoid:
function base(reading)    { /* ... */ }
function taxable(reading) { /* ... */ }

// Prefer:
function enrich(reading) {
  return { ...reading, base: base(reading), taxable: taxable(reading) };
}
```

**Removes smells:** Data Clumps, Mutable Data

---
name: split-phase
description: Apply Split Phase when you see Divergent Change, Long Function. Each phase reads and writes its own well-defined inputs and outputs; the seam between them is data, not control flow.
---

# Apply: 11 — Split Phase

**Target state:** Each phase reads and writes its own well-defined inputs and outputs; the seam between them is data, not control flow.

**Why apply it:** Phases evolve independently; tests target each phase in isolation; the intermediate shape becomes a documented contract.

**Pitfall:** An intermediate data structure between the phases is overhead — earn it by separating two clearly different concerns.

```js
// Avoid:
function priceAndRender(input) {
  const price = computePrice(input);
  return renderHTML(input, price);
}

// Prefer:
function pricing(input) { return { ...input, price: computePrice(input) }; }
function render(priced)  { return renderHTML(priced); }
```

**Removes smells:** Divergent Change, Long Function

---
name: slide-statements
description: Apply Slide Statements when you see Long Function, Comments. Related statements sit next to each other; the function reads as a sequence of cohesive sub-steps that are easy to extract.
---

# Apply: 14 — Slide Statements

**Target state:** Related statements sit next to each other; the function reads as a sequence of cohesive sub-steps that are easy to extract.

**Why apply it:** Setup for Extract Function becomes trivial; the implicit grouping inside the function becomes explicit.

**Pitfall:** Reordering can change behavior if statements aren't actually independent — verify side effects and dependencies before sliding.

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
description: Apply Split Loop when you see Long Function, Loops. Each loop does one thing; mixed-purpose loops separate into named single-purpose passes.
---

# Apply: 15 — Split Loop

**Target state:** Each loop does one thing; mixed-purpose loops separate into named single-purpose passes.

**Why apply it:** Each loop can then be replaced by a pipeline or extracted by name; bugs concentrate in one purpose at a time.

**Pitfall:** Two loops over the same collection are slower than one — only split when the doubled cost is dwarfed by the readability gain (which it usually is).

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
description: Apply Replace Loop with Pipeline when you see Loops. Filter / map / reduce expresses the transformation as a sequence of named operations; intent jumps off the page.
---

# Apply: 16 — Replace Loop with Pipeline

**Target state:** Filter / map / reduce expresses the transformation as a sequence of named operations; intent jumps off the page.

**Why apply it:** Off-by-one and accumulator bugs vanish; each step is independently testable.

**Pitfall:** Pipelines add a tiny per-element function-call overhead — usually negligible, but profile if you're in a hot path.

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
description: Apply Replace Derived Variable with Query when you see Mutable Data. Values computed from other state are computed on demand; no separate field needs to be kept in sync.
---

# Apply: 20 — Replace Derived Variable with Query

**Target state:** Values computed from other state are computed on demand; no separate field needs to be kept in sync.

**Why apply it:** Mutation scope shrinks; reasoning about state is simpler; no chance of the derived field drifting from its source.

**Pitfall:** If the derivation is expensive and the source rarely changes, recomputing on every read may be wasteful — measure before deciding.

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
description: Apply Split Variable when you see Mysterious Name, Mutable Data. Each variable has one role; reassignment patterns reflect distinct purposes rather than reused storage.
---

# Apply: 18 — Split Variable

**Target state:** Each variable has one role; reassignment patterns reflect distinct purposes rather than reused storage.

**Why apply it:** Names match purpose; the type system can narrow each role; refactoring each use becomes local.

**Pitfall:** Two distinct uses of one variable share a single update pattern that may have hidden coupling — verify each use is genuinely independent.

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
description: Apply Move Statements into Function when you see Duplicated Code. Setup or follow-up that happens around every call to a function moves inside the function, so the caller's contract shrinks.
---

# Apply: 44 — Move Statements into Function

**Target state:** Setup or follow-up that happens around every call to a function moves inside the function, so the caller's contract shrinks.

**Why apply it:** One fewer thing to remember at the call site; consistency is enforced by the function's definition, not by convention.

**Pitfall:** If the moved statements aren't always wanted, the function grows a flag argument — verify every caller really needs the moved behavior.

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
description: Apply Move Statements to Callers when you see Divergent Change. Statements that vary by caller move out of the function so each caller chooses its own setup or follow-up.
---

# Apply: 45 — Move Statements to Callers

**Target state:** Statements that vary by caller move out of the function so each caller chooses its own setup or follow-up.

**Why apply it:** The function's body becomes about its single responsibility; callers express their differences directly.

**Pitfall:** If most callers want the moved statements, you've created duplication — the inverse of Move Statements into Function is only an improvement when callers genuinely differ.

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
description: Apply Replace Inline Code with Function Call when you see Duplicated Code. When inline code reproduces what a named function already does, the inline copy is replaced by a call.
---

# Apply: 46 — Replace Inline Code with Function Call

**Target state:** When inline code reproduces what a named function already does, the inline copy is replaced by a call.

**Why apply it:** One canonical implementation; the name labels the intent; future improvements to the function reach every site that used to inline.

**Pitfall:** If the existing function's name doesn't quite match the local intent, the call site reads as a near-miss; consider Change Function Declaration first.

```js
// Avoid:
const inRange = candidate >= low && candidate <= high;

// Prefer:
const inRange = between(candidate, low, high);
```

**Removes smells:** Duplicated Code

---
name: replace-temp-with-query
description: Apply Replace Temp with Query when you see Long Function, Mutable Data. A local variable assigned once from a computation becomes a function that returns that computation on demand.
---

# Apply: 47 — Replace Temp with Query

**Target state:** A local variable assigned once from a computation becomes a function that returns that computation on demand.

**Why apply it:** Extract Function becomes easier (the query has a name and stable scope); the temp's lifetime no longer constrains how the surrounding function is split.

**Pitfall:** If the temp wraps an expensive calculation called many times, naive replacement may multiply cost — measure or cache before deciding.

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
description: Apply Replace Function with Command when you see Long Function. A function with rich internal state becomes an object whose methods can share that state — easier to extract, name, and test in pieces.
---

# Apply: 48 — Replace Function with Command

**Target state:** A function with rich internal state becomes an object whose methods can share that state — easier to extract, name, and test in pieces.

**Why apply it:** Long sequences become labeled steps; tests target each step on the command; subclasses or strategies can vary parts of the algorithm.

**Pitfall:** Promoting a function to a command adds ceremony (constructor, method calls). Only worth it when the function genuinely needs its own intermediate state or multiple entry points.

```js
// Avoid:
function score(c) {
  // fifty lines using ten locals
}

// Prefer:
class Scorer {
  constructor(c) { /* fields */ }
  execute()      { return this.compose(); }
  // named private steps
}
```

**Removes smells:** Long Function

---
name: replace-command-with-function
description: Apply Replace Command with Function when you see Speculative Generality, Lazy Element. A command object whose execute() does everything in one shot collapses back to a plain function.
---

# Apply: 49 — Replace Command with Function

**Target state:** A command object whose execute() does everything in one shot collapses back to a plain function.

**Why apply it:** Fewer files, fewer constructors, less indirection — the caller sees one function instead of build-then-execute.

**Pitfall:** If the command holds genuinely useful intermediate state, flattening to a function regrows the temps it eliminated — confirm there's no real reuse first.

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
description: Apply Return Modified Value when you see Mutable Data. Instead of mutating a parameter in place, the function returns the modified value so the caller reassigns.
---

# Apply: 50 — Return Modified Value

**Target state:** Instead of mutating a parameter in place, the function returns the modified value so the caller reassigns.

**Why apply it:** Side effects on inputs disappear; the function reads as a transformation; equality and snapshotting become possible.

**Pitfall:** Callers must remember to capture the returned value; if any forget, they keep the unmodified original. Mark the parameter readonly so the type system helps.

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
description: Apply Substitute Algorithm when you see Long Function, Loops. An opaque or convoluted algorithm gets replaced by a clearer one (often from a library or well-known pattern) that produces the same outputs.
---

# Apply: 51 — Substitute Algorithm

**Target state:** An opaque or convoluted algorithm gets replaced by a clearer one (often from a library or well-known pattern) that produces the same outputs.

**Why apply it:** Future maintainers read the well-known pattern instead of decoding the bespoke implementation; performance and correctness usually improve.

**Pitfall:** Swapping algorithms wholesale forfeits behavioral safety — characterize the function with tests at every input boundary you care about before substituting.

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
description: Apply Encapsulate Variable when you see Global Data, Mutable Data. All reads and writes pass through a small named function that owns validation, logging, and invariants.
---

# Apply: 06 — Encapsulate Variable

**Target state:** All reads and writes pass through a small named function that owns validation, logging, and invariants.

**Why apply it:** A bug fix or audit becomes a one-line addition inside the wrapper; consumers never need to change.

**Pitfall:** Adds a layer of indirection that pays off only when every access goes through the wrapper — leakage of direct access undoes the benefit.

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
description: Apply Hide Delegate when you see Message Chains. Callers ask the closest object for what they want; the object delegates internally without exposing its collaborators.
---

# Apply: 41 — Hide Delegate

**Target state:** Callers ask the closest object for what they want; the object delegates internally without exposing its collaborators.

**Why apply it:** Encapsulation tightens; intermediate objects can change shape without breaking callers.

**Pitfall:** Adds a passthrough method on the parent for every delegated operation — only worth it for operations that are repeated across consumers.

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
description: Apply Remove Middle Man when you see Middle Man. Callers talk directly to the real object; trivial passthroughs are deleted.
---

# Apply: 42 — Remove Middle Man

**Target state:** Callers talk directly to the real object; trivial passthroughs are deleted.

**Why apply it:** Fewer files, shorter call stacks, the implementation's location is obvious.

**Pitfall:** Direct access to the delegate exposes its surface to every consumer — only remove the middle man when most of its methods are passthroughs.

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
description: Apply Encapsulate Collection when you see Mutable Data, Insider Trading. A class's internal collection is never returned directly; callers add or remove via methods on the class, and reads return a snapshot or iterator.
---

# Apply: 52 — Encapsulate Collection

**Target state:** A class's internal collection is never returned directly; callers add or remove via methods on the class, and reads return a snapshot or iterator.

**Why apply it:** The owner can enforce invariants (uniqueness, ordering, max size); refactoring the collection's internal shape is local.

**Pitfall:** Returning a shallow copy on every read can hide bugs where callers expected mutation to be reflected — be explicit about the contract.

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
description: Apply Encapsulate Record when you see Data Class, Primitive Obsession. A bare record (plain object with public fields) becomes a class whose properties are accessed through methods that can validate, log, or derive.
---

# Apply: 53 — Encapsulate Record

**Target state:** A bare record (plain object with public fields) becomes a class whose properties are accessed through methods that can validate, log, or derive.

**Why apply it:** Field renames stay internal; invariants can be enforced on every read or write; the record becomes a real domain object.

**Pitfall:** Wrapping every record adds ceremony — only worth it when behavior or validation will accrete around the data.

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
description: Apply Remove Setting Method when you see Mutable Data, Data Class. Fields whose values should only be set at construction lose their setters; callers either construct a new object or call a domain method that changes the field as a side effect of doing real work.
---

# Apply: 54 — Remove Setting Method

**Target state:** Fields whose values should only be set at construction lose their setters; callers either construct a new object or call a domain method that changes the field as a side effect of doing real work.

**Why apply it:** Immutable-by-default classes; bugs from late mutation vanish; the API expresses what users can actually do.

**Pitfall:** Removing a setter forces every legitimate update through a more meaningful method — verify there's a domain action behind every setter call before deleting it.

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
description: Apply Move Function when you see Feature Envy, Shotgun Surgery, Insider Trading, Divergent Change. Each function lives where its data lives; coupling between modules drops.
---

# Apply: 12 — Move Function

**Target state:** Each function lives where its data lives; coupling between modules drops.

**Why apply it:** Modules become more cohesive; tests stay focused; feature-envy patterns disappear.

**Pitfall:** Moving a function across modules can pull dependencies with it — confirm the new home actually has access to everything the function needs.

```js
// Avoid:
class Order { totalPriority() { return this.account.priority(); } }

// Prefer:
class Account { priority() { /* ... */ } }
class Order   { /* asks account directly when needed */ }
```

**Removes smells:** Feature Envy, Shotgun Surgery, Insider Trading, Divergent Change

---
name: move-field
description: Apply Move Field when you see Shotgun Surgery, Insider Trading. Each field belongs to the class that owns its lifecycle; cross-class reaching disappears.
---

# Apply: 13 — Move Field

**Target state:** Each field belongs to the class that owns its lifecycle; cross-class reaching disappears.

**Why apply it:** Class boundaries align with data ownership; mutations are local; refactoring becomes safer.

**Pitfall:** Moving a field disturbs every reader — refactor in tooling-supported steps and add a temporary accessor on the original class while migrating.

```js
// Avoid:
class Customer { plan; discountRate; }

// Prefer:
class Plan     { discountRate; }
class Customer { plan; /* discountRate accessed via plan */ }
```

**Removes smells:** Shotgun Surgery, Insider Trading

---
name: extract-class
description: Apply Extract Class when you see Data Clumps, Temporary Field, Large Class, Primitive Obsession. A cohesive sub-concept inside a class becomes its own class with its own name, fields, and methods.
---

# Apply: 39 — Extract Class

**Target state:** A cohesive sub-concept inside a class becomes its own class with its own name, fields, and methods.

**Why apply it:** Each class has one purpose; tests target the small unit; the parent class shrinks.

**Pitfall:** Premature class extraction adds ceremony — extract when 3+ fields and at least one operation cluster around a single concept that the parent class doesn't own.

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

**Pitfall:** If the absorbing class was already large, inlining piles more onto it — fold in only when the absorber stays under its complexity budget afterward.

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

**Pitfall:** Wrapping every primitive is overkill — wrap when the concept needs validation, formatting, or domain-specific behavior beyond what the primitive offers.

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

**Pitfall:** Comparison semantics shift from identity to equality — every call site that depended on `===` or identity caches needs review.

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

**Pitfall:** Sharing introduces the question 'who owns this?' — make sure the lifetime and visibility of the shared reference are well-defined.

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

**Pitfall:** Names that aren't crisper than the underlying condition add ceremony — only extract when the named function/variable says something the condition can't.

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

**Pitfall:** Combining conditions can hide their independent reasons — only consolidate when they truly express the same business rule.

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

**Pitfall:** If multiple paths share work, premature returns can duplicate that work — extract first, then guard.

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
description: Apply Replace Conditional with Polymorphism when you see Repeated Switches, Primitive Obsession. Each case becomes a class implementing a shared interface; dispatch happens once via virtual call.
---

# Apply: 24 — Replace Conditional with Polymorphism

**Target state:** Each case becomes a class implementing a shared interface; dispatch happens once via virtual call.

**Why apply it:** Adding a new case is one new class; the type system tells you what's missing.

**Pitfall:** If only one switch on the type code exists, polymorphism is overkill — wait for the second or third repeat before extracting subclasses.

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

**Pitfall:** Adds a tiny class for one case; only worthwhile when the special case appears in 2+ consumers.

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

**Pitfall:** If the loop body is large, the break can hide the early-exit semantics — extract a function around the loop's body to keep the exit obvious.

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

**Pitfall:** Mass renames or signature shifts ripple to every caller; refactor in tooling-supported steps and update tests with each batch.

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

**Pitfall:** Premature parameter objects hide which fields are actually needed by which method — wait until the clump appears in 3+ places before extracting.

```js
// Avoid:
function record(low, high, value) {
  // ...
}

// Prefer:
class NumberRange { /* low, high */ }
function record(range, value) {
  // ...
}
```

**Removes smells:** Long Parameter List, Data Clumps

---
name: introduce-assertion
description: Apply Introduce Assertion when you see Comments, Mutable Data. Invariants the code assumes are stated explicitly; readers don't need to deduce them.
---

# Apply: 26 — Introduce Assertion

**Target state:** Invariants the code assumes are stated explicitly; readers don't need to deduce them.

**Why apply it:** Bugs that violate the invariant fail loudly at the source instead of bubbling out as mysterious downstream errors.

**Pitfall:** Assertions used as control flow couple production behavior to debug-mode invariants — keep them as runtime contracts that should never fire.

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

**Pitfall:** If the modification and the query truly cannot be separated (e.g. find-and-remove on a queue), the constraint is fundamental — leave the combined operation but document it.

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

**Pitfall:** If the variations are conceptually different operations, one parameterized function will accumulate flags and special cases — keep them separate then.

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

**Pitfall:** Two replacement functions with similar bodies introduce duplication — pair this with Extract Function for shared internals.

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

**Pitfall:** Passing the whole object adds coupling to its full surface — only do this when the called function might reasonably need other parts of the object.

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

**Pitfall:** If the query has side effects or is expensive, passing the value is genuinely better — only replace when the query is pure and cheap.

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

**Pitfall:** Passing the value pushes the responsibility onto callers; for many call sites, signatures grow noisily — prefer this when the query touches global or volatile state.

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

**Pitfall:** Hides the actual class from callers — make sure your factory's name still expresses the produced shape clearly.

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

**Pitfall:** Exceptions for predictable conditions misuse the mechanism — only convert codes that represent genuine, exceptional, unrecoverable failures.

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

**Pitfall:** Race conditions: the precheck may pass and the operation still fail (TOCTOU). Use prechecks only for conditions the caller can verify without a race.

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

**Pitfall:** If the methods only superficially resemble each other, pulling up creates a fake-shared abstraction — unify only when behavior is actually identical.

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

**Pitfall:** If the method is occasionally needed in the parent, pushing it down forces awkward type checks back at consumers — verify usage first.

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

**Pitfall:** If only one or two switches exist on the type code, subclassing is over-design; combine with Replace Conditional with Polymorphism only when dispatch repeats.

```js
// Avoid:
class Employee {
  type; // 'engineer' | 'manager'
}

// Prefer:
class Employee {}
class Engineer extends Employee {}
class Manager  extends Employee {}
```

**Removes smells:** Repeated Switches, Primitive Obsession

---
name: extract-superclass
description: Apply Extract Superclass when you see Duplicated Code, Alternative Classes with Different Interfaces. Two classes with substantial shared structure get a common parent that owns the shared bits.
---

# Apply: 36 — Extract Superclass

**Target state:** Two classes with substantial shared structure get a common parent that owns the shared bits.

**Why apply it:** Bug fixes and new shared behavior land in one place; the relationship between the classes is documented in code.

**Pitfall:** Inheritance is inflexible — if the duplication is shallow, prefer Extract Class (composition) over Extract Superclass.

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

**Pitfall:** Collapsing too eagerly destroys an extension point you'll later want — only collapse when the variant has been zero-sum for a sustained period.

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

**Pitfall:** Composition is more verbose at construction sites — accept the verbosity in exchange for the flexibility.

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

**Pitfall:** If only some subclasses share the init logic, pulling it up forces the others to opt out — verify the body is genuinely common.

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

**Pitfall:** Pulling up a field that subclasses use differently (different default, different visibility) creates surprise — verify the field semantics are identical.

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

**Pitfall:** If the field is occasionally consulted in the parent for type checks, pushing it down forces awkward downcasts — verify usage first.

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

**Pitfall:** Removing a subclass referenced by name elsewhere (factories, registries) breaks those references — confirm no consumer is type-testing the subclass.

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

**Pitfall:** Adds a forwarding method on the former subclass for every method the old superclass exposed — only worth it when the superclass relationship is misleading.

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
description: Refuse Mysterious Name when identifiers that don't reveal intent — names like aFunc(), x, theData, temp, or one-letter loop variables that force every reader to reverse-engineer the code's purpose. Apply Change Function Declaration, Rename Variable.
---

# Refuse: 01 — Mysterious Name

**Trigger (refuse when you see):** Identifiers that don't reveal intent — names like aFunc(), x, theData, temp, or one-letter loop variables that force every reader to reverse-engineer the code's purpose.

**Cost of leaving it in:** Every reading is a re-comprehension cost; bugs sneak in because what code does diverges from what its name suggests. Compounds in proportion to how many readers (humans + LLMs) touch the file.

**Target shape after refactoring:** Names read as the domain — a function's purpose, a variable's role, a class's responsibility — visible in one glance.

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
description: Refuse Duplicated Code when the same code structure appears in two or more places — same shape with cosmetic variations, or copy-paste-modify patterns that drift over time. Apply Extract Function, Slide Statements.
---

# Refuse: 02 — Duplicated Code

**Trigger (refuse when you see):** The same code structure appears in two or more places — same shape with cosmetic variations, or copy-paste-modify patterns that drift over time.

**Cost of leaving it in:** Bugs need to be fixed in every copy; behavior diverges as copies age, multiplying maintenance cost.

**Target shape after refactoring:** One canonical home per behavior, with parameters for the variations.

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
description: Refuse Long Function when functions whose body has dozens of lines and a mix of concerns — fetching, calculating, formatting, and logging all interwoven. Apply Extract Function, Replace Temp with Query.
---

# Refuse: 03 — Long Function

**Trigger (refuse when you see):** Functions whose body has dozens of lines and a mix of concerns — fetching, calculating, formatting, and logging all interwoven.

**Cost of leaving it in:** Each line is an opportunity for the reader to lose context; understanding requires holding the whole function in working memory.

**Target shape after refactoring:** Each function reads as a sequence of named single-responsibility steps; nothing does more than its name advertises.

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
description: Refuse Long Parameter List when functions taking five, six, or more parameters — especially when several travel together as a logical group. Apply Replace Parameter with Query, Preserve Whole Object.
---

# Refuse: 04 — Long Parameter List

**Trigger (refuse when you see):** Functions taking five, six, or more parameters — especially when several travel together as a logical group.

**Cost of leaving it in:** Callers must remember argument order and meaning; refactoring becomes a coordination exercise across every call site.

**Target shape after refactoring:** Related parameters travel together as one well-named value object that the function (and its callers) refer to by domain meaning.

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
description: Refuse Global Data when module-level variables, singletons, or shared mutable state that any code can read or mutate from anywhere. Apply Encapsulate Variable.
---

# Refuse: 05 — Global Data

**Trigger (refuse when you see):** Module-level variables, singletons, or shared mutable state that any code can read or mutate from anywhere.

**Cost of leaving it in:** The blast radius of any change is the whole codebase; behavior depends on hidden write order between unrelated callers.

**Target shape after refactoring:** Access goes through a small named function that owns the read/write contract — and ideally narrows it (read-only, validated).

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
description: Refuse Mutable Data when data structures whose fields are reassigned across the codebase, with no clear owner of the mutation. Apply Encapsulate Variable, Split Variable.
---

# Refuse: 06 — Mutable Data

**Trigger (refuse when you see):** Data structures whose fields are reassigned across the codebase, with no clear owner of the mutation.

**Cost of leaving it in:** Reasoning about state at any moment requires tracing every writer; concurrent code becomes a hazard area.

**Target shape after refactoring:** Mutation happens in one place behind a named function (or returns a new value), so the moment of change is clear.

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
description: Refuse Divergent Change when one module changes for many unrelated reasons — one part for tax law updates, another for UI changes, another for API shape drift. Apply Split Phase, Move Function.
---

# Refuse: 07 — Divergent Change

**Trigger (refuse when you see):** One module changes for many unrelated reasons — one part for tax law updates, another for UI changes, another for API shape drift.

**Cost of leaving it in:** Every team's churn lands in the same file; merges become contentious; testing one concern requires understanding all of them.

**Target shape after refactoring:** Each module changes for one reason — the kinds of changes that touch it cluster around a single axis of variation.

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
description: Refuse Shotgun Surgery when a single conceptual change forces edits in many small places — adding a logging field means touching 17 files. Apply Move Function, Move Field.
---

# Refuse: 08 — Shotgun Surgery

**Trigger (refuse when you see):** A single conceptual change forces edits in many small places — adding a logging field means touching 17 files.

**Cost of leaving it in:** Easy to miss a site; reviewers can't easily verify completeness; small changes feel disproportionately risky.

**Target shape after refactoring:** All code that varies together lives together. Adding a new field is one change in one module.

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
description: Refuse Feature Envy when a method on class A reaches deeply into class B's data via getters, then computes something B should compute. Apply Move Function, Extract Function.
---

# Refuse: 09 — Feature Envy

**Trigger (refuse when you see):** A method on class A reaches deeply into class B's data via getters, then computes something B should compute.

**Cost of leaving it in:** Domain logic lives where it's least expected; B's internals leak through public surfaces just to support A's method.

**Target shape after refactoring:** Methods live with the data they care about — B owns the logic over B's fields.

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
description: Refuse Data Clumps when the same group of fields travels together everywhere — (street, city, zip), (start, end), (firstName, lastName) — appearing as parameters, fields, or method args. Apply Extract Class, Introduce Parameter Object.
---

# Refuse: 10 — Data Clumps

**Trigger (refuse when you see):** The same group of fields travels together everywhere — (street, city, zip), (start, end), (firstName, lastName) — appearing as parameters, fields, or method args.

**Cost of leaving it in:** Adding or removing a field of the clump means touching every site; the clump's identity is invisible.

**Target shape after refactoring:** The clump becomes a value object with its own name and its own behavior.

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
description: Refuse Primitive Obsession when domain concepts represented as raw strings, numbers, or booleans — phone number is a string, money is a number, status is a code. Apply Replace Primitive with Object, Replace Type Code with Subclasses.
---

# Refuse: 11 — Primitive Obsession

**Trigger (refuse when you see):** Domain concepts represented as raw strings, numbers, or booleans — phone number is a string, money is a number, status is a code.

**Cost of leaving it in:** Validation and formatting scatter across every consumer; the type system can't catch wrong primitives in the wrong slot.

**Target shape after refactoring:** Each domain concept has a small typed home — Money, PhoneNumber, OrderId, Status — that knows its rules.

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
description: Refuse Repeated Switches when the same switch (or if/else chain) over a type code appears in multiple places — adding a new case means hunting them all down. Apply Replace Conditional with Polymorphism.
---

# Refuse: 12 — Repeated Switches

**Trigger (refuse when you see):** The same switch (or if/else chain) over a type code appears in multiple places — adding a new case means hunting them all down.

**Cost of leaving it in:** Dispatch logic is duplicated across the codebase; new cases are easy to miss; the type-code couple amplifies.

**Target shape after refactoring:** Each case is a class implementing a shared interface; dispatch happens once via a virtual call.

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
description: Refuse Loops when imperative for/while loops obscuring what the loop is producing — filter, map, reduce mixed together by hand. Apply Replace Loop with Pipeline.
---

# Refuse: 13 — Loops

**Trigger (refuse when you see):** Imperative for/while loops obscuring what the loop is producing — filter, map, reduce mixed together by hand.

**Cost of leaving it in:** Reader must mentally execute the loop to learn the result; off-by-one errors and accumulator bugs hide in the body.

**Target shape after refactoring:** The transformation reads as a sequence of named operations: filter, map, reduce.

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
description: Refuse Lazy Element when a class, function, or namespace that exists but does nothing meaningful — a one-line wrapper, an empty subclass, a passthrough method. Apply Inline Function, Inline Class.
---

# Refuse: 14 — Lazy Element

**Trigger (refuse when you see):** A class, function, or namespace that exists but does nothing meaningful — a one-line wrapper, an empty subclass, a passthrough method.

**Cost of leaving it in:** Reader pays a navigation cost to discover the wrapper adds nothing; future changes are tempted to add real work to it.

**Target shape after refactoring:** Trivial wrappers disappear; the call site says exactly what's happening.

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
description: Refuse Speculative Generality when hooks, abstract base classes, configuration knobs, and parameters added 'in case we need them' — but no real call site uses them. Apply Collapse Hierarchy, Inline Function.
---

# Refuse: 15 — Speculative Generality

**Trigger (refuse when you see):** Hooks, abstract base classes, configuration knobs, and parameters added 'in case we need them' — but no real call site uses them.

**Cost of leaving it in:** Tests are forced to cover branches no one exercises; readers learn a vocabulary they don't need; YAGNI debt compounds.

**Target shape after refactoring:** The code expresses exactly what it does today — abstraction earns its keep when a real second user shows up.

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
description: Refuse Temporary Field when a class field used by only one method, set to null or default the rest of the time. Apply Extract Class, Move Function.
---

# Refuse: 16 — Temporary Field

**Trigger (refuse when you see):** A class field used by only one method, set to null or default the rest of the time.

**Cost of leaving it in:** Reader must trace the conditions under which the field is meaningful; null-checks scatter; the field's role is unclear.

**Target shape after refactoring:** The temporary state moves to a dedicated class that exists only when it's relevant.

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
description: Refuse Message Chains when long dotted access paths; a.b.c.d.e — every callsite walks the entire object graph. Apply Hide Delegate, Extract Function.
---

# Refuse: 17 — Message Chains

**Trigger (refuse when you see):** Long dotted access paths: a.b.c.d.e — every callsite walks the entire object graph.

**Cost of leaving it in:** Every link in the chain is a coupling point; renaming any intermediate field breaks every consumer.

**Target shape after refactoring:** Callers ask the closest object for what they want; the object delegates internally.

```js
// Smellier:
const street = order.customer.address.street;

// Fresher:
const street = order.customerStreet();
```

**Apply refactorings:** Hide Delegate, Extract Function, Move Function

---
name: middle-man
description: Refuse Middle Man when a class whose methods all delegate straight through to another object — no decisions, no transformations. Apply Remove Middle Man, Inline Function.
---

# Refuse: 18 — Middle Man

**Trigger (refuse when you see):** A class whose methods all delegate straight through to another object — no decisions, no transformations.

**Cost of leaving it in:** An entire layer of indirection that adds no value; readers must follow every call to the real implementation.

**Target shape after refactoring:** Callers talk directly to the real object; trivial passthroughs are deleted.

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
description: Refuse Insider Trading when modules reach into each other's internals to coordinate behavior, bypassing public interfaces. Apply Move Function, Move Field.
---

# Refuse: 19 — Insider Trading

**Trigger (refuse when you see):** Modules reach into each other's internals to coordinate behavior, bypassing public interfaces.

**Cost of leaving it in:** Coupling at the implementation level — refactoring one breaks the other in non-obvious ways.

**Target shape after refactoring:** Cooperation happens through narrow, explicit interfaces; secrets stay secret.

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
description: Refuse Large Class when a class with too many fields and methods — multiple unrelated responsibilities under one type. Apply Extract Class, Extract Superclass.
---

# Refuse: 20 — Large Class

**Trigger (refuse when you see):** A class with too many fields and methods — multiple unrelated responsibilities under one type.

**Cost of leaving it in:** Cognitive load: every reader pays for fields they don't care about; merge conflicts spike; testing is unfocused.

**Target shape after refactoring:** Each class has one cohesive purpose; methods cluster around fields they actually use.

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
description: Refuse Alternative Classes with Different Interfaces when two classes do similar things but with mismatched method names and signatures — sortBy() vs orderUsing(), valueOf() vs evaluate(). Apply Change Function Declaration, Move Function.
---

# Refuse: 21 — Alternative Classes with Different Interfaces

**Trigger (refuse when you see):** Two classes do similar things but with mismatched method names and signatures — sortBy() vs orderUsing(), valueOf() vs evaluate().

**Cost of leaving it in:** Substitution becomes copy-paste; consumers can't treat the two interchangeably; abstraction over them is impossible.

**Target shape after refactoring:** Equivalent operations have equivalent signatures; a shared superclass or interface emerges naturally.

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
description: Refuse Data Class when a class that holds fields with getters and setters but no behavior — and consumers do all the operations on it externally. Apply Encapsulate Record, Remove Setting Method.
---

# Refuse: 22 — Data Class

**Trigger (refuse when you see):** A class that holds fields with getters and setters but no behavior — and consumers do all the operations on it externally.

**Cost of leaving it in:** Domain logic gets scattered to consumers; the class's data invariants aren't enforced; encapsulation is theater.

**Target shape after refactoring:** Behavior that belongs with the data lives on the class; the class becomes a real domain object.

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
description: Refuse Refused Bequest when a subclass inherits methods or fields it doesn't actually use — overriding to no-ops, throwing 'unsupported', or just ignoring the inheritance. Apply Push Down Method, Push Down Field.
---

# Refuse: 23 — Refused Bequest

**Trigger (refuse when you see):** A subclass inherits methods or fields it doesn't actually use — overriding to no-ops, throwing 'unsupported', or just ignoring the inheritance.

**Cost of leaving it in:** Liskov violations: callers can't trust subclass instances to honor the parent contract; polymorphism becomes a trap.

**Target shape after refactoring:** Sharing happens through composition (a delegate object) rather than forced inheritance.

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
description: Refuse Comments when comments explaining what the next block of code does, what a function returns, or how a parameter is meant to be used. Apply Extract Function, Change Function Declaration.
---

# Refuse: 24 — Comments

**Trigger (refuse when you see):** Comments explaining what the next block of code does, what a function returns, or how a parameter is meant to be used.

**Cost of leaving it in:** The code didn't reveal its intent — the comment is patching an unnamed function or unclear variable; comment and code drift over time.

**Target shape after refactoring:** Names of functions, variables, and types tell the reader what the comment was trying to say. Comments survive only when WHY is non-obvious.

```js
// Smellier:
// charge the customer's stored payment method, including tax
charge(c, t * 1.1);

// Fresher:
chargeWithTax(customer, total);
```

**Apply refactorings:** Extract Function, Change Function Declaration, Introduce Assertion
