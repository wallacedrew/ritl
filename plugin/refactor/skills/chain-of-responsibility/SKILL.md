---
name: chain-of-responsibility
description: Apply Chain of Responsibility when you see Long Function, Divergent Change, Replace Conditional with Polymorphism. N small handler classes the agent reads one at a time.
---

# Apply: 40 — Chain of Responsibility

**Announce first:** name the chain of refactorings pointing at Chain of Responsibility and that you're applying it before the next edit. The user reads the announcement as your contract.

**Or decline first:** if you don't see a chain pointing at Chain of Responsibility, name the decline type — no chain, taste call, cost-benefit, constraint-blocked, or insufficient context.

**Symptom:** A single-function dispatcher with multiple concerns the agent must verify against on every concern-related edit. Edits to one concern's logic touch the same source span as every other concern; merge conflicts and unintended side effects are routine.

**Goal:** N small handler classes the agent reads one at a time. Edits to a concern scope to one file; chain ordering is one expression at the construction site; the agent's verification budget on a concern-specific change drops from full-function-scan to one-file-scan.

```js
// Before:
function handleRequest(req, res) {
  if (!req.headers.authorization) {
    res.status = 401;
    res.body = 'unauthorized';
    return;
  }
  if (rateLimiter.exceeded(req.ip)) {
    res.status = 429;
    res.body = 'too many requests';
    return;
  }
  logger.info(`${req.method} ${req.path}`);
  if (req.path === '/api/users') {
    res.status = 200;
    res.body = listUsers();
    return;
  }
  res.status = 404;
}
// One function changes for auth reasons, rate-limit reasons, logging reasons,
// routing reasons — every concern is a Divergent Change pressure on the same body.

// After:
class Handler {
  constructor(next) {
    this.next = next;
  }
  handle(req, res) {
    if (this.next) this.next.handle(req, res);
  }
}
class AuthHandler extends Handler {
  handle(req, res) {
    if (!req.headers.authorization) {
      res.status = 401;
      res.body = 'unauthorized';
      return;
    }
    super.handle(req, res);
  }
}
class RateLimitHandler extends Handler {
  handle(req, res) {
    if (rateLimiter.exceeded(req.ip)) {
      res.status = 429;
      res.body = 'too many requests';
      return;
    }
    super.handle(req, res);
  }
}
class LoggingHandler extends Handler {
  handle(req, res) {
    logger.info(`${req.method} ${req.path}`);
    super.handle(req, res);
  }
}
class RoutingHandler extends Handler {
  handle(req, res) {
    if (req.path === '/api/users') {
      res.status = 200;
      res.body = listUsers();
      return;
    }
    res.status = 404;
  }
}
const chain = new AuthHandler(new RateLimitHandler(new LoggingHandler(new RoutingHandler(null))));
chain.handle(req, res);
```

_Example source: Illustrative example written for this site in the spirit of Design Patterns (Gamma, Helm, Johnson, Vlissides, Addison-Wesley, 1994), chapter 5. The book's running example is a context-sensitive help system where help requests bubble up a widget tree; this JavaScript adaptation uses HTTP middleware because the chain-of-handlers shape is recognizable to most modern readers._

**Pressure:** A long sequential handler function is O(concerns) read cost per edit and O(concerns²) verification cost for concern interactions. The agent's working memory is consumed by the full concern set rather than the change's actual scope.

**Tradeoff:** Chain composition is implicit in the construction expression's nesting order. The agent investigating a runtime issue must trace through N handlers; stack traces span N frames; concern interactions (handler-A short-circuits before handler-B logs the failure) require explicit chain-aware reasoning the type system cannot enforce.

**Relief:** Adding a new concern is one new handler class plus one wiring entry in the chain; per-handler tests load one class instead of the full chain, and the chain's composition lives at one construction site the agent reads to predict ordering.

**Trap:** Handlers that peek at chain neighbors or skip ahead by mutating the request reintroduce cross-handler coupling. The agent reading one handler can no longer reason about its behaviour in isolation; chain-aware verification becomes mandatory on every handler edit, defeating the per-handler isolation the pattern promised.

**Triggered by:** Long Function (smells), Divergent Change (smells), Replace Conditional with Polymorphism (refactorings)
