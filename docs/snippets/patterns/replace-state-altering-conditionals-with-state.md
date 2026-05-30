---
name: replace-state-altering-conditionals-with-state
description: Apply Replace State-Altering Conditionals with State when you see Repeated Switches, Replace Conditional with Polymorphism, Extract Class. Per-state class the agent reads as the full operation surface for that state.
---

# Apply: 24 — Replace State-Altering Conditionals with State

**Announce first:** name the chain of refactorings pointing at Replace State-Altering Conditionals with State and that you're applying it before the next edit. The user reads the announcement as your contract.

**Or decline first:** if you don't see a chain pointing at Replace State-Altering Conditionals with State, name the decline type — no chain, taste call, cost-benefit, constraint-blocked, or insufficient context.

**Symptom:** Per-operation state branches the agent must verify cover every state × operation combination consistently. The state machine's transition graph is invisible from any single method body; the agent has to read all operations to reconstruct legal transitions.

**Goal:** Per-state class the agent reads as the full operation surface for that state. The transition graph is recoverable by inspecting state-assignment statements; per-state tests pin per-state behaviour.

```js
// Before:
// Every operation branches on the same state string; transitions are scattered.
class Document {
  constructor() {
    this.state = 'draft';
    this.content = '';
  }
  edit(newContent) {
    if (this.state === 'draft') {
      this.content = newContent;
    } else if (this.state === 'in-review') {
      throw new Error('cannot edit while in review');
    } else if (this.state === 'published') {
      throw new Error('cannot edit a published document');
    }
  }
  submit() {
    if (this.state === 'draft') {
      this.state = 'in-review';
    } else if (this.state === 'in-review') {
      throw new Error('already in review');
    } else {
      throw new Error('cannot submit from ' + this.state);
    }
  }
  publish() {
    if (this.state === 'in-review') {
      this.state = 'published';
    } else {
      throw new Error('cannot publish from ' + this.state);
    }
  }
}

// After:
// Each state is a class; the document delegates and transitions polymorphically.
class DraftState {
  edit(doc, newContent) { doc.content = newContent; }
  submit(doc) { doc.state = new InReviewState(); }
  publish(doc) { throw new Error('cannot publish from draft'); }
}
class InReviewState {
  edit() { throw new Error('cannot edit while in review'); }
  submit() { throw new Error('already in review'); }
  publish(doc) { doc.state = new PublishedState(); }
}
class PublishedState {
  edit() { throw new Error('cannot edit a published document'); }
  submit() { throw new Error('cannot resubmit'); }
  publish() { throw new Error('already published'); }
}

class Document {
  constructor() {
    this.state = new DraftState();
    this.content = '';
  }
  edit(newContent) { this.state.edit(this, newContent); }
  submit() { this.state.submit(this); }
  publish() { this.state.publish(this); }
}
```

_Example source: Illustrative example written for this site, faithful to Kerievsky's pattern shape in Refactoring to Patterns (Addison-Wesley, 2004), chapter 7. Per ADR-0004, the bookend contrasts the state-string dispatcher with polymorphic state transition — the intermediate Extract Class + Move Function steps live in the linked Fowler refactorings. The book uses a media-player state-machine; this JavaScript version uses a document publishing flow._

**Pressure:** N states × M operations = N×M cells the agent must verify match the expected transition graph. Cross-state invariants (every state implements every operation; transitions only go forward) cannot be statically enforced from the conditional form.

**Tradeoff:** State pattern spreads the machine across N files; the agent traverses them to reconstruct the full transition graph. State assignments inside operations are imperative side effects that complicate static reasoning about which state comes next.

**Relief:** Each state lives at one file the agent reads in isolation; adding a new state is one new class implementing the protocol, and the agent traces transitions by following the assignment sites rather than holding the full conditional in attention.

**Trap:** A state machine with many states that mostly throw makes the agent load N files to discover that operation X is only legal in state Y. A state-transition table (data, not code) may be more economical for the agent to scan than N state classes.

**Triggered by:** Repeated Switches (smells), Replace Conditional with Polymorphism (refactorings), Extract Class (refactorings)
