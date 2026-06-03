import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import AboutSection from "./AboutSection";

export default function WhatThisIs() {
  return (
    <AboutSection title="What this is">
      <Typography variant="body1">
        Refactoring In The Loop is a reference site that places three classic works on code quality
        side-by-side and adds a second column for AI coding agents.
      </Typography>
      <Stack component="ul" spacing={0.5} sx={{ pl: 3, my: 0 }}>
        <Typography component="li" variant="body1">
          <em>Refactoring</em> (Fowler) — refactorings and code smells.
        </Typography>
        <Typography component="li" variant="body1">
          <em>Refactoring to Patterns</em> (Kerievsky) — composite refactorings.
        </Typography>
        <Typography component="li" variant="body1">
          <em>Design Patterns</em> (Gang of Four) — the 23 reusable object-oriented patterns.
        </Typography>
      </Stack>
      <Typography variant="body1">
        The signature surface is the compare view. Every entry presents six paired force fields —
        Symptom, Goal, Pressure, Tradeoff, Relief, Trap — for humans on one side and AI coding
        agents on the other.
      </Typography>
    </AboutSection>
  );
}
