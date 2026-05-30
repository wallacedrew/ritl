---
name: extract-adapter
description: Apply Extract Adapter when you see Divergent Change, Extract Class, Replace Conditional with Polymorphism. One adapter file per variant; the agent verifies each adapter independently against the external API.
---

# Apply: 05 — Extract Adapter

**Announce first:** name the chain of refactorings pointing at Extract Adapter and that you're applying it before the next edit. The user reads the announcement as your contract.

**Or decline first:** if you don't see a chain pointing at Extract Adapter, name the decline type — no chain, taste call, cost-benefit, constraint-blocked, or insufficient context.

**Symptom:** Host class methods the agent must scan twice — once for the host logic, once for each variant branch — to determine what executes in a given environment. Library-version edits ripple to host class methods even when host behaviour is unchanged.

**Goal:** One adapter file per variant; the agent verifies each adapter independently against the external API. The host class becomes a thin delegator the agent reads once and trusts thereafter.

```js
// Before:
// One class branches on library version internally.
class ChartGenerator {
  draw(data, libraryVersion) {
    if (libraryVersion === 1) {
      const ctx = OldChartLib.createContext();
      ctx.setData(data.map(d => ({ x: d.label, y: d.value })));
      ctx.setTitle(this.title);
      ctx.render();
      return ctx;
    }
    if (libraryVersion === 2) {
      const renderer = new NewChartLib.Renderer({ data, title: this.title });
      renderer.render();
      return renderer;
    }
    throw new Error(`unsupported version ${libraryVersion}`);
  }
}

// After:
// One adapter per version; ChartGenerator no longer knows the library.
class ChartGenerator {
  constructor(chartAdapter) {
    this.chartAdapter = chartAdapter;
  }
  draw(data) {
    return this.chartAdapter.draw(data, this.title);
  }
}

class V1ChartAdapter {
  draw(data, title) {
    const ctx = OldChartLib.createContext();
    ctx.setData(data.map(d => ({ x: d.label, y: d.value })));
    ctx.setTitle(title);
    ctx.render();
    return ctx;
  }
}

class V2ChartAdapter {
  draw(data, title) {
    const renderer = new NewChartLib.Renderer({ data, title });
    renderer.render();
    return renderer;
  }
}
```

_Example source: Adapted from Joshua Kerievsky's third-party-library-version example in Refactoring to Patterns (Addison-Wesley, 2004), chapter 6. The Java original wrapped two versions of a charting library; this JavaScript translation keeps the same shape — a host class delegating to a per-version adapter._

**Pressure:** Mixed variant + host code consumes context budget on every host-class edit. The agent must hold all variant branches in working memory to verify that a host change doesn't break a variant code path; cross-variant invariants are easy to miss.

**Tradeoff:** Adapter extraction multiplies file count and may obscure the agent's static call-graph view of how data flows from host through to external API. Mocking adapters in host tests requires duplicating the adapter interface in the test setup.

**Relief:** Host class tests load the adapter's interface instead of the external library; adapter tests load the vendor surface in isolation; a library upgrade touches the one adapter file rather than every host call site.

**Trap:** An adapter for a single, stable variant is dead weight — one extra file the agent must learn before reading the host. The pattern pays only when adapter count > 1 or when adapter-level test isolation buys verifiability the host couldn't achieve alone.

**Triggered by:** Divergent Change (smells), Extract Class (refactorings), Replace Conditional with Polymorphism (refactorings)
