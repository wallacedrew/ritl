---
name: encapsulate-composite-with-builder
description: Apply Encapsulate Composite With Builder when you see Long Function, Hide Delegate, Extract Class. A construction site that reads as a tree literal the agent can parse structurally in one pass.
---

# Apply: 04 — Encapsulate Composite With Builder

**Announce first:** name the chain of refactorings pointing at Encapsulate Composite With Builder and that you're applying it before the next edit. The user reads the announcement as your contract.

**Or decline first:** if you don't see a chain pointing at Encapsulate Composite With Builder, name the decline type — no chain, taste call, cost-benefit, constraint-blocked, or insufficient context.

**Symptom:** A construction site the agent must trace line-by-line across many intermediate variable assignments to reconstruct the tree's shape. Behavioural preservation on tree-shape edits requires loading the full construction span and following cross-variable references to verify which child lives under which parent.

**Goal:** A construction site that reads as a tree literal the agent can parse structurally in one pass. Edits to one subtree don't require loading the rest; the chain's indentation tells the agent which method calls operate on which node.

```js
// Before:
// Client constructs the XML tree by wiring TagNodes manually.
const order = new TagNode('Order');
const customer = new TagNode('Customer');
customer.setAttribute('id', 'C-901');
order.addChild(customer);
const items = new TagNode('Items');
const item1 = new TagNode('Item');
item1.setAttribute('sku', '123');
item1.setAttribute('qty', '2');
items.addChild(item1);
const item2 = new TagNode('Item');
item2.setAttribute('sku', '456');
item2.setAttribute('qty', '1');
items.addChild(item2);
order.addChild(items);
const xml = order.toXML();

// After:
// Client reads as an outline of the tree it builds.
const xml = new XMLBuilder('Order')
  .addChild('Customer').addAttribute('id', 'C-901').end()
  .addChild('Items')
    .addChild('Item').addAttribute('sku', '123').addAttribute('qty', '2').end()
    .addChild('Item').addAttribute('sku', '456').addAttribute('qty', '1').end()
  .end()
  .toXML();
```

_Example source: Adapted from Joshua Kerievsky's XML-builder example in Refactoring to Patterns (Addison-Wesley, 2004), chapter 6. The Java original used a TagNode composite + XMLBuilder fluent API; this JavaScript translation keeps the same shape — TagNode for the composite, a chained builder for the construction grammar._

**Pressure:** Tree wiring across N intermediate variables × M tree nodes consumes context budget proportional to the tree's size. Renaming a variable risks breaking the wiring; the data flow is brittle in a way static analysis cannot fully catch.

**Tradeoff:** A fluent chain is one large expression the agent must keep coherent — losing track of `.end()` placement silently produces a different tree shape. Long chains evade static analysis of intermediate states, and partial failures inside the chain are hard to attribute.

**Relief:** The builder's method chain reads structurally; nested calls visually mirror nested nodes. Verifying a tree edit is a localized diff inside the chain rather than a cross-variable trace; the build is a single expression with one rooted result.

**Trap:** A builder that returns `this` everywhere becomes one massive expression; the agent's reasoning about partial-state failures degrades because there are no intermediate names to anchor on. Debugging requires re-reading the entire chain to localize where the failure happened.

**Triggered by:** Long Function (smells), Hide Delegate (refactorings), Extract Class (refactorings)
