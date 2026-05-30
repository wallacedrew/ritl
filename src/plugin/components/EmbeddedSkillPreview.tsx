import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { CHARACTERIZATION_TEST_SOURCE } from "@/refactorings/examples/extractFunctionInvoiceExample";
import CatalogDetailBody from "@/shared/components/CatalogDetailBody";
import CodeBlock from "@/shared/components/CodeBlock";
import type { CatalogEntry } from "@/shared/lib/CatalogEntry";

interface EmbeddedSkillPreviewProps {
  entry: CatalogEntry;
  description: string;
}

export default function EmbeddedSkillPreview({ entry, description }: EmbeddedSkillPreviewProps) {
  const skillName = entry.name.toString();
  const previewHeading = `What a skill looks like: ${skillName}`;

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
      <Box
        sx={{
          border: 1,
          borderColor: "divider",
          borderRadius: 1,
          p: 2,
          bgcolor: "background.paper",
        }}
      >
        <Stack spacing={3}>
          <Stack spacing={0.5}>
            <Typography variant="overline" color="text.secondary">
              SKILL description
            </Typography>
            <Typography variant="body1">{description}</Typography>
          </Stack>
          <CatalogDetailBody
            entry={entry}
            lens="agent"
            beforeLabel="Before the refactoring"
            afterLabel="After the refactoring"
          />
          <Stack spacing={1}>
            <Stack spacing={0.5}>
              <Typography variant="overline" color="text.secondary">
                Characterization test
              </Typography>
              <Typography variant="body2" color="text.secondary">
                The same assertion is green against both Before and After — that&apos;s step #3 of
                the discipline (&ldquo;establish a safety net&rdquo;) made visible on its own
                showcase. The two functions live in{" "}
                <Box
                  component="code"
                  sx={{
                    fontFamily: "inherit",
                    bgcolor: "#f4f4f5",
                    px: 0.5,
                    borderRadius: 0.5,
                  }}
                >
                  src/refactorings/examples/extractFunctionInvoiceExample.ts
                </Box>{" "}
                and the assertion runs in the project&apos;s fast suite.
              </Typography>
            </Stack>
            <CodeBlock code={CHARACTERIZATION_TEST_SOURCE} label="characterization-test.ts" />
          </Stack>
        </Stack>
      </Box>
    </Stack>
  );
}
