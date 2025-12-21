import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import { Outlet, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import Cookies from "universal-cookie";

export const AGSAppBar = () => {
  const { user, loading, setUser } = useAuth();
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const navigate = useNavigate();
  const cookies = new Cookies();

  const logout = async () => {
    cookies.remove("TOKEN", { path: "./" });
    setUser(null);
    navigate("/");
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

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
          {user && (
            <>
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt={user.email}>{user.email[0]}</Avatar>
              </IconButton>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem
                  onClick={() => {
                    logout();
                    handleCloseUserMenu();
                  }}
                >
                  <Typography sx={{ textAlign: "center" }}>Logout</Typography>
                </MenuItem>
              </Menu>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Container sx={{ marginTop: 2 }}>
        <Outlet />
      </Container>
    </>
  );
};
