import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import RefactoringList from "./components/RefactoringList";
import { loadRefactorings } from "./lib/loadRefactorings";
import { toRefactoringListItem } from "./lib/toRefactoringListItem";

export default function RefactoringsPage() {
  const items = loadRefactorings().map((refactoring, index) =>
    toRefactoringListItem(refactoring, index + 1),
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={4}>
        <Stack spacing={1}>
          <Typography component="h1" variant="h3" sx={{ fontWeight: 600 }}>
            Refactorings
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Canonical Fowler refactorings and the smells they address.
          </Typography>
        </Stack>
        <RefactoringList items={items} />
      </Stack>
    </Container>
  );
}
