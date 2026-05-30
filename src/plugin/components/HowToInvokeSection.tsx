import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { MONOSPACE_FONT } from "@/shared/theme/monospace";

interface InvocationMode {
  scenario: string;
  command: string;
  description: string;
}

const INVOCATION_MODES: readonly InvocationMode[] = [
  {
    scenario: "Something feels off and you can't name it",
    command: "(just describe it)",
    description:
      'Type what you see in plain English — "this feels off", "is this clean?", "what\'s wrong here?", "take a look at this". The workflow orchestrator\'s router catches phrases like these and walks the full cycle. No slash command needed; the plugin teaches you the vocabulary through the agent\'s announcements.',
  },
  {
    scenario: "You want to refactor a block but don't know which named move",
    command: "/refactor:workflow",
    description:
      "Force the workflow orchestrator with the block of code attached. Same cycle as above, but invoked explicitly instead of relying on description match — useful when the conversation isn't about refactoring and you want to switch modes.",
  },
  {
    scenario: "You already know the named refactoring you want",
    command: "/refactor:<skill-slug>",
    description:
      "Invoke the per-skill command directly. Tab-completion after /refactor: lists all 140 skills. Examples: /refactor:extract-function, /refactor:strategy, /refactor:replace-conditional-with-polymorphism.",
  },
];

const COMMAND_BADGE_SX = {
  fontFamily: MONOSPACE_FONT,
  bgcolor: "#f4f4f5",
  border: 1,
  borderColor: "divider",
  px: 0.75,
  py: 0.25,
  borderRadius: 0.5,
  fontSize: "0.8125rem",
  whiteSpace: "nowrap",
} as const;

export default function HowToInvokeSection() {
  return (
    <Stack spacing={1.5}>
      <Stack spacing={0.5}>
        <Typography component="h2" variant="h6" sx={{ fontWeight: 600 }}>
          How to invoke the plugin
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Three entry points, picked by what you know about the code in front of you.
        </Typography>
      </Stack>
      <Stack spacing={2}>
        {INVOCATION_MODES.map((mode) => (
          <Box key={mode.scenario}>
            <Stack
              direction="row"
              sx={{ alignItems: "baseline", gap: 1, flexWrap: "wrap", mb: 0.5 }}
            >
              <Typography component="span" variant="body1" sx={{ fontWeight: 600 }}>
                {mode.scenario}.
              </Typography>
              <Box component="code" sx={COMMAND_BADGE_SX}>
                {mode.command}
              </Box>
            </Stack>
            <Typography variant="body2" color="text.secondary">
              {mode.description}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Stack>
  );
}
