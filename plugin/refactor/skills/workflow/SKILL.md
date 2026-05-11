---
name: workflow
description: Run the full refactoring cycle — sense the smell, locate its source, lay down safety-net tests, then apply the matching refactorings via the per-entity skills in this plugin. Trigger when the user says "refactoring", "ritl", "smell", "code-smell", "refactor this", "fix this smell", "clean this up", "this looks off", "what's wrong with this", or describes code that feels tangled, duplicated, mysteriously named, or otherwise unhealthy. Use the 24 per-entity smell skills (long-function, mysterious-name, duplicated-code, etc.) to identify which smell applies, then read that smell skill's apply-refactorings list to pick the refactoring skill (extract-function, inline-function, etc.) to follow next. Keep tests green throughout; revert if anything goes red.
---

# Workflow — sense smell → safety net → apply refactoring

The full refactoring cycle, end to end. Follow the five steps in order; each step has to land before the next.

## 1. Sense the smell

Read the code in context. Match what you see against the 24 known smells in this plugin: long-function, mysterious-name, duplicated-code, long-parameter-list, global-data, mutable-data, divergent-change, shotgun-surgery, feature-envy, data-clumps, primitive-obsession, repeated-switches, loops, lazy-element, speculative-generality, temporary-field, message-chains, middle-man, insider-trading, large-class, alternative-classes-with-different-interfaces, data-class, refused-bequest, comments. Each smell's description names its trigger.

Pick the strongest match. If multiple smells apply, prefer the one whose recommended refactorings are smallest first — easier moves expose more shape.

If nothing matches a named smell, say so. Don't invent a refactoring name for an unnamed shape — that's how vocabulary drifts.

## 2. Identify the source

Pinpoint the exact code: file path + line range. State both explicitly in your reply so the user can follow. The smell skill's "trigger" line tells you what shape to look for; the file + line range tells the user where.

If the smell appears in multiple places, pick the one with the fewest external dependencies and refactor it first. Repeat for the others if the user wants.

## 3. Establish a safety net

Before changing anything, the current behavior needs tests. Refer to the `tdd` skill for the discipline. Specifically, write characterization tests that pin down the current observable behavior, so a refactoring that accidentally changes behavior gets caught by red tests.

Don't skip this step. The whole point of refactoring is structural change with zero behavior change — without tests, you can't tell which one you got.

If the area already has comprehensive tests covering the behavior in question, note that and proceed. If not, write the characterization tests first, get them green, commit, then move to step 4.

## 4. Apply the matching refactoring

Read the smell skill's `Apply refactorings:` line. That's the list of refactoring skills to consult, in order of likely fit. Load the first one. Follow its Before/After.

Each refactoring skill in this plugin has the same shape — a target state, a why-apply, a pitfall note, a code Before, a code After, and the smells it removes. Read the Pitfall before you make the change; that's the trap that catches eager refactorers.

Apply one refactoring at a time. Don't chain three together in one commit; each is its own micro-step. Run the test suite after each.

## 5. Stay green

After the refactoring, run the full test suite. Three outcomes:

- **Green** → commit immediately. Move to the next smell (or stop).
- **Red** → revert. The refactoring revealed something the safety net missed; either the test was wrong or the refactoring changed behavior. Diagnose, fix, retry — don't power through.
- **Compilation or type errors** → treat as red. Same flow.

Reference the `tcr` skill for the underlying discipline.

When in doubt, smaller steps. A 5-line refactoring that lands green is worth more than a 50-line one that's been red for an hour.
