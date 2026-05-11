import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { loadCatalogItems } from "../lib/loadCatalogItems";
import CatalogSearch from "./CatalogSearch";
import CatalogToolbar from "./CatalogToolbar";

export default function SiteHeader() {
  const items = loadCatalogItems();

  return (
    <Box
      component="header"
      sx={{
        borderBottom: 1,
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack spacing={3}>
          <Stack spacing={1}>
            <Typography variant="h4" component="div" sx={{ fontWeight: 600 }}>
              Refactoring in the Large
            </Typography>
            <Typography variant="body1" color="text.secondary">
              A catalog explorer for code smells and the Fowler refactorings that address them.
            </Typography>
          </Stack>
          <CatalogSearch items={items} />
          <CatalogToolbar />
        </Stack>
      </Container>
    </Box>
  );
}
