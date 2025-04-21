"use client";
import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Box,
  List,
  ListItem,
  ListItemButton,
  Drawer,
  ListItemText,
} from "@mui/material";
import {
  Brightness4,
  Brightness7,
  Menu as MenuIcon,
  Close as CloseIcon,
} from "@mui/icons-material";

interface NavbarProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  user: { id: number; username: string } | null;
  logout: () => void;
}

export default function Navbar({ isDarkMode, toggleDarkMode, user, logout }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box
      sx={{
        width: 250,
        bgcolor: isDarkMode ? "#333" : "#fff",
        color: isDarkMode ? "#fff" : "#000",
        height: "100%",
        transition: "all 0.3s ease",
      }}
    >
      <IconButton
        onClick={handleDrawerToggle}
        sx={{ color: isDarkMode ? "#fff" : "#000", m: 1 }}
      >
        <CloseIcon />
      </IconButton>
      <List>
        <ListItem
          disablePadding
          sx={{
            backgroundColor: isActive("/home")
              ? "rgba(0, 128, 0, 0.3)"
              : "inherit",
          }}
        >
          <ListItemButton
            component="a"
            href="/home"
            onClick={handleDrawerToggle}
          >
            <ListItemText primary="Home" />
          </ListItemButton>
        </ListItem>
        {user ? (
          <ListItem
            disablePadding
            sx={{
              backgroundColor: isActive("/auth/login") // Keep highlight logic for logout if needed
                ? "rgba(0, 128, 0, 0.3)"
                : "inherit",
            }}
          >
            <ListItemButton
              onClick={() => {
                logout();
                handleDrawerToggle();
              }}
            >
              <ListItemText primary="Logout" sx={{ color: "red" }} />
            </ListItemButton>
          </ListItem>
        ) : (
          <>
            <ListItem
              disablePadding
              sx={{
                backgroundColor: isActive("/auth/login")
                  ? "rgba(0, 128, 0, 0.3)"
                  : "inherit",
              }}
            >
              <ListItemButton
                component="a"
                href="/auth/login"
                onClick={handleDrawerToggle}
              >
                <ListItemText primary="Login" />
              </ListItemButton>
            </ListItem>
            <ListItem
              disablePadding
              sx={{
                backgroundColor: isActive("/auth/register")
                  ? "rgba(0, 128, 0, 0.3)"
                  : "inherit",
              }}
            >
              <ListItemButton
                component="a"
                href="/auth/register"
                onClick={handleDrawerToggle}
              >
                <ListItemText primary="Register" />
              </ListItemButton>
            </ListItem>
          </>
        )}

        {/* Divider */}
        <div
          style={{
            borderTop: isDarkMode ? "1px solid #fff" : "1px solid #333",
            marginTop: 2,
            marginBottom: 2,
          }}
        ></div>

        {/* Dark mode toggle */}
        <ListItem disablePadding>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            width="100%"
            px={2}
            sx={{ mt: 0.5 }}
          >
            <Typography sx={{ color: isDarkMode ? "#fff" : "#000" }}>
              Dark Mode
            </Typography>
            <IconButton onClick={toggleDarkMode}>
              {isDarkMode ? (
                <Brightness7 sx={{ color: "#fff" }} />
              ) : (
                <Brightness4 sx={{ color: "#000" }} />
              )}
            </IconButton>
          </Box>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="sticky" sx={{ backgroundColor: "#006400" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            <Link href="/" style={{ color: "#fff", textDecoration: "none" }}>
              Case Study ToDo App
            </Link>
          </Typography>

          {/* Desktop Navigation */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
            }}
          >
            <Link href="/home" passHref>
              <Button
                sx={{
                  color: isActive("/home") ? "#f5f5f5" : "#ffffff",
                  position: "relative",
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    height: "2px",
                    width: isActive("/home") ? "100%" : "0",
                    backgroundColor: "#ffffff",
                    borderRadius: "10px",
                    transition: "width 0.3s",
                  },
                  "&:hover::after": {
                    width: "100%",
                  },
                }}
              >
                Home
              </Button>
            </Link>

            {user ? (
              <Button
                onClick={logout}
                sx={{
                  color: "red",
                  fontWeight: "bold",
                  position: "relative",
                  "&:hover": {
                    color: "#ff4d4d",
                  },
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    height: "2px",
                    width: "0",
                    backgroundColor: "#fff",
                    transition: "width 0.3s",
                  },
                  "&:hover::after": {
                    width: "100%",
                  },
                }}
              >
                Logout
              </Button>
            ) : (
              <>
                <Link href="/auth/login" passHref>
                  <Button
                    sx={{
                      color: isActive("/auth/login") ? "#f5f5f5" : "#ffffff",
                      position: "relative",
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        height: "2px",
                        width: isActive("/auth/login") ? "100%" : "0",
                        backgroundColor: "#ffffff",
                        borderRadius: "10px",
                        transition: "width 0.3s",
                      },
                      "&:hover::after": {
                        width: "100%",
                      },
                    }}
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/auth/register" passHref>
                  <Button
                    sx={{
                      color: isActive("/auth/register") ? "#f5f5f5" : "#ffffff",
                      position: "relative",
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        height: "2px",
                        width: isActive("/auth/register") ? "100%" : "0",
                        backgroundColor: "#ffffff",
                        borderRadius: "10px",
                        transition: "width 0.3s",
                      },
                      "&:hover::after": {
                        width: "100%",
                      },
                    }}
                  >
                    Register
                  </Button>
                </Link>
              </>
            )}

            <IconButton color="inherit" onClick={toggleDarkMode}>
              {isDarkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Box>

          {/* Mobile Navigation */}
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              display: { xs: "block", md: "none" },
              textAlign: "center",
              width: "50px",
              height: "50px",
            }}
          >
            <MenuIcon sx={{ mt: "5px" }} />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Drawer for Mobile */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
      >
        {drawer}
      </Drawer>
    </>
  );
}
