---
name: proxy
description: Apply Proxy when you see Insider Trading, Encapsulate Variable, Replace Subclass with Delegate. One Proxy class the agent reads to know the policy.
---

# Apply: 39 — Proxy

**Symptom:** Scattered per-client policy checks (auth, init, cache) the agent must verify uniformly on every change. Eager construction of expensive resources the agent must trace through the constructor at every reading to understand load semantics.

**Goal:** One Proxy class the agent reads to know the policy. Clients are uniform calls to the interface; the agent's verification budget on access policy collapses to one file. Load and access semantics are statically derivable from the Proxy's implementation.

```js
// Before:
class Image {
  constructor(url) {
    this.url = url;
    this.pixels = downloadAndDecode(url);
  }
  draw(ctx, x, y) {
    ctx.putImageData(this.pixels, x, y);
  }
}
// Building a gallery thumbnail row:
const images = thumbnailUrls.map((url) => new Image(url));
// 100 thumbnails × 50MB decoded pixels = 5GB up front,
// even if the user only ever scrolls past 10 of them.

// After:
class Image {
  constructor(url) {
    this.url = url;
    this.pixels = downloadAndDecode(url);
  }
  draw(ctx, x, y) {
    ctx.putImageData(this.pixels, x, y);
  }
}
class ImageProxy {
  constructor(url) {
    this.url = url;
    this.real = null;
  }
  draw(ctx, x, y) {
    if (this.real === null) {
      this.real = new Image(this.url);
    }
    this.real.draw(ctx, x, y);
  }
}
const images = thumbnailUrls.map((url) => new ImageProxy(url));
// ~24 bytes per proxy. Only the images that draw() is called on materialize.
```

_Example source: Illustrative example written for this site in the spirit of Design Patterns (Gamma, Helm, Johnson, Vlissides, Addison-Wesley, 1994), chapter 4. The book's running example is a document with embedded images that load on demand; this JavaScript adaptation uses a thumbnail gallery because the lazy-loading payoff is concrete and the same-interface contract between Image and ImageProxy reads in code._

**Pressure:** Per-client policy is N×M cells (N clients × M policy aspects); each cell is a potential miss the agent verifies independently. Eager construction hides load cost in constructor side effects, which the agent cannot localize from a single-file read.

**Tradeoff:** The agent must trace through Subject + Proxy to understand any operation's full behaviour; stack traces span both layers; runtime errors require the agent to disambiguate 'did the Proxy or the Subject raise this?' Same-interface contracts depend on subtle behavioural conformance the type system does not enforce.

**Relief:** Policy edits scope to the Proxy; client code unchanged; cross-client uniformity is structurally guaranteed. The agent's reasoning about access semantics is one-file-bounded; tests for the Proxy cover policy exhaustively without per-client repetition.

**Trap:** Subject and Proxy diverging on subtle semantics (concurrency, error types, side-effect timing) produces type-compatible bugs the agent struggles to localize. The agent reading client code trusts the interface contract; the runtime experience contradicts that trust intermittently, exactly the bug shape that survives review and ships.

**Triggered by:** Insider Trading (smells), Encapsulate Variable (refactorings), Replace Subclass with Delegate (refactorings)
