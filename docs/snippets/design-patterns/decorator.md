---
name: decorator
description: Apply Decorator when you see Large Class, Divergent Change, Replace Subclass with Delegate. N small wrapper classes the agent reads one at a time.
---

# Apply: 09 — Decorator

**Announce first:** name the chain of refactorings pointing at Decorator and that you're applying it before the next edit. The user reads the announcement as your contract.

**Or decline first:** if you don't see a chain pointing at Decorator, name the decline type — no chain, taste call, cost-benefit, constraint-blocked, or insufficient context.

**Symptom:** Combinatorial subclass explosion or feature-flag-laden monoliths the agent must verify exhaustively on every behavioural change. 2^N combinations means N×(N-1) feature-interaction cells the agent reasons about; feature flags inside one class make the class's behaviour parametric on flag combinations.

**Goal:** N small wrapper classes the agent reads one at a time. Feature composition is explicit in the construction expression; each wrapper's behaviour is its own one-file unit; tests cover each wrapper × wrappee combination compositionally.

```js
// Before:
class EmailNotifier {
  send(message) { /* email */ }
}
class EmailAndSmsNotifier {
  send(message) { /* email + sms */ }
}
class EmailAndSlackNotifier {
  send(message) { /* email + slack */ }
}
class EmailAndSmsAndSlackNotifier {
  send(message) { /* email + sms + slack */ }
}
// N channels → 2^N notifier classes. Adding 'Discord' doubles the
// hierarchy. Each new combination repeats the orchestration logic.

// After:
class EmailNotifier {
  send(message) { /* email */ }
}
class SmsDecorator {
  constructor(wrapped) { this.wrapped = wrapped; }
  send(message) {
    this.wrapped.send(message);
    /* also send sms */
  }
}
class SlackDecorator {
  constructor(wrapped) { this.wrapped = wrapped; }
  send(message) {
    this.wrapped.send(message);
    /* also post to slack */
  }
}
// Compose at the call site:
const notifier = new SlackDecorator(new SmsDecorator(new EmailNotifier()));
notifier.send('Build failed');
// N channels → N classes. Adding 'Discord' = 1 new decorator.
```

_Example source: Illustrative example written for this site in the spirit of Design Patterns (Gamma, Helm, Johnson, Vlissides, Addison-Wesley, 1994), chapter 4. The book's running example is a windowing toolkit with scroll-bars and borders as decorators; this JavaScript adaptation uses a multi-channel notifier because the composability of channels makes the 2^N → N collapse visible in code._

**Pressure:** Combinatorial hierarchy growth turns 'add a feature' into 'edit every existing combination'. Feature-flag monoliths concentrate the verification burden into one mega-class whose behaviour the agent must trace through every flag-permutation. Both shapes consume context budget that should be spent on the calling code.

**Tradeoff:** Wrapping chains are stack-allocated indirection the agent must navigate per operation. Tracing why `notifier.send(msg)` produced a specific side effect requires the agent to walk the wrapping chain — and the chain's composition is dynamic, set at the construction site that may live in a different module.

**Relief:** Per-feature edits scope to one decorator file; verification scales linearly with feature count. Stack traces map decorators 1:1 to call frames; the agent can localize bugs by reading one wrapper at a time. Compositional tests cover combinations without enumerating them.

**Trap:** Decorators whose semantics depend on wrapping order (RetryDecorator(LoggingDecorator(X)) vs LoggingDecorator(RetryDecorator(X))) force the agent to verify order-correctness on every construction site. The construction expression becomes part of the spec; PR review must catch wrong-order regressions the type system cannot.

**Triggered by:** Large Class (smells), Divergent Change (smells), Replace Subclass with Delegate (refactorings)
