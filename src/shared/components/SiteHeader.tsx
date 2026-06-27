import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import NextLink from "next/link";

import { loadCatalogItems } from "../lib/loadCatalogItems";
import CatalogSearch from "./CatalogSearch";
import CatalogToolbar from "./CatalogToolbar";

// MUI's default theme.zIndex.appBar. Inlined as a literal because SiteHeader is a
// Server Component and a theme-callback in sx can't cross the server→client boundary.
const STICKY_HEADER_Z_INDEX = 1100;

export default function SiteHeader() {
  const items = loadCatalogItems();

  return (
    <Box
      component="header"
      sx={{
        position: "sticky",
        top: 0,
        zIndex: STICKY_HEADER_Z_INDEX,
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
              <Stack spacing={0}>
                <Typography
                  variant="h5"
                  component="span"
                  sx={{ fontWeight: 700, letterSpacing: "-0.01em", whiteSpace: "nowrap" }}
                >
                  RefactorPlug
                </Typography>
                <Typography
                  variant="caption"
                  component="span"
                  color="text.secondary"
                  sx={{ whiteSpace: "nowrap" }}
                >
                  refactoring in the loop
                </Typography>
              </Stack>
            </NextLink>
            <Box sx={{ flex: 1, width: "100%" }}>
              <CatalogSearch items={items} />
            </Box>
          </Stack>
          <CatalogToolbar />
        </Stack>
      </Container>
    </Box>
  );
}
