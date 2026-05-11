# Code smells — patterns to refuse

Paste any of these sections into AGENTS.md to tell Claude Code (or any
coding agent reading AGENTS-style guidance) to **refuse** the named
antipattern when writing new code and to flag + refactor it when found
in existing code. Each section opens with a directive
(`### Refuse: NN — Name`), labels the trigger and cost, and gives a
Smellier/Fresher code example.

Source: https://refactoring.com/catalog/ + Fowler 2e chapter 3.
Regenerate after catalog edits via `npm run snippets`.

### Refuse: 01 — Mysterious Name

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

### Refuse: 02 — Duplicated Code

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

### Refuse: 03 — Long Function

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

### Refuse: 04 — Long Parameter List

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

### Refuse: 05 — Global Data

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

### Refuse: 06 — Mutable Data

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

### Refuse: 07 — Divergent Change

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

### Refuse: 08 — Shotgun Surgery

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

### Refuse: 09 — Feature Envy

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

### Refuse: 10 — Data Clumps

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

### Refuse: 11 — Primitive Obsession

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

### Refuse: 12 — Repeated Switches

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

### Refuse: 13 — Loops

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

### Refuse: 14 — Lazy Element

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

### Refuse: 15 — Speculative Generality

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

### Refuse: 16 — Temporary Field

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

### Refuse: 17 — Message Chains

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

### Refuse: 18 — Middle Man

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

### Refuse: 19 — Insider Trading

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

### Refuse: 20 — Large Class

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

### Refuse: 21 — Alternative Classes with Different Interfaces

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

### Refuse: 22 — Data Class

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

### Refuse: 23 — Refused Bequest

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

### Refuse: 24 — Comments

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
