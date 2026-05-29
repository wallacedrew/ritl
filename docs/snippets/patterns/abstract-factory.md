---
name: abstract-factory
description: Apply Abstract Factory when you see Shotgun Surgery, Repeated Switches, Replace Constructor with Factory Function. The agent reads one factory interface to know what products exist; concrete factories are short and exhaustive; client code is one factory pointer away from the right family.
---

# Apply: 28 — Abstract Factory

**Symptom:** The agent must scan multiple call sites to verify theme consistency on any UI-construction edit. Type-tag dispatch on theme is structurally invisible — from one call site the agent cannot tell whether all sibling sites have been kept in sync, so verification balloons to the full file set.

**Goal:** The agent reads one factory interface to know what products exist; concrete factories are short and exhaustive; client code is one factory pointer away from the right family. Cross-call-site family consistency becomes structurally guaranteed, not inspection-required.

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

**Pressure:** N call sites × M theme branches = N×M cells the agent must verify on every theme-related edit. Adding a theme requires the agent to find every switch and prove no branch was missed — high context cost, high verification load, and the proof is fragile because nothing structural anchors it.

**Tradeoff:** A new product method requires the agent to update every concrete factory in lockstep. The factory interface becomes a single mutation surface the agent must understand fully before any product edit; partial knowledge produces compile errors, but compile errors that surface late in the iteration cycle.

**Relief:** Adding a new family of products is one new factory implementation; the type checker confirms every factory produces the full family, and client code reaches for the factory once at construction without per-product conditional branches.

**Trap:** Factory interface bloat — over many edits the agent loses sight of which products are still in use. Dead factory methods accumulate because no client demands them but the interface contract still requires them; cleanup requires touching every concrete factory together, exactly the cross-cutting edit the pattern was supposed to eliminate.

**Triggered by:** Shotgun Surgery (smells), Repeated Switches (smells), Replace Constructor with Factory Function (refactorings)
