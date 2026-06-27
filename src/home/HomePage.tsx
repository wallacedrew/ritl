import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { visuallyHidden } from "@mui/utils";

import { SUB_SITES } from "@/shared/lib/subSites";

import SubSiteCard from "./components/SubSiteCard";

export default function HomePage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={4}>
        <Stack spacing={1}>
          <Typography component="h1" sx={visuallyHidden}>
            RefactorPlug — refactoring in the loop
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Pick a catalog to explore.
          </Typography>
        </Stack>
        <Stack spacing={2}>
          {SUB_SITES.map((subSite) => (
            <SubSiteCard
              key={subSite.slug}
              title={subSite.title}
              href={subSite.primaryLandingHref()}
            />
          ))}
        </Stack>
      </Stack>
    </Container>
  );
}
