"use client";

import Box from "@mui/material/Box";

import { MONOSPACE_FONT } from "@/shared/theme/monospace";

interface CodeBlockProps {
  code: string;
}

export default function CodeBlock({ code }: CodeBlockProps) {
  return (
    <Box
      component="pre"
      sx={(theme) => ({
        margin: 0,
        padding: 2,
        borderRadius: 1,
        bgcolor: theme.palette.mode === "dark" ? "#0a0a0a" : "#f4f4f5",
        color: "text.primary",
        border: 1,
        borderColor: "divider",
        fontFamily: MONOSPACE_FONT,
        fontSize: "0.875rem",
        lineHeight: 1.5,
        overflowX: "auto",
      })}
    >
      <code>{code}</code>
    </Box>
  );
}
