---
name: replace-conditional-dispatcher-with-command
description: Apply Replace Conditional Dispatcher With Command when you see Repeated Switches, Replace Function with Command, Replace Conditional with Polymorphism. One file per command the agent reads in isolation; the dispatcher is short and command-set-agnostic.
---

# Apply: 17 — Replace Conditional Dispatcher With Command

**Symptom:** A dispatcher conditional + N inline handler methods the agent must scan together to know what runs for a given command. Adding a command requires the agent to edit two places (dispatcher + host class); the diff surface scales linearly with handler complexity.

**Goal:** One file per command the agent reads in isolation; the dispatcher is short and command-set-agnostic. Per-command diff surface collapses to one Command class + one registry entry.

```js
// Before:
// One processor with a long dispatch conditional plus all handler bodies.
class CommandProcessor {
  execute(command, payload) {
    if (command === 'create-user') return this.createUser(payload);
    if (command === 'delete-user') return this.deleteUser(payload);
    if (command === 'reset-password') return this.resetPassword(payload);
    if (command === 'update-profile') return this.updateProfile(payload);
    throw new Error(`unknown command ${command}`);
  }
  createUser(payload) { /* ... */ }
  deleteUser(payload) { /* ... */ }
  resetPassword(payload) { /* ... */ }
  updateProfile(payload) { /* ... */ }
}

// After:
// Each handler is a Command object; the registry replaces the conditional.
class CreateUserCommand {
  execute(payload) { /* ... */ }
}
class DeleteUserCommand {
  execute(payload) { /* ... */ }
}
class ResetPasswordCommand {
  execute(payload) { /* ... */ }
}
class UpdateProfileCommand {
  execute(payload) { /* ... */ }
}

class CommandProcessor {
  constructor() {
    this.commands = new Map([
      ['create-user', new CreateUserCommand()],
      ['delete-user', new DeleteUserCommand()],
      ['reset-password', new ResetPasswordCommand()],
      ['update-profile', new UpdateProfileCommand()],
    ]);
  }
  execute(command, payload) {
    const handler = this.commands.get(command);
    if (!handler) throw new Error(`unknown command ${command}`);
    return handler.execute(payload);
  }
}
```

_Example source: Illustrative example written for this site, faithful to Kerievsky's pattern shape in Refactoring to Patterns (Addison-Wesley, 2004), chapter 7. Distinct from Replace Conditional Logic With Strategy: Strategy varies *how* one algorithm computes its result; Command varies *which action* is invoked. The book uses an HTTP-style request dispatcher; this JavaScript version keeps that shape._

**Pressure:** Cross-command invariants (e.g., 'every command logs') cannot be statically enforced when handlers are loose methods on the dispatcher. The agent must hold the full handler set in context to verify any cross-command concern; refactoring one handler risks unintended impact on neighbouring branches that share helpers.

**Tradeoff:** Command spreads handler logic across N files; the agent must traverse the registry to know which class handles a given command name. Stringy registry keys defeat static type analysis — typo-driven bugs slip past the type system.

**Relief:** Diff surface for a new command is one file. Static analysis can verify every Command implements `execute`; the dispatcher's behaviour is statically uniform. Cross-cutting concerns can live as a wrapping decorator on the registry rather than duplicated per handler.

**Trap:** Many trivial Commands (`class XCommand { execute() { return X(); } }`) raise context cost without buying anything — the agent loads one definition per command name to verify what it does. The pattern's gain materializes when commands carry meaningful state or when cross-cutting concerns reuse the uniform interface.

**Triggered by:** Repeated Switches (smells), Replace Function with Command (refactorings), Replace Conditional with Polymorphism (refactorings)
