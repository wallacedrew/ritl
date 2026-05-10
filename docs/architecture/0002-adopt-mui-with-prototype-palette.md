# 0002. Adopt Material UI (v9) with prototype-derived dark theme

- **Status**: accepted
- **Date**: 2026-05-10
- **Deciders**: project owner, agent

## Context

The prototype establishes the project's visual identity: a dark scheme (`#09090b` background, `#18181b` cards, `#67e8f9` cyan accent, `#f4f4f5` text, `#a1a1aa` muted), Inter typography, and a small but consistent component vocabulary (Card, Pill, Toolbar of toggle buttons, responsive 2-col Grid, Code block).

The owner wants to keep that look while gaining a richer component vocabulary as content gets more detailed (chips, dialogs, dropdowns, tabs, typography variants, etc.). Three options were considered:

1. **CSS Modules + global custom properties** — preserve the prototype's CSS verbatim, zero new dependencies.
2. **Tailwind CSS** — Next.js's default, ergonomic for variants, but costs a translation pass over every prototype rule.
3. **Material UI** — designed component vocabulary, theme-driven, opinionated.

The owner explicitly chose Material UI.

## Decision

We will use **Material UI v9** (`@mui/material`) with **Emotion** as the style engine and **`@mui/material-nextjs/v16-appRouter`** for SSR-safe Emotion caching.

- A custom theme at `src/shared/theme/theme.ts` exports a `dark`-mode `createTheme()` whose `palette` and `typography` are taken directly from the prototype's tokens — so the visual identity stays the project's, not MUI's defaults.
- A client component `src/shared/theme/ThemeRegistry.tsx` wraps `<AppRouterCacheProvider>` + `<ThemeProvider>` + `<CssBaseline>` and is mounted from `src/app/layout.tsx` once.
- Inter is loaded via `@fontsource-variable/inter` (single import in `layout.tsx`) and referenced from the theme's `typography.fontFamily`.
- Component-local styling uses MUI's `sx` prop for one-offs and `styled()` for anything reused twice.
- All RTL renders in tests go through a `renderWithTheme` helper (`tests-small-unit/_helpers/renderWithTheme.tsx`) that wraps the unit under the same `<ThemeProvider>` + `<CssBaseline>` — components must see the real theme during tests so palette and spacing match production.

## Consequences

**Easier:**

- A pre-designed component vocabulary (Card, Chip, Grid, Typography, ToggleButtonGroup, Dialog, Drawer, ...) is on tap as the catalog UI grows past the prototype.
- The palette, typography, and shape tokens live in one place. Components reach for `theme.palette.*` instead of hard-coding hex values, so a future palette change is a one-file edit.
- SSR-safe Emotion via `AppRouterCacheProvider` avoids the typical FOUC seen when MUI is dropped into Next App Router naively.

**Harder / new constraints:**

- MUI components that hold state (toggle groups, dialogs, dropdowns) must be rendered inside a Client Component boundary (`"use client"`). The layout shell stays a Server Component; interactive features get marked at the slice that introduces them.
- Bundle size — MUI is heavier than CSS Modules. Mitigated by tree-shaken icon imports (`@mui/icons-material/Foo` only when used) and by Next's per-route code splitting.
- Tests against MUI-rendered output must wrap under the theme; renders without `renderWithTheme` produce false-passes (default theme, wrong colors). The helper is the only sanctioned entry point for component tests.

**Follow-up work:**

- Translate the prototype's bespoke styles (toolbar, code blocks, pill badges) into MUI primitives as each slice that needs them lands. No big up-front translation pass — slices earn their pieces.
- Reconsider if the bundle-size cost ever becomes a Core Web Vitals problem; `theme.palette.*` discipline keeps the door open to a different style engine without the call sites changing.
