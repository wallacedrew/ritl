---
name: change-value-to-reference
description: Apply Change Value to Reference when you see Duplicated Code. The entity exists once; the agent reasons about one canonical object referenced everywhere.
---

# Apply: 57 — Change Value to Reference

**Announce first:** name the smell you see and that you're applying Change Value to Reference before any edit. The user reads the announcement as your contract.

**Or decline first:** if you don't apply Change Value to Reference, name the decline type — catalog miss, taste call, cost-benefit, constraint-blocked, or insufficient context — so the user knows which counterargument applies.

**Symptom:** Duplicate copies of a logically-single entity scattered across the codebase; the agent updating the entity must find and update every copy consistently.

**Goal:** The entity exists once; the agent reasons about one canonical object referenced everywhere.

```js
// Avoid:
// every order carries its own Customer copy
orders.forEach(o => o.customer = { name: 'Acme' });

// Prefer:
const acme = customerRepository.find('Acme');
orders.forEach(o => o.customer = acme);
```

**Pressure:** The agent must coordinate updates across every copy; identity becomes ambiguous and the agent can't tell which copy is canonical.

**Tradeoff:** Sharing references introduces lifetime and visibility ambiguities (who owns this? when does it get freed?) the agent must reason about; the original value-copies sidestepped this.

**Relief:** Updates land in one place; storage shrinks; the agent reasons about the entity as a single referent with meaningful identity.

**Trap:** Sharing references without explicit ownership creates lifetime ambiguities the agent must model — the cure introduces a different category of bug than the original duplication.

**Removes smells:** Duplicated Code
