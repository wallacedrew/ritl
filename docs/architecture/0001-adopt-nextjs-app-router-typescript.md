# 0001. Adopt Next.js App Router + TypeScript

- **Status**: accepted
- **Date**: 2026-05-10
- **Deciders**: project owner, agent

## Context

The starting point of this project is a single self-contained `prototype.html` file: a Fowler Refactoring Catalog Explorer with three views (Code-Smell-Centric, Refactoring-Centric, Reference) over hardcoded arrays of 24 smells, 38 refactorings, and 3 refactoring categories.

The owner wants to rebuild this as a robust app where:

- Content (smells, refactorings) lives in JSON so the catalog can grow independently of code.
- Pages are typed and the catalog is navigable via routes (smells list, smell detail, refactorings list, refactoring detail, home).
- The same general layout from the prototype is preserved, then evolved.

The slices envisioned (browse smells, read smell detail, browse refactorings, read refactoring detail with cross-links, switch top-level views) are predominantly read-heavy, server-renderable pages over a static content set. Future slices may add interactivity (search, filters) but no slice on the roadmap requires a dedicated backend, mutations, or auth.

## Decision

We will use **Next.js 16 (App Router)** with **TypeScript 5** as the application framework.

- App Router because slice routes map cleanly to file-system routes (`/smells`, `/smells/[slug]`, `/refactorings`, `/refactorings/[slug]`), and React Server Components let us read JSON content at the route level without shipping it to the client.
- TypeScript with `strict: true`, `noUncheckedIndexedAccess: true`, `noImplicitOverride: true` to honor AGENTS-general's "Explicit types" discipline.
- Bootstrapped via `create-next-app@latest` with `--ts --eslint --app --src-dir --import-alias "@/*" --use-npm`, opting out of Tailwind (see ADR-0002) and the agent's `--agents-md` scaffolding (we already maintain our own `AGENTS-*.md`).
- Tests live in sibling-of-`src/` folders (`tests-small-unit/`, `tests-medium-integration/`, `tests-big-e2e/`) per AGENTS-general's pyramid layout.
- Pre-commit hook (Husky 9 + lint-staged) runs format-write → typecheck → fast-test in that order, per AGENTS-general's Commands template.

## Consequences

**Easier:**

- Server-rendered pages over JSON content with strong typing on every route.
- File-system routing matches the slice plan one-to-one — adding a slice is "create a folder under `src/<feature>/` and a route shim under `src/app/`".
- Future Vercel deployment is one click; static prerender is the default for content pages.
- Strict typing catches drift between the JSON shapes and the components that consume them, satisfying AGENTS-general's "no naked casts across trust boundaries" when paired with hand-rolled parsers.

**Harder / new constraints:**

- Two component-execution contexts to think about (Server vs Client). MUI's interactive components require a Client Component boundary; we'll mark those with `"use client"`.
- Next 16 + Turbopack are recent — we accept that some patterns (Cache Components, Server Actions) may need to be revisited as the framework hardens.
- Build output (`.next/`) is gitignored; `next-env.d.ts` regenerates and is also gitignored — this is by design and is reflected in the bootstrapped `.gitignore`.

**Follow-up work:**

- ADR-0002 covers the styling decision that rides on top of this one.
- A future ADR will be needed when we add a runtime content source (CMS, database, fs reads) — at that point a `SmellRepository` / `RefactoringRepository` port becomes load-bearing.
