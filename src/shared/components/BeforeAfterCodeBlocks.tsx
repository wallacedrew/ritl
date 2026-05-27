import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import CodeBlock from "./CodeBlock";

interface BeforeAfterCodeBlocksProps {
  beforeLabel: string;
  afterLabel: string;
  beforeCode: string;
  afterCode: string;
}

export default function BeforeAfterCodeBlocks({
  beforeLabel,
  afterLabel,
  beforeCode,
  afterCode,
}: BeforeAfterCodeBlocksProps) {
  return (
    <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ alignItems: "stretch" }}>
      <Stack spacing={1} sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="overline" color="text.secondary">
          {beforeLabel}
        </Typography>
        <CodeBlock code={beforeCode} />
      </Stack>
      <Stack spacing={1} sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="overline" color="text.secondary">
          {afterLabel}
        </Typography>
        <CodeBlock code={afterCode} />
      </Stack>
    </Stack>
  );
}
