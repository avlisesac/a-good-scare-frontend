import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { useNavigate } from "react-router";
import { useAsyncAction } from "./useAsyncAction";
import { MovieResultItem, TMDB, TMDBError } from "@lorenzopant/tmdb";
import { ConfigurationResponse } from "@lorenzopant/tmdb/dist/types/configuration";
import { useAuth } from "../context/AuthContext";

type RegistrationInput = {
  email: string;
  password: string;
};

type LoginInput = {
  email: string;
  password: string;
};

type DBDateFields = {
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
};

export type MovieRatingOptions = "pos" | "neg" | null;

export type MovieToUser = DBDateFields & {
  movieId: number;
  userId: string;
  wantToWatch?: boolean;
  seen?: boolean;
  rating?: MovieRatingOptions;
  review?: string;
  reviewContainsSpoiler?: boolean;
  flaggedAsNotHorror?: boolean;
};

export type GetMovieToUserInput = {
  movieId: number;
  userId: string;
};

export type RateMovieInput = {
  movieId: number;
  rating?: MovieRatingOptions;
};

type RegistrationResponse = {};
type LoginResponse = {};

const API_BASE = process.env.REACT_APP_API_URL ?? "";

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

export const useLogout = () => {
  const { user, loading, setUser } = useAuth();
  const navigate = useNavigate();

  const logout = (destination: string) => {
    setUser(null);
    navigate(destination);
  };

  return { logout };
};

const tmdb = new TMDB(process.env.REACT_APP_TMDB_ACCESS_TOKEN ?? "");

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
    url: "/api/auth/login",
    data: {
      ...input,
    },
  };
  const response = await api(configuration);
  return response;
};

export const callAuthEndpoint = async (): Promise<String> => {
  const configuration: AxiosRequestConfig = {
    method: "get",
    url: "/api/auth-endpoint",
  };
  const response = await api(configuration);
  return response.data.message;
};

export const searchMovies = async (
  query: string
): Promise<MovieResultItem[]> => {
  const response = await tmdb.search.movies({ query });
  return response.results;
};

export const getTmdbConfig = async (): Promise<ConfigurationResponse> => {
  const config = await tmdb.config.get();
  return config;
};

export const getMovieToUser = async ({
  movieId,
  userId,
}: GetMovieToUserInput): Promise<MovieToUser> => {
  const configuration: AxiosRequestConfig = {
    method: "get",
    url: `/api/rate/${movieId}/${userId}`,
  };

  const response = await api(configuration);
  return response.data;
};

export const rateMovie = async ({
  movieId,
  rating,
}: RateMovieInput): Promise<MovieToUser> => {
  const configuration: AxiosRequestConfig = {
    method: "post",
    url: `/api/rate/${movieId}`,
    data: {
      rating: rating,
    },
  };

  const response = await api(configuration);
  return response.data;
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
  const { execute, ...state } = useAsyncAction<void, String>(callAuthEndpoint);
  return { ...state, callAuthEndpoint: execute };
};

export const useSearchMovies = () => {
  const { execute, ...state } = useAsyncAction<string, MovieResultItem[]>(
    searchMovies
  );
  return { ...state, attemptSearch: execute };
};

export const useGetTmdbConfig = () => {
  const { execute, ...state } = useAsyncAction<void, ConfigurationResponse>(
    getTmdbConfig
  );
  return { ...state, attemptConfig: execute };
};

export const useGetMovieToUser = () => {
  const { execute, ...state } = useAsyncAction<
    GetMovieToUserInput,
    MovieToUser
  >(getMovieToUser);
  return { ...state, attemptGet: execute };
};

export const useRateMovie = () => {
  const { execute, ...state } = useAsyncAction<RateMovieInput, MovieToUser>(
    rateMovie
  );
  return { ...state, attemptRate: execute };
};
