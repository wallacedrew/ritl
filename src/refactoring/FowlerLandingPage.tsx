import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { visuallyHidden } from "@mui/utils";
import NextLink from "next/link";

import CatalogStats from "@/home/components/CatalogStats";
import { loadPatterns } from "@/patterns/lib/loadPatterns";
import ReferenceView from "@/refactorings/components/ReferenceView";
import { getRefactoringsByCategory } from "@/refactorings/lib/getRefactoringsByCategory";
import { FOWLER, GOF, KERIEVSKY } from "@/shared/lib/subSites";
import { loadSmells } from "@/smells/lib/loadSmells";

import BrowseButtons from "./components/BrowseButtons";

const INLINE_LINK_STYLE = { color: "inherit", textDecoration: "underline" } as const;

export default function FowlerLandingPage() {
  const groups = getRefactoringsByCategory();
  const smellCount = loadSmells().length;
  const refactoringCount = groups.reduce((sum, group) => sum + group.items.length, 0);
  const categoryCount = groups.length;
  const kerievskyPatternCount = loadPatterns("kerievsky").length;
  const gofPatternCount = loadPatterns("gof").length;
  const kerievskyHref = KERIEVSKY.hrefForCatalog("patterns");
  const gofHref = GOF.hrefForCatalog("patterns");

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={4}>
        <Stack spacing={1}>
          <Typography component="h1" sx={visuallyHidden}>
            Refactoring
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Fowler&rsquo;s refactorings and code smells organized by chapter — one of three
            reference catalogs here, alongside Joshua Kerievsky&rsquo;s{" "}
            <NextLink href={kerievskyHref} style={INLINE_LINK_STYLE}>
              refactoring patterns
            </NextLink>{" "}
            ({kerievskyPatternCount}) and the Gang of Four&rsquo;s{" "}
            <NextLink href={gofHref} style={INLINE_LINK_STYLE}>
              design patterns
            </NextLink>{" "}
            ({gofPatternCount}). Refactorings and smells are bidirectionally cross-referenced with
            both pattern catalogs.
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
          kerievskyHref={kerievskyHref}
          gofHref={gofHref}
        />
        <Divider />
        <ReferenceView groups={groups} />
      </Stack>
    </Container>
  );
}
