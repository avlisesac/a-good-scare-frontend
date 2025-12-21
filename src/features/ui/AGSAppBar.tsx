import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
} from "@mui/material";
import { Outlet } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

export const AGSAppBar = () => {
  const { user, loading } = useAuth();

  useEffect(() => {
    console.log("user:", user);
  }, [user]);

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: "black" }}>
        <Toolbar sx={{ gap: 2 }}>
          <Box component="img" src="/eyeAnimation.gif" sx={{ width: 50 }} />
          <Typography
            component="a"
            href="/"
            sx={{
              textDecoration: "none",
              color: "white",
              fontWeight: 700,
              letterSpacing: "0.3rem",
              marginRight: "auto",
            }}
          >
            A Good Scare
          </Typography>
          {!user && <Button href="/login">Login</Button>}
          {user && <Typography>{user.email[0]}</Typography>}
        </Toolbar>
      </AppBar>
      <Container sx={{ marginTop: 2 }}>
        <Outlet />
      </Container>
    </>
  );
};
