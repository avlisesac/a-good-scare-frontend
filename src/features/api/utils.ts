import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useAsyncAction } from "./useAsyncAction";

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

const API_BASE = process.env.REACT_APP_API_URL ?? "";

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

export const register = async (
  input: RegistrationInput
): Promise<RegistrationResponse> => {
  const configuration: AxiosRequestConfig = {
    method: "post",
    url: "/api/register",
    data: {
      ...input,
    },
  };
  const response = await api(configuration);
  return response;
};

export const login = async (input: LoginInput): Promise<AxiosResponse> => {
  const configuration: AxiosRequestConfig = {
    method: "post",
    url: "/api/login",
    data: {
      ...input,
    },
  };
  const response = await api(configuration);
  return response;
};

export const callAuthEndpoint = async (input: String): Promise<String> => {
  const configuration: AxiosRequestConfig = {
    method: "get",
    url: "/api/auth-endpoint",
    headers: {
      Authorization: `Bearer ${input}`,
    },
  };
  const response = await api(configuration);
  return response.data.message;
};

export const useLogin = () => {
  const { execute, ...state } = useAsyncAction<LoginInput, AxiosResponse>(
    login
  );
  return { ...state, attemptLogin: execute };
};

export const useRegister = () => {
  const { execute, ...state } = useAsyncAction<
    RegistrationInput,
    RegistrationResponse
  >(register);
  return { ...state, attemptRegister: execute };
};

export const useAuthEndpoint = () => {
  const { execute, ...state } = useAsyncAction<String, String>(
    callAuthEndpoint
  );
  return { ...state, callAuthEndpoint: execute };
};
