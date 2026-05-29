#!/usr/bin/env node
// Generates Claude-skill-shaped markdown snippets from the catalog JSON.
//
// Output layout:
//   docs/snippets/ritl-skills-index.md               (slugs + descriptions + per-skill URLs)
//   docs/snippets/refactoring-discipline.md          (AGENTS.md / CLAUDE.md drop-in directive)
//   docs/snippets/workflow.md                        (orchestrator SKILL.md mirror)
//   docs/snippets/refactorings/<slug>.md             (one valid SKILL.md per refactoring)
//   docs/snippets/smells/<slug>.md                   (one valid SKILL.md per smell)
//   docs/snippets/patterns/<slug>.md                 (one valid SKILL.md per pattern)
//   public/snippets/*                                (identical, served by Next)
//
// Per-entity files are well-formed Claude skills: bare-scalar YAML
// frontmatter (`name`, `description`) followed by the Apply/Refuse body.
// The bulk file inlines the per-entity sections verbatim so its content
// is the centralized view of the same material.

import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const refactorings = JSON.parse(
  readFileSync(resolve(root, "src/refactorings/content/refactorings.json"), "utf-8"),
);
const smells = JSON.parse(readFileSync(resolve(root, "src/smells/content/smells.json"), "utf-8"));
const patterns = JSON.parse(
  readFileSync(resolve(root, "src/patterns/content/patterns.json"), "utf-8"),
);

const workflowSkillMd = readFileSync(
  resolve(root, "plugin/refactor/skills/workflow/SKILL.md"),
  "utf-8",
);

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
  const forces = agentLensForces(r);
  const triggers = r.nemeses.join(", ");
  const goal = neutralizeColonSpace(firstSentence(forces.goal));
  return `Apply ${r.name} when you see ${triggers}. ${goal}`;
}

function agentLensForces(entry) {
  return entry.forces.agent;
}

function routingDescriptionForSmell(s) {
  const forces = agentLensForces(s);
  const symptomLead = neutralizeColonSpace(firstSentence(forces.symptom));
  const symptomClause = symptomLead.replace(/^[A-Z]/, (c) => c.toLowerCase());
  const apply = s.nemeses.slice(0, 2).join(", ");
  return `Refuse ${s.name} when ${symptomClause} Apply ${apply}.`;
}

function formatRefactoringBody(r) {
  const num = String(refactoringNumberByName.get(r.name)).padStart(2, "0");
  const forces = agentLensForces(r);
  return [
    `# Apply: ${num} — ${r.name}`,
    "",
    `**Symptom:** ${forces.symptom}`,
    "",
    `**Goal:** ${forces.goal}`,
    "",
    "```js",
    "// Avoid:",
    r.before,
    "",
    "// Prefer:",
    r.after,
    "```",
    "",
    `**Pressure:** ${forces.pressure}`,
    "",
    `**Tradeoff:** ${forces.tradeoff}`,
    "",
    `**Relief:** ${forces.relief}`,
    "",
    `**Trap:** ${forces.trap}`,
    "",
    `**Removes smells:** ${r.nemeses.join(", ")}`,
    "",
  ].join("\n");
}

function routingDescriptionForPattern(p) {
  const forces = agentLensForces(p);
  const triggers = p.nemeses.map((n) => n.name).join(", ");
  const goal = neutralizeColonSpace(firstSentence(forces.goal));
  return `Apply ${p.name} when you see ${triggers}. ${goal}`;
}

function formatPatternBody(p, index) {
  const num = String(index + 1).padStart(2, "0");
  const forces = agentLensForces(p);
  const triggers = p.nemeses.map((n) => `${n.name} (${n.catalog})`).join(", ");
  const lines = [
    `# Apply: ${num} — ${p.name}`,
    "",
    `**Symptom:** ${forces.symptom}`,
    "",
    `**Goal:** ${forces.goal}`,
    "",
    "```js",
    "// Before:",
    p.before,
    "",
    "// After:",
    p.after,
    "```",
    "",
  ];
  if (p.exampleSource) {
    lines.push(`_Example source: ${p.exampleSource}_`, "");
  }
  lines.push(
    `**Pressure:** ${forces.pressure}`,
    "",
    `**Tradeoff:** ${forces.tradeoff}`,
    "",
    `**Relief:** ${forces.relief}`,
    "",
    `**Trap:** ${forces.trap}`,
    "",
    `**Triggered by:** ${triggers}`,
    "",
  );
  return lines.join("\n");
}

