---
name: prototype
description: Apply Prototype when you see Duplicated Code, Speculative Generality, Replace Subclass with Delegate. One prototype-registry table the agent reads once to enumerate every variant and its defaults.
---

# Apply: 31 — Prototype

**Announce first:** name the chain of refactorings pointing at Prototype and that you're applying it before the next edit. The user reads the announcement as your contract.

**Symptom:** N near-identical create methods the agent must scan in parallel to verify field-setting consistency. Adding a shared field requires the agent to find and update every method; missing one is a structurally-invisible bug the type checker doesn't see.

**Goal:** One prototype-registry table the agent reads once to enumerate every variant and its defaults. Cloning is a structural operation: the agent verifies clone() once, then trusts every per-variant change is data-only.

```js
// Before:
class GraphicEditor {
  createCircle(x, y) {
    const c = new Shape();
    c.kind = 'circle';
    c.fill = '#3498db';
    c.stroke = '#2c3e50';
    c.strokeWidth = 2;
    c.x = x; c.y = y; c.r = 20;
    return c;
  }
  createSquare(x, y) {
    const s = new Shape();
    s.kind = 'square';
    s.fill = '#e74c3c';
    s.stroke = '#2c3e50';
    s.strokeWidth = 2;
    s.x = x; s.y = y; s.side = 30;
    return s;
  }
  createStar(x, y) {
    const s = new Shape();
    s.kind = 'star';
    s.fill = '#f1c40f';
    s.stroke = '#2c3e50';
    s.strokeWidth = 2;
    s.x = x; s.y = y; s.points = 5; s.r = 25;
    return s;
  }
}

// After:
class Shape {
  clone() {
    return Object.assign(new Shape(), this);
  }
}
const SHAPE_PROTOTYPES = {
  circle: Object.assign(new Shape(), { kind: 'circle', fill: '#3498db', stroke: '#2c3e50', strokeWidth: 2, r: 20 }),
  square: Object.assign(new Shape(), { kind: 'square', fill: '#e74c3c', stroke: '#2c3e50', strokeWidth: 2, side: 30 }),
  star:   Object.assign(new Shape(), { kind: 'star',   fill: '#f1c40f', stroke: '#2c3e50', strokeWidth: 2, points: 5, r: 25 }),
};
function createShape(kind, x, y) {
  const shape = SHAPE_PROTOTYPES[kind].clone();
  shape.x = x;
  shape.y = y;
  return shape;
}
```

_Example source: Illustrative example written for this site in the spirit of Design Patterns (Gamma, Helm, Johnson, Vlissides, Addison-Wesley, 1994), chapter 3. The book's running example is a graphic editor's shape palette; this JavaScript adaptation keeps the registry-of-prototypes shape so adding a new shape variant is data, not a new createX method._

**Pressure:** Field additions cascade across every create method; the agent's edit cost grows linearly with variant count. The shared-by-convention shape is invisible to static analysis; the agent must compare methods pairwise to be sure they stay in sync.

**Tradeoff:** Shallow-clone aliasing bugs are the worst kind for the agent — symptoms appear far from the cause, in code that 'just reads a field'. Verifying clone semantics requires reasoning across the full clone graph; partial verification produces flaky-looking tests.

**Relief:** Adding a new variant is one new entry in the prototype registry; the clone operation works against every variant through the shared interface, and the agent reads one prototype's configuration to predict any clone's initial state.

**Trap:** Optional fields and conditional cloning logic accreting onto the prototype mask divergent variant shapes. The agent reading the registry sees a uniform table; the runtime sees branching behaviour that depends on which fields a prototype happens to have set. The structural promise the pattern made stops holding.

**Triggered by:** Duplicated Code (smells), Speculative Generality (smells), Replace Subclass with Delegate (refactorings)
