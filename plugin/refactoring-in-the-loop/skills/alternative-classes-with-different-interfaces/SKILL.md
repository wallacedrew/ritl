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
