"use client";
import { createTheme } from "@mui/material";

export const darkTheme = createTheme({
  palette: {
    mode: "dark", // Set mode to dark
    primary: {
      main: "#006400", // Dark green
    },
    secondary: {
      main: "#ffffff", // White
    },
    background: {
      default: "#121212", // Dark background
      paper: "#333333", // Dark paper
    },
    text: {
      primary: "#ffffff", // White text
      secondary: "#bbbbbb", // Lighter gray text
    },
  },
  typography: {
    fontFamily: "Poppins, sans-serif",
  },
});

export const lightTheme = createTheme({
  palette: {
    mode: "light", // Set mode to light
    primary: {
      main: "#006400", // Dark green
    },
    secondary: {
      main: "#000000", // Black
    },
    background: {
      default: "#f5f5f5", // Light gray background
      paper: "#ffffff", // White paper
    },
    text: {
      primary: "#000000", // Black text
      secondary: "#555555", // Darker gray text
    },
  },
  typography: {
    fontFamily: "Poppins, sans-serif",
  },
});
