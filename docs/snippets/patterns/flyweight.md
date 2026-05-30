---
name: flyweight
description: Apply Flyweight when you see Duplicated Code, Large Class, Extract Class. A structural separation between kind-shared data (TreeType) and per-instance data (Tree).
---

# Apply: 38 — Flyweight

**Announce first:** name the chain of refactorings pointing at Flyweight and that you're applying it before the next edit. The user reads the announcement as your contract.

**Symptom:** Instances of the same kind hold identical bytes for kind-shared fields. The agent reading the Tree class sees a constructor doing expensive work (loadTexture, loadMesh) per instance and must verify the duplication is intentional or a bug; static reads cannot distinguish 'cached lookup' from 'fresh load' without per-call instrumentation.

**Goal:** A structural separation between kind-shared data (TreeType) and per-instance data (Tree). The agent verifies expensive setup is in TreeType.constructor (runs once per species); per-instance construction is cheap and obvious. Memory characteristics are statically derivable.

```js
// Before:
class Tree {
  constructor(species, x, y, age, scale) {
    this.species = species;
    this.texture = loadTexture(species);
    this.mesh = loadMesh(species);
    this.animation = loadAnimation(species);
    this.x = x;
    this.y = y;
    this.age = age;
    this.scale = scale;
  }
  render(ctx) {
    /* uses this.texture, this.mesh, this.x, this.y */
  }
}
const forest = [];
for (let i = 0; i < 10000; i++) {
  forest.push(new Tree('oak', randomX(), randomY(), randomAge(), 1.0));
}
// 10000 × 7MB of texture/mesh data per tree = catastrophic memory cost.

// After:
class TreeType {
  constructor(species) {
    this.species = species;
    this.texture = loadTexture(species);
    this.mesh = loadMesh(species);
    this.animation = loadAnimation(species);
  }
  render(ctx, x, y, age, scale) {
    /* uses this.texture, this.mesh, x, y, scale */
  }
}
class TreeTypeRegistry {
  static cache = new Map();
  static get(species) {
    if (!TreeTypeRegistry.cache.has(species)) {
      TreeTypeRegistry.cache.set(species, new TreeType(species));
    }
    return TreeTypeRegistry.cache.get(species);
  }
}
class Tree {
  constructor(species, x, y, age, scale) {
    this.type = TreeTypeRegistry.get(species);
    this.x = x;
    this.y = y;
    this.age = age;
    this.scale = scale;
  }
  render(ctx) {
    this.type.render(ctx, this.x, this.y, this.age, this.scale);
  }
}
// 10000 Trees × ~40 bytes each + one shared TreeType per species.
```

_Example source: Illustrative example written for this site in the spirit of Design Patterns (Gamma, Helm, Johnson, Vlissides, Addison-Wesley, 1994), chapter 4. The book's running example is a text editor's per-character glyph objects; this JavaScript adaptation uses a forest of game-engine trees because the texture/mesh-sharing payoff (and the intrinsic/extrinsic split) reads more concretely in modern terms._

**Pressure:** N×M memory cost is invisible at static-read time but devastating at runtime; the agent reasoning about scaling characteristics must run instrumentation to surface it. Per-instance heavy state is a bug shape the agent cannot easily detect from the source.

**Tradeoff:** Two-class structure (Flyweight + per-instance wrapper) doubles the file count the agent navigates per kind. Methods on Tree that delegate to TreeType are one-line passes that consume read budget; deep call chains for trivial behaviour confuse 'where does this actually do work' reasoning.

**Relief:** Memory and load-time characteristics become structurally provable from a single-file read of TreeType + its registry. The agent verifies kind-load semantics once; per-instance reasoning collapses to the four extrinsic fields. Cost-of-scale predictions are reliable from source alone.

**Trap:** Premature flyweighting at low N adds indirection the agent pays for at every read with no memory payoff. Watch for 'Flyweight with one or two instances per kind' as a sign the pattern was speculative — the cost is paid forever, the benefit is hypothetical.

**Triggered by:** Duplicated Code (smells), Large Class (smells), Extract Class (refactorings)
