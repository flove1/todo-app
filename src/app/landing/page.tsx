"use client";
import React, { useEffect, useState } from "react";
import {
  Container,
  Box,
  Button,
  Paper,
  Grid,
  Typography,
  useTheme,
} from "@mui/material";
import "../page.css";
import Link from "next/link";

export default function LandingPage() {
  const [animationClass, setAnimationClass] = useState("");
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationClass("animated");
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Hero Section */}
      <Box
        className={animationClass}
        sx={{
          flexGrow: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          padding: "50px 20px",
          backgroundColor: isDarkMode ? "#222" : "#e8e8e8",
          color: isDarkMode ? "#fff" : "#000",
          transition: "all 0.3s ease",
        }}
      >
        <Container>
          <Typography variant="h2" gutterBottom sx={{ fontWeight: "bold" }}>
            Welcome to the To-Do App
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

      {/* Features Section */}
      <Container className={animationClass} sx={{ py: 8 }}>
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ fontWeight: "bold" }}
        >
          Why Choose Us?
        </Typography>
        <Grid container spacing={4}>
          {[
            {
              title: "Easy to Use",
              description:
                "Our app is designed with simplicity in mind. Easily manage your tasks with a clean and intuitive interface.",
            },
            {
              title: "Stay Organized",
              description:
                "Keep track of your tasks, categorize them, and stay organized. Never miss an important task again.",
            },
            {
              title: "Dark Mode Support",
              description:
                "Enjoy using the app in both light and dark modes. Switch between modes for a more comfortable experience.",
            },
            {
              title: "Cloud Sync",
              description:
                "Access your tasks from anywhere, anytime. Your tasks are securely stored in the cloud for easy access. Tasks are also synced in real-time for seamless updates.",
            },
            {
              title: "Accessible Anywhere",
              description:
                "Use our app on any device, including desktop, tablet, and mobile. Access your tasks on the go and stay productive wherever you are.",
            },
            {
              title: "Account Security",
              description:
                "Your account is secure with us. We use the latest encryption technologies to protect your data, ensure your privacy, and keep your account (and to-do lists) safe.",
            },
          ].map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Paper
                elevation={4}
                sx={{
                  padding: 3,
                  backgroundColor: theme.palette.background.paper,
                  color: theme.palette.text.primary,
                  textAlign: "center",
                  borderRadius: 2,
                  boxShadow: 3,
                  transition: "all 0.3s ease",
                }}
              >
                <Typography variant="h6" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2">{feature.description}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Call-to-Action Section */}
      <Box
        className={animationClass}
        sx={{
          textAlign: "center",
          py: 4,
          backgroundColor: isDarkMode ? "#444" : "#e8e8e8",
          color: isDarkMode ? "#fff" : "#000",
          transition: "all 0.3s ease",
        }}
      >
        <Typography variant="h5" gutterBottom>
          Ready to become more organized and productive?
        </Typography>
        <Typography variant="body2" gutterBottom>
          Sign up now and start managing your tasks with ease. Get started for
          free!
        </Typography>
        <Link href="/auth/register" passHref>
          <Button
            variant="contained"
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: "#fff",
              mt: 2,
              transition: "all 0.3s ease",
              "&:hover": { backgroundColor: theme.palette.primary.dark },
            }}
          >
            Start Your Journey
          </Button>
        </Link>
      </Box>

      {/* Documentation Section */}
      <Box
        className={animationClass}
        sx={{
          textAlign: "center",
          py: 4,
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
          transition: "all 0.3s ease",
        }}
      >
        <Typography variant="h5" gutterBottom>
          Explore the App&apos;s Documentation
        </Typography>
        <Typography variant="body2" gutterBottom>
          Visit the app&apos;s source code repository and view the API
          documentation to get to know the app even better!
        </Typography>
        <Link
          href="https://github.com/hoangsonww/ToDo-App-NextJS-Fullstack"
          passHref
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button
            variant="contained"
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: "#fff",
              mt: 2,
              transition: "all 0.3s ease",
              "&:hover": { backgroundColor: theme.palette.primary.dark },
            }}
          >
            View Documentation
          </Button>
        </Link>
      </Box>
    </>
  );
}
