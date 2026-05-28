"use client";

import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import FolderIcon from "@mui/icons-material/Folder";
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
      sx={{ "& .MuiBreadcrumbs-separator": { mx: 0.5 } }}
    >
      <Link
        component={NextLink}
        href={parentHref}
        underline="hover"
        color="text.secondary"
        variant="body2"
        sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}
      >
        <FolderIcon fontSize="small" />
        {parentLabel}
      </Link>
      <Typography variant="body2" color="text.primary" sx={{ fontWeight: 500 }}>
        {currentLabel}
      </Typography>
    </Breadcrumbs>
  );
}
