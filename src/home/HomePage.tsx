import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { getRefactoringsByCategory } from "@/refactorings/lib/getRefactoringsByCategory";
import ReferenceView from "@/refactorings/components/ReferenceView";
import CatalogToolbar from "@/shared/components/CatalogToolbar";
import { loadSmells } from "@/smells/lib/loadSmells";

import CatalogStats from "./components/CatalogStats";

export default function HomePage() {
  const groups = getRefactoringsByCategory();
  const smellCount = loadSmells().length;
  const refactoringCount = groups.reduce((sum, g) => sum + g.items.length, 0);
  const categoryCount = groups.length;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={4}>
        <Stack spacing={1}>
          <Typography component="h1" variant="h3" sx={{ fontWeight: 600 }}>
            Refactoring in the Large
          </Typography>
          <Typography variant="body1" color="text.secondary">
            A catalog explorer for code smells and the Fowler refactorings that address them.
          </Typography>
        </Stack>
        <CatalogToolbar active="reference" />
        <CatalogStats
          smellCount={smellCount}
          refactoringCount={refactoringCount}
          categoryCount={categoryCount}
        />
        <Divider />
        <ReferenceView groups={groups} />
      </Stack>
    </Container>
  );
}
