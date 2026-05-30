import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { loadExtractFunctionPreview } from "./lib/loadExtractFunctionPreview";

import AgentsMdSnippetSection from "./components/AgentsMdSnippetSection";
import ClaudeMdCompanionSection from "./components/ClaudeMdCompanionSection";
import EmbeddedSkillPreview from "./components/EmbeddedSkillPreview";
import PluginInstallSection from "./components/PluginInstallSection";
import ProvenanceLine from "./components/ProvenanceLine";
import SixStepDisciplineSection from "./components/SixStepDisciplineSection";
import WhenNotToInstallSection from "./components/WhenNotToInstallSection";
import { visuallyHidden } from "@mui/utils";

export default function PluginPage() {
  const { entry, description, rawMarkdown } = loadExtractFunctionPreview();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={4}>
        <Stack spacing={1}>
          <Typography component="h1" variant="h4" sx={visuallyHidden}>
            Plugin
          </Typography>
          <Typography variant="body1">
            Your agent ships better code when it has a named vocabulary for what&apos;s wrong and
            what to do — and only the matching skill loads per query.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Two ways to install: the Claude Code plugin (auto-invoking skills) or an AGENTS.md
            drop-in for other agents. Pick the higher one your environment supports.
          </Typography>
          <ProvenanceLine />
        </Stack>
        <PluginInstallSection />
        <ClaudeMdCompanionSection />
        <Divider />
        <SixStepDisciplineSection />
        <Divider />
        <EmbeddedSkillPreview entry={entry} description={description} rawMarkdown={rawMarkdown} />
        <Divider />
        <AgentsMdSnippetSection />
        <Divider />
        <WhenNotToInstallSection />
      </Stack>
    </Container>
  );
}
