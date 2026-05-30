import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

const GITHUB_REPO_URL = "https://github.com/wallacedrew/ritl";
const ADR_URL = `${GITHUB_REPO_URL}/blob/main/docs/architecture/0006-agent-forces-carry-the-contrast.md`;

const FOOTER_LINK_SX = {
  textDecorationStyle: "dotted",
  fontWeight: 600,
} as const;

export default function SiteFooter() {
  return (
    <Box
      component="footer"
      sx={{
        borderTop: 1,
        borderColor: "divider",
        bgcolor: "background.paper",
        mt: "auto",
      }}
    >
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Stack spacing={1.25}>
          <Typography variant="caption" color="text.secondary">
            A catalog explorer inspired by Martin Fowler&rsquo;s{" "}
            <Link
              href="https://refactoring.com/catalog/"
              target="_blank"
              rel="noopener noreferrer"
              color="inherit"
              underline="hover"
              sx={{ ...FOOTER_LINK_SX, fontStyle: "italic" }}
            >
              Refactoring
            </Link>{" "}
            (2e), Joshua Kerievsky&rsquo;s <em>Refactoring to Patterns</em> (2004), and the Gang of
            Four&rsquo;s <em>Design Patterns</em> (1994).
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Built by Wallace Drew. Every entry&rsquo;s framing is audited against{" "}
            <Link
              href={ADR_URL}
              target="_blank"
              rel="noopener noreferrer"
              color="inherit"
              underline="hover"
              sx={FOOTER_LINK_SX}
            >
              ADR-0006
            </Link>
            . Source:{" "}
            <Link
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              color="inherit"
              underline="hover"
              sx={FOOTER_LINK_SX}
            >
              github.com/wallacedrew/ritl
            </Link>
            .{" "}
            <Link
              href="mailto:feedback@refactoringintheloop.com"
              color="inherit"
              underline="hover"
              sx={FOOTER_LINK_SX}
            >
              Feedback
            </Link>
            .
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
