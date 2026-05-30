---
name: template-method
description: Apply Template Method when you see Duplicated Code, Shotgun Surgery, Pull Up Method. One template method in a base class the agent reads to understand the algorithm shape.
---

# Apply: 49 — Template Method

**Announce first:** name the chain of refactorings pointing at Template Method and that you're applying it before the next edit. The user reads the announcement as your contract.

**Or decline first:** if you don't see a chain pointing at Template Method, name the decline type — no chain, taste call, cost-benefit, constraint-blocked, or insufficient context.

**Symptom:** Duplicated algorithm skeletons across N classes the agent must verify in lockstep on every shape edit. The shared structure is invisible to static analysis; the agent cannot prove that all N implementations follow the same shape from source alone.

**Goal:** One template method in a base class the agent reads to understand the algorithm shape. Per-subclass reasoning collapses to 'which hooks does this subclass override'; cross-subclass verification of skeleton consistency is structural.

```js
// Before:
class JavaScriptBuilder {
  build() {
    this.fetchSource();
    this.compile();
    this.runTests();
    this.package();
  }
  fetchSource() { return git.clone(this.repo); }
  compile()    { return run('npx tsc'); }
  runTests()   { return run('npm test'); }
  package()    { return run('npm pack'); }
}
class PythonBuilder {
  build() {
    this.fetchSource();
    this.compile();
    this.runTests();
    this.package();
  }
  fetchSource() { return git.clone(this.repo); }
  compile()    { return run('python -m py_compile .'); }
  runTests()   { return run('pytest'); }
  package()    { return run('python -m build'); }
}
class GoBuilder {
  build() {
    this.fetchSource();
    this.compile();
    this.runTests();
    this.package();
  }
  fetchSource() { return git.clone(this.repo); }
  compile()    { return run('go build ./...'); }
  runTests()   { return run('go test ./...'); }
  package()    { return run('tar -czf project.tar.gz .'); }
}
// build() skeleton + fetchSource() duplicated across every builder.
// Adding a 'lint' step in the pipeline = 3 edits in lockstep.

// After:
class Builder {
  build() {
    this.fetchSource();
    this.compile();
    this.runTests();
    this.package();
  }
  fetchSource() {
    return git.clone(this.repo);
  }
  compile() {
    throw new Error('subclass implements compile');
  }
  runTests() {
    throw new Error('subclass implements runTests');
  }
  package() {
    throw new Error('subclass implements package');
  }
}
class JavaScriptBuilder extends Builder {
  compile()  { return run('npx tsc'); }
  runTests() { return run('npm test'); }
  package()  { return run('npm pack'); }
}
class PythonBuilder extends Builder {
  compile()  { return run('python -m py_compile .'); }
  runTests() { return run('pytest'); }
  package()  { return run('python -m build'); }
}
class GoBuilder extends Builder {
  compile()  { return run('go build ./...'); }
  runTests() { return run('go test ./...'); }
  package()  { return run('tar -czf project.tar.gz .'); }
}
```

_Example source: Illustrative example written for this site in the spirit of Design Patterns (Gamma, Helm, Johnson, Vlissides, Addison-Wesley, 1994), chapter 5. The book uses an Application/Document framework with skeletal initialization; this JavaScript adaptation uses a per-language build pipeline because the fixed-shape, variable-step structure is recognizable and the Pull Up Method savings show clearly._

**Pressure:** Skeleton duplication forces every pipeline-step addition to edit N subclass bodies, with token cost scaling linearly in the subclass count; a missed subclass is a structurally-invisible bug that ships when the affected variant is the less-exercised one in the test suite.

**Tradeoff:** Inheritance binds the agent to a vertical hierarchy: every edit to the base class implicitly affects every subclass, and the agent must verify cross-subclass invariants on every hook addition. Stack traces span base + subclass methods; investigating one runtime error often requires reading both.

**Relief:** Skeleton edits scope to the base class file; per-subclass edits are bounded by hook implementation; the type system enforces hook presence (where languages support it) catching missed subclasses at compile time.

**Trap:** Hook proliferation — base class with 10 hooks each subclass overrides — turns the parallel hierarchy into the same N×M cell-verification problem the pattern was supposed to solve, only spread across more files. Watch for 'template method with > 4 hooks' as a sign the abstraction is over-reaching.

**Triggered by:** Duplicated Code (smells), Shotgun Surgery (smells), Pull Up Method (refactorings)
