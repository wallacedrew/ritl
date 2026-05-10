import Box from "@mui/material/Box";

interface CodeBlockProps {
  code: string;
}

export default function CodeBlock({ code }: CodeBlockProps) {
  return (
    <Box
      component="pre"
      sx={{
        margin: 0,
        padding: 2,
        borderRadius: 1,
        bgcolor: "#0a0a0a",
        color: "text.primary",
        border: 1,
        borderColor: "divider",
        fontFamily:
          'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
        fontSize: "0.875rem",
        lineHeight: 1.5,
        overflowX: "auto",
      }}
    >
      <code>{code}</code>
    </Box>
  );
}
