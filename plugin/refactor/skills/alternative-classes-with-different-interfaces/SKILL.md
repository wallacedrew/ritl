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
