import { Alert, Box, Button, TextField } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { ChangeEvent, FormEventHandler, useState } from "react";
import { RegistrationInput, useRegister } from "../api/utils";
import { useNavigate } from "react-router";
import axios from "axios";

const emailExistsError = "This email address is already in use.";
const usernameExistsError = "This username is already in use.";

export const Register = () => {
  const [formData, setFormData] = useState<RegistrationInput>({
    email: "",
    username: "",
    password: "",
  });
  const { status, attemptRegister } = useRegister();
  const [registerError, setRegisterError] = useState<String | null>(null);
  const navigate = useNavigate();

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setRegisterError(null);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("submitting registration form w/:", formData);
    try {
      const result = await attemptRegister({
        email: formData.email.trim(),
        username: formData.username.trim(),
        password: formData.password,
      });
      console.log("registration result:", result);
      navigate("/login");
    } catch (err) {
      console.error("registrationError:", err);
      if (axios.isAxiosError(err)) {
        const errData = err.response?.data;
        const reason = errData?.reason;
        if (reason === "emailExists") {
          setRegisterError(emailExistsError);
        } else if (reason === "usernameExists") {
          setRegisterError(usernameExistsError);
        } else {
          setRegisterError(
            errData.message || "Unknown error while registering."
          );
        }
      }
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
      <h1>Register</h1>
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
        label="Username"
        name="username"
        value={formData.username}
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
      {registerError && <Alert severity="error">{registerError}</Alert>}
      <LoadingButton
        type="submit"
        variant="contained"
        loading={status === "loading"}
        disabled={status === "loading"}
      >
        Register
      </LoadingButton>
    </Box>
  );
};
