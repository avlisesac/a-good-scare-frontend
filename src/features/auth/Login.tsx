import { Alert, Box, TextField, Typography } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { ChangeEvent, useState } from "react";
import { useLogin } from "../api/utils";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

type LoginFormData = {
  email: string;
  password: string;
};

const cookies = new Cookies();

export const Login = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const { status, err, result, attemptLogin } = useLogin();
  const [loginError, setLoginError] = useState<String | null>(null);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setLoginError(null);
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  // TODO:
  // - Investigate httponly cookies
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("submitting login form w/:", formData);
    setLoginError(null);
    try {
      const result = await attemptLogin({
        email: formData.email,
        password: formData.password,
      });
      if (result.data?.token) {
        cookies.set("TOKEN", result.data.token, { path: "/" });
        navigate("/");
      }
      const user = result.data?.user;
      console.log("user (Login):", user);
      if (user) {
        setUser(user);
      }
    } catch (err) {
      console.error(err);
      setLoginError(err as String);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        width: "200px",
      }}
    >
      <TextField
        label="Email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        disabled={status === "loading"}
        fullWidth
        required
      />
      <TextField
        label="Password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        disabled={status === "loading"}
        fullWidth
        required
      />
      {loginError && <Alert severity="error">{loginError}</Alert>}
      <LoadingButton
        type="submit"
        variant="contained"
        loading={status === "loading"}
        disabled={status === "loading"}
      >
        Login
      </LoadingButton>
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Typography>No account yet?</Typography>
        <Typography component="a" href="/register">
          Register here!
        </Typography>
      </Box>
    </Box>
  );
};
