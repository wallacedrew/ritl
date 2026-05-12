"use client";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import Link from "@mui/material/Link";
import NextLink from "next/link";

interface CatalogBackLinkProps {
  href: string;
  label: string;
}

export default function CatalogBackLink({ href, label }: CatalogBackLinkProps) {
  return (
    <Link
      component={NextLink}
      href={href}
      underline="hover"
      color="text.secondary"
      variant="body2"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.5,
        alignSelf: "flex-start",
      }}
    >
      <ChevronLeftIcon fontSize="small" />
      {label}
    </Link>
  );
}
