---
name: unify-interfaces-with-adapter
description: Apply Unify Interfaces With Adapter when you see Alternative Classes with Different Interfaces, Change Function Declaration, Move Function. One adapter file the agent verifies once; consumers are uniform calls against a single interface.
---

# Apply: 26 — Unify Interfaces With Adapter

**Announce first:** name the chain of refactorings pointing at Unify Interfaces With Adapter and that you're applying it before the next edit. The user reads the announcement as your contract.

**Symptom:** `instanceof` branches at every consumer site the agent must verify match consistently. Per-consumer translation logic is duplicated; the agent's per-edit cost on a translation-rule change is proportional to consumer count.

**Goal:** One adapter file the agent verifies once; consumers are uniform calls against a single interface. Translation rules are centralized; consumer-side code is generic over the adapted type.

```js
// Before:
// Two classes do similar work through different shapes; callers branch on which they have.
class Logger {
  log(level, message) { /* writes to internal log */ }
}
class ThirdPartyReporter {
  report(severityName, text, context) { /* delivers to vendor */ }
}

function emitDiagnostic(emitter, level, message) {
  if (emitter instanceof Logger) {
    emitter.log(level, message);
  } else if (emitter instanceof ThirdPartyReporter) {
    emitter.report(level.toUpperCase(), message, {});
  } else {
    throw new Error('unknown emitter');
  }
}

// After:
// One adapter gives the vendor class the internal interface; callers stop branching.
class Logger {
  log(level, message) { /* writes to internal log */ }
}
class ThirdPartyReporter {
  report(severityName, text, context) { /* delivers to vendor */ }
}

class ReporterAsLogger {
  constructor(reporter) {
    this.reporter = reporter;
  }
  log(level, message) {
    this.reporter.report(level.toUpperCase(), message, {});
  }
}

function emitDiagnostic(logger, level, message) {
  logger.log(level, message);
}

// At the composition root:
const adaptedReporter = new ReporterAsLogger(new ThirdPartyReporter());
emitDiagnostic(adaptedReporter, 'error', 'something failed');
```

_Example source: Illustrative example written for this site, faithful to Kerievsky's pattern shape in Refactoring to Patterns (Addison-Wesley, 2004), chapter 6. Distinct from Extract Adapter (#5): that pattern pulls per-variant code from one host class into adapters; this pattern wraps an existing class so it conforms to a different existing interface._

**Pressure:** Per-consumer translation defeats static typing — the consumer's interface contract is implicit in the branches rather than declared. Adding a third variant means another branch at every consumer site (Shotgun Surgery scales with consumer × variant count).

**Tradeoff:** Adapter spreads the boundary across one extra class; the agent must trace from consumer through adapter to vendor to understand a single call's full path. Vendor-API changes ripple to the adapter — usually the right place — but the agent must remember to re-verify the adapter when the vendor updates.

**Relief:** Consumers reach for the canonical interface; a new vendor variant is one new adapter file, and existing consumer code does not change because the adapter's signature matches what the consumers already call.

**Trap:** An adapter that smuggles non-trivial logic (validation, error remapping, retries) hides behaviour the agent might expect to see at the consumer or at the vendor — neither location is now authoritative. When the adapter is doing more than shape-conversion, its name should reflect that (Gateway, Anti-Corruption Layer).

**Triggered by:** Alternative Classes with Different Interfaces (smells), Change Function Declaration (refactorings), Move Function (refactorings)
