import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

const GITHUB_REPO_URL = "https://github.com/wallacedrew/ritl";
const ADR_URL = `${GITHUB_REPO_URL}/blob/main/docs/architecture/0006-agent-forces-carry-the-contrast.md`;

export default function ProvenanceLine() {
  return (
    <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
      Built by Wallace Drew. Vocabulary follows Fowler&apos;s <em>Refactoring</em> (2e),
      Kerievsky&apos;s <em>Refactoring to Patterns</em> (2004), and Gamma et al.&apos;s{" "}
      <em>Design Patterns</em> (1994). Every entry&apos;s framing is audited against{" "}
      <Link href={ADR_URL} target="_blank" rel="noopener noreferrer" color="inherit" underline="hover">
        ADR-0006
      </Link>
      . Source:{" "}
      <Link
        href={GITHUB_REPO_URL}
        target="_blank"
        rel="noopener noreferrer"
        color="inherit"
        underline="hover"
      >
        github.com/wallacedrew/ritl
      </Link>
      .
    </Typography>
  );
}
