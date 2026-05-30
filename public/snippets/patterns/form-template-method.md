---
name: form-template-method
description: Apply Form Template Method when you see Duplicated Code, Pull Up Method, Extract Function. One template body the agent reads to know the algorithm; primitives are short, locally readable, individually verifiable.
---

# Apply: 08 — Form Template Method

**Announce first:** name the chain of refactorings pointing at Form Template Method and that you're applying it before the next edit. The user reads the announcement as your contract.

**Symptom:** N near-identical algorithm bodies the agent must verify match step-for-step on every edit. A control-flow bug fixed in one body must be ported to N-1 others, with no static guarantee the ports stayed faithful.

**Goal:** One template body the agent reads to know the algorithm; primitives are short, locally readable, individually verifiable. The agent's edit budget for an algorithmic change scales with template length, not with subclass count.

```js
// Before:
// Two reports follow the same outline but each open-codes the whole algorithm.
class HtmlReport {
  generate(data) {
    let output = '<html><body>';
    output += `<h1>${data.title}</h1>`;
    output += '<table>';
    for (const row of data.rows) {
      output += `<tr><td>${row.name}</td><td>${row.value}</td></tr>`;
    }
    output += '</table>';
    output += '</body></html>';
    return output;
  }
}
class TextReport {
  generate(data) {
    let output = '';
    output += data.title.toUpperCase() + '\n';
    output += '='.repeat(data.title.length) + '\n';
    for (const row of data.rows) {
      output += row.name + ': ' + row.value + '\n';
    }
    return output;
  }
}

// After:
// The algorithm lives once in Report; subclasses supply the per-format primitives.
class Report {
  generate(data) {
    let output = this.openSection();
    output += this.formatTitle(data.title);
    output += this.openRows();
    for (const row of data.rows) {
      output += this.formatRow(row);
    }
    output += this.closeRows();
    output += this.closeSection();
    return output;
  }
}
class HtmlReport extends Report {
  openSection() { return '<html><body>'; }
  closeSection() { return '</body></html>'; }
  formatTitle(t) { return `<h1>${t}</h1>`; }
  openRows() { return '<table>'; }
  closeRows() { return '</table>'; }
  formatRow(row) { return `<tr><td>${row.name}</td><td>${row.value}</td></tr>`; }
}
class TextReport extends Report {
  openSection() { return ''; }
  closeSection() { return ''; }
  formatTitle(t) { return t.toUpperCase() + '\n' + '='.repeat(t.length) + '\n'; }
  openRows() { return ''; }
  closeRows() { return ''; }
  formatRow(row) { return row.name + ': ' + row.value + '\n'; }
}
```

_Example source: Illustrative example written for this site, faithful to Kerievsky's pattern shape in Refactoring to Patterns (Addison-Wesley, 2004), chapter 8. The book uses tax-calculator subclasses with a shared compute outline; this JavaScript version uses report generators with a shared layout outline — same shape, same Template Method payoff._

**Pressure:** Algorithmic duplication across N subclasses × M steps = N×M cells the agent must hold in context to verify consistency. The agent cannot statically detect when one copy drifts from the others; the drift only surfaces when a subclass-specific test fails — assuming there is one.

**Tradeoff:** Template Method splits behaviour across the superclass (algorithm) and subclasses (primitives); the agent must traverse the hierarchy to know what a single call produces. Method resolution order issues complicate static reasoning when intermediate subclasses partially override primitives.

**Relief:** Algorithmic edits land at one parent method body the agent reads once; per-subclass tests target the primitive overrides without re-running the full algorithm, and adding a step is one new abstract primitive plus one override per subclass.

**Trap:** A long Template Method with many fine-grained primitives forces the agent to read across many small methods to reconstruct what the algorithm does in any given subclass. Context cost migrates from inline duplication to hierarchy traversal; per-step debugging requires loading the relevant primitive override before the template makes sense.

**Triggered by:** Duplicated Code (smells), Pull Up Method (refactorings), Extract Function (refactorings)
