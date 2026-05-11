### Apply: 12 — Move Function

**Target state:** Each function lives where its data lives; coupling between modules drops.

**Why apply it:** Modules become more cohesive; tests stay focused; feature-envy patterns disappear.

**Pitfall:** Moving a function across modules can pull dependencies with it — confirm the new home actually has access to everything the function needs.

```js
// Avoid:
class Order { totalPriority() { return this.account.priority(); } }

// Prefer:
class Account { priority() { /* ... */ } }
class Order   { /* asks account directly when needed */ }
```

**Removes smells:** Feature Envy, Shotgun Surgery, Insider Trading, Divergent Change
