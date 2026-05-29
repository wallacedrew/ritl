"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import NextLink from "next/link";

import { loadRefactorings } from "@/refactorings/lib/loadRefactorings";
import { toRefactoringListItem } from "@/refactorings/lib/toRefactoringListItem";
import CatalogCard from "@/shared/components/CatalogCard";
import type { CatalogListItem } from "@/shared/lib/CatalogListItem";
import { loadSmells } from "@/smells/lib/loadSmells";
import { toSmellListItem } from "@/smells/lib/toSmellListItem";

const STARTER_REFACTORINGS = ["Extract Function", "Rename Variable"] as const;
const STARTER_SMELLS = ["Long Function"] as const;

function pickStarterCards(): CatalogListItem[] {
  const refactorings = loadRefactorings();
  const smells = loadSmells();

  const refactoringCards = STARTER_REFACTORINGS.map((targetName) => {
    const index = refactorings.findIndex((r) => r.name.toString() === targetName);
    const refactoring = refactorings[index];
    if (index === -1 || !refactoring) {
      throw new Error(`not-found: starter refactoring "${targetName}" missing`);
    }
    return toRefactoringListItem(refactoring, index + 1);
  });

  const smellCards = STARTER_SMELLS.map((targetName) => {
    const index = smells.findIndex((s) => s.name.toString() === targetName);
    const smell = smells[index];
    if (index === -1 || !smell) {
      throw new Error(`not-found: starter smell "${targetName}" missing`);
    }
    return toSmellListItem(smell, index + 1);
  });

  return [...refactoringCards, ...smellCards];
}

export default function NotFound() {
  const starterCards = pickStarterCards();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={4}>
        <Stack spacing={1.5}>
          <Typography
            variant="overline"
            color="text.secondary"
            sx={{ letterSpacing: "0.2em", fontWeight: 600 }}
          >
            404
          </Typography>
          <Typography component="h1" variant="h4" sx={{ fontWeight: 600 }}>
            Mysterious URL
          </Typography>
          <Typography variant="body1" color="text.secondary">
            This page name doesn&rsquo;t reveal its intent. Let&rsquo;s rename it to one that
            exists.
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1.5} sx={{ flexWrap: "wrap", gap: 1 }}>
          <Button component={NextLink} href="/refactoring/refactorings" variant="contained">
            Browse refactorings
          </Button>
          <Button component={NextLink} href="/refactoring/smells" variant="outlined">
            Browse smells
          </Button>
          <Button component={NextLink} href="/reference" variant="outlined">
            Reference
          </Button>
        </Stack>

        <Divider />

        <Stack spacing={2}>
          <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: "0.15em" }}>
            Try one of these
          </Typography>
          <Box
            sx={{
              display: "grid",
              gap: 3,
              gridTemplateColumns: { xs: "1fr", sm: "repeat(auto-fit, minmax(280px, 1fr))" },
            }}
          >
            {starterCards.map((item) => (
              <CatalogCard key={item.href} item={item} />
            ))}
          </Box>
        </Stack>
      </Stack>
    </Container>
  );
}
