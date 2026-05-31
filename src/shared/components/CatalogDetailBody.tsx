import Stack from "@mui/material/Stack";

import BeforeAfterCodeBlocks from "@/shared/components/BeforeAfterCodeBlocks";
import CatalogExampleSource from "@/shared/components/CatalogExampleSource";
import CatalogSection from "@/shared/components/CatalogSection";
import type { ForcesRecord } from "@/shared/lib/Forces";

interface CatalogDetailBodyProps {
  forces: ForcesRecord;
  beforeLabel: string;
  afterLabel: string;
  beforeCode: string;
  afterCode: string;
  exampleSource?: string;
}

export default function CatalogDetailBody({
  forces,
  beforeLabel,
  afterLabel,
  beforeCode,
  afterCode,
  exampleSource,
}: CatalogDetailBodyProps) {
  return (
    <Stack spacing={4}>
      <CatalogSection label="Symptom" body={forces.symptom} />
      <CatalogSection label="Goal" body={forces.goal} />
      <BeforeAfterCodeBlocks
        beforeLabel={beforeLabel}
        afterLabel={afterLabel}
        beforeCode={beforeCode}
        afterCode={afterCode}
      />
      {exampleSource && <CatalogExampleSource note={exampleSource} />}
      <CatalogSection label="Pressure" body={forces.pressure} />
      <CatalogSection label="Tradeoff" body={forces.tradeoff} />
      <CatalogSection label="Relief" body={forces.relief} />
      <CatalogSection label="Trap" body={forces.trap} />
    </Stack>
  );
}
