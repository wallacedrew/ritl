import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

interface UsageStep {
  title: string;
  summary: string;
}

const USAGE_STEPS: readonly UsageStep[] = [
  {
    title: "Describe the problem in plain English",
    summary:
      "\"This function is doing too much\", \"this conditional is unreadable\", \"this is duplicated across three files\". The plugin's router matches your description against each skill — you don't have to memorise the catalog.",
  },
  {
    title: "Watch for the agent naming the smell and the refactoring",
    summary:
      "Before any edit, the agent announces what it sees and what it's applying — \"this is a Long Function smell; I'll apply Extract Function.\" Treat the announcement as the contract: if it doesn't name a catalog entry, it isn't using one.",
  },
  {
    title: "Click through when you don't recognise the named skill",
    summary:
      "Every named skill has a detail page at refactorplug.com with the Before/After and the agent-side forces. Two clicks to verify the agent picked the right move.",
  },
  {
    title: "Watch for the destination pattern when refactorings stack",
    summary:
      "When the agent says \"this chain of Extract Method + Replace Conditional with Polymorphism is heading toward Strategy\", that's where the catalog earns its weight versus a vocabulary-less agent. Let it name the destination before the next move.",
  },
  {
    title: "Watch the decline vocabulary when the agent doesn't refactor",
    summary:
      "When the agent decides not to apply a refactoring, it should name which kind of decline — catalog miss (checkable), taste call (arguable), cost-benefit (arguable cost or value), constraint-blocked (non-negotiable), or insufficient context (asking before deciding). Silent non-action is the smell — name which.",
  },
];

export default function HowToUseSection() {
  return (
    <Stack spacing={1.5}>
      <Stack spacing={0.5}>
        <Typography component="h2" variant="h6" sx={{ fontWeight: 600 }}>
          How to use the plugin
        </Typography>
        <Typography variant="body2" color="text.secondary">
          The loop you actually run in once it&apos;s installed.
        </Typography>
      </Stack>
      <Box component="ol" sx={{ pl: 3, m: 0 }}>
        {USAGE_STEPS.map((step) => (
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
