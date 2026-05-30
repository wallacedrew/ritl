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
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
        <Stack spacing={3}>
          <Stack spacing={1.25}>
            <NextLink href="/" style={{ color: "inherit", textDecoration: "none" }}>
              <Typography
                variant="h5"
                component="span"
                sx={{ fontWeight: 700, letterSpacing: "-0.01em" }}
              >
                Refactoring In The Loop
              </Typography>
            </NextLink>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 680 }}>
              A catalog explorer inspired by Martin Fowler&rsquo;s refactorings and code smells,
              Joshua Kerievsky&rsquo;s refactoring patterns, and the Gang of Four design patterns.
            </Typography>
          </Stack>
          <CatalogSearch items={items} />
          <CatalogToolbar />
        </Stack>
      </Container>
    </Box>
  );
}
