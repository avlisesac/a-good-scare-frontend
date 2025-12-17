import axios, { AxiosRequestConfig } from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";
import Cookies from "universal-cookie";

type ApiStatus = "idle" | "loading" | "success" | "error";

type RegistrationInput = {
  email: string;
  password: string;
};

type LoginInput = {
  email: string;
  password: string;
};

type RegistrationResponse = {};
type LoginResponse = {};

const cookies = new Cookies();

const API_BASE = process.env.REACT_APP_API_URL ?? "";

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

export const useRegister = () => {
  const [status, setStatus] = useState<ApiStatus>("idle");
  const [data, setData] = useState<RegistrationResponse>();
  const [errMessage, setErrMessage] = useState("");
  const navigate = useNavigate();

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
      const response = await api(configuration);
      console.log("response:", response);
      setStatus("success");
      setData(data);
      navigate("/login");
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

export const useLogin = () => {
  const [status, setStatus] = useState<ApiStatus>("idle");
  const [data, setData] = useState<LoginResponse>();
  const [errMessage, setErrMessage] = useState("");
  const navigate = useNavigate();

  const attemptLogin = async (input: LoginInput) => {
    const configuration: AxiosRequestConfig = {
      method: "post",
      url: "/api/login",
      data: {
        ...input,
      },
    };
    try {
      setStatus("loading");
      const response = await api(configuration);
      console.log("response:", response);
      setStatus("success");
      setData(response);
      cookies.set("TOKEN", response.data.token, { path: "/" });
      navigate("/");
    } catch (error) {
      setStatus("error");
      console.error("error:", error);
      if (axios.isAxiosError(error)) {
        setErrMessage(error.message);
      } else {
        setErrMessage("An unknown error occured during login.");
      }
    }
  };

  return {
    status,
    data,
    errMessage,
    attemptLogin,
  };
};

export const useAuthEndpoint = () => {
  const [status, setStatus] = useState<ApiStatus>("idle");
  const [data, setData] = useState<string>();
  const [errMessage, setErrMessage] = useState("");

  const callAuthEndpoint = async (token: String) => {
    const configuration: AxiosRequestConfig = {
      method: "get",
      url: "/api/auth-endpoint",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      setStatus("loading");
      setErrMessage("");
      setData(undefined);
      const response = await api(configuration);
      console.log("response:", response);
      setStatus("success");
      setData(response.data.message);
    } catch (error) {
      setStatus("error");
      console.error("error:", error);
      if (axios.isAxiosError(error)) {
        setErrMessage(error.message);
      } else {
        setErrMessage("An unknown error occured during login.");
      }
    }
  };

  return {
    status,
    data,
    errMessage,
    callAuthEndpoint,
  };
};
