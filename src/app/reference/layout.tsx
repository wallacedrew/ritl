import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";

import ReferencePageHeader from "@/reference/components/ReferencePageHeader";
import ReferenceViewToggle from "@/reference/components/ReferenceViewToggle";
import { getReferenceSections } from "@/reference/lib/getReferenceSections";

export default function ReferenceLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { counts } = getReferenceSections();

  return (
    <>
      <Container maxWidth="lg" sx={{ pt: 4, pb: 1 }}>
        <Stack spacing={2}>
          <ReferencePageHeader counts={counts} />
          <ReferenceViewToggle />
        </Stack>
      </Container>
      <Box>{children}</Box>
    </>
  );
}
