#!/usr/bin/env node
// Generates AGENTS.md-ready markdown snippets from the catalog JSON.
//
// Output: docs/snippets/{refactorings,smells,combined}.md
// Tuning: directive voice for AI coding agents — imperative section
// headers (Apply / Refuse), action-shaped labels (Trigger / Pitfall),
// concrete Before/After code blocks. See feedback memory
// "AGENTS.md snippets: directive voice".

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const refactorings = JSON.parse(
  readFileSync(resolve(root, "src/refactorings/content/refactorings.json"), "utf-8"),
);
const smells = JSON.parse(readFileSync(resolve(root, "src/smells/content/smells.json"), "utf-8"));

// Mirrors src/refactorings/lib/categories.ts. Duplicated here so the
// generator can run as a plain Node script without TS tooling; keep in
// sync after catalog reorganizations.
const REFACTORING_CATEGORIES = {
  "Basic Refactorings": [
    "Rename Variable",
    "Rename Field",
    "Remove Dead Code",
    "Replace Magic Literal",
  ],
  "Composing Methods": [
    "Extract Function",
    "Inline Function",
    "Extract Variable",
    "Inline Variable",
    "Combine Functions into Class",
    "Combine Functions into Transform",
    "Split Phase",
    "Slide Statements",
    "Split Loop",
    "Replace Loop with Pipeline",
    "Replace Derived Variable with Query",
    "Split Variable",
    "Move Statements into Function",
    "Move Statements to Callers",
    "Replace Inline Code with Function Call",
    "Replace Temp with Query",
    "Replace Function with Command",
    "Replace Command with Function",
    "Return Modified Value",
    "Substitute Algorithm",
  ],
  Encapsulation: [
    "Encapsulate Variable",
    "Hide Delegate",
    "Remove Middle Man",
    "Encapsulate Collection",
    "Encapsulate Record",
    "Remove Setting Method",
  ],
  "Moving Features": ["Move Function", "Move Field", "Extract Class", "Inline Class"],
  "Organizing Data": [
    "Replace Primitive with Object",
    "Change Reference to Value",
    "Change Value to Reference",
  ],
  "Simplifying Conditional Logic": [
    "Decompose Conditional",
    "Consolidate Conditional Expression",
    "Replace Nested Conditional with Guard Clauses",
    "Replace Conditional with Polymorphism",
    "Introduce Special Case",
    "Replace Control Flag with Break",
  ],
  "Refactoring APIs": [
    "Change Function Declaration",
    "Introduce Parameter Object",
    "Introduce Assertion",
    "Separate Query from Modifier",
    "Parameterize Function",
    "Remove Flag Argument",
    "Preserve Whole Object",
    "Replace Parameter with Query",
    "Replace Query with Parameter",
    "Replace Constructor with Factory Function",
    "Replace Error Code with Exception",
    "Replace Exception with Precheck",
  ],
  "Dealing with Inheritance": [
    "Pull Up Method",
    "Push Down Method",
    "Replace Type Code with Subclasses",
    "Extract Superclass",
    "Collapse Hierarchy",
    "Replace Subclass with Delegate",
    "Pull Up Constructor Body",
    "Pull Up Field",
    "Push Down Field",
    "Remove Subclass",
    "Replace Superclass with Delegate",
  ],
};

// JSON-order numbering (1-based) — matches the in-app catalog badges.
const refactoringNumberByName = new Map(refactorings.map((r, i) => [r.name, i + 1]));

