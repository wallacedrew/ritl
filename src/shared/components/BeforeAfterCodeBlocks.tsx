import Stack from "@mui/material/Stack";

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
      <Stack sx={{ flex: 1, minWidth: 0 }}>
        <CodeBlock code={beforeCode} label={beforeLabel} tone="before" />
      </Stack>
      <Stack sx={{ flex: 1, minWidth: 0 }}>
        <CodeBlock code={afterCode} label={afterLabel} tone="after" />
      </Stack>
    </Stack>
  );
}
