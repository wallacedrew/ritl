---
name: audit
description: Audit a target for refactoring smells — primary purpose is shared understanding of what's present, for both agent and human reader; refactoring is the action arm, taken only on accepted rows. Sense the smells, build a decision table, lay down safety-net tests for accepted rows, then apply the matching refactorings via the per-entity skills in this plugin. Trigger when the user says "audit this", "refactoring", "ritl", "ritl this", "smell", "smell check", "code-smell", "refactor this", "fix this smell", "clean this up", "tidy this up", "this looks off", "what's wrong with this", "is this clean", "give this a once-over", or describes code that feels tangled, duplicated, mysteriously named, or otherwise unhealthy. Use the 24 per-entity smell skills (long-function, mysterious-name, duplicated-code, etc.) to identify which smells apply, then read each smell skill's apply-refactorings list to pick the refactoring skill (extract-function, inline-function, etc.) to follow next. Keep tests green throughout; revert if anything goes red.
---

# Audit — sense smell → safety net → apply refactoring

**The audit's primary purpose is shared understanding** — making the smells in a target visible to both the agent and the human reader. Refactoring is the action arm of comprehension, applied only to accepted rows. A run that surfaces the smells, populates the table, and stops there is a valid audit; the decision to act belongs to the user, row by row.

The audit runs a six-phase loop: **sense → table (or update the table) → safety net → apply next on the list → stay green → re-sense**. The loop repeats on the same target until every remaining row in the table is a decline; then the audit moves to a different target or stops.

Follow the six steps in order; each step has to land before the next.

## 1. Sense the smells

**Declare the scope.** Name the target the scan applies to — a function, a file, a module, a feature, a directory tree. If the user pointed at code, use that. If the invocation was ambiguous ("audit this"), pick the most likely scope (the most recently edited file, the function in focus) and state both the scope and the reason — the user corrects on the next turn if the guess was wrong. "Comprehensive" against an entire codebase is dishonest; "comprehensive within the declared scope" is achievable.

**Flag oversized scopes as an FYI.** A function or a single file scans cleanly; a sprawling directory tree does not. If the declared scope spans more than a handful of files or a few hundred lines, note that in your reply and recommend the user tighten it before the scan proceeds — by feature, by recent-change hotspot, or by the specific file in question. A comprehensive scan against a large scope either skims (missing smells) or stalls (never reaching the table). The recommendation is an FYI, not a refusal; if the user confirms the scope, proceed.

**Scan the target comprehensively.** Walk every variable, function signature, block, file, function, class, and method. For each one, check fan-in (who calls or reads it) and fan-out (what it calls or depends on). Some smells show only from one angle — Feature Envy from a method's fan-out, Shotgun Surgery from a concept's fan-in across files, Mysterious Name from a confused call site, Divergent Change from a file's fan-in concentrating multiple reasons-to-change. A glance misses these; the comprehensive scan finds them.

Match what you see against the 24 known smells in this plugin: long-function, mysterious-name, duplicated-code, long-parameter-list, global-data, mutable-data, divergent-change, shotgun-surgery, feature-envy, data-clumps, primitive-obsession, repeated-switches, loops, lazy-element, speculative-generality, temporary-field, message-chains, middle-man, insider-trading, large-class, alternative-classes-with-different-interfaces, data-class, refused-bequest, comments. Each smell's description names its trigger.

**List every detected smell.** The inventory is the output of Step 1; ordering and accept/decline decisions happen in Step 2. Filtering down to one smell here would deliver action ahead of comprehension — the opposite of what the audit is for.

If nothing matches a named smell, say so. Don't invent a refactoring name for an unnamed shape — that's how vocabulary drifts.

**Pinpoint the exact code:** file path + line range for each detected smell. State the locations explicitly in your reply so the user can follow. The smell skill's "trigger" line tells you what shape to look for; the file + line range tells the user where. If the same smell appears in multiple places, list each instance as its own table row — the locations carry into the table's rationale.

