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
