/**
 * Neutral surface tint shared across "inert chrome" surfaces — code-block
 * header bars, segmented-control inactive buttons, etc.
 *
 * Picking one warm cream and routing every such surface through it keeps
 * the page reading as a single LnF rather than a patchwork of subtle
 * grays drifting toward different temperature ranges.
 */
export const SURFACE_TINT = "#f3eee4";

/** Hover state derived from SURFACE_TINT — slightly deeper. */
export const SURFACE_TINT_HOVER = "#eae4d8";