// Mirrors src/shared/lib/slugify.ts (duplicated for plain-Node script).
function slugify(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

// First sentence of a paragraph — trims to a one-liner for tables / digests.
function firstSentence(text) {
  const trimmed = text.trim();
  const dot = trimmed.indexOf(". ");
  return dot === -1 ? trimmed : trimmed.slice(0, dot + 1);
}

function escapePipes(text) {
  return text.replace(/\|/g, "\\|");
}

function formatRefactoring(r) {
  const num = String(refactoringNumberByName.get(r.name)).padStart(2, "0");
  return [
    `### Apply: ${num} — ${r.name}`,
    "",
    `**Target state:** ${r.goal}`,
    "",
    `**Why apply it:** ${r.savings}`,
    "",
    `**Pitfall:** ${r.risk}`,
    "",
    "```js",
    "// Avoid:",
    r.before,
    "",
    "// Prefer:",
    r.after,
    "```",
    "",
    `**Removes smells:** ${r.solves.join(", ")}`,
    "",
  ].join("\n");
}

function formatSmell(s, index) {
  const num = String(index + 1).padStart(2, "0");
  return [
    `### Refuse: ${num} — ${s.name}`,
    "",
    `**Trigger (refuse when you see):** ${s.symptom}`,
    "",
    `**Cost of leaving it in:** ${s.risk}`,
    "",
    `**Target shape after refactoring:** ${s.goal}`,
    "",
    "```js",
    "// Smellier:",
    s.before,
    "",
    "// Fresher:",
    s.after,
    "```",
    "",
    `**Apply refactorings:** ${s.refactorings.join(", ")}`,
    "",
  ].join("\n");
}

function renderRefactoringsFile() {
  const byName = new Map(refactorings.map((r) => [r.name, r]));

  const header = `# Refactorings — patterns to apply

Paste any of these sections into AGENTS.md to tell Claude Code (or any
coding agent reading AGENTS-style guidance) to **apply** the named
refactoring when its preconditions appear. Each section opens with a
directive (\`### Apply: NN — Name\`), labels the target state and
pitfall, and gives a Before/Prefer code example.

Source: https://refactoring.com/catalog/ (Fowler 2e). Regenerate after
catalog edits via \`npm run snippets\`.

`;

  const sections = [];
  for (const [category, names] of Object.entries(REFACTORING_CATEGORIES)) {
    sections.push(`## ${category}`);
    sections.push("");
    const blocks = names
      .map((name) => byName.get(name))
      .filter(Boolean)
      .map(formatRefactoring);
    sections.push(blocks.join("\n---\n\n"));
    sections.push("");
  }

  return header + sections.join("\n");
}

function renderSmellsFile() {
  const header = `# Code smells — patterns to refuse

Paste any of these sections into AGENTS.md to tell Claude Code (or any
coding agent reading AGENTS-style guidance) to **refuse** the named
antipattern when writing new code and to flag + refactor it when found
in existing code. Each section opens with a directive
(\`### Refuse: NN — Name\`), labels the trigger and cost, and gives a
Smellier/Fresher code example.

Source: https://refactoring.com/catalog/ + Fowler 2e chapter 3.
Regenerate after catalog edits via \`npm run snippets\`.

`;

  const blocks = smells.map((s, i) => formatSmell(s, i));
  return header + blocks.join("\n---\n\n");
}

function renderCombinedFile() {
  const lines = [];

  lines.push("# Refactoring catalog — agent guidance");
  lines.push("");
  lines.push(
    "Paste this whole section into AGENTS.md to give a coding agent the catalog vocabulary and cross-references in one block.",
  );
  lines.push("");
  lines.push("**How to use this:**");
  lines.push("");
  lines.push(
    "- When writing new code in this project, **refuse** to introduce any pattern listed under **Code smells** below.",
  );
  lines.push(
    "- When the trigger of a smell appears in code you're editing, **apply** one of the named refactorings before adding new behavior.",
  );
  lines.push(
    "- For Before/After code on any entry, see `docs/snippets/refactorings.md` and `docs/snippets/smells.md`.",
  );
  lines.push("");
  lines.push("Source: https://refactoring.com/catalog/ (Fowler 2e).");
  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push("## Code smells — refuse these patterns");
  lines.push("");
  lines.push("| # | Smell | Trigger (refuse when you see) | Apply |");
  lines.push("|---|-------|-------------------------------|-------|");
  smells.forEach((s, i) => {
    const num = String(i + 1).padStart(2, "0");
    const trigger = escapePipes(firstSentence(s.symptom));
    const apply = s.refactorings.join(", ");
    lines.push(`| ${num} | **${s.name}** | ${trigger} | ${apply} |`);
  });
  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push("## Refactorings — apply these patterns");
  lines.push("");
  lines.push("Grouped by Fowler chapter. Numbers match the in-app catalog ordering.");
  lines.push("");

  const byName = new Map(refactorings.map((r) => [r.name, r]));
  for (const [category, names] of Object.entries(REFACTORING_CATEGORIES)) {
    lines.push(`### ${category}`);
    lines.push("");
    for (const name of names) {
      const r = byName.get(name);
      if (!r) continue;
      const num = String(refactoringNumberByName.get(name)).padStart(2, "0");
      const goal = firstSentence(r.goal);
      lines.push(`- **${num} ${r.name}** — ${goal}`);
    }
    lines.push("");
  }

  return lines.join("\n");
}

// Outputs go to both docs/snippets/ (human-browsable in the repo) and
// public/snippets/ (served by Next so the app can offer downloads).
const refactoringsMd = renderRefactoringsFile();
const smellsMd = renderSmellsFile();
const combinedMd = renderCombinedFile();

for (const dest of ["docs/snippets", "public/snippets"]) {
  mkdirSync(resolve(root, dest), { recursive: true });
  writeFileSync(resolve(root, `${dest}/refactorings.md`), refactoringsMd);
  writeFileSync(resolve(root, `${dest}/smells.md`), smellsMd);
  writeFileSync(resolve(root, `${dest}/combined.md`), combinedMd);

  mkdirSync(resolve(root, `${dest}/refactorings`), { recursive: true });
  for (const r of refactorings) {
    writeFileSync(
      resolve(root, `${dest}/refactorings/${slugify(r.name)}.md`),
      formatRefactoring(r),
    );
  }

  mkdirSync(resolve(root, `${dest}/smells`), { recursive: true });
  smells.forEach((s, i) => {
    writeFileSync(resolve(root, `${dest}/smells/${slugify(s.name)}.md`), formatSmell(s, i));
  });
}

console.log("Generated snippets in docs/snippets/ and public/snippets/");
console.log(`  ${refactorings.length} refactoring sections (bulk + per-entity)`);
console.log(`  ${smells.length} smell sections (bulk + per-entity)`);
console.log(`  1 combined digest`);
