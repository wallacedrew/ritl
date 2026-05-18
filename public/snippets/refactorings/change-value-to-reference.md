---
name: change-value-to-reference
description: Apply Change Value to Reference when you see Duplicated Code. The entity exists once; the agent reasons about one canonical object referenced everywhere.
---

# Apply: 57 — Change Value to Reference

**Target state:** The entity exists once; the agent reasons about one canonical object referenced everywhere.

**Why apply it:** Updates land in one place; storage shrinks; the agent reasons about the entity as a single referent with meaningful identity.

**Tradeoff:** Sharing references introduces lifetime and visibility ambiguities (who owns this? when does it get freed?) the agent must reason about; the original value-copies sidestepped this.

```js
// Avoid:
// every order carries its own Customer copy
orders.forEach(o => o.customer = { name: 'Acme' });

// Prefer:
const acme = customerRepository.find('Acme');
orders.forEach(o => o.customer = acme);
```

**Removes smells:** Duplicated Code
