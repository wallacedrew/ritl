import Stack from "@mui/material/Stack";

import BeforeAfterCodeBlocks from "@/shared/components/BeforeAfterCodeBlocks";
import CatalogExampleSource from "@/shared/components/CatalogExampleSource";
import CatalogSection from "@/shared/components/CatalogSection";
import type { CatalogEntry, Lens } from "@/shared/lib/CatalogEntry";

interface CatalogDetailBodyProps {
  entry: CatalogEntry;
  lens: Lens;
  beforeLabel: string;
  afterLabel: string;
}

export default function CatalogDetailBody({
  entry,
  lens,
  beforeLabel,
  afterLabel,
}: CatalogDetailBodyProps) {
  const forces = entry.forcesFor(lens);

  return (
    <Stack spacing={4}>
      <CatalogSection label="Symptom" body={forces.symptom} />
      <CatalogSection label="Goal" body={forces.goal} />
      <BeforeAfterCodeBlocks
        beforeLabel={beforeLabel}
        afterLabel={afterLabel}
        beforeCode={entry.before}
        afterCode={entry.after}
      />
      {entry.exampleSource && <CatalogExampleSource note={entry.exampleSource} />}
      <CatalogSection label="Pressure" body={forces.pressure} />
      <CatalogSection label="Tradeoff" body={forces.tradeoff} />
      <CatalogSection label="Relief" body={forces.relief} />
      <CatalogSection label="Trap" body={forces.trap} />
    </Stack>
  );
}
