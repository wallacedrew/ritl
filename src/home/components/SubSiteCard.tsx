import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import NextLink from "next/link";

import type { SubSite } from "@/shared/lib/SubSite";

interface SubSiteCardProps {
  subSite: SubSite;
}

export default function SubSiteCard({ subSite }: SubSiteCardProps) {
  return (
    <Card variant="outlined">
      <CardActionArea component={NextLink} href={subSite.href()}>
        <CardContent>
          <Stack spacing={1}>
            <Typography component="h2" variant="h6">
              {subSite.title}
            </Typography>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
