"use client";

import React, { useState } from "react";
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
import { Visibility, VisibilityOff } from "@mui/icons-material";
import "../../page.css";

export default function ForgotPassword() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleVerifyUsername = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }), // Send username in the request
      });
      const data = await response.json();

      if (response.ok) {
        setStep(2); // Move to reset password step
      } else {
        setError(data.error || "Username verification failed.");
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, newPassword: password }),
      });
      const data = await response.json();

      if (response.ok) {
        alert("Password reset successful!");
        router.push("/auth/login");
      } else {
        setError(data.error || "Password reset failed.");
      }
    } catch {
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
          bgcolor: "background.paper",
          color: "text.primary",
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          {step === 1 ? "Verify Username" : "Reset Password"}
        </Typography>
        {error && (
          <Typography color="error" align="center" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        {step === 1 ? (
          <Box>
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleVerifyUsername()}
              sx={{ marginBottom: 2 }}
              // Styles handled by ThemeProvider
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleVerifyUsername}
              disabled={isLoading}
              sx={{ color: "#fff" }}
            >
              {isLoading ? (
                <CircularProgress size={24} sx={{ color: "#fff" }} />
              ) : (
                "Verify Username"
              )}
            </Button>
          </Box>
        ) : (
          <Box>
            <TextField
              label="New Password"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleResetPassword()}
              sx={{ marginBottom: 2 }}
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
            <TextField
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              variant="outlined"
              fullWidth
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleResetPassword()}
              sx={{ marginBottom: 2 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={toggleConfirmPasswordVisibility}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              // Styles handled by ThemeProvider
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleResetPassword}
              disabled={isLoading}
              sx={{ color: "#fff" }}
            >
              {isLoading ? (
                <CircularProgress size={24} sx={{ color: "#fff" }} />
              ) : (
                "Reset Password"
              )}
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
}
