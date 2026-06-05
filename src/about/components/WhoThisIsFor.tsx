import PersonIcon from "@mui/icons-material/Person";
import PsychologyAltIcon from "@mui/icons-material/PsychologyAlt";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import AboutSection from "./AboutSection";

export default function WhoThisIsFor() {
  return (
    <AboutSection title="Who this is for">
      <Stack component="ul" spacing={1.5} sx={{ pl: 0, my: 0, listStyle: "none" }}>
        <Box component="li" sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
          <PersonIcon
            aria-hidden
            sx={{ fontSize: 24, color: "text.secondary", mt: 0.25, flexShrink: 0 }}
          />
          <Typography variant="body1" sx={{ flex: 1 }}>
            You are a developer pair-coding with LLM agents. You know the classic catalogs and want
            a second axis: how each smell, refactoring, and pattern plays out when the editor is an
            LLM rather than a person.
          </Typography>
        </Box>
        <Box component="li" sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
          <SupervisorAccountIcon
            aria-hidden
            sx={{ fontSize: 24, color: "text.secondary", mt: 0.25, flexShrink: 0 }}
          />
          <Typography variant="body1" sx={{ flex: 1 }}>
            You are a tech lead writing AI coding standards. You need citable, per-smell reasoning
            grounded in agent mechanics rather than opinion.
          </Typography>
        </Box>
        <Box component="li" sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
          <PsychologyAltIcon
            aria-hidden
            sx={{ fontSize: 24, color: "text.secondary", mt: 0.25, flexShrink: 0 }}
          />
          <Typography variant="body1" sx={{ flex: 1 }}>
            You are a self-taught developer shipping with an agent. You need a vocabulary for the
            thing your agent just did and a lookup table to the canonical name.
          </Typography>
        </Box>
      </Stack>
    </AboutSection>
  );
}
