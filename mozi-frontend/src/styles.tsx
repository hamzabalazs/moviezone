import { createTheme } from "@mui/material/styles";

function styles() {
  if (localStorage.getItem("color-mode") === "light") {
    const customTheme = createTheme({
      palette: {
        primary: {
          main: "#9ccc65",
        },
        secondary: {
          main: "#1b5e20",
        },
      },
    });
    return customTheme;
  } else if (localStorage.getItem("color-mode") === "dark") {
    const customTheme = createTheme({
      palette: {
        primary: {
          main: "#404040",
        },
        secondary: {
          main: "#202020",
        },
        text: {
          primary: "#fff",
          secondary: "#CACACA",
          disabled: "#808080",
        },
        action: {
          active: "#fff",
          hover: "#141414",
          selected: "#292929",
          disabled: "#4D4D4D",
          disabledBackground: "#1F1F1F",
        },
        background: {
          default: "#121212",
          paper: "#121212",
        },
        divider: "#1F1F1F",
      },
    });
    return customTheme;
  } else {
    const customTheme = createTheme({
      palette: {
        primary: {
          main: "#9ccc65",
        },
        secondary: {
          main: "#1b5e20",
        },
      },
    });
    return customTheme;
  }
}
export default styles;
