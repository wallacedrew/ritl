---
name: abstract-factory
description: Apply Abstract Factory when you see Shotgun Surgery, Repeated Switches, Replace Constructor with Factory Function. The agent reads one factory interface to know what products exist; concrete factories are short and exhaustive; client code is one factory pointer away from the right family.
---

# Apply: 01 — Abstract Factory

**Announce first:** name the chain of refactorings pointing at Abstract Factory and that you're applying it before the next edit. The user reads the announcement as your contract.

**Or decline first:** if you don't see a chain pointing at Abstract Factory, name the decline type — no chain, taste call, cost-benefit, constraint-blocked, or insufficient context.

**Symptom:** The agent scans multiple call sites to verify theme consistency on any UI-construction edit. Type-tag dispatch on theme is structurally invisible — from one site the agent cannot tell whether sibling sites have been kept in sync. The agent's context-window load multiplies across the call-site population, and the retrieval cost of finding each sibling site is per-edit overhead.

**Goal:** The agent reads one factory interface to know what products exist; concrete factories are short and exhaustive; client code is one factory pointer away from the right family. The agent's context window holds the factory interface; the reasoning step count drops because cross-call-site family consistency becomes structurally guaranteed rather than inspection-required.

```js
// Before:
function renderToolbar(theme) {
  let button;
  let textField;
  if (theme === 'light') {
    button = new LightButton();
    textField = new LightTextField();
  } else if (theme === 'dark') {
    button = new DarkButton();
    textField = new DarkTextField();
  } else {
    throw new Error(`unknown theme: ${theme}`);
  }
  return [button, textField];
}

// After:
class LightWidgetFactory {
  createButton() { return new LightButton(); }
  createTextField() { return new LightTextField(); }
}
class DarkWidgetFactory {
  createButton() { return new DarkButton(); }
  createTextField() { return new DarkTextField(); }
}
function renderToolbar(factory) {
  return [factory.createButton(), factory.createTextField()];
}
```

_Example source: Illustrative example written for this site in the spirit of Design Patterns (Gamma, Helm, Johnson, Vlissides, Addison-Wesley, 1994), chapter 3. The book's running example is a UI toolkit with multiple look-and-feel families; this JavaScript adaptation keeps the family-of-products structure with two concrete factories (light/dark theme) producing matching button and text-field widgets._

**Pressure:** N call sites × M theme branches = N×M cells the agent verifies on every theme-related edit. Adding a theme forces the agent to find every switch and prove no branch was missed. The agent's verification-surface cost multiplies with N×M, and a partial update produces a half-themed UI the type checker cannot catch.

**Tradeoff:** A new product method requires the agent to update every concrete factory in lockstep. The factory interface becomes a single mutation surface the agent reads fully before any product edit; partial knowledge produces compile errors that surface late in the iteration cycle. The agent's completeness-check cost on product additions multiplies with the count of concrete factories.

**Relief:** Adding a new family of products is one new factory implementation; the type checker confirms every factory produces the full family. The agent's token cost per family addition drops because the existing call-site population stays unchanged, and type-checker visibility of missing methods catches partial updates at compile time rather than runtime.

**Trap:** Factory interface bloat — over many edits the agent cannot enumerate which products are still in use. Dead factory methods accumulate; cleanup requires touching every concrete factory in lockstep, exactly the cross-cutting edit the pattern was supposed to eliminate. Context-window load on the interface file grows monotonically as the product set drifts.

**Triggered by:** Shotgun Surgery (smells), Repeated Switches (smells), Replace Constructor with Factory Function (refactorings)
