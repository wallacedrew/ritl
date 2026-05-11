import TextField from "@mui/material/TextField";

import { MONOSPACE_FONT } from "@/shared/theme/monospace";

interface SnippetEditorProps {
  value: string;
  onChange: (next: string) => void;
}

export default function SnippetEditor({ value, onChange }: SnippetEditorProps) {
  return (
    <TextField
      fullWidth
      multiline
      minRows={15}
      maxRows={30}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      variant="outlined"
      aria-label="Snippet content (editable)"
      sx={(theme) => ({
        "& .MuiInputBase-root": {
          bgcolor: theme.palette.mode === "dark" ? "#0a0a0a" : "#f4f4f5",
          alignItems: "flex-start",
        },
        "& .MuiInputBase-input": {
          fontFamily: MONOSPACE_FONT,
          fontSize: "0.8rem",
          lineHeight: 1.5,
        },
      })}
    />
  );
}
