---
name: move-function
description: Apply Move Function when you see Feature Envy, Shotgun Surgery, Insider Trading, Divergent Change. Each function lives where its data lives; coupling between modules drops.
---

# Apply: 12 — Move Function

**Target state:** Each function lives where its data lives; coupling between modules drops.

**Why apply it:** Modules become more cohesive; tests stay focused; feature-envy patterns disappear.

**Tradeoff:** Dependencies don't always travel cleanly — circular imports surface at the destination, and readers' 'where does this live' map briefly breaks.

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
