import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { visuallyHidden } from "@mui/utils";

import CatalogStats from "@/home/components/CatalogStats";
import ReferenceView from "@/refactorings/components/ReferenceView";
import { getRefactoringsByCategory } from "@/refactorings/lib/getRefactoringsByCategory";
import { FOWLER } from "@/shared/lib/subSites";
import { loadSmells } from "@/smells/lib/loadSmells";

import BrowseButtons from "./components/BrowseButtons";

export default function FowlerLandingPage() {
  const groups = getRefactoringsByCategory();
  const smellCount = loadSmells().length;
  const refactoringCount = groups.reduce((sum, group) => sum + group.items.length, 0);
  const categoryCount = groups.length;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={4}>
        <Stack spacing={1}>
          <Typography component="h1" sx={visuallyHidden}>
            Refactoring
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Fowler refactorings organized by chapter.
          </Typography>
        </Stack>
        <CatalogStats
          smellCount={smellCount}
          refactoringCount={refactoringCount}
          categoryCount={categoryCount}
        />
        <BrowseButtons
          refactoringsHref={FOWLER.hrefForCatalog("refactorings")}
          smellsHref={FOWLER.hrefForCatalog("smells")}
        />
        <Divider />
        <ReferenceView groups={groups} />
      </Stack>
    </Container>
  );
}
