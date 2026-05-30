import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import NextLink from "next/link";

import { loadCatalogItems } from "../lib/loadCatalogItems";
import CatalogSearch from "./CatalogSearch";
import CatalogToolbar from "./CatalogToolbar";

export default function SiteHeader() {
  const items = loadCatalogItems();

  return (
    <Box
      component="header"
      sx={{
        bgcolor: "background.paper",
      }}
    >
      <Container maxWidth="lg" sx={{ pt: { xs: 3, md: 4 } }}>
        <Stack spacing={3}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={{ xs: 2, md: 3 }}
            sx={{ alignItems: { xs: "stretch", md: "center" } }}
          >
            <NextLink href="/" style={{ color: "inherit", textDecoration: "none" }}>
              <Typography
                variant="h5"
                component="span"
                sx={{ fontWeight: 700, letterSpacing: "-0.01em", whiteSpace: "nowrap" }}
              >
                Refactoring In The Loop
              </Typography>
            </NextLink>
            <Box sx={{ flex: 1, maxWidth: { md: 480 }, width: "100%" }}>
              <CatalogSearch items={items} />
            </Box>
          </Stack>
          <CatalogToolbar />
        </Stack>
      </Container>
    </Box>
  );
}
