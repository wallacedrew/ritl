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
    <Stack spacing={2}>
      <Typography variant="overline" color="text.secondary">
        {beforeLabel}
      </Typography>
      <CodeBlock code={beforeCode} />
      <Typography variant="overline" color="text.secondary">
        {afterLabel}
      </Typography>
      <CodeBlock code={afterCode} />
    </Stack>
  );
}
