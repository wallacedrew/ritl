// Post-build cleanup for `output: "export"`.
//
// Next 16 emits both `out/404.html` and `out/_not-found.html` when an
// `app/not-found.tsx` exists. Cloudflare Pages only serves `404.html`
// on unknown routes; `_not-found.html` (and the `_not-found/` directory
// of RSC manifest fragments) ships as dead bytes. Delete them.

import { existsSync, readdirSync, rmSync, statSync } from "node:fs";
import { resolve } from "node:path";

const OUT_DIR = resolve(process.cwd(), "out");
const DEAD_TARGETS = ["_not-found.html", "_not-found.txt", "_not-found"];

let removedBytes = 0;
let removedCount = 0;

for (const target of DEAD_TARGETS) {
  const path = resolve(OUT_DIR, target);
  if (!existsSync(path)) continue;
  const stats = statSync(path);
  const size = stats.isDirectory() ? directorySize(path) : stats.size;
  rmSync(path, { recursive: true, force: true });
  removedBytes += size;
  removedCount += 1;
}

function directorySize(dir) {
  let total = 0;
  for (const name of readdirSync(dir, { withFileTypes: true })) {
    const child = resolve(dir, name.name);
    total += name.isDirectory() ? directorySize(child) : statSync(child).size;
  }
  return total;
}

if (removedCount > 0) {
  const kib = (removedBytes / 1024).toFixed(1);
  console.log(`Cleaned ${removedCount} dead _not-found artifacts from out/ (${kib} KiB)`);
}
