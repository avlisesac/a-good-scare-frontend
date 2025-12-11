import axios, { AxiosRequestConfig } from "axios";
import { useState } from "react";

type ApiStatus = "idle" | "loading" | "completed" | "error";

type RegistrationInput = {
  email: string;
  password: string;
};

type RegistrationResponse = {};

export const useRegister = () => {
  const [status, setStatus] = useState<ApiStatus>("idle");
  const [data, setData] = useState<RegistrationResponse>();
  const [errMessage, setErrMessage] = useState("");

  const attemptRegister = async (input: RegistrationInput) => {
    const configuration: AxiosRequestConfig = {
      method: "post",
      url: "/api/register",
      data: {
        ...input,
      },
    };
    try {
      setStatus("loading");
      const response = await axios(configuration);
      console.log("response:", response);
      setStatus("completed");
      setData(data);
    } catch (error) {
      setStatus("error");
      console.error("error:", error);
      if (axios.isAxiosError(error)) {
        setErrMessage(error.message);
      } else {
        setErrMessage("An unknown error occured during registration.");
      }
    }
  };

  return {
    status,
    data,
    errMessage,
    attemptRegister,
  };
};
