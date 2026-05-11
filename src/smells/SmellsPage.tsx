import FileDownloadIcon from "@mui/icons-material/FileDownload";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { visuallyHidden } from "@mui/utils";

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
          <Button
            component="a"
            href="/snippets/smells.md"
            download
            startIcon={<FileDownloadIcon />}
            variant="outlined"
            size="small"
            sx={{ alignSelf: "flex-start" }}
          >
            Download all 24 as snippets for AGENTS.md
          </Button>
        </Stack>
        <SmellList items={items} />
      </Stack>
    </Container>
  );
}
