import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import NextLink from "next/link";

import { loadCatalogItems } from "../lib/loadCatalogItems";
import CatalogSearch from "./CatalogSearch";
import CatalogToolbar from "./CatalogToolbar";
import ColorModeToggle from "./ColorModeToggle";

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
          <Stack
            direction="row"
            sx={{ alignItems: "flex-start", justifyContent: "space-between", gap: 2 }}
          >
            <Stack spacing={1}>
              <NextLink href="/" style={{ color: "inherit", textDecoration: "none" }}>
                <Typography variant="h6" component="span" sx={{ fontWeight: 600 }}>
                  Refactoring in the Loop
                </Typography>
              </NextLink>
              <Typography variant="body2" color="text.secondary">
                A catalog explorer for the{" "}
                <Link
                  href="https://refactoring.com/catalog/"
                  target="_blank"
                  rel="noopener noreferrer"
                  underline="hover"
                  color="inherit"
                  sx={{ textDecorationStyle: "dotted", fontWeight: 700 }}
                >
                  canonical refactorings and code smells
                </Link>
                .
              </Typography>
            </Stack>
            <ColorModeToggle />
          </Stack>
          <CatalogSearch items={items} />
          <CatalogToolbar />
        </Stack>
      </Container>
    </Box>
  );
}
