---
name: move-embellishment-to-decorator
description: Apply Move Embellishment To Decorator when you see Long Parameter List, Extract Class, Replace Subclass with Delegate. One file per behaviour the agent reads in isolation; the core class is short and verifiable on its own.
---

# Apply: 16 — Move Embellishment To Decorator

**Announce first:** name the chain of refactorings pointing at Move Embellishment To Decorator and that you're applying it before the next edit. The user reads the announcement as your contract.

**Or decline first:** if you don't see a chain pointing at Move Embellishment To Decorator, name the decline type — no chain, taste call, cost-benefit, constraint-blocked, or insufficient context.

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

**Relief:** Adding or removing an embellishment is one decorator file or one wiring edit at the construction site; the core class holds the base behavior without optional-feature conditionals, and per-feature tests load one decorator instead of every combination.

**Trap:** Five-deep decorator chains require the agent to load five definitions before reading the call. Stack traces obscure where in the chain a failure occurred; the agent's debugging cost goes up with depth. A composition-style API that names the intended capability set can be more legible than the raw chain.

**Triggered by:** Long Parameter List (smells), Extract Class (refactorings), Replace Subclass with Delegate (refactorings)
