import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { useAsyncAction } from "./useAsyncAction";
import { MovieDetails, MovieResultItem, TMDB } from "@lorenzopant/tmdb";
import { ConfigurationResponse } from "@lorenzopant/tmdb/dist/types/configuration";

export type RegistrationInput = {
  email: string;
  username: string;
  password: string;
};

export type LoginInput = {
  idField: string;
  password: string;
};

export type DBDateFields = {
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
};

export type MovieRatingOptions = "pos" | "neg" | null;

type RegistrationResponse = {};

const API_BASE = process.env.REACT_APP_API_URL ?? "";

export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

console.log("api base url:", api.defaults.baseURL);

const tmdb = new TMDB(process.env.REACT_APP_TMDB_ACCESS_TOKEN ?? "");

export const register = async (
  input: RegistrationInput
): Promise<RegistrationResponse> => {
  const configuration: AxiosRequestConfig = {
    method: "post",
    url: "/api/auth/register",
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
    url: "/api/auth/login",
    data: {
      ...input,
    },
  };
  const response = await api(configuration);
  return response;
};

export const searchMovies = async (
  query: string
): Promise<MovieResultItem[]> => {
  const response = await tmdb.search.movies({ query });
  return response.results;
};

export const getTmdbMovieDetails = async (
  movieId: number
): Promise<MovieDetails> => {
  const response = await tmdb.movies.details({ movie_id: movieId });
  return response;
};

export const getTmdbConfig = async (): Promise<ConfigurationResponse> => {
  const config = await tmdb.config.get();
  return config;
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

export const useSearchMovies = () => {
  const { execute, ...state } = useAsyncAction<string, MovieResultItem[]>(
    searchMovies
  );
  return { ...state, attemptSearch: execute };
};

export const useGetTmdbDetails = () => {
  const { execute, ...state } = useAsyncAction<number, MovieDetails>(
    getTmdbMovieDetails
  );
  return { ...state, attemptGet: execute };
};

export const useGetTmdbConfig = () => {
  const { execute, ...state } = useAsyncAction<void, ConfigurationResponse>(
    getTmdbConfig
  );
  return { ...state, attemptConfig: execute };
};

export const extractAxiosErrorMessage = (err: any) => {
  if (axios.isAxiosError(err)) {
    return err.response?.data.message;
  }
  return null;
};
