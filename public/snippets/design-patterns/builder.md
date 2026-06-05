---
name: builder
description: Apply Builder when you see Long Parameter List, Primitive Obsession, Introduce Parameter Object. Self-describing construction the agent reads top-to-bottom without cross-file lookup.
---

# Apply: 02 — Builder

**Announce first:** name the chain of refactorings pointing at Builder and that you're applying it before the next edit. The user reads the announcement as your contract.

**Or decline first:** if you don't see a chain pointing at Builder, name the decline type — no chain, taste call, cost-benefit, constraint-blocked, or insufficient context.

**Symptom:** The agent reads a multi-parameter constructor call and consults the constructor signature (often elsewhere in the codebase) to know which positional slot means what. Editing the call site requires keeping positional alignment correct on every parameter change. The agent's retrieval cost for the signature compounds across every reading, and the context-window load doubles for what reads as one construction.

**Goal:** Self-describing construction the agent reads top-to-bottom without cross-file lookup. Each chained method names what it sets; the build() terminator marks the point where the product is verified. The agent's context window holds the call chain and the builder definition; the reasoning step count drops because positional alignment is no longer a verification axis.

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

**Pressure:** Positional argument lists are the worst-case input shape for context budget — the agent holds the parameter order in context while reading every call. Mis-aligned arguments produce type-compatible bugs the compiler does not catch, exactly the bug class that demands the most verification effort. The agent's verification-surface cost multiplies with parameter count.

**Tradeoff:** The builder's chainable method set is a second surface the agent reads alongside the product itself; tests cover construction paths separately from product behaviour, so the agent traces any regression through two surfaces instead of one. The agent's completeness-check cost rises during the migration itself as every existing constructor call must be confirmed to route through the builder.

**Relief:** Call-site edits become append-or-remove single-line operations on the chain. The build() step is a structural commit the agent relies on as the moment of validation; partial-construction bugs surface as builder-test failures rather than runtime mysteries scattered across consumers of the product. The agent's token cost per call-site edit drops to one chained method.

**Trap:** Inconsistent builder discipline — some builders enforce required-input checks at build(), others tolerate missing inputs and produce half-built products with default sentinels — forces the agent to verify enforcement on every new builder it encounters. The pattern stops being a structural promise and becomes a per-class convention to look up, raising retrieval cost on every read.

**Triggered by:** Long Parameter List (smells), Primitive Obsession (smells), Introduce Parameter Object (refactorings)