## 2. Build (or update) the table

Before writing any safety-net tests or applying any refactoring, summarize the audit as a decision table. One row per detected smell, grouped by target move. The table commits the audit to a plan the user can argue with before any code changes.

**Group rows by target move.** Smells cluster: a single Long Function often carries Feature Envy or Data Clumps in its body, and one Extract Function resolves all of them at once. When two or more smells resolve to the same refactoring, list those rows contiguously and name the shared move only on the first row — the rows beneath it reference `(same move)`. Grouping makes the cluster visible and prevents the false impression that N smells need N independent refactorings.

| Smell | Proposed refactoring(s) | Decision | Rationale |
| ----- | ----------------------- | -------- | --------- |
| Long Function (lib/foo.ts:23-45) | Extract Function; Split Phase | accept | Three phases in one body; parse phase extracts cleanly. |
| Feature Envy (lib/foo.ts:30-38) | (same move) | accept | Envy disappears once the parse phase is extracted. |
| Mysterious Name (lib/foo.ts:10) | Rename Function | accept | Body required to decode `calc`. Single call site, low blast radius. |
| Primitive Obsession (lib/foo.ts:12, +13 sites) | Replace Primitive with Object | decline — cost-benefit | 14 call sites for a 3-line clarification. Cost > value here. |
| Speculative Generality (lib/foo.ts:50) | Remove Dead Code | decline — insufficient context | Can't tell from this file whether the `factory` param is used downstream. Asking before removing. |

Decisions use the decline vocabulary below (catalog miss / taste / cost-benefit / constraint-blocked / insufficient context) or `accept`. Each `decline — *` row is arguable in the specific way named; each `accept` row commits to safety-net + refactoring in Steps 3–5.

State the table explicitly in your reply. The user can argue any row before you continue. If no objection lands, proceed to Step 3 with the accepted rows only.

**Order the accepted groups by likely yield.** Smaller, more localized refactorings first (Rename Variable, Extract Variable) before larger structural moves (Extract Class, Replace Inheritance with Delegation). When the same smell appears in multiple locations as separate groups, the instance with the fewest external dependencies goes first. Smaller moves expose more shape, and a quick green commit builds the safety margin for the larger ones.

**On subsequent rounds**, update the table rather than starting over. New smells surfaced by Step 6 (re-sense) get new rows; earlier declines may need re-evaluation against the changed shape. State the updated table the same way you stated the original — the user argues with it before any further code changes.

### When you decline

**Sketch first.** Before naming a decline, write the after-state — in your reply or in scratch. Compare it to the current shape side by side. If the after reads cleaner and the smell skill's recommended chain points at the move, default to applying. Reserve declines for cases where the sketch itself shows the cost: more lines without more clarity, loss of a language idiom you can see disappearing in the after-shape, a contract that would actually break.

Without sketching, abstract arguments about cost ("this adds ceremony," "the shared X argues for keeping them together") are easy to construct and hard to dispute. The sketch makes the trade-off concrete.

If you decide **not** to apply a refactoring, do not just stay silent — name which kind of decline you're doing. Silent non-action loses the user's ability to argue. Pick one:

- **Catalog miss** — checked the 24 smells; nothing matches. Will not invent an ad-hoc name. *Example:* "I checked the 24 smells; this doesn't match any of them. I won't invent a refactoring name for an unnamed shape."
- **Taste call** — match exists, but you judge it not worth doing right now. *Open to argument.* *Example:* "There's a Long Function here, but I judge this isn't worth doing right now. Argue if I'm wrong."
- **Cost-benefit** — match exists, but you estimate cost > value. Name the cost and the value as you see them so the user can dispute either. *Example:* "Extract Function applies, but the refactoring spans 6 files and the only benefit is a 12-line collapse. Argue with the cost or the value."
- **Constraint-blocked** — match exists, but applying would break a non-negotiable external constraint (public API contract, perf budget, contract). *Example:* "Inline Function applies, but the inlined call is public API. Choose a different move."
- **Insufficient context** — you can't decide without more information. *Example:* "Before deciding, I'd need to know whether this method is called from outside the package. Asking before applying."

