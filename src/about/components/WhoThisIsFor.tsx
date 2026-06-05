import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import AboutSection from "./AboutSection";

export default function WhoThisIsFor() {
  return (
    <AboutSection title="Who this is for">
      <Stack component="ul" spacing={1} sx={{ pl: 3, my: 0 }}>
        <Typography component="li" variant="body1">
          You are a developer pair-coding with LLM agents. You know the classic catalogs and want a
          second axis: how each smell, refactoring, and pattern plays out when the editor is an LLM
          rather than a person.
        </Typography>
        <Typography component="li" variant="body1">
          You are a tech lead writing AI coding standards. You need citable, per-smell reasoning
          grounded in agent mechanics rather than opinion.
        </Typography>
        <Typography component="li" variant="body1">
          You are a self-taught developer shipping with an agent. You need a vocabulary for the
          thing your agent just did and a lookup table to the canonical name.
        </Typography>
      </Stack>
    </AboutSection>
  );
}
