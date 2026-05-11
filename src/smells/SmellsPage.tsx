import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { visuallyHidden } from "@mui/utils";

import SnippetPreviewButton from "@/shared/components/SnippetPreviewButton";

import SmellList from "./components/SmellList";
import { loadSmells } from "./lib/loadSmells";
import { toSmellListItem } from "./lib/toSmellListItem";

export default function SmellsPage() {
  const items = loadSmells().map((smell, index) => toSmellListItem(smell, index + 1));

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={4}>
        <Stack spacing={1}>
          <Typography component="h1" sx={visuallyHidden}>
            Code Smells
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Canonical Fowler smells and the refactorings that address them.
          </Typography>
          <SnippetPreviewButton
            href="/snippets/smells.md"
            label="Preview all 24 snippets for AGENTS.md"
          />
        </Stack>
        <SmellList items={items} />
      </Stack>
    </Container>
  );
}
