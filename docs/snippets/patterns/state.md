---
name: state
description: Apply State when you see Repeated Switches, Primitive Obsession, Replace Conditional with Polymorphism. One class per state, each owning its operation set exhaustively.
---

# Apply: 47 — State

**Symptom:** Per-method switches on state are O(states × methods) cells the agent verifies for every state-related edit. Adding a state requires editing every method symmetrically; missed methods produce type-compatible bugs (string status fallback to a default) the test suite may not exercise on the new state.

**Goal:** One class per state, each owning its operation set exhaustively. The agent reads one state file to understand its full behaviour; static analysis returns complete answers about 'what does X mean in state Y'; type system enforces operation-set completeness on every state class.

```js
// Before:
class Order {
  constructor() {
    this.status = 'pending';
    this.items = [];
  }
  confirm() {
    if (this.status !== 'pending') throw new Error('can only confirm pending');
    this.status = 'confirmed';
  }
  ship() {
    if (this.status !== 'confirmed') throw new Error('can only ship confirmed');
    this.status = 'shipped';
  }
  deliver() {
    if (this.status !== 'shipped') throw new Error('can only deliver shipped');
    this.status = 'delivered';
  }
  cancel() {
    if (this.status === 'delivered') throw new Error('cannot cancel delivered');
    if (this.status === 'shipped') refundAfterReturn();
    this.status = 'cancelled';
  }
}
// Every method switches on this.status. Adding 'On Hold' touches every method.

// After:
class PendingState {
  confirm(order) { order.setState(new ConfirmedState()); }
  ship() { throw new Error('cannot ship pending order'); }
  deliver() { throw new Error('cannot deliver pending order'); }
  cancel(order) { order.setState(new CancelledState()); }
}
class ConfirmedState {
  confirm() { throw new Error('already confirmed'); }
  ship(order) { order.setState(new ShippedState()); }
  deliver() { throw new Error('cannot deliver before ship'); }
  cancel(order) { order.setState(new CancelledState()); }
}
class ShippedState {
  confirm() { throw new Error('already shipped'); }
  ship() { throw new Error('already shipped'); }
  deliver(order) { order.setState(new DeliveredState()); }
  cancel(order) { refundAfterReturn(); order.setState(new CancelledState()); }
}
class DeliveredState {
  confirm() { throw new Error('already delivered'); }
  ship() { throw new Error('already delivered'); }
  deliver() { throw new Error('already delivered'); }
  cancel() { throw new Error('cannot cancel delivered'); }
}
class Order {
  constructor() {
    this.state = new PendingState();
    this.items = [];
  }
  setState(s) { this.state = s; }
  confirm() { this.state.confirm(this); }
  ship() { this.state.ship(this); }
  deliver() { this.state.deliver(this); }
  cancel() { this.state.cancel(this); }
}
```

_Example source: Illustrative example written for this site in the spirit of Design Patterns (Gamma, Helm, Johnson, Vlissides, Addison-Wesley, 1994), chapter 5. The book's running example is a TCP connection's state machine; this JavaScript adaptation uses an e-commerce order lifecycle because the state set is small enough to read in code and the per-transition rules are concrete._

**Pressure:** State-as-primitive is invisible to the type system as a set; the agent cannot prove from static read that every method handles every state. Adding a state requires editing every method; verification is N×M cells the agent must trace one at a time.

**Tradeoff:** N state classes is N files the agent navigates to understand the system. Stack traces show 'ShippedState.cancel' but resolving 'what is cancel here' requires reading the State class hierarchy. The cost is paid on every state-related investigation.

**Relief:** Each state lives at one file the agent reads in isolation; adding a new state is one new class implementing the protocol, and the type checker confirms every state handles every operation defined on the protocol.

**Trap:** Shared behaviour across states (every cancel logs an audit event) repeated across state files re-creates Duplicated Code at the new layer. The agent reading the State class hierarchy must verify the shared logic per state; without a common policy or superclass, the agent loses confidence in cross-state consistency on every edit.

**Triggered by:** Repeated Switches (smells), Primitive Obsession (smells), Replace Conditional with Polymorphism (refactorings)
