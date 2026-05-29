import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { visuallyHidden } from "@mui/utils";

import CategoryGroup from "@/refactorings/components/CategoryGroup";

import BookSection from "./components/BookSection";
import FlatChipStrip from "./components/FlatChipStrip";
import { getReferenceSections } from "./lib/getReferenceSections";

export default function ReferencePage() {
  const sections = getReferenceSections();
  const { counts } = sections;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={5}>
        <Stack spacing={1}>
          <Typography component="h1" sx={visuallyHidden}>
            Reference
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Every refactoring, smell, and pattern in the catalog, grouped by its source book.{" "}
            {counts.refactorings} refactorings · {counts.smells} smells · {counts.kerievskyPatterns}{" "}
            Kerievsky patterns · {counts.gofPatterns} GoF design patterns.
          </Typography>
        </Stack>

        <BookSection
          title="Refactorings"
          attribution="Martin Fowler, Refactoring (2nd ed., 2018) — organized by chapter."
        >
          <Stack spacing={3}>
            {sections.refactoringsByCategory.map((group) => (
              <CategoryGroup key={group.category} category={group.category} items={group.items} />
            ))}
          </Stack>
        </BookSection>

        <Divider />

        <BookSection
          title="Code smells"
          attribution="Martin Fowler, Refactoring (2nd ed., 2018) — the 24 named smells that trigger a refactoring."
        >
          <FlatChipStrip items={sections.smells} />
        </BookSection>

        <Divider />

        <BookSection
          title="Refactoring to Patterns"
          attribution="Joshua Kerievsky, Refactoring to Patterns (2004) — composite refactorings that lead to a design-pattern destination."
        >
          <FlatChipStrip items={sections.kerievskyPatterns} />
        </BookSection>

        <Divider />

        <BookSection
          title="Design Patterns"
          attribution="Gamma, Helm, Johnson, Vlissides, Design Patterns (1994) — the 23 Gang of Four patterns, grouped by intent."
        >
          <Stack spacing={3}>
            {sections.gofPatternsByBand.map((group) => (
              <CategoryGroup key={group.category} category={group.category} items={group.items} />
            ))}
          </Stack>
        </BookSection>
      </Stack>
    </Container>
  );
}
