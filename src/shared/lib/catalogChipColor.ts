import { alpha, type SxProps, type Theme } from "@mui/material/styles";

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
 * source label (smell / fowler-refactoring / kerievsky-refactoring /
 * pattern); colors are preserved across the post-ADR-0007 rename:
 *
 *   fowler-refactoring     → success  (green)
 *   smell                  → error    (red)
 *   kerievsky-refactoring  → warning  (orange)
 *   pattern                → info     (blue)
 */
export function chipColorForTone(tone: CatalogEntryTone): ChipColor {
  switch (tone) {
    case "fowler-refactoring":
      return "success";
    case "smell":
      return "error";
    case "kerievsky-refactoring":
      return "warning";
    case "pattern":
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
    case "fowler-refactoring":
      return "success";
    case "smell":
      return "error";
    case "kerievsky-refactoring":
      return "warning";
    case "pattern":
      return "info";
  }
}

/**
 * Shared chip styling for any MUI Chip representing a catalog entry —
 * transparent fill, toned border and label, subtle hover fill. Used by
 * LinkedChip; ExpandableCatalogChip composes its own split-chip styling
 * because the divider and chevron section need element-level control.
 */
export function tonedChipSx(tone: CatalogEntryTone): SxProps<Theme> {
  const paletteKey = badgePaletteKey(tone);
  return (theme) => ({
    backgroundColor: "transparent",
    color: theme.palette[paletteKey].dark,
    border: `1px solid ${alpha(theme.palette[paletteKey].main, 0.5)}`,
    fontWeight: 500,
    "&:hover": {
      backgroundColor: alpha(theme.palette[paletteKey].main, 0.08),
    },
  });
}
