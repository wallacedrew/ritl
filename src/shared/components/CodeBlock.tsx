"use client";

import CheckIcon from "@mui/icons-material/Check";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Highlight, themes } from "prism-react-renderer";
import { useState } from "react";

import { MONOSPACE_FONT } from "@/shared/theme/monospace";
import { SURFACE_TINT } from "@/shared/theme/surfaces";

type CodeBlockTone = "before" | "after" | "none";

interface CodeBlockProps {
  code: string;
  label?: string;
  tone?: CodeBlockTone;
  language?: string;
}

const DOT_COLORS: Record<CodeBlockTone, string> = {
  before: "#d32f2f",
  after: "#2e7d32",
  none: "#999999",
};

export default function CodeBlock({
  code,
  label,
  tone = "none",
  language = "javascript",
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Browsers that block clipboard.writeText silently no-op; the icon
      // just doesn't switch to the success state.
    }
  }

  return (
    <Box
      sx={{
        borderRadius: 1,
        border: 1,
        borderColor: "divider",
        overflow: "hidden",
        bgcolor: "#fafafa",
      }}
    >
      {label && (
        <Stack
          direction="row"
          sx={{
            alignItems: "center",
            justifyContent: "space-between",
            px: 1.5,
            py: 0.75,
            bgcolor: SURFACE_TINT,
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Stack direction="row" sx={{ alignItems: "center", gap: 1 }}>
            <Box
              aria-hidden="true"
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: DOT_COLORS[tone],
              }}
            />
            <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary" }}>
              {label}
            </Typography>
          </Stack>
          <IconButton
            size="small"
            onClick={handleCopy}
            aria-label={copied ? "Copied" : "Copy code"}
            sx={{ color: "text.secondary" }}
          >
            {copied ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
          </IconButton>
        </Stack>
      )}
      <Highlight code={code} language={language} theme={themes.vsLight}>
        {({ className, tokens, getLineProps, getTokenProps }) => (
          <Box
            component="pre"
            className={className}
            sx={{
              margin: 0,
              padding: 2,
              fontFamily: MONOSPACE_FONT,
              fontSize: "0.8125rem",
              lineHeight: 1.55,
              overflowX: "auto",
              bgcolor: "transparent",
              color: "#1f2328",
            }}
          >
            {tokens.map((line, lineIndex) => (
              <div key={lineIndex} {...getLineProps({ line })}>
                {line.map((token, tokenIndex) => (
                  <span key={tokenIndex} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </Box>
        )}
      </Highlight>
    </Box>
  );
}
