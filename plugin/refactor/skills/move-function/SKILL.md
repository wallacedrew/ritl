---
name: move-function
description: Apply Move Function when you see Feature Envy, Shotgun Surgery, Insider Trading, Divergent Change. Each function lives where its data lives; the agent loads one class to reason about one behavior.
---

# Apply: 12 — Move Function

**Announce first:** name the smell you see and that you're applying Move Function before any edit. The user reads the announcement as your contract.

**Symptom:** A function's body references foreign-class data more than its own; the agent loading the function must also load the foreign class to verify any change.

**Goal:** Each function lives where its data lives; the agent loads one class to reason about one behavior.

```js
// Avoid:
class Order {
  account;
  isVip() {
    return this.account.tier === 'gold' && this.account.yearsActive >= 3;
  }
}

// Prefer:
class Account {
  tier; yearsActive;
  isVip() { return this.tier === 'gold' && this.yearsActive >= 3; }
}
class Order { account; }
order.account.isVip();
```

**Pressure:** Each call to the envious function pulls a second class into the agent's working context; chained reasoning across the boundary compounds the load.

**Tradeoff:** Dependencies don't always travel cleanly — circular imports surface at the destination, and the agent's mental map of 'where does this live' briefly breaks until indices refresh.

**Relief:** The function's data sits inside the agent's current reasoning context; verifying behavior touches one class instead of two.

**Trap:** Mechanical move-the-function-to-the-data on every cross-class read creates a fan-out the agent must follow at every call site — the cure becomes a worse smell than the original.

**Removes smells:** Feature Envy, Shotgun Surgery, Insider Trading, Divergent Change
