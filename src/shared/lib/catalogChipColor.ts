import type { CatalogEntryTone } from "./CatalogEntry";

/**
 * MUI ChipOwnProps["color"] union, restated here so this file does not
 * import from `@mui/material` (keeps the helper testable in isolation
 * and out of any client/server-component boundary discussions).
 */
export type ChipColor =
  | "default"
  | "primary"
  | "secondary"
  | "error"
  | "info"
  | "success"
  | "warning";

/**
 * Mapping of catalog tone → MUI palette key. Tone is the granular
 * source label (refactoring / smell / kerievsky-pattern / gof-pattern);
 * colors are the user-chosen tones:
 *
 *   refactoring        → success  (green)
 *   smell              → error    (red)
 *   kerievsky-pattern  → warning  (orange)
 *   gof-pattern        → info     (blue)
 */
export function chipColorForTone(tone: CatalogEntryTone): ChipColor {
  switch (tone) {
    case "refactoring":
      return "success";
    case "smell":
      return "error";
    case "kerievsky-pattern":
      return "warning";
    case "gof-pattern":
      return "info";
  }
}

/**
 * Background-color palette key for the small dots rendered in the search
 * dropdown. Returns the `.main` shade by convention (e.g. "success.main")
 * so the caller can pass it directly as an `sx={{ bgcolor: ... }}` value.
 */
export function dotBgForTone(tone: CatalogEntryTone): string {
  return `${chipColorForTone(tone)}.main`;
}

/**
 * Narrowed palette key for badges/borders that want `theme.palette[key].main`
 * with `alpha()`. Same mapping as `chipColorForTone` but excludes "default"
 * etc. so TypeScript can index `theme.palette[badgePaletteKey(tone)]` safely.
 */
export type BadgePaletteKey = "success" | "error" | "warning" | "info";

export function badgePaletteKey(tone: CatalogEntryTone): BadgePaletteKey {
  switch (tone) {
    case "refactoring":
      return "success";
    case "smell":
      return "error";
    case "kerievsky-pattern":
      return "warning";
    case "gof-pattern":
      return "info";
  }
}
