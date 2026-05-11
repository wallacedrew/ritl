import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { visuallyHidden } from "@mui/utils";

import { getRefactoringsByCategory } from "@/refactorings/lib/getRefactoringsByCategory";
import ReferenceView from "@/refactorings/components/ReferenceView";
import { loadSmells } from "@/smells/lib/loadSmells";

import AgentsDownloads from "./components/AgentsDownloads";
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
          <Typography component="h1" sx={visuallyHidden}>
            Reference
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Fowler refactorings organized by chapter.
          </Typography>
          <AgentsDownloads />
        </Stack>
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
