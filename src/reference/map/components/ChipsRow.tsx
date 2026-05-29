import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import LinkedChip from "@/shared/components/LinkedChip";

import type { CrossReferenceChip } from "@/reference/lib/RelationshipGroup";

interface Props {
  chips: readonly CrossReferenceChip[];
  emptyMessage: string;
}

export default function ChipsRow({ chips, emptyMessage }: Props) {
  if (chips.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
        {emptyMessage}
      </Typography>
    );
  }
  return (
    <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1 }}>
      {chips.map((chip) => (
        <LinkedChip key={chip.href} label={chip.label} href={chip.href} tone={chip.tone} />
      ))}
    </Stack>
  );
}
