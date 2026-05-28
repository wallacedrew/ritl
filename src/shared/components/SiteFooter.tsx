import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

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
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          sx={{
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
          }}
        >
          <Typography variant="caption" color="text.secondary">
            Built on Martin Fowler&apos;s{" "}
            <Link
              href="https://refactoring.com/catalog/"
              target="_blank"
              rel="noopener noreferrer"
              color="inherit"
              underline="hover"
              sx={{ textDecorationStyle: "dotted", fontWeight: 600, fontStyle: "italic" }}
            >
              Refactoring
            </Link>
            , Joshua Kerievsky&apos;s <em>Refactoring to Patterns</em>, and the Gang of Four&apos;s{" "}
            <em>Design Patterns</em>.
          </Typography>
          <Typography variant="caption" color="text.secondary">
            <Link
              href="mailto:feedback@refactoringintheloop.com"
              color="inherit"
              underline="hover"
              sx={{ textDecorationStyle: "dotted", fontWeight: 600 }}
            >
              Feedback
            </Link>
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
