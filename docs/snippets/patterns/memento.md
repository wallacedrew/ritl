---
name: memento
description: Apply Memento when you see Insider Trading, Mutable Data, Extract Class. One save / restore pair the agent reads inside the editor class.
---

# Apply: 45 — Memento

**Announce first:** name the chain of refactorings pointing at Memento and that you're applying it before the next edit. The user reads the announcement as your contract.

**Or decline first:** if you don't see a chain pointing at Memento, name the decline type — no chain, taste call, cost-benefit, constraint-blocked, or insufficient context.

**Symptom:** Client-side snapshot logic the agent must verify across every consumer for deep-copy correctness. Shared-reference aliasing is invisible to static reads; the agent cannot prove from one call site whether 'snapshot then mutate' is safe.

**Goal:** One save / restore pair the agent reads inside the editor class. Cross-client correctness is structurally guaranteed by treating Memento as opaque; the agent verifies one location for clone depth and one location for restore field-set completeness.

```js
// Before:
class GraphEditor {
  constructor() {
    this.nodes = [];
    this.edges = [];
    this.selection = new Set();
  }
}
function undoableMutation(editor, fn) {
  const prev = {
    nodes: editor.nodes,
    edges: editor.edges,
    selection: editor.selection,
  };
  fn();
  return () => {
    editor.nodes = prev.nodes;
    editor.edges = prev.edges;
    editor.selection = prev.selection;
  };
}
// Clients reach into internals to snapshot; references shared with the editor
// mutate underneath; restore is a partial revert because nested objects were
// not cloned. Insider Trading + Mutable Data conspire to produce silent
// state-leak bugs.

// After:
class GraphMemento {
  constructor(snapshot) {
    this.snapshot = snapshot;
  }
}
class GraphEditor {
  constructor() {
    this.nodes = [];
    this.edges = [];
    this.selection = new Set();
  }
  save() {
    return new GraphMemento({
      nodes: structuredClone(this.nodes),
      edges: structuredClone(this.edges),
      selection: new Set(this.selection),
    });
  }
  restore(memento) {
    this.nodes = memento.snapshot.nodes;
    this.edges = memento.snapshot.edges;
    this.selection = memento.snapshot.selection;
  }
}
const before = editor.save();
/* mutate */
editor.restore(before);
```

_Example source: Illustrative example written for this site in the spirit of Design Patterns (Gamma, Helm, Johnson, Vlissides, Addison-Wesley, 1994), chapter 5. The book's running example is a graphical editor with undo support; this JavaScript adaptation keeps the editor framing and shows the memento as an opaque token clients pass back to restore() without inspecting its fields._

**Pressure:** Per-client snapshot/restore code is N×M cells (N consumers × M state fields) the agent verifies on every state-shape change. Adding a new field requires editing every snapshot site; one missed site silently produces a partial undo that survives review.

**Tradeoff:** Opaque Memento means the agent investigating a runtime issue (e.g., 'why did this undo restore the wrong selection?') cannot inspect the Memento in stack traces. Debugging requires save/restore-aware instrumentation; without it, mementos look like black boxes the agent must trust.

**Relief:** Save and restore live on the editor in two methods; adding a new field is one assignment in save plus one in restore, and consumers pass the memento as an opaque token without reading its field set.

**Trap:** Clients that read memento.snapshot directly defeat the encapsulation and create new Insider Trading on the editor's representation. The agent reading client code trusts the Memento contract; the runtime coupling contradicts that trust silently. Lint or document the opacity invariant or it will erode commit-by-commit.

**Triggered by:** Insider Trading (smells), Mutable Data (smells), Extract Class (refactorings)