function formatPatternSkill(p, index) {
  const slug = slugify(p.name);
  const description = routingDescriptionForPattern(p);
  assertSafeBareYamlScalar(description, p.name);
  return frontmatter(slug, description) + formatPatternBody(p, index);
}

function formatSmellBody(s, index) {
  const num = String(index + 1).padStart(2, "0");
  const forces = agentLensForces(s);
  return [
    `# Refuse: ${num} — ${s.name}`,
    "",
    `**Symptom:** ${forces.symptom}`,
    "",
    `**Goal:** ${forces.goal}`,
    "",
    "```js",
    "// Smellier:",
    s.before,
    "",
    "// Fresher:",
    s.after,
    "```",
    "",
    `**Pressure:** ${forces.pressure}`,
    "",
    `**Tradeoff:** ${forces.tradeoff}`,
    "",
    `**Relief:** ${forces.relief}`,
    "",
    `**Trap:** ${forces.trap}`,
    "",
    `**Apply refactorings:** ${s.nemeses.join(", ")}`,
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

const SITE_ORIGIN = "https://refactoringintheloop.com";

function parseFrontmatterDescription(skillMd) {
  const match = skillMd.match(/^---\nname:[^\n]*\ndescription:\s*(.*)\n---/);
  if (!match) {
    throw new Error("parseFrontmatterDescription: SKILL.md is missing frontmatter description");
  }
  return match[1].trim();
}

function indexBullet(slug, description, urlPath) {
  return `- **${slug}** — ${description}\n  ${SITE_ORIGIN}${urlPath}`;
}

function renderIndexFile() {
  const byName = new Map(refactorings.map((r) => [r.name, r]));
  const kerievskyPatterns = patterns.filter((p) => p.book === "kerievsky");
  const gofPatterns = patterns.filter((p) => p.book === "gof");
  const totalSkills =
    1 + refactorings.length + smells.length + kerievskyPatterns.length + gofPatterns.length;

  const workflowDescription = parseFrontmatterDescription(workflowSkillMd);

  const header = `# RITL skills index

Index of all ${totalSkills} skills in the catalog — 1 workflow orchestrator, ${refactorings.length} Fowler refactorings, ${smells.length} Fowler smells, ${kerievskyPatterns.length} Kerievsky composite refactorings, and ${gofPatterns.length} GoF design patterns. Each entry lists the skill's slug, its routing description, and the URL of the full SKILL.md to fetch when the description matches what you're working on.

## When to use this index

For coding agents with file or URL fetch (Cursor, Aider, Codex, Cline, Continue, custom agents). Read this index once, fetch only the matching skills on demand, work the cycle, repeat.

For Claude Code users, install the plugin instead — auto-loading via description match is strictly better than this index plus manual fetch:

    /plugin marketplace add wallacedrew/ritl
    /plugin install refactor@ritl

For agents that cannot fetch URLs at all, paste \`refactoring-discipline.md\` into your AGENTS.md or CLAUDE.md — it's a ~30-line behavior shape that does not depend on catalog lookup.

Do not concatenate every linked SKILL.md into one context. The whole point of this index is on-demand retrieval; loading the full ${totalSkills} skills at once is the anti-pattern this catalog teaches against.

`;

  const parts = [header, "## Workflow", ""];

  parts.push(indexBullet("workflow", workflowDescription, "/snippets/workflow.md"), "");

  parts.push("## Refactorings (Fowler 2e)", "");
  for (const [category, names] of Object.entries(REFACTORING_CATEGORIES)) {
    parts.push(`### ${category}`, "");
    for (const name of names) {
      const refactoring = byName.get(name);
      if (!refactoring) continue;
      const slug = slugify(refactoring.name);
      const description = routingDescriptionForRefactoring(refactoring);
      parts.push(indexBullet(slug, description, `/snippets/refactorings/${slug}.md`), "");
    }
  }

  parts.push("## Code smells (Fowler 2e)", "");
  smells.forEach((smell) => {
    const slug = slugify(smell.name);
    const description = routingDescriptionForSmell(smell);
    parts.push(indexBullet(slug, description, `/snippets/smells/${slug}.md`), "");
  });

  parts.push("## Patterns — Refactoring to Patterns (Kerievsky 2004)", "");
  patterns.forEach((pattern) => {
    if (pattern.book !== "kerievsky") return;
    const slug = slugify(pattern.name);
    const description = routingDescriptionForPattern(pattern);
    parts.push(indexBullet(slug, description, `/snippets/patterns/${slug}.md`), "");
  });

  parts.push("## Patterns — Design Patterns (Gamma/Helm/Johnson/Vlissides 1994)", "");
  patterns.forEach((pattern) => {
    if (pattern.book !== "gof") return;
    const slug = slugify(pattern.name);
    const description = routingDescriptionForPattern(pattern);
    parts.push(indexBullet(slug, description, `/snippets/patterns/${slug}.md`), "");
  });

  return parts.join("\n");
}

const indexMd = renderIndexFile();

// AGENTS.md-shaped discipline snippet. Directive voice, no catalog data
// inline beyond naming the 24 smell vocabulary. This is the
// best-practice cross-tool artifact (rules, not lookup table) for
// non-Claude-Code agents — Claude Code users install the plugin
// instead so each skill body loads just-in-time on description match.
const disciplineMd = `# Refactoring discipline (drop into AGENTS.md / CLAUDE.md)

Apply this cycle to every change to existing code; refuse to skip steps.

## 1. Sense the smell

Match what you see against Fowler's vocabulary before changing anything. The 24 named smells: mysterious-name, duplicated-code, long-function, long-parameter-list, global-data, mutable-data, divergent-change, shotgun-surgery, feature-envy, data-clumps, primitive-obsession, repeated-switches, loops, lazy-element, speculative-generality, temporary-field, message-chains, middle-man, insider-trading, large-class, alternative-classes-with-different-interfaces, data-class, refused-bequest, comments.

Refuse to invent ad-hoc smell names. If nothing matches, say so.

## 2. Identify the source

State file path + line range explicitly. If the smell appears in multiple places, refactor the one with the fewest external dependencies first.

## 3. Establish a safety net

Before any structural change, the current behavior needs tests. If they don't exist, write characterization tests first, get them green, commit. Skip this step only if the area already has comprehensive coverage.

## 4. Apply one named refactoring

Pick from Fowler's catalog — Extract Function, Inline Function, Extract Variable, Replace Primitive with Object, Decompose Conditional, Replace Conditional with Polymorphism, Replace Loop with Pipeline, etc. State which one you're applying and why. One refactoring per commit.

## 5. Stay green

Run the full test suite after each refactoring. Red → revert, decompose further, retry. Never power through red.

## 6. Recognize pattern destinations

When a stack of refactorings climbs toward a known shape, name the destination. Kerievsky's *Refactoring to Patterns* gives 27 composite refactorings whose endpoints are GoF design patterns; the GoF *Design Patterns* book gives 23 structural shapes. Look these up at refactoringintheloop.com/reference. State the destination before applying the next move so the agent can verify each step is heading there. Refuse to invent ad-hoc pattern names; if nothing matches, say so.

## Tidy First

Structural changes (refactoring) and behavioral changes (features, fixes) ship in separate commits. Subjects: \`refactor: <what>\` for structural; \`feat: <what>\` or \`fix: <what>\` for behavioral. Structural commits include a \`Before: / After: / Value:\` block in the body so the next reader can tell load-bearing tidying from drive-by churn.

## Source

Fowler 2e (https://refactoring.com/catalog/), Kerievsky's *Refactoring to Patterns* (2004), and *Design Patterns* (Gamma/Helm/Johnson/Vlissides 1994). For Claude Code users, install the auto-invoking plugin instead of pasting this file: \`/plugin marketplace add wallacedrew/ritl\` then \`/plugin install refactor@ritl\` — each skill loads just-in-time on description match.
`;

for (const dest of ["docs/snippets", "public/snippets"]) {
  mkdirSync(resolve(root, dest), { recursive: true });
  writeFileSync(resolve(root, `${dest}/ritl-skills-index.md`), indexMd);
  writeFileSync(resolve(root, `${dest}/refactoring-discipline.md`), disciplineMd);
  writeFileSync(resolve(root, `${dest}/workflow.md`), workflowSkillMd);

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

  mkdirSync(resolve(root, `${dest}/patterns`), { recursive: true });
  patterns.forEach((p, i) => {
    writeFileSync(
      resolve(root, `${dest}/patterns/${slugify(p.name)}.md`),
      formatPatternSkill(p, i),
    );
  });
}

// --- Plugin distribution ----------------------------------------------------
//
// Same 90 SKILL.md files in the canonical Claude Code plugin layout:
//   plugin/refactor/
//     .claude-plugin/plugin.json
//     skills/<slug>/SKILL.md
// Plus a one-plugin marketplace manifest at:
//   .claude-plugin/marketplace.json
// Marketplace install is the only distribution path; no zip is produced.

const PLUGIN_NAME = "refactor";
const MARKETPLACE_NAME = "ritl";
const PLUGIN_DESCRIPTION =
  "141 SKILL.md skills — 1 workflow orchestrator + 66 refactorings + 24 smells + 50 patterns (27 Kerievsky + 23 GoF). Apply Fowler refactorings when their preconditions appear; refuse known code smells; apply Kerievsky composite refactorings whose destination is a pattern; recognize GoF design patterns as destination shapes. Sources: https://refactoring.com/catalog/, Refactoring to Patterns (Kerievsky 2004), and Design Patterns (Gamma/Helm/Johnson/Vlissides 1994).";

const pluginRoot = resolve(root, `plugin/${PLUGIN_NAME}`);
const pluginSkillsRoot = resolve(pluginRoot, "skills");
const marketplaceDir = resolve(root, ".claude-plugin");

// Scope the wipe to catalog-derived slugs only. Hand-authored skills
// in this folder (like `workflow/`) live outside the catalog and must
// survive every regen.
const expectedCatalogSlugs = new Set([
  ...refactorings.map((r) => slugify(r.name)),
  ...smells.map((s) => slugify(s.name)),
  ...patterns.map((p) => slugify(p.name)),
]);
if (existsSync(pluginSkillsRoot)) {
  for (const entry of readdirSync(pluginSkillsRoot)) {
    if (expectedCatalogSlugs.has(entry)) {
      rmSync(resolve(pluginSkillsRoot, entry), { recursive: true, force: true });
    }
  }
}
mkdirSync(pluginSkillsRoot, { recursive: true });
mkdirSync(resolve(pluginRoot, ".claude-plugin"), { recursive: true });
mkdirSync(marketplaceDir, { recursive: true });

const pluginManifest = {
  name: PLUGIN_NAME,
  description: PLUGIN_DESCRIPTION,
  author: { name: "Wallace Drew" },
  homepage: "https://refactoringintheloop.com",
  repository: "https://github.com/wallacedrew/ritl",
};
writeFileSync(
  resolve(pluginRoot, ".claude-plugin/plugin.json"),
  JSON.stringify(pluginManifest, null, 2) + "\n",
);

const marketplaceManifest = {
  $schema: "https://anthropic.com/claude-code/marketplace.schema.json",
  name: MARKETPLACE_NAME,
  description: "Refactoring in the Loop — catalog tools for Claude Code",
  owner: { name: "Wallace Drew", email: "wallace.drew@gmail.com" },
  plugins: [
    {
      name: PLUGIN_NAME,
      description: PLUGIN_DESCRIPTION,
      author: { name: "Wallace Drew" },
      category: "development",
      source: `./plugin/${PLUGIN_NAME}`,
      homepage: "https://refactoringintheloop.com",
    },
  ],
};
writeFileSync(
  resolve(marketplaceDir, "marketplace.json"),
  JSON.stringify(marketplaceManifest, null, 2) + "\n",
);

for (const r of refactorings) {
  const slug = slugify(r.name);
  const dir = resolve(pluginSkillsRoot, slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(resolve(dir, "SKILL.md"), formatRefactoringSkill(r));
}
smells.forEach((s, i) => {
  const slug = slugify(s.name);
  const dir = resolve(pluginSkillsRoot, slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(resolve(dir, "SKILL.md"), formatSmellSkill(s, i));
});
patterns.forEach((p, i) => {
  const slug = slugify(p.name);
  const dir = resolve(pluginSkillsRoot, slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(resolve(dir, "SKILL.md"), formatPatternSkill(p, i));
});

console.log("Generated skill-shaped snippets in docs/snippets/ and public/snippets/");
console.log(`  ${refactorings.length} refactoring SKILL.md files`);
console.log(`  ${smells.length} smell SKILL.md files`);
console.log(`  ${patterns.length} pattern SKILL.md files`);
console.log("  1 ritl-skills-index.md (catalog of slugs + descriptions + URLs)");
console.log("  1 refactoring-discipline.md (AGENTS.md rules snippet)");
console.log("  1 workflow.md (orchestrator SKILL.md mirror)");
console.log(`Generated plugin '${PLUGIN_NAME}' at plugin/${PLUGIN_NAME}/`);
console.log(`  marketplace.json at .claude-plugin/marketplace.json`);
console.log(
  `  ${refactorings.length + smells.length + patterns.length} skill folders under skills/`,
);