The taxonomy matters because each decline is arguable in a different way: catalog miss is a checkable claim, taste calls are open to argument, cost-benefit names two estimates the user can challenge separately, constraint-blocked points at the constraint to dispute, and insufficient context asks before deciding. Conflating them all into "I'm not refactoring this" hides which counterargument the user could make.

One common over-decline trap to watch for: citing a "shared X" or "common Y" argument without testing whether the share is a domain concept (which Beck's third rule defends) or just a shared expression result (which it does not). A method call result computed once and reused, or a local variable assigned from a single expression, is mechanical sharing — not a domain concept said twice. If the sketch of the split form recomputes that expression a second time, the recomputation is a non-concern. "No duplication" defends concepts, not method-call results.

## 3. Establish a safety net for the next on the list

Before changing anything, the current behavior needs tests. Refer to the `tdd` skill for the discipline. Specifically, write characterization tests that pin down the current observable behavior, so a refactoring that accidentally changes behavior gets caught by red tests.

Don't skip this step. The whole point of refactoring is structural change with zero behavior change — without tests, you can't tell which one you got.

If the area already has comprehensive tests covering the behavior in question, note that and proceed. If not, write the characterization tests first, get them green, commit, then move to Step 4.

## 4. Apply next on the list

Pick the next accepted group from the table. Read the first row's smell skill `Apply refactorings:` line — that's the list of refactoring skills to consult, in order of likely fit. Load the first one. Follow its Before/After. The shared move applies once and is expected to resolve every row in the group; Step 6 confirms that prediction.

Each refactoring skill in this plugin has the same shape — a target state, a why-apply, a pitfall note, a code Before, a code After, and the smells it removes. Read the Pitfall before you make the change; that's the trap that catches eager refactorers.

Apply one refactoring at a time. Don't chain three together in one commit; each is its own micro-step. Run the test suite after each.

## 5. Stay green

After the refactoring, run the full test suite. Three outcomes:

- **Green** → commit immediately. Move to Step 6.
- **Red** → revert. The refactoring revealed something the safety net missed; either the test was wrong or the refactoring changed behavior. Diagnose, fix, retry — don't power through.
- **Compilation or type errors** → treat as red. Same flow.

Reference the `tcr` skill for the underlying discipline.

When in doubt, smaller steps. A 5-line refactoring that lands green is worth more than a 50-line one that's been red for an hour.

## 6. Re-sense

A refactoring that lands green changes the target. The same target may now exhibit a different smell that was previously hidden under what was just removed.

Walk the 24 smells against the post-refactor body. If re-sense surfaces nothing new, continue down the table's remaining accepted groups — pick the next one, return to Step 3 for its safety net, and proceed. If re-sense surfaces a new smell that supersedes a planned row, return to Step 2, update the table, and pick again.

**Decline-rate sanity check.** If more than half of the current round's table rows are declines, the scope may be wrong — too large to scan honestly, or pointing at code that isn't actually unhealthy. Surface that to the user before declaring the loop terminated. The signal isn't always "stop"; sometimes it's "tighten the scope and re-scan."

The loop terminates when every remaining row in the table is a decline — no accept row is left to apply. Move to a different target, or stop.

Common pattern: a structural simplification (Substitute Algorithm, Replace Temp with Query, Inline Variable) collapses noise that was hiding a multi-phase or multi-concern structure. The next round finds Split Phase, Compose Method, or Extract Function on the simpler form.

A single audit that delivers one refactoring and stops is the wrong default. Multi-round audits on the same target are normal — applying one refactoring per commit doesn't mean stopping after one commit.
