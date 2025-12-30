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
import { useLogout } from "../api/utils";

export const AGSAppBar = () => {
  const { user, loading } = useAuth();
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const { logout } = useLogout();
  const navigate = useNavigate();

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
          <Button
            onClick={() => {
              navigate("/test");
            }}
          >
            Test Page
          </Button>
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
                    logout("/");
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
