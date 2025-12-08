import { Box, Button, TextField } from "@mui/material";
import { ChangeEvent, FormEventHandler, useState } from "react";

type RegistrationFormData = {
  email: string;
  password: string;
};

export const RegistrationForm = () => {
  const [formData, setFormData] = useState<RegistrationFormData>({
    email: "",
    password: "",
  });

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("submitting registration form w/:", formData);
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
        fullWidth
        required
      />
      <TextField
        label="Password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        fullWidth
        required
      />
      <Button type="submit" variant="contained">
        Register
      </Button>
    </Box>
  );
};
