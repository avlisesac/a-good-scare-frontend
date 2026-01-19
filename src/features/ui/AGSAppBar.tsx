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

export const AGSAppBar = () => {
  const { user, loading, logout } = useAuth();
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

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
                <Avatar alt={user.email}>{user.username[0]}</Avatar>
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
                    navigate("/");
                  }}
                >
                  <Typography sx={{ textAlign: "center" }}>Logout</Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleCloseUserMenu();
                    navigate("/watchlist");
                  }}
                >
                  <Typography sx={{ textAlign: "center" }}>
                    My Watchlist
                  </Typography>
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
