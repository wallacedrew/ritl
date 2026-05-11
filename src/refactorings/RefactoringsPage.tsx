import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { visuallyHidden } from "@mui/utils";

import SnippetPreviewButton from "@/shared/components/SnippetPreviewButton";

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
          <Typography component="h1" sx={visuallyHidden}>
            Refactorings
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Canonical Fowler refactorings and the smells they address.
          </Typography>
          <SnippetPreviewButton
            href="/snippets/refactoring-catalog.md"
            label="refactoring-catalog.md"
            hint="90 SKILL.md sections in one paste"
          />
        </Stack>
        <RefactoringList items={items} />
      </Stack>
    </Container>
  );
}
