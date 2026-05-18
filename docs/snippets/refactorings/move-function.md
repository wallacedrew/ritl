---
name: move-function
description: Apply Move Function when you see Feature Envy, Shotgun Surgery, Insider Trading, Divergent Change. Each function lives where its data lives; the agent loads one class to reason about one behavior.
---

# Apply: 12 — Move Function

**Target state:** Each function lives where its data lives; the agent loads one class to reason about one behavior.

**Why apply it:** The function's data sits inside the agent's current reasoning context; verifying behavior touches one class instead of two.

**Tradeoff:** Dependencies don't always travel cleanly — circular imports surface at the destination, and the agent's mental map of 'where does this live' briefly breaks until indices refresh.

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

**Removes smells:** Feature Envy, Shotgun Surgery, Insider Trading, Divergent Change
