import { Alert, Box, Button, Link, TextField, Typography } from "@mui/material";
import { ChangeEvent, useState } from "react";
import { LoginInput } from "../api/utils";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

export const Login = () => {
  const [formData, setFormData] = useState<LoginInput>({
    idField: "",
    password: "",
  });
  const { login, initialFetchLoading, authLoading, error } = useAuth();
  const loadingUser = initialFetchLoading || authLoading;
  const navigate = useNavigate();

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("submitting login form w/:", formData);
    try {
      const result = await login(formData);
      navigate("/");
    } catch (err) {
      console.error(err);
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
        disabled={loadingUser}
        fullWidth
        required
      />
      <TextField
        label="Password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        disabled={loadingUser}
        fullWidth
        required
      />
      {error && <Alert severity="error">{error}</Alert>}
      <Button
        type="submit"
        variant="contained"
        loading={loadingUser}
        loadingPosition="start"
      >
        Login
      </Button>
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
