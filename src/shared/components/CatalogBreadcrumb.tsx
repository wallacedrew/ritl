"use client";

import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import FolderIcon from "@mui/icons-material/Folder";
import Box from "@mui/material/Box";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import NextLink from "next/link";

interface CatalogBreadcrumbProps {
  parentHref: string;
  parentLabel: string;
  currentLabel: string;
}

export default function CatalogBreadcrumb({
  parentHref,
  parentLabel,
  currentLabel,
}: CatalogBreadcrumbProps) {
  return (
    <Breadcrumbs
      aria-label="breadcrumb"
      separator={<ChevronRightIcon fontSize="small" />}
      sx={{
        "& .MuiBreadcrumbs-ol": { alignItems: "center" },
        "& .MuiBreadcrumbs-li": { display: "inline-flex", alignItems: "center" },
        "& .MuiBreadcrumbs-separator": {
          mx: 0.5,
          display: "inline-flex",
          alignItems: "center",
        },
      }}
    >
      <Link
        component={NextLink}
        href={parentHref}
        underline="hover"
        color="text.secondary"
        variant="body2"
        sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, lineHeight: 1 }}
      >
        <FolderIcon fontSize="small" />
        <Box component="span" sx={{ lineHeight: 1 }}>
          {parentLabel}
        </Box>
      </Link>
      <Typography
        variant="body2"
        color="text.primary"
        sx={{ fontWeight: 500, lineHeight: 1, display: "inline-flex", alignItems: "center" }}
      >
        {currentLabel}
      </Typography>
    </Breadcrumbs>
  );
}
