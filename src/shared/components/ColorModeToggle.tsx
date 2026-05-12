"use client";

import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import IconButton from "@mui/material/IconButton";

import { useColorMode } from "@/shared/hooks/useColorMode";

export default function ColorModeToggle() {
  const { mode, toggleMode } = useColorMode();
  const isDark = mode === "dark";

  return (
    <IconButton
      onClick={toggleMode}
      color="inherit"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <Brightness7Icon /> : <Brightness4Icon />}
    </IconButton>
  );
}
