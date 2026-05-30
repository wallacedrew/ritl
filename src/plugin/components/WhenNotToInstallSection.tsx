import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export default function WhenNotToInstallSection() {
  return (
    <Stack spacing={1}>
      <Typography component="h2" variant="h6" sx={{ fontWeight: 600 }}>
        When not to install
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Throwaway prototype code? Skip the plugin — each skill that fires adds context budget per
        query, and you don&apos;t need that on code you&apos;re about to delete. Shipping production
        code? The per-query context cost is repaid in refactoring discipline you don&apos;t have to
        enforce by hand.
      </Typography>
    </Stack>
  );
}
