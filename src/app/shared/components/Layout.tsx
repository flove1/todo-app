"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import Navbar from "./Navbar"; // Corrected path
import Footer from "./Footer"; // Corrected path
import { darkTheme, lightTheme } from "../theme"; // Corrected path

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [user, setUser] = useState<{ id: number; username: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedDarkMode = JSON.parse(
      localStorage.getItem("darkMode") || "false",
    );
    setIsDarkMode(storedDarkMode);

    const storedUser = JSON.parse(
      localStorage.getItem("currentUser") || "null",
    );
    if (storedUser) {
      setUser(storedUser);
    } else {
      const publicPaths = ["/auth/login", "/auth/register", "/auth/forgot-password", "/"];
      if (!publicPaths.includes(window.location.pathname)) {
        router.push("/auth/login");
      }
    }
  }, [router]);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem("darkMode", JSON.stringify(newDarkMode));
  };

  const logout = () => {
    localStorage.removeItem("currentUser");
    setUser(null);
    router.push("/auth/login");
  };

  const currentTheme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          backgroundColor: currentTheme.palette.background.default,
          color: currentTheme.palette.text.primary,
          transition: "all 0.3s ease",
        }}
      >
        <Navbar
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
          user={user}
          logout={logout}
        />
        <Box component="main" sx={{ flexGrow: 1 }}>
          {children}
        </Box>
        <Footer />
      </Box>
    </ThemeProvider>
  );
}

