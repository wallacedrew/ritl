import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import AboutSection from "./AboutSection";

export default function WhoThisIsFor() {
  return (
    <AboutSection title="Who this is for">
      <Stack component="ul" spacing={1} sx={{ pl: 3, my: 0 }}>
        <Typography component="li" variant="body1">
          Developers pair-coding with LLM agents who know the classic catalogs and want a second
          axis: how each smell, refactoring, and pattern plays out when the editor is an LLM rather
          than a person.
        </Typography>
        <Typography component="li" variant="body1">
          Tech leads writing AI coding standards who need citable, per-smell reasoning grounded in
          agent mechanics rather than opinion.
        </Typography>
        <Typography component="li" variant="body1">
          Self-taught developers shipping with an agent who need a vocabulary for the thing their
          agent just did and a lookup table to the canonical name.
        </Typography>
      </Stack>
    </AboutSection>
  );
}
