---
name: interpreter
description: Apply Interpreter when you see Primitive Obsession, Repeated Switches, Replace Conditional with Polymorphism. One class per grammar rule, each with interpret(env).
---

# Apply: 15 — Interpreter

**Announce first:** name the chain of refactorings pointing at Interpreter and that you're applying it before the next edit. The user reads the announcement as your contract.

**Or decline first:** if you don't see a chain pointing at Interpreter, name the decline type — no chain, taste call, cost-benefit, constraint-blocked, or insufficient context.

**Symptom:** Ad-hoc string parsing the agent must read sequentially to understand evaluation semantics. Operator precedence is implicit; bugs in the parser cascade silently across every rule. Static analysis of 'what variables does this rule depend on' requires re-implementing the parser in the analysis tool.

**Goal:** One class per grammar rule, each with interpret(env). The agent reads the AST shape directly from the construction expression; static traversal returns complete answers; per-rule edits scope to one class file.

```js
// Before:
function evaluateRule(ruleString, context) {
  if (ruleString.includes(' AND ')) {
    const [left, right] = ruleString.split(' AND ');
    return evaluateRule(left, context) && evaluateRule(right, context);
  }
  if (ruleString.includes(' OR ')) {
    const [left, right] = ruleString.split(' OR ');
    return evaluateRule(left, context) || evaluateRule(right, context);
  }
  if (ruleString.startsWith('NOT ')) {
    return !evaluateRule(ruleString.slice(4), context);
  }
  return Boolean(context[ruleString]);
}
const pass = evaluateRule('verified AND NOT banned', user);
// Strings as DSL, ad-hoc parser, operator precedence implicit in eval order,
// no caching, no static analysis, every consumer re-implements its own dialect.

// After:
class Variable {
  constructor(name) {
    this.name = name;
  }
  interpret(env) {
    return Boolean(env[this.name]);
  }
}
class And {
  constructor(left, right) {
    this.left = left;
    this.right = right;
  }
  interpret(env) {
    return this.left.interpret(env) && this.right.interpret(env);
  }
}
class Or {
  constructor(left, right) {
    this.left = left;
    this.right = right;
  }
  interpret(env) {
    return this.left.interpret(env) || this.right.interpret(env);
  }
}
class Not {
  constructor(operand) {
    this.operand = operand;
  }
  interpret(env) {
    return !this.operand.interpret(env);
  }
}
const rule = new And(new Variable('verified'), new Not(new Variable('banned')));
const pass = rule.interpret(user);
```

_Example source: Illustrative example written for this site in the spirit of Design Patterns (Gamma, Helm, Johnson, Vlissides, Addison-Wesley, 1994), chapter 5. The book's running example is a regular-expression matcher; this JavaScript adaptation uses a tiny boolean rule language (AND, OR, NOT, variables) because the AST is small enough to read in one screen and the structural-vs-string-DSL contrast is sharp._

**Pressure:** String DSLs are opaque to the type system. The agent reasoning about rule correctness must trace through the parser's logic at every consumer; partial verification produces misleading confidence. New operators add cascading edits the agent must verify across every parsing path.

**Tradeoff:** AST construction in code is verbose and harder to read than the string DSL. The agent's reading cost on the construction site is higher; tracing a runtime error in an AND.interpret requires walking the recursive call chain through the tree, which can be deep.

**Relief:** Per-rule edits are one-file; static traversal of 'rules using variable X' is a complete enumeration; type system enforces interpret-method existence on every rule class. The agent's verification budget on grammar changes is bounded and structurally provable.

**Trap:** Grammars growing past ~10 operators turn into class proliferation the agent navigates as a graph rather than a hierarchy. Visitor or AST-walker tooling becomes mandatory at that scale; without it, every traversal-style analysis requires editing every rule class — the cross-cutting problem the pattern was supposed to avoid.

**Triggered by:** Primitive Obsession (smells), Repeated Switches (smells), Replace Conditional with Polymorphism (refactorings)
