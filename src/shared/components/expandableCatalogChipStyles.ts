import { alpha, type SxProps, type Theme } from "@mui/material/styles";

import { type BadgePaletteKey } from "@/shared/theme/catalogChipColor";

export function splitChipContainerSx(paletteKey: BadgePaletteKey): SxProps<Theme> {
  return (theme) => ({
    display: "inline-flex",
    alignItems: "stretch",
    height: 24,
    borderRadius: 12,
    border: `1px solid ${alpha(theme.palette[paletteKey].main, 0.5)}`,
    backgroundColor: "transparent",
    overflow: "hidden",
    minWidth: 0,
    maxWidth: "100%",
  });
}

export function splitChipLabelSx(paletteKey: BadgePaletteKey): SxProps<Theme> {
  return (theme) => ({
    display: "block",
    flex: "1 1 auto",
    minWidth: 0,
    paddingLeft: "10px",
    paddingRight: "8px",
    color: theme.palette[paletteKey].dark,
    fontSize: "0.8125rem",
    fontWeight: 500,
    textDecoration: "none",
    lineHeight: "22px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    transition: "background-color 120ms",
    position: "relative",
    zIndex: 1,
    "&:hover": {
      backgroundColor: alpha(theme.palette[paletteKey].main, 0.08),
    },
    "&:focus-visible": {
      outline: `2px solid ${theme.palette[paletteKey].main}`,
      outlineOffset: -2,
    },
  });
}

export function splitChipDividerSx(paletteKey: BadgePaletteKey): SxProps<Theme> {
  return (theme) => ({
    width: "1px",
    alignSelf: "center",
    height: "65%",
    backgroundColor: alpha(theme.palette[paletteKey].main, 0.4),
    flexShrink: 0,
    pointerEvents: "none",
  });
}

export function splitChipChevronSx(paletteKey: BadgePaletteKey): SxProps<Theme> {
  return (theme) => ({
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: "6px",
    paddingRight: "6px",
    background: "transparent",
    border: "none",
    color: theme.palette[paletteKey].dark,
    cursor: "pointer",
    flexShrink: 0,
    transition: "background-color 120ms",
    position: "relative",
    zIndex: 1,
    "&:hover": {
      backgroundColor: alpha(theme.palette[paletteKey].main, 0.08),
    },
    "&:focus-visible": {
      outline: `2px solid ${theme.palette[paletteKey].main}`,
      outlineOffset: -2,
    },
  });
}
