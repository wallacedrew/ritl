#!/usr/bin/env node
// Real-browser screenshot script for visual verification during refactors.
//
// Drives Playwright + chromium across a representative URL list at two
// viewports (desktop 1280×800, mobile 375×667) and writes one PNG per
// (viewport, url) pair to /tmp/ritl-snap-<label>/.
//
// Usage:
//   pnpm dev                         # in another terminal, or via SNAP_BASE_URL
//   pnpm snap --label=baseline
//   pnpm snap --label=after-2-1
//   diff -r /tmp/ritl-snap-baseline /tmp/ritl-snap-after-2-1
//
// First-time setup: `npx playwright install chromium`.

import { mkdirSync, rmSync } from "node:fs";
import { resolve } from "node:path";

import { chromium } from "playwright";

const BASE_URL = process.env.SNAP_BASE_URL ?? "http://localhost:3020";

const VIEWPORTS = [
  { name: "desktop", width: 1280, height: 800 },
  { name: "mobile", width: 375, height: 667 },
];

// Covers every distinct page.tsx route type under src/app/:
// 5 static (/, /plugin, /reference, /reference/list, /reference/map)
// 4 catalog landings + 4 catalog detail × 3 variants (base, /agent, /compare)
// 1 known 404 path
const URLS = [
  "/",
  "/plugin",
  "/reference",
  "/reference/list",
  "/reference/map",
  "/refactoring/canon",
  "/refactoring/canon/extract-function",
  "/refactoring/canon/extract-function/compare",
  "/refactoring/canon/extract-function/agent",
  "/refactoring/smells",
  "/refactoring/smells/long-function",
  "/refactoring/smells/long-function/compare",
  "/refactoring/smells/long-function/agent",
  "/refactoring-to-patterns",
  "/refactoring-to-patterns/compose-method",
  "/refactoring-to-patterns/compose-method/compare",
  "/refactoring-to-patterns/compose-method/agent",
  "/design-patterns",
  "/design-patterns/abstract-factory",
  "/design-patterns/abstract-factory/compare",
  "/design-patterns/abstract-factory/agent",
  "/this-page-does-not-exist",
];

function parseLabel(argv) {
  for (const arg of argv.slice(2)) {
    if (arg.startsWith("--label=")) return arg.slice("--label=".length);
    if (arg === "--label") {
      const next = argv[argv.indexOf(arg) + 1];
      if (next) return next;
    }
  }
  throw new Error("snap: --label=<name> is required");
}

function sanitize(urlPath) {
  if (urlPath === "/") return "root";
  return urlPath
    .replace(/^\//, "")
    .replace(/\//g, "_")
    .replace(/[^a-z0-9_-]/gi, "");
}

async function main() {
  const label = parseLabel(process.argv);
  const outDir = resolve("/tmp", `ritl-snap-${label}`);
  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch();
  try {
    for (const viewport of VIEWPORTS) {
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
        deviceScaleFactor: 1,
      });
      const page = await context.newPage();
      for (const urlPath of URLS) {
        const target = `${BASE_URL}${urlPath}`;
        const filename = `${viewport.name}-${sanitize(urlPath)}.png`;
        const fullPath = resolve(outDir, filename);
        try {
          await page.goto(target, { waitUntil: "networkidle", timeout: 30000 });
          await page.screenshot({ path: fullPath, fullPage: true });
          process.stdout.write(`  ${filename}\n`);
        } catch (error) {
          process.stdout.write(`  ${filename} (error: ${error.message})\n`);
        }
      }
      await context.close();
    }
  } finally {
    await browser.close();
  }

  process.stdout.write(`\nWrote ${URLS.length * VIEWPORTS.length} screenshots to ${outDir}\n`);
}

main().catch((error) => {
  process.stderr.write(`snap: ${error.message}\n`);
  process.exit(1);
});
