import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import AboutSection from "./AboutSection";
import SubSiteHoverBullet from "./SubSiteHoverBullet";

export default function WhatThisIs() {
  return (
    <AboutSection title="What this is">
      <Typography variant="body1">
        RefactorPlug is a reference site that places three classic works on code quality
        side-by-side and adds a second column for AI coding agents.
      </Typography>
      <Stack component="ul" spacing={0.5} sx={{ pl: 3, my: 0 }}>
        <SubSiteHoverBullet
          testId="about-bullet-refactoring"
          relatedViews={["refactorings", "smells"]}
        >
          <em>Refactoring</em> (Fowler, Beck) — refactorings and code smells.
        </SubSiteHoverBullet>
        <SubSiteHoverBullet
          testId="about-bullet-refactoring-to-patterns"
          relatedViews={["patterns"]}
        >
          <em>Refactoring to Patterns</em> (Kerievsky) — composite refactorings.
        </SubSiteHoverBullet>
        <SubSiteHoverBullet
          testId="about-bullet-design-patterns"
          relatedViews={["design-patterns"]}
        >
          <em>Design Patterns</em> (Gang of Four) — the 23 reusable object-oriented patterns.
        </SubSiteHoverBullet>
      </Stack>
      <Typography variant="body1">
        The signature surface is the compare view. Each entry sits in a two-column layout: the human
        column on the left, the agent column on the right. Both columns carry the same six force
        fields — Symptom, Goal, Pressure, Tradeoff, Relief, Trap — so any row reads as a direct
        contrast. The names match Fowler, Kerievsky, or the Gang of Four; the agent row names a
        token-cost or context-window mechanism for the same name.
      </Typography>
      <Typography variant="body1">
        Entries cross-link by role. A smell links to the refactorings that relieve it; a refactoring
        links back to the smells it targets and to any composite refactoring or design pattern it
        composes into. The catalog forms a bidirectional graph — symptom to remedy in one direction,
        target shape back to smells in the other.
      </Typography>
      <Typography variant="body1">
        Terms from LLM research — <em>context window</em>, <em>lost-in-the-middle</em>,{" "}
        <em>token cost</em> — carry inline definitions throughout the catalog. Hover or tap any
        underlined term to read the definition and its citation without leaving the entry.
      </Typography>
      <Typography variant="body1">
        The catalog spans roughly 140 entries across the three books. Six force fields per entry,
        two actors per entry.
      </Typography>
    </AboutSection>
  );
}
