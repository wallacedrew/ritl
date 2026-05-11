#!/usr/bin/env node
// Generates Claude-skill-shaped markdown snippets from the catalog JSON.
//
// Output layout:
//   docs/snippets/refactoring-catalog.md             (single bulk reference)
//   docs/snippets/refactorings/<slug>.md             (one valid SKILL.md per refactoring)
//   docs/snippets/smells/<slug>.md                   (one valid SKILL.md per smell)
//   public/snippets/*                                (identical, served by Next)
//
// Per-entity files are well-formed Claude skills: bare-scalar YAML
// frontmatter (`name`, `description`) followed by the Apply/Refuse body.
// The bulk file inlines the per-entity sections verbatim so its content
// is the centralized view of the same material.

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

const refactoringNumberByName = new Map(refactorings.map((r, i) => [r.name, i + 1]));

function slugify(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

function firstSentence(text) {
  const trimmed = text.trim();
  const dot = trimmed.indexOf(". ");
  return dot === -1 ? trimmed : trimmed.slice(0, dot + 1);
}

// Bare YAML scalars accept commas, em-dashes, parens, double quotes,
// and apostrophes without escaping — the on-disk skills (tcr, tdd,
// tidy-first, business-analysis) all rely on this. The two failure
// modes are (a) ": " (colon-space) inside the value, which YAML parses
// as a nested key, and (b) a forbidden lead character. Assert both at
// generate time so a future catalog edit cannot silently break a skill.
const FORBIDDEN_LEAD_CHARS = new Set([
  "-",
  "?",
  ",",
  "[",
  "]",
  "{",
  "}",
  "#",
  "&",
  "*",
  "!",
  "|",
  ">",
  "'",
  '"',
  "%",
  "@",
  "`",
]);

function assertSafeBareYamlScalar(value, label) {
  if (value.includes(": ")) {
    throw new Error(
      `Description for ${label} contains ": " (colon-space). Rephrase. Value: ${value}`,
    );
  }
  if (FORBIDDEN_LEAD_CHARS.has(value.charAt(0))) {
    throw new Error(
      `Description for ${label} starts with forbidden YAML char "${value.charAt(0)}". Value: ${value}`,
    );
  }
}

// Bare YAML scalars reject ": " (colon-space) — the parser would treat
// it as a nested key. Source catalog prose sometimes uses a colon to
// introduce examples ("named domain decisions: isInSummer(), ..."). We
// rewrite those to semicolons in the routing description only; the
// per-entity body retains the original prose verbatim.
function neutralizeColonSpace(text) {
  return text.replace(/: /g, "; ");
}

function routingDescriptionForRefactoring(r) {
  const triggers = r.solves.join(", ");
  const goal = neutralizeColonSpace(firstSentence(r.goal));
  return `Apply ${r.name} when you see ${triggers}. ${goal}`;
}

function routingDescriptionForSmell(s) {
  const symptomLead = neutralizeColonSpace(firstSentence(s.symptom));
  const symptomClause = symptomLead.replace(/^[A-Z]/, (c) => c.toLowerCase());
  const apply = s.refactorings.slice(0, 2).join(", ");
  return `Refuse ${s.name} when ${symptomClause} Apply ${apply}.`;
}

function formatRefactoringBody(r) {
  const num = String(refactoringNumberByName.get(r.name)).padStart(2, "0");
  return [
    `# Apply: ${num} — ${r.name}`,
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

function formatSmellBody(s, index) {
  const num = String(index + 1).padStart(2, "0");
  return [
    `# Refuse: ${num} — ${s.name}`,
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

function frontmatter(name, description) {
  return ["---", `name: ${name}`, `description: ${description}`, "---", "", ""].join("\n");
}

function formatRefactoringSkill(r) {
  const slug = slugify(r.name);
  const description = routingDescriptionForRefactoring(r);
  assertSafeBareYamlScalar(description, r.name);
  return frontmatter(slug, description) + formatRefactoringBody(r);
}

function formatSmellSkill(s, index) {
  const slug = slugify(s.name);
  const description = routingDescriptionForSmell(s);
  assertSafeBareYamlScalar(description, s.name);
  return frontmatter(slug, description) + formatSmellBody(s, index);
}

function renderCatalogFile() {
  const byName = new Map(refactorings.map((r) => [r.name, r]));

  const header = `# Refactoring catalog

Centralized view of the 90 catalog skills. Each section below is the
full SKILL.md content of the matching per-entity download — the
content is identical at the section level. Use this single paste when
you want the whole vocabulary loaded; use the per-entity downloads
when you want auto-invocable skills under \`~/.claude/skills/<slug>/SKILL.md\`.

Source: https://refactoring.com/catalog/ (Fowler 2e). Regenerate with
\`npm run snippets\`.

`;

  const parts = [header, "---", "", "## Refactorings", ""];

  for (const [category, names] of Object.entries(REFACTORING_CATEGORIES)) {
    parts.push(`### ${category}`);
    parts.push("");
    for (const name of names) {
      const refactoring = byName.get(name);
      if (!refactoring) continue;
      parts.push(formatRefactoringSkill(refactoring));
    }
  }

  parts.push("---");
  parts.push("");
  parts.push("## Code smells");
  parts.push("");
  smells.forEach((smell, index) => {
    parts.push(formatSmellSkill(smell, index));
  });

  return parts.join("\n");
}

const catalogMd = renderCatalogFile();

for (const dest of ["docs/snippets", "public/snippets"]) {
  mkdirSync(resolve(root, dest), { recursive: true });
  writeFileSync(resolve(root, `${dest}/refactoring-catalog.md`), catalogMd);

  mkdirSync(resolve(root, `${dest}/refactorings`), { recursive: true });
  for (const r of refactorings) {
    writeFileSync(
      resolve(root, `${dest}/refactorings/${slugify(r.name)}.md`),
      formatRefactoringSkill(r),
    );
  }

  mkdirSync(resolve(root, `${dest}/smells`), { recursive: true });
  smells.forEach((s, i) => {
    writeFileSync(resolve(root, `${dest}/smells/${slugify(s.name)}.md`), formatSmellSkill(s, i));
  });
}

console.log("Generated skill-shaped snippets in docs/snippets/ and public/snippets/");
console.log(`  ${refactorings.length} refactoring SKILL.md files`);
console.log(`  ${smells.length} smell SKILL.md files`);
console.log("  1 consolidated refactoring-catalog.md");
