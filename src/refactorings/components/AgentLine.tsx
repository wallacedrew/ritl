import Typography from "@mui/material/Typography";

interface AgentLineProps {
  label: string;
  body: string;
}

export default function AgentLine({ label, body }: AgentLineProps) {
  return (
    <Typography variant="body1">
      <strong>{label}:</strong> {body}
    </Typography>
  );
}
