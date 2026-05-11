import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";

interface SnippetDialogActionsProps {
  isEdited: boolean;
  copied: boolean;
  disabled: boolean;
  onReset: () => void;
  onCopy: () => void;
  onDownload: () => void;
}

export default function SnippetDialogActions({
  isEdited,
  copied,
  disabled,
  onReset,
  onCopy,
  onDownload,
}: SnippetDialogActionsProps) {
  return (
    <DialogActions>
      <Button
        onClick={onReset}
        startIcon={<RestartAltIcon />}
        disabled={!isEdited}
        sx={{ mr: "auto" }}
      >
        Reset
      </Button>
      <Button onClick={onCopy} startIcon={<ContentCopyIcon />} disabled={disabled}>
        {copied ? "Copied!" : "Copy"}
      </Button>
      <Button
        onClick={onDownload}
        startIcon={<FileDownloadIcon />}
        variant="contained"
        disabled={disabled}
      >
        Download
      </Button>
    </DialogActions>
  );
}
