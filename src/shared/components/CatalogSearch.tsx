"use client";

import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { usePathname, useRouter } from "next/navigation";

import type { CatalogItem } from "../lib/CatalogItem";
import CatalogNumber from "./CatalogNumber";

interface CatalogSearchProps {
  items: CatalogItem[];
}

export default function CatalogSearch({ items }: CatalogSearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const selected = items.find((item) => item.href === pathname) ?? null;

  return (
    <Autocomplete
      options={items}
      value={selected}
      autoHighlight
      blurOnSelect
      clearOnEscape
      selectOnFocus
      getOptionLabel={(option) => option.name}
      isOptionEqualToValue={(option, value) => option.href === value.href}
      onChange={(_, option) => {
        if (option) {
          router.push(option.href);
        }
      }}
      renderInput={(params) => (
        <TextField {...params} placeholder="Search smells and refactorings" size="small" />
      )}
      renderOption={(props, option) => {
        const { key, ...rest } = props as typeof props & { key?: string };
        return (
          <Box component="li" key={key ?? option.href} {...rest}>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", width: "100%" }}>
              <Box
                aria-hidden
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: option.kind === "smell" ? "warning.main" : "primary.main",
                  flexShrink: 0,
                }}
              />
              <CatalogNumber value={option.number} />
              <Typography sx={{ flexGrow: 1 }}>{option.name}</Typography>
              <Typography variant="caption" color="text.secondary">
                {option.kind}
              </Typography>
            </Stack>
          </Box>
        );
      }}
    />
  );
}
