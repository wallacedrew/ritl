"use client";

import SearchIcon from "@mui/icons-material/Search";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { usePathname, useRouter } from "next/navigation";

import { useAnalytics } from "@/shared/hooks/useAnalytics";

import type { CatalogItem } from "../lib/CatalogItem";
import { dotBgForTone } from "../lib/catalogChipColor";
import CatalogNumber from "./CatalogNumber";

function slugFromHref(href: string): string {
  const last = href.split("/").pop();
  return last && last.length > 0 ? last : "";
}

function captionFor(tone: CatalogItem["tone"]): string {
  switch (tone) {
    case "refactoring":
      return "refactoring";
    case "smell":
      return "smell";
    case "kerievsky-pattern":
      return "kerievsky pattern";
    case "gof-pattern":
      return "gof pattern";
  }
}

interface CatalogSearchProps {
  items: CatalogItem[];
}

export default function CatalogSearch({ items }: CatalogSearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const analytics = useAnalytics();
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
          analytics.track({
            event: "search_selected",
            properties: { kind: option.kind, slug: slugFromHref(option.href) },
          });
          router.push(option.href);
        }
      }}
      renderInput={(params) => {
        const slotProps = {
          ...params.slotProps,
          input: {
            ...params.slotProps.input,
            startAdornment: (
              <InputAdornment position="start" sx={{ color: "text.secondary" }}>
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          },
        };
        return (
          <TextField
            {...params}
            slotProps={slotProps}
            placeholder="Search all"
            size="small"
            sx={{
              "& .MuiAutocomplete-inputRoot.MuiOutlinedInput-root.MuiInputBase-adornedStart": {
                paddingLeft: "9px",
              },
              "& .MuiInputAdornment-positionStart": {
                marginLeft: 0,
                marginRight: "8px",
              },
            }}
          />
        );
      }}
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
                  bgcolor: dotBgForTone(option.tone),
                  flexShrink: 0,
                }}
              />
              <CatalogNumber value={option.number} />
              <Typography sx={{ flexGrow: 1 }}>{option.name}</Typography>
              <Typography variant="caption" color="text.secondary">
                {captionFor(option.tone)}
              </Typography>
            </Stack>
          </Box>
        );
      }}
    />
  );
}
