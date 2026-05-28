---
name: observer
description: Apply Observer when you see Shotgun Surgery, Divergent Change, Hide Delegate. One subscribe/notify protocol the agent reads once per subject.
---

# Apply: 46 — Observer

**Symptom:** Per-consumer references inside the subject are N×M cells (N subjects × M consumers each) the agent verifies on every consumer-set change. Adding a consumer forces the agent to edit subject + caller in lockstep; the subject's diff history conflates unrelated concerns.

**Goal:** One subscribe/notify protocol the agent reads once per subject. Consumer registration is one expression at the call site; subject edits do not scale with consumer count. Static analysis of 'who subscribes to this subject' is grep-able and complete.

```js
// Before:
class TemperatureSensor {
  constructor(currentDisplay, chartDisplay, alertSystem) {
    this.currentDisplay = currentDisplay;
    this.chartDisplay = chartDisplay;
    this.alertSystem = alertSystem;
    this.temperature = 0;
  }
  setTemperature(t) {
    this.temperature = t;
    this.currentDisplay.update(t);
    this.chartDisplay.recordSample(t);
    if (t > 80) this.alertSystem.fire('high temperature');
  }
}
// Adding a mobile-push consumer or a CSV-logger consumer requires editing
// the sensor's constructor and setTemperature in lockstep. Subject changes
// for unrelated reasons; one consumer's bug forces a sensor redeploy.

// After:
class TemperatureSensor {
  constructor() {
    this.observers = [];
    this.temperature = 0;
  }
  subscribe(observer) {
    this.observers.push(observer);
    return () => {
      this.observers = this.observers.filter((o) => o !== observer);
    };
  }
  setTemperature(t) {
    this.temperature = t;
    for (const observer of this.observers) {
      observer.notify(t);
    }
  }
}
const sensor = new TemperatureSensor();
sensor.subscribe({ notify: (t) => currentDisplay.update(t) });
sensor.subscribe({ notify: (t) => chartDisplay.recordSample(t) });
sensor.subscribe({ notify: (t) => { if (t > 80) alertSystem.fire('high temperature'); }});
```

_Example source: Illustrative example written for this site in the spirit of Design Patterns (Gamma, Helm, Johnson, Vlissides, Addison-Wesley, 1994), chapter 5. The book's running example is a spreadsheet's chart updating when cell data changes; this JavaScript adaptation uses a temperature sensor + multiple displays because the subscribe/notify shape and the consumer-count growth are easier to picture._

**Pressure:** Hard-coded subject→consumer wiring forces the agent to verify each consumer's contract on every subject edit. The diff blast radius for a new consumer is unpredictable; the verification budget grows linearly with consumer count.

**Tradeoff:** Notify dispatch order and re-entrancy semantics are runtime-only properties the agent cannot statically derive. Observers that depend on dispatch order produce flaky test failures; the agent investigating one must trace runtime subscription order, which is invisible in the source.

**Relief:** Subject edits scope to one file; consumer additions are zero-edit on the subject; static analysis of subscriber set is complete by grep. Tests for the subject cover notification dispatch exhaustively without per-consumer setup.

**Trap:** Re-entrancy bugs (observer A's notify() triggers a state change that re-fires notify() on A) and silent unsubscribe leaks are runtime-only failure modes. The agent reading subscribe/notify trusts the contract; runtime ordering and memory bugs survive review and surface as flaky behaviour in production.

**Triggered by:** Shotgun Surgery (smells), Divergent Change (smells), Hide Delegate (refactorings)
