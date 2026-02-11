import { Alert, Box, Button, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { RegistrationInput, useRegister } from "../api/utils";
import { useNavigate } from "react-router";
import axios from "axios";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";

const emailExistsError = "This email address is already in use.";
const usernameExistsError = "This username is already in use.";

export const Register = () => {
  const {
    register,
    handleSubmit,
    getValues,
    watch,
    trigger,
    formState: { errors, isSubmitted },
  } = useForm<RegistrationInput>({
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const username = watch("username");
  const email = watch("email");

  const { status, attemptRegister } = useRegister();
  const [registerError, setRegisterError] = useState<String | null>(null);
  const navigate = useNavigate();

  // TODO - move registration actions to tanstack
  const submit = async (data: RegistrationInput) => {
    try {
      const result = await attemptRegister({
        email: data.email.trim(),
        username: data.username.trim(),
        password: data.password,
      });
      console.log("registration result:", result);
      toast.success(
        "Registration successful! Please log in with your new account.",
      );
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
            errData.message || "Unknown error while registering.",
          );
        }
      }
    }
  };

  useEffect(() => {
    if (errors.password) {
      trigger("password");
    }
  }, [username, email, isSubmitted, trigger]);

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(submit)}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        width: "200px",
      }}
    >
      <Typography variant="h1">Register</Typography>
      <TextField
        label="Email"
        type="email"
        {...register("email", {
          required: "Email is required.",
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Please enter a valid email address.",
          },
        })}
        disabled={status === "loading"}
        fullWidth
        required
      />
      {errors.email && <Alert severity="error">{errors.email.message}</Alert>}
      <TextField
        label="Username"
        {...register("username", {
          required: "Username is required.",
          minLength: {
            value: 3,
            message: "Username must be between 3 and 30 characters.",
          },
          maxLength: {
            value: 30,
            message: "Username must be between 3 and 30 characters.",
          },
          pattern: {
            value: /^[a-zA-Z][a-zA-Z0-9._-]*$/,
            message: `Username may only consist of letters, numbers, and special the special characters "_", "-", and "." It may not contain spaces or start or end with a special character.`,
          },
        })}
        disabled={status === "loading"}
        fullWidth
        required
      />
      {errors.username && (
        <Alert severity="error">{errors.username.message}</Alert>
      )}
      <TextField
        label="Password"
        type="password"
        {...register("password", {
          required: "Password is required",
          minLength: {
            value: 8,
            message: "Password must be at least 8 characters.",
          },
          maxLength: {
            value: 128,
            message: "Password cannot be longer than 128 characters.",
          },
          deps: ["email", "username"],
          validate: {
            notSameAsEmailOrUsername: (val) => {
              const { email, username } = getValues();
              if (!email || !username) return true;

              if (val === email) {
                return "Password cannot be the same as your email.";
              }

              if (val === username) {
                return "Password cannot be the same as your username.";
              }
            },
          },
        })}
        disabled={status === "loading"}
        fullWidth
        required
      />
      {errors.password && (
        <Alert severity="error">{errors.password.message}</Alert>
      )}
      {registerError && <Alert severity="error">{registerError}</Alert>}
      <Button
        type="submit"
        variant="contained"
        loading={status === "loading"}
        loadingPosition="start"
      >
        Register
      </Button>
    </Box>
  );
};
