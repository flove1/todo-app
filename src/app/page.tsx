"use client";
import React, { useEffect, useState } from "react";
import {
  Container,
  Box,
  Button,
  Typography,
  useTheme,
} from "@mui/material";
import "./page.css";
import Link from "next/link";

export default function LandingPage() {
  const [animationClass, setAnimationClass] = useState("");
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationClass("animated");
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Box
        className={animationClass}
        sx={{
          flexGrow: 1,
          display: "flex",
          justifyContent: "center",
          justifySelf: "center",
          alignItems: "center",
          textAlign: "center",
          padding: "50px 20px",
          color: isDarkMode ? "#fff" : "#000",
          transition: "all 0.3s ease",
        }}
      >
        <Container>
          <Typography variant="h2" gutterBottom sx={{ fontWeight: "bold" }}>
            Welcome to the
          </Typography>
          <Typography variant="h6" gutterBottom>
            Organize your tasks, increase your productivity, and manage your
            to-dos effortlessly with our simple and intuitive app.
          </Typography>
          <Link href="/auth/register" passHref>
            <Button
              variant="contained"
              sx={{
                backgroundColor: theme.palette.primary.main,
                color: "#fff",
                mt: 3,
                "&:hover": { backgroundColor: theme.palette.primary.dark },
              }}
            >
              Get Started
            </Button>
          </Link>
        </Container>
      </Box>
    </>
  );
}
