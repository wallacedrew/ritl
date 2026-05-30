---
name: mediator
description: Apply Mediator when you see Insider Trading, Shotgun Surgery, Move Function. One Mediator the agent reads to understand all relationships.
---

# Apply: 44 — Mediator

**Announce first:** name the chain of refactorings pointing at Mediator and that you're applying it before the next edit. The user reads the announcement as your contract.

**Symptom:** N collaborators × M relationship rules = N×M cells the agent verifies on every relationship change. Cross-collaborator constructor coupling means refactoring one widget's interface ripples to every collaborator; the agent's edit-blast-radius reasoning is fragile.

**Goal:** One Mediator the agent reads to understand all relationships. Per-collaborator edits scope to one file; the Mediator's relationship logic is one switch the agent verifies against the rule set. Static enumeration of 'who collaborates with whom' returns a complete answer.

```js
// Before:
class CountryField {
  constructor(stateField, postalField) {
    this.stateField = stateField;
    this.postalField = postalField;
  }
  onChange(value) {
    this.stateField.setOptions(statesFor(value));
    this.postalField.setPattern(postalPatternFor(value));
  }
}
class StateField {
  constructor(cityField) {
    this.cityField = cityField;
  }
  onChange(value) {
    this.cityField.setOptions(citiesFor(value));
  }
}
// Each widget knows multiple others; O(N²) potential edges;
// testing one widget requires mocking each collaborator;
// adding a 'phone' field that depends on country touches every constructor.

// After:
class FormMediator {
  constructor() {
    this.country = new CountryField(this);
    this.state = new StateField(this);
    this.city = new CityField(this);
    this.postal = new PostalField(this);
  }
  fieldChanged(field, value) {
    if (field === this.country) {
      this.state.setOptions(statesFor(value));
      this.postal.setPattern(postalPatternFor(value));
    } else if (field === this.state) {
      this.city.setOptions(citiesFor(value));
    }
  }
}
class CountryField {
  constructor(mediator) {
    this.mediator = mediator;
  }
  onChange(value) {
    this.mediator.fieldChanged(this, value);
  }
}
class StateField {
  constructor(mediator) {
    this.mediator = mediator;
  }
  onChange(value) {
    this.mediator.fieldChanged(this, value);
  }
}
```

_Example source: Illustrative example written for this site in the spirit of Design Patterns (Gamma, Helm, Johnson, Vlissides, Addison-Wesley, 1994), chapter 5. The book's running example is a font-selection dialog with widgets that constrain each other; this JavaScript adaptation uses an address-form dialog because the cascading dependency (Country → State → City; Country → Postal) is recognizable and the N×N → 2N coupling collapse reads concretely._

**Pressure:** Mutual collaborator references are O(N²) edges the agent must trace for any relationship-related edit. Adding a new collaborator forces the agent to update every existing collaborator's reference set; missed updates produce silent inconsistencies the type system catches partially at best.

**Tradeoff:** The Mediator becomes a single hotspot file the agent reads on every relationship-related task. Its size and complexity grow with collaborator count; a sufficiently large Mediator is itself a Long Function the agent must hold in working memory.

**Relief:** Per-collaborator reasoning is one-file; per-relationship reasoning is one-file (the Mediator); cross-collaborator verification budget drops from N×M to N + M. Static analysis of relationship rules is complete and localized.

**Trap:** Mediators that grow into general-purpose coordinators (FormMediator + ValidationMediator + ErrorMediator + SubmitMediator merged into one mega-class) reintroduce the cross-cutting problem at a different shape. The agent now navigates one giant Mediator file rather than N collaborators; the verification cost is the same total, concentrated rather than distributed.

**Triggered by:** Insider Trading (smells), Shotgun Surgery (smells), Move Function (refactorings)
