---
name: inline-singleton
description: Apply Inline Singleton when you see Global Data, Inline Function, Remove Dead Code. Constructor signatures carry every dependency the class uses; the agent reads one signature to enumerate what the class touches instead of grepping for static accessor calls across the codebase.
---

# Apply: 09 — Inline Singleton

**Symptom:** Singleton accessors (`Class.getInstance()`) hide the agent's view of which classes depend on the collaborator. The agent must grep the codebase for every static-accessor call to know the real dependency graph; test setup requires resetting global state between cases.

**Goal:** Constructor signatures carry every dependency the class uses; the agent reads one signature to enumerate what the class touches instead of grepping for static accessor calls across the codebase.

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

**Relief:** Every dependency the class uses appears in its constructor signature; the agent enumerates dependencies from one file load instead of grepping for static-accessor calls across the codebase.

**Trap:** Inlining without first establishing a composition root produces `new Logger()` calls scattered across consumer files, each creating an independent instance; generated code that assumes a shared logger picks up an isolated one and the divergence ships.

**Triggered by:** Global Data (smells), Inline Function (refactorings), Remove Dead Code (refactorings)
