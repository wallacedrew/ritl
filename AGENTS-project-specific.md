# Agent Instructions - this project

## Workflow: trunk-based development

This project ships off `main`. **Commit directly to `main` and push.** Do not create feature branches, do not open pull requests for routine work.

- **Why**: solo, fast iteration, no review queue to clear. Branch + PR overhead is pure churn here.
- **How to apply**: when the user says "commit and push," that means `git commit` on `main` followed by `git push origin main` — full stop. If a harness permission rule blocks the direct push to `main`, surface the block to the user rather than silently routing around it via a feature branch. The user will lift the rule on their side.
- **Discipline still applies**: small commits, green tests before pushing, no `--no-verify`, no Claude co-author trailers. Trunk-based does not mean undisciplined — it means the safety net is the test suite and the green-on-main rule, not a review queue.

## Voice rules for agent-side catalog content

Agent-side force fields (`symptom / goal / pressure / tradeoff / relief / trap` under `forces.agent` in catalog JSON) are governed by four voice ADRs and four mechanical lints. When you author, edit, or remove any agent-side content, you must comply with all of them.

**The ADRs:**

- [ADR-0006](docs/architecture/0006-agent-forces-carry-the-contrast.md) — six-field structure, stake requirement in `pressure` and `trap`.
- [ADR-0009](docs/architecture/0009-strict-canonical-llm-research-terms.md) — vocabulary allow-list (canonical LLM-research terms + three project-endorsed phrases).
- [ADR-0010](docs/architecture/0010-agent-side-voice-and-audience-contract.md) — modal reader, POV (`the agent`), present-declarative mood, 50-word ceiling, six-field role contract, parallel structure across human/agent columns.
- [ADR-0011](docs/architecture/0011-no-anthropomorphism-and-mechanism-citation.md) — no mentalist verbs, every field names a mechanism, with carve-outs for the field-role contract.

**The lints** (under `tests-small-unit/shared/lib/agent-forces-*.test.ts`):

- `agent-forces-vocabulary` — banned-pattern regexes from the ADRs.
- `agent-forces-pov` — bans 2nd-person and 1st-person pronouns.
- `agent-forces-length` — flags fields over 50 words.
- `agent-forces-glossary-tokens` — every `{{key}}` token resolves to a known glossary entry.
- `agent-forces-glossary-marking` — opted-in entries (any entry with at least one `{{key}}` marker) must mark every lintable glossary key on its first occurrence per entry.

**The marking rule, in plain language:**

When the agent-side prose of an entry uses a lintable glossary term (see the canonical list in `docs/glossary.md` and the `LINTABLE_KEYS` allow-list in `agent-forces-glossary-marking.test.ts`), wrap the **first occurrence per entry** in `{{key}}` — e.g. `{{context window}}`. Do not mark later occurrences of the same key in the same entry. Marking is opt-in per entry: entries with zero markers are not enforced; entries with at least one marker must mark every lintable key they mention.

Inflected forms (`token` vs `tokens`, possessive `'s`) are out of scope for the parser. Author the prose to use the canonical form from the glossary.

**Why this exists:** the tooltip on a marked term opens a popover with the term's definition (and citation, where applicable). Readers who don't know `lost-in-the-middle` or `RAG` get the definition inline. Readers who do, ignore the dotted underline. The voice rules ensure the prose earns its claim to ground in agent mechanics; the tooltip rule ensures readers can verify that claim without leaving the page.
