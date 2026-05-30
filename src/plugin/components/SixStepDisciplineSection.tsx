import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

interface DisciplineStep {
  title: string;
  summary: string;
}

const SIX_STEPS: readonly DisciplineStep[] = [
  {
    title: "Sense the smell",
    summary:
      "Match what you see against Fowler's 24 named smells; refuse to invent ad-hoc smell names.",
  },
  {
    title: "Identify the source",
    summary:
      "State file path and line range; refactor the occurrence with the fewest external dependencies first.",
  },
  {
    title: "Establish a safety net",
    summary:
      "Write characterization tests for current behavior before any structural change; commit them green.",
  },
  {
    title: "Apply one named refactoring",
    summary:
      "Pick from Fowler's catalog, state which one and why, and ship one refactoring per commit.",
  },
  {
    title: "Stay green",
    summary:
      "Run the full test suite after each move; on red, revert and decompose further — never power through.",
  },
  {
    title: "Recognize pattern destinations",
    summary:
      "When a stack of refactorings heads toward a Kerievsky composite or GoF pattern, name the destination before the next move.",
  },
];

export default function SixStepDisciplineSection() {
  return (
    <Stack spacing={1.5}>
      <Stack spacing={0.5}>
        <Typography component="h2" variant="h6" sx={{ fontWeight: 600 }}>
          The six-step discipline
        </Typography>
        <Typography variant="body2" color="text.secondary">
          What both tiers below get your agent to do on every change to existing code.
        </Typography>
      </Stack>
      <Box component="ol" sx={{ pl: 3, m: 0 }}>
        {SIX_STEPS.map((step) => (
          <Box component="li" key={step.title} sx={{ mb: 1 }}>
            <Typography component="span" variant="body1" sx={{ fontWeight: 600 }}>
              {step.title}.
            </Typography>{" "}
            <Typography component="span" variant="body1" color="text.secondary">
              {step.summary}
            </Typography>
          </Box>
        ))}
      </Box>
    </Stack>
  );
}
