---
name: replace-implicit-tree-with-composite
description: Apply Replace Implicit Tree With Composite when you see Primitive Obsession, Replace Primitive with Object, Encapsulate Record. A concrete Composite the agent reads as a typed recursive structure.
---

# Apply: 22 — Replace Implicit Tree With Composite

**Announce first:** name the chain of refactorings pointing at Replace Implicit Tree With Composite and that you're applying it before the next edit. The user reads the announcement as your contract.

**Symptom:** Tree traversals expressed as filters over flat records the agent must trace per call to verify tree-shape invariants. Cycles, orphans, and disconnected subtrees are runtime concerns; the agent cannot statically verify a 'tree' is acyclic from the flat form.

**Goal:** A concrete Composite the agent reads as a typed recursive structure. Static analysis can verify that traversal methods cover all node types; tree-shape invariants live in the constructor.

```js
// Before:
// Tree shape encoded as flat records joined by parentId pointers.
const items = [
  { id: 1, label: 'File', parentId: null },
  { id: 2, label: 'Edit', parentId: null },
  { id: 3, label: 'New', parentId: 1 },
  { id: 4, label: 'Open', parentId: 1 },
  { id: 5, label: 'Recent', parentId: 4 },
  { id: 6, label: 'Cut', parentId: 2 },
];

function render(items) {
  const roots = items.filter((i) => i.parentId === null);
  return roots.map((root) => renderItem(root, items)).join('\n');
}
function renderItem(item, items, depth = 0) {
  const children = items.filter((i) => i.parentId === item.id);
  let line = '  '.repeat(depth) + item.label;
  for (const child of children) {
    line += '\n' + renderItem(child, items, depth + 1);
  }
  return line;
}

// After:
// Explicit composite: each node holds its children directly.
class MenuItem {
  constructor(label) {
    this.label = label;
    this.children = [];
  }
  add(child) {
    this.children.push(child);
    return this;
  }
  render(depth = 0) {
    return (
      '  '.repeat(depth) +
      this.label +
      this.children.map((child) => '\n' + child.render(depth + 1)).join('')
    );
  }
}

const file = new MenuItem('File')
  .add(new MenuItem('New'))
  .add(new MenuItem('Open').add(new MenuItem('Recent')));
const edit = new MenuItem('Edit').add(new MenuItem('Cut'));
const menus = [file, edit];

menus.map((menu) => menu.render()).join('\n');
```

_Example source: Illustrative example written for this site, faithful to Kerievsky's pattern shape in Refactoring to Patterns (Addison-Wesley, 2004), chapter 9. The book uses an XML-ish document tree encoded implicitly; this JavaScript version uses a menu hierarchy encoded as flat parentId-joined records — same shape, accessible domain._

**Pressure:** Filtering-based traversals consume context budget proportional to record count, not tree depth. The agent cannot statically distinguish a malformed flat representation (cycles, missing parents) from a valid one without simulating the parent-pointer resolution.

**Tradeoff:** Composite construction is itself a translation step the agent must verify against the flat form. Persistence boundaries require the agent to keep two representations in mind — the in-memory tree and the on-disk flat form. Serialization round-trips are a new bug surface.

**Relief:** Traversal runs through one-line recursive calls on the Composite interface; the type checker confirms every node type implements the traversal contract, and tree-operation tests construct one typed tree instead of reconstructing the shape from raw records.

**Trap:** If the on-disk form remains the flat record set, the agent has to verify the in-memory tree stays consistent with it across edits. The pattern's gain materializes when the tree owns the canonical form; when it's a transient view over a relational store, the implicit form may stay authoritative.

**Triggered by:** Primitive Obsession (smells), Replace Primitive with Object (refactorings), Encapsulate Record (refactorings)
