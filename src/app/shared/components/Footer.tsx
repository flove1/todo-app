"use client";
import React from "react";
import { Box, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Box
      sx={{
        mt: "auto",
        textAlign: "center",
        py: 2,
        backgroundColor: "#006400", // Use theme primary color if possible later
        color: "#ffffff",
      }}
    >
      <Typography variant="body2">
        &copy; {new Date().getFullYear()} Software Development Case Study
      </Typography>
    </Box>
  );
}
