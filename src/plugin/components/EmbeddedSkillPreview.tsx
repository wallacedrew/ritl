import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import CatalogDetailBody from "@/shared/components/CatalogDetailBody";
import CodeBlock from "@/shared/components/CodeBlock";
import type { CatalogEntry } from "@/shared/lib/CatalogEntry";
import { toForcesRecord } from "@/shared/lib/toForcesRecord";

import SkillViewToggle from "./SkillViewToggle";

interface EmbeddedSkillPreviewProps {
  entry: CatalogEntry;
  description: string;
  rawMarkdown: string;
}

export default function EmbeddedSkillPreview({
  entry,
  description,
  rawMarkdown,
}: EmbeddedSkillPreviewProps) {
  const skillName = entry.name.toString();
  const previewHeading = `What a skill looks like: ${skillName}`;
  const forces = toForcesRecord(entry.forcesFor("agent"));

  const renderedView = (
    <Stack spacing={3}>
      <Stack spacing={0.5}>
        <Typography variant="overline" color="text.secondary">
          SKILL description
        </Typography>
        <Typography variant="body1">{description}</Typography>
      </Stack>
      <CatalogDetailBody
        forces={forces}
        beforeLabel="Before the refactoring"
        afterLabel="After the refactoring"
        beforeCode={entry.before}
        afterCode={entry.after}
        exampleSource={entry.exampleSource}
      />
    </Stack>
  );

  const rawView = (
    <CodeBlock code={rawMarkdown} language="markdown" label="extract-function.md" />
  );

  return (
    <Stack spacing={2}>
      <Stack spacing={0.75}>
        <Typography component="h2" variant="h6" sx={{ fontWeight: 600 }}>
          {previewHeading}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          This is the SKILL.md the plugin auto-loads when its description matches the agent&apos;s
          task. Same content as the {skillName} detail page.
        </Typography>
      </Stack>
      <SkillViewToggle rendered={renderedView} raw={rawView} />
    </Stack>
  );
}
