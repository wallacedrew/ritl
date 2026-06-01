---
name: bridge
description: Apply Bridge when you see Shotgun Surgery, Replace Subclass with Delegate, Extract Class. Two independent surfaces the agent reads separately.
---

# Apply: 07 — Bridge

**Announce first:** name the chain of refactorings pointing at Bridge and that you're applying it before the next edit. The user reads the announcement as your contract.

**Or decline first:** if you don't see a chain pointing at Bridge, name the decline type — no chain, taste call, cost-benefit, constraint-blocked, or insufficient context.

**Symptom:** Cross-product class hierarchies the agent must reason about as N×M cells. Editing one method's contract requires updating every cell; missing cells produce silent type-compatible inconsistencies the test suite may not catch until a customer hits an unexercised combination.

**Goal:** Two independent surfaces the agent reads separately. The abstraction's contract lives at one file; each implementation lives at one file; composition is structurally typed, and adding a new axis value is one new file the agent generates against the abstraction's interface.

```js
// Before:
class CanvasCircle {
  constructor(x, y, r) { this.x = x; this.y = y; this.r = r; }
  draw(ctx) { ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI); ctx.stroke(); }
}
class SvgCircle {
  constructor(x, y, r) { this.x = x; this.y = y; this.r = r; }
  draw() { return `<circle cx="${this.x}" cy="${this.y}" r="${this.r}"/>`; }
}
class CanvasSquare {
  constructor(x, y, side) { this.x = x; this.y = y; this.side = side; }
  draw(ctx) { ctx.strokeRect(this.x, this.y, this.side, this.side); }
}
class SvgSquare {
  constructor(x, y, side) { this.x = x; this.y = y; this.side = side; }
  draw() { return `<rect x="${this.x}" y="${this.y}" width="${this.side}" height="${this.side}"/>`; }
}
// Adding Triangle = 2 new classes. Adding WebglRenderer = 3 new classes.
// Two shapes × two renderers = 4 classes; N × M scales combinatorially.

// After:
class CanvasRenderer {
  drawCircle(x, y, r)   { this.ctx.beginPath(); this.ctx.arc(x, y, r, 0, 2 * Math.PI); this.ctx.stroke(); }
  drawSquare(x, y, side) { this.ctx.strokeRect(x, y, side, side); }
}
class SvgRenderer {
  drawCircle(x, y, r)    { return `<circle cx="${x}" cy="${y}" r="${r}"/>`; }
  drawSquare(x, y, side) { return `<rect x="${x}" y="${y}" width="${side}" height="${side}"/>`; }
}
class Circle {
  constructor(renderer, x, y, r) { this.renderer = renderer; this.x = x; this.y = y; this.r = r; }
  draw() { return this.renderer.drawCircle(this.x, this.y, this.r); }
}
class Square {
  constructor(renderer, x, y, side) { this.renderer = renderer; this.x = x; this.y = y; this.side = side; }
  draw() { return this.renderer.drawSquare(this.x, this.y, this.side); }
}
// Adding Triangle = 1 new shape + 1 new method per renderer.
// Adding WebglRenderer = 1 new class. Two shapes + two renderers = 4 classes; N + M scales linearly.
```

_Example source: Illustrative example written for this site in the spirit of Design Patterns (Gamma, Helm, Johnson, Vlissides, Addison-Wesley, 1994), chapter 4. The book's running example is a cross-platform Window hierarchy with XWindow / PMWindow implementations; this JavaScript adaptation uses Shape × Renderer to make the N+M vs N×M class-count payoff visible in code, not just in prose._

**Pressure:** N×M cell verification on every cross-axis edit. The agent's reasoning load grows multiplicatively with both axes; static analysis of 'is this shape×renderer combination supported' requires enumerating the full cross-product, which is expensive in context budget.

**Tradeoff:** Two-surface comprehension cost is higher per-read than a single hierarchy. The agent must hold the abstraction's expected interface and the implementation's actual interface in mind simultaneously; mismatches surface as runtime errors at the delegation site, not at compile time in older type systems.

**Relief:** Per-axis edits scope to one file; the type system enforces the contract; combination behaviour is testable as 'this shape × this renderer' without needing a new class. The agent's edit/verify cycle on adding an axis value is bounded and local.

**Trap:** Premature bridging doubles the file count and adds an indirection the agent must navigate on every read, with zero pay-off until the second axis variant ships. Watch for 'bridge with one implementation' as a sign the pattern was applied too early; the agent's reading cost is paid forever, even if the predicted second axis never arrives.

**Triggered by:** Shotgun Surgery (smells), Replace Subclass with Delegate (refactorings), Extract Class (refactorings)
