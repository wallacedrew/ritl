import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import AgentsDownloads from "./components/AgentsDownloads";

export default function PluginPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={4}>
        <Stack spacing={1}>
          <Typography component="h1" variant="h4" sx={{ fontWeight: 600 }}>
            Plugin
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Three ways to use Refactoring in the Loop with your coding agent — in order of
            preference: the Claude Code plugin (auto-invoking skills), the AGENTS.md drop-in
            snippet for other agents, or the full catalog paste as a last resort.
          </Typography>
        </Stack>
        <AgentsDownloads />
      </Stack>
    </Container>
  );
}
