import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import SmellList from "./components/SmellList";
import { loadSmells } from "./lib/loadSmells";

export default function SmellsPage() {
  const smells = loadSmells();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={4}>
        <Stack spacing={1}>
          <Typography component="h1" variant="h3" sx={{ fontWeight: 600 }}>
            Code Smells
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Canonical Fowler smells and the refactorings that address them.
          </Typography>
        </Stack>
        <SmellList smells={smells} />
      </Stack>
    </Container>
  );
}
