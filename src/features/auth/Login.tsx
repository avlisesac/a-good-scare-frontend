import { Alert, Box, Button, TextField } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { ChangeEvent, FormEventHandler, useEffect, useState } from "react";
import { useLogin, useRegister } from "../api/utils";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router";

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
        email: formData.email,
        password: formData.password,
      });
      if (result.data?.token) {
        cookies.set("TOKEN", result.data.token, { path: "/" });
        navigate("/");
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
    </Box>
  );
};
