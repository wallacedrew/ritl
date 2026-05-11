import { createTheme } from "@mui/material/styles";

const sharedTypography = {
  fontFamily: '"Inter Variable", system-ui, sans-serif',
};

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#ef4444" },
    background: {
      default: "#09090b",
      paper: "#18181b",
    },
    text: {
      primary: "#f4f4f5",
      secondary: "#a1a1aa",
    },
  },
  typography: sharedTypography,
});

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#dc2626" },
    background: {
      default: "#fafafa",
      paper: "#ffffff",
    },
    text: {
      primary: "#18181b",
      secondary: "#52525b",
    },
  },
  typography: sharedTypography,
});

// Backward-compatible default — tests and any other consumer that doesn't
// care about light mode (e.g. renderWithTheme's snapshot context) keeps
// importing { theme } and gets the dark variant.
export const theme = darkTheme;
