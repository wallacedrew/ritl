import Stack from "@mui/material/Stack";

import type { RefactoringCategoryGroup } from "../lib/getRefactoringsByCategory";
import CategoryGroup from "./CategoryGroup";

interface ReferenceViewProps {
  groups: RefactoringCategoryGroup[];
}

export default function ReferenceView({ groups }: ReferenceViewProps) {
  return (
    <Stack spacing={4}>
      {groups.map((group) => (
        <CategoryGroup key={group.category} category={group.category} items={group.items} />
      ))}
    </Stack>
  );
}
