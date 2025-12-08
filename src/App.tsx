import React, { useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import axios, {
  AxiosResponse,
  AxiosError,
  AxiosRequestConfig,
  RawAxiosRequestHeaders,
} from "axios";
import { RegistrationForm } from "./features/registration/RegistrationForm";
import { Box } from "@mui/material";

const makeAxiosCall = async () => {
  try {
    console.log("attempting axios call...");
    const response = await axios.get("/api/users");
    console.log("response:", response);
  } catch (error) {
    console.error("error:", error);
  }
};

const App = () => {
  useEffect(() => {
    // makeAxiosCall();
  }, []);

  return (
    <Box
      className="App"
      sx={{
        display: "flex",
        width: "100%",
        height: "100vh",
        flex: "1",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <RegistrationForm />
    </Box>
  );
};

export default App;
