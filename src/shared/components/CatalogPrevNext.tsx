"use client";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import NextLink from "next/link";

import type { CatalogListItem } from "@/shared/lib/CatalogListItem";

import CatalogNumber from "./CatalogNumber";

interface CatalogPrevNextProps {
  prev: CatalogListItem | null;
  next: CatalogListItem | null;
}

export default function CatalogPrevNext({ prev, next }: CatalogPrevNextProps) {
  return (
    <Box
      sx={{
        display: "grid",
        gap: 2,
        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
      }}
    >
      {prev ? <NeighborTile item={prev} direction="prev" /> : <Box />}
      {next ? <NeighborTile item={next} direction="next" /> : <Box />}
    </Box>
  );
}

interface NeighborTileProps {
  item: CatalogListItem;
  direction: "prev" | "next";
}

function NeighborTile({ item, direction }: NeighborTileProps) {
  const isNext = direction === "next";
  const Icon = isNext ? ChevronRightIcon : ChevronLeftIcon;
  const label = isNext ? "Next" : "Previous";

  return (
    <Card variant="outlined" sx={{ height: "100%" }}>
      <CardActionArea component={NextLink} href={item.href} sx={{ height: "100%" }}>
        <Stack spacing={0.5} sx={{ p: 1.5, alignItems: isNext ? "flex-end" : "flex-start" }}>
          <Typography variant="overline" color="text.secondary">
            {label}
          </Typography>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
            {!isNext && <Icon fontSize="small" />}
            <CatalogNumber value={item.number} />
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {item.name}
            </Typography>
            {isNext && <Icon fontSize="small" />}
          </Stack>
        </Stack>
      </CardActionArea>
    </Card>
  );
}
