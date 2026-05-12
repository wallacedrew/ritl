import Typography from "@mui/material/Typography";

interface SnippetHintCaptionProps {
  text: string;
  emphasized?: boolean;
}

export default function SnippetHintCaption({ text, emphasized }: SnippetHintCaptionProps) {
  return (
    <Typography
      component="span"
      variant="caption"
      color={emphasized ? "warning.main" : "text.secondary"}
      sx={{ ml: 1, fontWeight: emphasized ? 600 : undefined }}
    >
      · {text}
    </Typography>
  );
}
