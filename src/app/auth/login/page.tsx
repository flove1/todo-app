"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Paper,
  Button,
  TextField,
  InputAdornment,
  Box,
  Typography,
  CircularProgress,
  IconButton,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import "../../page.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Redirect if user is already logged in
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("currentUser") || "null");
    if (storedUser) {
      router.push("/home");
    }
  }, [router]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Username and password are required");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        localStorage.setItem("currentUser", JSON.stringify(data.user));
        // No need to set user state here, Layout handles it on refresh/navigation
        router.push("/home");
      } else {
        setError(data.error || "Invalid username or password");
      }
    } catch (err) {
      console.error("Error during login:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container
      sx={{
        minHeight: "80vh", // Adjust height considering Navbar/Footer
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 4, // Add some padding
      }}
    >
      <Paper
        elevation={4}
        sx={{
          padding: "30px",
          borderRadius: 2,
          boxShadow: 3,
          width: "100%",
          maxWidth: "400px",
          bgcolor: 'background.paper',
          color: 'text.primary',
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Login
        </Typography>
        {error && (
          <Typography color="error" align="center" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        <Box mb={2}>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleLogin()}
            sx={{ marginBottom: 2 }}
            // Styles handled by ThemeProvider
          />
          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleLogin()}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={togglePasswordVisibility} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            // Styles handled by ThemeProvider
          />
        </Box>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleLogin}
          disabled={isLoading}
          sx={{
            color: "#fff",
            "&:hover": {
              backgroundColor: "primary.dark",
            },
          }}
        >
          {isLoading ? (
            <CircularProgress size={24} sx={{ color: "#fff" }} />
          ) : (
            "Login"
          )}
        </Button>
        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          Don&#39;t have an account?{" "}
          <a
            href="/auth/register"
            style={{ color: 'primary.main' }}
          >
            Register
          </a>
        </Typography>
        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          Forgot Password?{" "}
          <a
            href="/auth/forgot-password"
            style={{ color: 'primary.main' }}
          >
            Click here to reset
          </a>
        </Typography>
      </Paper>
    </Container>
  );
}
