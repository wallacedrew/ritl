"use client";

import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import NextLink from "next/link";

import CatalogNumber from "@/shared/components/CatalogNumber";
import type { CatalogListItem } from "@/shared/lib/CatalogListItem";

interface CatalogCardProps {
  item: CatalogListItem;
}

export default function CatalogCard({ item }: CatalogCardProps) {
  return (
    <Card variant="outlined" sx={{ height: "100%" }}>
      <CardActionArea component={NextLink} href={item.href} sx={{ height: "100%" }}>
        <CardContent>
          <Stack spacing={1.5}>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: "baseline" }}>
              <CatalogNumber value={item.number} />
              <Typography component="h2" variant="h6">
                {item.name}
              </Typography>
            </Stack>
            <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1 }}>
              {item.chips.map((chip) => (
                <Chip key={chip} label={chip} size="small" variant="outlined" />
              ))}
            </Stack>
            <Typography variant="body2" color="text.secondary">
              {item.caption}
            </Typography>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
