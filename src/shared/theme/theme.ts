import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#67e8f9" },
    background: {
      default: "#09090b",
      paper: "#18181b",
    },
    text: {
      primary: "#f4f4f5",
      secondary: "#a1a1aa",
    },
  },
  typography: {
    fontFamily: '"Inter Variable", system-ui, sans-serif',
  },
});
