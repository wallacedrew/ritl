import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { MONOSPACE_FONT } from "@/shared/theme/monospace";

export default function WhenNotToInstallSection() {
  return (
    <Stack spacing={1}>
      <Typography component="h2" variant="h6" sx={{ fontWeight: 600 }}>
        When not to install
      </Typography>
      <Typography variant="body2" color="text.secondary">
        The plugin is the wrong choice in a hot debugging loop. The discipline&apos;s safety-net
        step writes characterization tests before any structural change, and that test-writing
        latency compounds when you&apos;re chasing a fault iteration to iteration. Disable it with{" "}
        <Box
          component="code"
          sx={{ fontFamily: MONOSPACE_FONT, bgcolor: "#f4f4f5", px: 0.5, borderRadius: 0.5 }}
        >
          /plugin disable refactor@ritl
        </Box>{" "}
        until the trace is clean, then re-enable for the cleanup pass.
      </Typography>
    </Stack>
  );
}
