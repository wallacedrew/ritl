import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";

import CategoryGroup from "@/refactorings/components/CategoryGroup";

import BookSection from "./components/BookSection";
import FlatChipStrip from "./components/FlatChipStrip";
import { getReferenceSections } from "./lib/getReferenceSections";

export default function ReferencePage() {
  const sections = getReferenceSections();

  return (
    <Container maxWidth="lg" sx={{ pt: 2, pb: 4 }}>
      <Stack spacing={5}>
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
          <FlatChipStrip items={sections.kerievskyRefactorings} />
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
