import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import AgentsMdSnippetSection from "./components/AgentsMdSnippetSection";
import CatalogPasteSection from "./components/CatalogPasteSection";
import PluginInstallSection from "./components/PluginInstallSection";
import { visuallyHidden } from "@mui/utils";

export default function PluginPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={4}>
        <Stack spacing={1}>
          <Typography component="h1" variant="h4" sx={visuallyHidden}>
            Plugin
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Three ways to use Refactoring In The Loop with your coding agent — pick the highest
            one your environment supports.
          </Typography>
        </Stack>
        <PluginInstallSection />
        <Divider />
        <AgentsMdSnippetSection />
        <Divider />
        <CatalogPasteSection />
      </Stack>
    </Container>
  );
}
