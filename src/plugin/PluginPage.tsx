import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { loadExtractFunctionPreview } from "./lib/loadExtractFunctionPreview";

import AgentsMdSnippetSection from "./components/AgentsMdSnippetSection";
import EmbeddedSkillPreview from "./components/EmbeddedSkillPreview";
import PluginInstallSection from "./components/PluginInstallSection";
import { visuallyHidden } from "@mui/utils";

export default function PluginPage() {
  const { entry, description } = loadExtractFunctionPreview();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={4}>
        <Stack spacing={1}>
          <Typography component="h1" variant="h4" sx={visuallyHidden}>
            Plugin
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Two ways to use Refactoring In The Loop with your coding agent — pick the higher one
            your environment supports.
          </Typography>
        </Stack>
        <EmbeddedSkillPreview entry={entry} description={description} />
        <Divider />
        <PluginInstallSection />
        <Divider />
        <AgentsMdSnippetSection />
      </Stack>
    </Container>
  );
}
