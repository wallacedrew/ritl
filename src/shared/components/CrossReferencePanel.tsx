import Stack from "@mui/material/Stack";

import LabeledChipRow from "@/shared/components/LabeledChipRow";

import type { CrossReferences } from "../lib/RelationshipGroup";

interface Props {
  crossReferences: CrossReferences;
}

export default function CrossReferencePanel({ crossReferences }: Props) {
  return (
    <Stack spacing={2} sx={{ p: 2, maxWidth: 360 }}>
      {crossReferences.groups.map((group) => (
        <LabeledChipRow key={group.kind} label={group.label} chips={group.chips} />
      ))}
    </Stack>
  );
}
