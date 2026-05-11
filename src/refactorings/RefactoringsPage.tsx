import FileDownloadIcon from "@mui/icons-material/FileDownload";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { visuallyHidden } from "@mui/utils";

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
          <Button
            component="a"
            href="/snippets/refactorings.md"
            download
            startIcon={<FileDownloadIcon />}
            variant="outlined"
            size="small"
            sx={{ alignSelf: "flex-start" }}
          >
            Download all 66 as snippets for AGENTS.md
          </Button>
        </Stack>
        <RefactoringList items={items} />
      </Stack>
    </Container>
  );
}
