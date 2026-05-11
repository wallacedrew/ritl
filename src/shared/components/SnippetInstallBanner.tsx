import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";

import { MONOSPACE_FONT } from "@/shared/theme/monospace";

interface SnippetInstallBannerProps {
  slug: string | null;
}

export default function SnippetInstallBanner({ slug }: SnippetInstallBannerProps) {
  if (!slug) return null;
  return (
    <Alert severity="info" icon={false} sx={{ mb: 2 }}>
      <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
        Install as a Claude skill
      </Typography>
      <Typography
        component="pre"
        variant="caption"
        sx={{
          fontFamily: MONOSPACE_FONT,
          whiteSpace: "pre-wrap",
          m: 0,
        }}
      >
        {`mkdir -p ~/.claude/skills/${slug}\nmv ${slug}.md ~/.claude/skills/${slug}/SKILL.md`}
      </Typography>
    </Alert>
  );
}
