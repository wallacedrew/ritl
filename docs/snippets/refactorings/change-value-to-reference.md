---
name: change-value-to-reference
description: Apply Change Value to Reference when you see Duplicated Code. Duplicate copies of a logically-single entity collapse into one shared object that everyone references.
---

# Apply: 57 — Change Value to Reference

**Target state:** Duplicate copies of a logically-single entity collapse into one shared object that everyone references.

**Why apply it:** Updates to the entity are visible everywhere; storage shrinks; identity becomes meaningful again.

**Tradeoff:** Sharing introduces the question 'who owns this?' — make sure the lifetime and visibility of the shared reference are well-defined.

```js
// Avoid:
// every order carries its own Customer copy
orders.forEach(o => o.customer = { name: 'Acme' });

// Prefer:
const acme = customerRepository.find('Acme');
orders.forEach(o => o.customer = acme);
```

**Removes smells:** Duplicated Code
