import { Alert, Box, Button, TextField } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { ChangeEvent, FormEventHandler, useState } from "react";
import { useRegister } from "../api/utils";
import { useNavigate } from "react-router";

type RegistrationFormData = {
  email: string;
  password: string;
};

export const Register = () => {
  const [formData, setFormData] = useState<RegistrationFormData>({
    email: "",
    password: "",
  });
  const { status, err, result, attemptRegister } = useRegister();
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
        email: formData.email,
        password: formData.password,
      });
      navigate("/login");
    } catch (err) {
      setRegisterError(err as String);
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
