import { colors, createTheme } from "@mui/material";

export const appTheme = createTheme({
  typography: {
    h1: {
      fontFamily: ["creepster", "roboto"].join(", "),
    },
    h2: {
      fontFamily: ["Archivo Black", "roboto"].join(", "),
    },
    h3: {
      fontFamily: ["Archivo Black", "roboto"].join(", "),
    },
    h4: {
      fontFamily: ["Archivo Black", "roboto"].join(", "),
    },
    h5: {
      fontFamily: ["Archivo Black", "roboto"].join(", "),
    },
    h6: {
      fontFamily: ["Archivo Black", "roboto"].join(", "),
    },
  },
  palette: {
    mode: "dark",
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
    action: {
      disabledOpacity: 0.6,
      disabledBackground: "#90A1B9",
    },
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
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          color: "#000",
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
    MuiPaper: {
      variants: [
        {
          props: { variant: "outlined" },
          style: ({ theme }) => ({
            borderColor: theme.palette.secondary.main,
          }),
        },
      ],
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
  },
});
