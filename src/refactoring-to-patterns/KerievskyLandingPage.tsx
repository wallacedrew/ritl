import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { visuallyHidden } from "@mui/utils";

import CatalogCard from "@/shared/components/CatalogCard";
import { loadPatterns } from "@/patterns/lib/loadPatterns";
import { toPatternListItem } from "@/patterns/lib/toPatternListItem";

export default function KerievskyLandingPage() {
  const patterns = loadPatterns();
  const items = patterns.map((pattern, index) => toPatternListItem(pattern, index + 1));

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={4}>
        <Stack spacing={1}>
          <Typography component="h1" sx={visuallyHidden}>
            Refactoring to Patterns
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Kerievsky&rsquo;s composite refactorings whose destination is a design pattern.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Source: Joshua Kerievsky, <em>Refactoring to Patterns</em> (Addison-Wesley, 2004). Code
            examples on this sub-site are illustrative adaptations written for the site, not direct
            quotations from the book.
          </Typography>
        </Stack>
        <Divider />
        <Stack spacing={2}>
          {items.map((item) => (
            <CatalogCard key={item.href} item={item} />
          ))}
        </Stack>
      </Stack>
    </Container>
  );
}
