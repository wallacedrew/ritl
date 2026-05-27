"use client";

import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import NextLink from "next/link";

interface SubSiteCardProps {
  title: string;
  href: string;
}

export default function SubSiteCard({ title, href }: SubSiteCardProps) {
  return (
    <Card variant="outlined">
      <CardActionArea component={NextLink} href={href}>
        <CardContent>
          <Stack spacing={1}>
            <Typography component="h2" variant="h6">
              {title}
            </Typography>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
