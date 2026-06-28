import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
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
  typography: {
    fontFamily: '"Inter Variable", system-ui, sans-serif',
  },
});
