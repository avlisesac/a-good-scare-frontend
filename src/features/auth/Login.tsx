import { Alert, Box, Button, Link, TextField, Typography } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { ChangeEvent, useState } from "react";
import { extractAxiosErrorMessage, LoginInput, useLogin } from "../api/utils";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

export const Login = () => {
  const [formData, setFormData] = useState<LoginInput>({
    idField: "",
    password: "",
  });
  const { status, attemptLogin } = useLogin();
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("submitting login form w/:", formData);
    setLoginError(null);
    try {
      const result = await attemptLogin({
        idField: formData.idField,
        password: formData.password,
      });
      const user = result.data?.user;
      if (user) {
        console.log("user (Login):", user);
        setUser(user);
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      const extractedMessage = extractAxiosErrorMessage(err);
      setLoginError(extractedMessage || "Unknown error when logging in.");
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
      <Typography variant="h1">Login</Typography>
      <TextField
        label="Username or Email"
        name="idField"
        value={formData.idField}
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
      >
        Login
      </LoadingButton>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography>No account yet?</Typography>
        <Button color="secondary" href="register" component={Link}>
          Register here!
        </Button>
      </Box>
    </Box>
  );
};
