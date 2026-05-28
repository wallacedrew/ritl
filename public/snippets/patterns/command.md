---
name: command
description: Apply Command when you see Repeated Switches, Primitive Obsession, Replace Function with Command. One Command interface (execute + undo) the agent reads as the structural commitment.
---

# Apply: 41 — Command

**Symptom:** Operations are scattered methods the agent must enumerate by reading the receiver class. Adding a cross-cutting feature (undo, audit, replay) forces the agent to touch every method symmetrically — the verification problem grows linearly with operation count.

**Goal:** One Command interface (execute + undo) the agent reads as the structural commitment. Each operation is a one-class file; cross-cutting features attach to the interface, not the methods. Static analysis of 'what operations exist' returns a complete list (subclasses of Command).

```js
// Before:
class TextEditor {
  constructor() {
    this.text = '';
  }
  type(s) {
    this.text += s;
  }
  delete(n) {
    this.text = this.text.slice(0, -n);
  }
}
// Adding undo: we have no record of what was done, so undo is impossible.
// Adding macros (replay 5 operations): we have no first-class notion of
// an operation. Adding remote dispatch (send a command to another editor):
// we'd have to invent a serializable representation by hand.

// After:
class TypeCommand {
  constructor(editor, text) {
    this.editor = editor;
    this.text = text;
  }
  execute() {
    this.editor.text += this.text;
  }
  undo() {
    this.editor.text = this.editor.text.slice(0, -this.text.length);
  }
}
class DeleteCommand {
  constructor(editor, n) {
    this.editor = editor;
    this.n = n;
    this.removed = '';
  }
  execute() {
    this.removed = this.editor.text.slice(-this.n);
    this.editor.text = this.editor.text.slice(0, -this.n);
  }
  undo() {
    this.editor.text += this.removed;
  }
}
class TextEditor {
  constructor() {
    this.text = '';
    this.history = [];
  }
  execute(command) {
    command.execute();
    this.history.push(command);
  }
  undo() {
    const cmd = this.history.pop();
    if (cmd) cmd.undo();
  }
}
```

_Example source: Illustrative example written for this site in the spirit of Design Patterns (Gamma, Helm, Johnson, Vlissides, Addison-Wesley, 1994), chapter 5. The book's running example is a menu-item framework with PasteCommand etc.; this JavaScript adaptation uses a text editor with TypeCommand and DeleteCommand because the undo motivation is concrete and the redo/macro/replay generalizations follow directly._

**Pressure:** Method-shaped operations are invisible to the type system as a set; the agent cannot prove 'every operation has been retrofitted with undo' without enumerating methods by hand. Method enumeration is fragile against new operations sneaking in unnoticed.

**Tradeoff:** N Command classes for N operations doubles the file count compared to N methods. The agent navigates more files per task; debugging an operation requires reading the Command + the receiver method it ultimately calls; stack traces span both layers.

**Relief:** The Command interface is the agent's single anchor; per-operation edits scope to one Command file; cross-cutting features are tested once against the interface. Static enumeration of operations is complete and verifiable.

**Trap:** Commands that mutate receiver state outside their own captured fields produce undo bugs the agent cannot localize from the Command's source alone. The agent reading TypeCommand.undo() trusts the captured text length; if execute() actually invoked side effects (autocomplete, save-on-keypress) the undo is silently incomplete. Capture every effect the execute touches, or the pattern's reversibility promise is a lie.

**Triggered by:** Repeated Switches (smells), Primitive Obsession (smells), Replace Function with Command (refactorings)
