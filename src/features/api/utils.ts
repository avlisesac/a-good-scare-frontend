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
export type WatchlistEntryAction = "add" | "remove";

export type UserRating = DBDateFields & {
  movieId: number;
  userId: string;
  rating?: MovieRatingOptions;
};

export type UpdateWatchlistEntryInput = {
  movieId: number;
  action: WatchlistEntryAction;
};

export type GetWatchlistEntryInput = {
  movieId: number;
};

export type WatchlistEntry = DBDateFields & {
  movieId: number;
  toWatch?: boolean;
};

export type MovieRating = DBDateFields & {
  movieId: number;
  average: string;
};

export type GetUserRatingInput = {
  movieId: number;
  userId: string;
};

export type GetMovieRatingInput = {
  movieId: number;
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

export const getUserRating = async ({
  movieId,
  userId,
}: GetUserRatingInput): Promise<UserRating> => {
  const configuration: AxiosRequestConfig = {
    method: "get",
    url: `/api/rating/${movieId}/${userId}`,
  };

  const response = await api(configuration);
  return response.data;
};

export const getWatchlistEntry = async ({
  movieId,
}: GetWatchlistEntryInput): Promise<WatchlistEntry> => {
  const configuration: AxiosRequestConfig = {
    method: "get",
    url: `/api/watchlist/${movieId}`,
  };

  const response = await api(configuration);
  return response.data;
};

export const getMovieRating = async ({
  movieId,
}: GetMovieRatingInput): Promise<MovieRating> => {
  const configuration: AxiosRequestConfig = {
    method: "get",
    url: `/api/rating/${movieId}`,
  };

  const response = await api(configuration);
  return response.data;
};

export const rateMovie = async ({
  movieId,
  rating,
}: RateMovieInput): Promise<UserRating> => {
  const configuration: AxiosRequestConfig = {
    method: "post",
    url: `/api/rating/${movieId}`,
    data: {
      rating: rating,
    },
  };

  const response = await api(configuration);
  return response.data;
};

export const updateWatchlistEntry = async ({
  movieId,
  action,
}: UpdateWatchlistEntryInput): Promise<WatchlistEntry> => {
  const configuration: AxiosRequestConfig = {
    method: "post",
    url: `/api/watchlist/${movieId}/${action}`,
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

export const useGetUserRating = () => {
  const { execute, ...state } = useAsyncAction<GetUserRatingInput, UserRating>(
    getUserRating
  );
  return { ...state, attemptGet: execute };
};

export const useRateMovie = () => {
  const { execute, ...state } = useAsyncAction<RateMovieInput, UserRating>(
    rateMovie
  );
  return { ...state, attemptRate: execute };
};

export const useGetMovieRating = () => {
  const { execute, ...state } = useAsyncAction<
    GetMovieRatingInput,
    MovieRating
  >(getMovieRating);
  return { ...state, attemptGet: execute };
};

export const useUpdateWatchlistEntry = () => {
  const { execute, ...state } = useAsyncAction<
    UpdateWatchlistEntryInput,
    WatchlistEntry
  >(updateWatchlistEntry);
  return { ...state, attemptUpdate: execute };
};

export const useGetWatchlistEntry = () => {
  const { execute, ...state } = useAsyncAction<
    GetWatchlistEntryInput,
    WatchlistEntry
  >(getWatchlistEntry);
  return { ...state, attemptGet: execute };
};
