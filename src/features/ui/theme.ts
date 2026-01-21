import { colors, createTheme } from "@mui/material";

export const appTheme = createTheme({
  typography: {
    h1: {
      fontFamily: ["creepster", "roboto"].join(", "),
    },
  },
  palette: {
    text: {
      primary: "#fff",
      secondary: "#fff",
    },
    background: {
      paper: "#1D293D",
      default: "#0F172B",
    },
    primary: {
      main: "#8E51FF",
    },
    secondary: {
      main: "#C2FF51",
    },
    // secondary: {
    //   main: "#fff",
    // },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          background: "#fff",
          input: {
            color: "#000",
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "#000",
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        noOptions: {
          color: "#fff",
        },
      },
    },
  },
});
