---
name: iterator
description: Apply Iterator when you see Insider Trading, Message Chains, Encapsulate Collection. One iterator protocol the agent reads to understand traversal semantics.
---

# Apply: 43 — Iterator

**Announce first:** name the chain of refactorings pointing at Iterator and that you're applying it before the next edit. The user reads the announcement as your contract.

**Symptom:** Per-traversal duplication of representation-specific logic the agent must verify uniformly on every collection-internals change. Insider Trading on collection internals couples every consumer to the collection's private fields; refactoring the collection's storage is N-files-in-lockstep.

**Goal:** One iterator protocol the agent reads to understand traversal semantics. Consumer code is uniform `for (const x of coll)` — the agent's reasoning about traversal collapses to one shape; representation changes inside the collection scope to one file.

```js
// Before:
class RingBuffer {
  constructor(capacity) {
    this.buffer = new Array(capacity);
    this.head = 0;
    this.tail = 0;
    this.size = 0;
    this.capacity = capacity;
  }
  push(item) { /* ... */ }
}
function dump(buf) {
  let i = buf.head;
  let count = 0;
  while (count < buf.size) {
    console.log(buf.buffer[i]);
    i = (i + 1) % buf.capacity;
    count++;
  }
}
// Every consumer that wants to iterate must know head/tail/capacity
// and the modular arithmetic.

// After:
class RingBuffer {
  constructor(capacity) {
    this.buffer = new Array(capacity);
    this.head = 0;
    this.tail = 0;
    this.size = 0;
    this.capacity = capacity;
  }
  push(item) { /* ... */ }
  [Symbol.iterator]() {
    let i = this.head;
    let count = 0;
    const that = this;
    return {
      next() {
        if (count >= that.size) return { done: true, value: undefined };
        const value = that.buffer[i];
        i = (i + 1) % that.capacity;
        count++;
        return { done: false, value };
      },
    };
  }
}
for (const item of ringBuffer) {
  console.log(item);
}
```

_Example source: Illustrative example written for this site in the spirit of Design Patterns (Gamma, Helm, Johnson, Vlissides, Addison-Wesley, 1994), chapter 5. The book uses a List + ListIterator pair; this JavaScript adaptation uses the language's built-in Symbol.iterator protocol on a ring buffer because the encapsulation benefit (hiding modular arithmetic) reads more concretely than a generic List._

**Pressure:** Per-consumer traversal logic forces the agent to enumerate every consumer on every storage-layout change to prove the change is safe; the verification cost scales with the consumer count, and partial verification ships silent bugs that survive review.

**Tradeoff:** Per-traversal iterator allocation and the closure semantics of [Symbol.iterator] hide performance characteristics from the agent's static read. Tight-loop performance bugs require the agent to look at the iterator implementation, which is hidden behind the protocol.

**Relief:** Consumer-side traversal is one expression; collection-side representation is one file; agent edits to storage shape scope to one place and need no cross-consumer verification. Static analysis of 'where is this collection iterated' returns complete results.

**Trap:** Iterators with hidden mutability (re-entrant push during iteration, snapshot-vs-live semantics) produce bugs the agent cannot localize from the iterator protocol alone. The agent reading `for (const x of coll)` trusts the consumer side; runtime ordering bugs live in the iterator's interaction with the underlying mutation. Document or freeze; do not leave ambiguous.

**Triggered by:** Insider Trading (smells), Message Chains (smells), Encapsulate Collection (refactorings)
