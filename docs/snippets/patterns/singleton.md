---
name: singleton
description: Apply Singleton when you see Global Data, Duplicated Code, Encapsulate Variable. A single getInstance() access point the agent can grep for to enumerate every consumer.
---

# Apply: 32 — Singleton

**Announce first:** name the chain of refactorings pointing at Singleton and that you're applying it before the next edit. The user reads the announcement as your contract.

**Or decline first:** if you don't see a chain pointing at Singleton, name the decline type — no chain, taste call, cost-benefit, constraint-blocked, or insufficient context.

**Symptom:** The agent sees `new Config()` scattered across modules and cannot tell from reading whether the consumers share state. Test-isolation reasoning requires the agent to enumerate every construction site; assumptions about 'one config' are unverifiable at static read time.

**Goal:** A single getInstance() access point the agent can grep for to enumerate every consumer. Construction is structurally one-shot; the agent's reasoning about 'who owns this state' has exactly one answer; tests against shared state are explicit about reset.

```js
// Before:
class Config {
  constructor() {
    this.values = loadFromDisk();
  }
}
// every consumer constructs its own:
const databaseModule = { config: new Config() };
const httpModule = { config: new Config() };
const loggerModule = { config: new Config() };
// three disk reads; three copies that drift if the file changes;
// no canonical 'current configuration' anywhere in the system.

// After:
class Config {
  static instance = null;
  static getInstance() {
    if (Config.instance === null) {
      Config.instance = new Config(Config.#TOKEN);
    }
    return Config.instance;
  }
  static #TOKEN = Symbol('Config.constructor');
  constructor(token) {
    if (token !== Config.#TOKEN) {
      throw new Error('Use Config.getInstance() — Config is a singleton');
    }
    this.values = loadFromDisk();
  }
}
const databaseModule = { config: Config.getInstance() };
const httpModule = { config: Config.getInstance() };
const loggerModule = { config: Config.getInstance() };
```

_Example source: Illustrative example written for this site in the spirit of Design Patterns (Gamma, Helm, Johnson, Vlissides, Addison-Wesley, 1994), chapter 3. The book's running example is a printer-spooler; this JavaScript adaptation uses a configuration registry where the expensive disk load happens at most once. The private-token guard makes new Config() unconstructable from outside, mirroring the book's private-constructor enforcement in languages that have it._

**Pressure:** Per-consumer copies multiply the agent's state-graph reasoning by consumer count. Cross-module bugs caused by stale copies are nearly impossible to localize statically — the agent must trace runtime construction order, which is invisible in the source.

**Tradeoff:** Singleton state survives across tests by default; the agent must remember per-test reset discipline that the test framework does not enforce. Coupling consumers to a static getter hides the dependency in a way linters cannot warn about — the agent's 'who depends on what' graph is structurally incomplete.

**Relief:** The instance is constructed at one site (the getter); a grep for the getter returns every consumer; the loading strategy lives at one class the agent edits once to change how the instance is created.

**Trap:** When tests rely on Config.getInstance() returning a real (live) instance, the agent's edits to Config silently break unrelated tests through the shared-state coupling. The pattern's convenience hides exactly the kind of cross-cutting dependency the agent needs structural visibility into.

**Triggered by:** Global Data (smells), Duplicated Code (smells), Encapsulate Variable (refactorings)
