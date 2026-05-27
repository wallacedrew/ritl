import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { visuallyHidden } from "@mui/utils";
import NextLink from "next/link";

import CatalogStats from "@/home/components/CatalogStats";
import ReferenceView from "@/refactorings/components/ReferenceView";
import { getRefactoringsByCategory } from "@/refactorings/lib/getRefactoringsByCategory";
import { FOWLER } from "@/shared/lib/subSites";
import { loadSmells } from "@/smells/lib/loadSmells";

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
        <Stack direction="row" spacing={1.5} sx={{ flexWrap: "wrap", gap: 1 }}>
          <Button
            component={NextLink}
            href={FOWLER.hrefForCatalog("refactorings")}
            variant="outlined"
          >
            Browse all refactorings
          </Button>
          <Button component={NextLink} href={FOWLER.hrefForCatalog("smells")} variant="outlined">
            Browse all smells
          </Button>
        </Stack>
        <Divider />
        <ReferenceView groups={groups} />
      </Stack>
    </Container>
  );
}
