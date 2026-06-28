#!/usr/bin/env node
// Generates the RefactorPlug brand assets as font-independent SVG paths.
//
// Output:
//   public/brand/refactorplug-wordmark.svg   (RefactorPlug, 700)
//   public/brand/refactorplug-lockup.svg     (wordmark 700 + tagline 800)
//   public/brand/refactorplug-monogram.svg   (RP, 800)
//   src/app/icon.svg                          (RP, 800 — Next App Router favicon)
//
// The live header renders the wordmark in JetBrains Mono via the variable
// web font (@fontsource-variable/jetbrains-mono, imported in the root
// layout). These standalone SVGs cannot rely on a web font being present
// on a viewer's machine, so each glyph is emitted as a vector <path>
// extracted from the static per-weight JetBrains Mono files. The result
// carries no font dependency and renders identically anywhere.
//
// Run manually when the brand text, weights, or sizing change:
//   npm run brand-assets
// fontkit and @fontsource/jetbrains-mono are devDependencies used only
// here; the runtime ships only the variable font package.

import { writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import * as fontkit from "fontkit";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const WORDMARK_FILL = "#18181b";
const TAGLINE_FILL = "#52525b";

// JetBrains Mono is monospaced on a 1000-unit em with a 600-unit advance,
// so every glyph sits on a fixed grid: glyph N starts at N × advance.
const UNITS_PER_EM = 1000;
const ADVANCE = 600;

const openFont = fontkit.openSync ?? fontkit.default?.openSync;

function staticWeightFont(weight) {
  const file = resolve(
    root,
    `node_modules/@fontsource/jetbrains-mono/files/jetbrains-mono-latin-${weight}-normal.woff2`,
  );
  return openFont(file);
}

const fontsByWeight = {
  700: staticWeightFont(700),
  800: staticWeightFont(800),
};

// Returns the glyph paths for `text` as a positioned, scaled <g>, plus the
// rendered width in pixels (used to center the monogram).
function glyphGroup(weight, text, { fontSize, xPx, baselinePx, fill, letterSpacingEm = 0 }) {
  const font = fontsByWeight[weight];
  const stepUnits = ADVANCE + letterSpacingEm * UNITS_PER_EM;
  const scale = fontSize / UNITS_PER_EM;

  const paths = [...text]
    .map((character, index) => {
      const glyph = font.glyphForCodePoint(character.codePointAt(0));
      const data = glyph.path.toSVG();

      // Whitespace glyphs carry no outline; skip the empty <path> but keep
      // the advance slot so following glyphs stay on the monospace grid.
      if (data === "") return null;

      return `    <path transform="translate(${index * stepUnits} 0)" d="${data}"/>`;
    })
    .filter(Boolean);

  // Y is flipped (scale ... -scale) because font outlines are y-up and SVG
  // is y-down; the group translate plants the baseline.
  const group = [
    `  <g fill="${fill}" transform="translate(${xPx.toFixed(2)} ${baselinePx}) scale(${scale} ${-scale})">`,
    ...paths,
    "  </g>",
  ].join("\n");

  const widthPx = ((text.length - 1) * stepUnits + ADVANCE) * scale;
  return { group, widthPx };
}

function svgDocument(viewBox, ariaLabel, groups) {
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" role="img" aria-label="${ariaLabel}">\n` +
    groups.join("\n") +
    "\n</svg>\n"
  );
}

function writeAsset(relativePath, contents) {
  writeFileSync(resolve(root, relativePath), contents);
}

// --- Wordmark ---------------------------------------------------------------
const wordmark = glyphGroup(700, "RefactorPlug", {
  fontSize: 44,
  xPx: 10,
  baselinePx: 44,
  fill: WORDMARK_FILL,
});
writeAsset(
  "public/brand/refactorplug-wordmark.svg",
  svgDocument("0 0 360 64", "RefactorPlug", [wordmark.group]),
);

// --- Lockup (wordmark + tagline) --------------------------------------------
const lockupWordmark = glyphGroup(700, "RefactorPlug", {
  fontSize: 40,
  xPx: 10,
  baselinePx: 40,
  fill: WORDMARK_FILL,
});
const lockupTagline = glyphGroup(800, "refactoring in the loop", {
  fontSize: 16,
  xPx: 11,
  baselinePx: 66,
  fill: TAGLINE_FILL,
});
writeAsset(
  "public/brand/refactorplug-lockup.svg",
  svgDocument("0 0 320 80", "RefactorPlug — refactoring in the loop", [
    lockupWordmark.group,
    lockupTagline.group,
  ]),
);

// --- Monogram + favicon (RP, centered in a 64×64 square) --------------------
const MONOGRAM_FONT_SIZE = 40;
const MONOGRAM_LETTER_SPACING_EM = -0.04;
const monogramMeasure = glyphGroup(800, "RP", {
  fontSize: MONOGRAM_FONT_SIZE,
  xPx: 0,
  baselinePx: 0,
  fill: WORDMARK_FILL,
  letterSpacingEm: MONOGRAM_LETTER_SPACING_EM,
});
const monogram = glyphGroup(800, "RP", {
  fontSize: MONOGRAM_FONT_SIZE,
  xPx: (64 - monogramMeasure.widthPx) / 2,
  baselinePx: 46,
  fill: WORDMARK_FILL,
  letterSpacingEm: MONOGRAM_LETTER_SPACING_EM,
});
const monogramDocument = svgDocument("0 0 64 64", "RP", [monogram.group]);
writeAsset("public/brand/refactorplug-monogram.svg", monogramDocument);
writeAsset("src/app/icon.svg", monogramDocument);

console.log("Generated brand assets in public/brand/ and src/app/icon.svg");
console.log("  refactorplug-wordmark.svg  (RefactorPlug, 700)");
console.log("  refactorplug-lockup.svg    (wordmark 700 + tagline 800)");
console.log("  refactorplug-monogram.svg  (RP, 800)");
console.log("  src/app/icon.svg           (RP, 800 — favicon)");
