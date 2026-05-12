# Agent Instructions - this project

## Workflow: trunk-based development

This project ships off `main`. **Commit directly to `main` and push.** Do not create feature branches, do not open pull requests for routine work.

- **Why**: solo, fast iteration, no review queue to clear. Branch + PR overhead is pure churn here.
- **How to apply**: when the user says "commit and push," that means `git commit` on `main` followed by `git push origin main` — full stop. If a harness permission rule blocks the direct push to `main`, surface the block to the user rather than silently routing around it via a feature branch. The user will lift the rule on their side.
- **Discipline still applies**: small commits, green tests before pushing, no `--no-verify`, no Claude co-author trailers. Trunk-based does not mean undisciplined — it means the safety net is the test suite and the green-on-main rule, not a review queue.
