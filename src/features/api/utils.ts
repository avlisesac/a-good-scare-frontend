import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { useNavigate } from "react-router";
import { useAsyncAction } from "./useAsyncAction";
import {
  MovieDetails,
  MovieResultItem,
  TMDB,
  TMDBError,
} from "@lorenzopant/tmdb";
import { ConfigurationResponse } from "@lorenzopant/tmdb/dist/types/configuration";
import { useAuth } from "../context/AuthContext";

export type RegistrationInput = {
  email: string;
  username: string;
  password: string;
};

export type LoginInput = {
  idField: string;
  password: string;
};

type DBDateFields = {
  createdAt: string;
  updatedAt: string;
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

export type MovieReview = DBDateFields & {
  id: string;
  reviewText: string;
  reviewContainsSpoiler: boolean | null;
  userId: string;
  username: string;
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

export type GetAllReviewsForMovieInput = {
  movieId: number;
};

export type RateMovieInput = {
  movieId: number;
  rating?: MovieRatingOptions;
};

export type SubmitReviewInput = {
  movieId: number;
  review: string;
};

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

export const getAllReviewsForMovie = async ({
  movieId,
}: GetAllReviewsForMovieInput): Promise<MovieReview[]> => {
  const configuration: AxiosRequestConfig = {
    method: "get",
    url: `/api/review/${movieId}`,
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

export const getFullWatchlist = async (): Promise<WatchlistEntry[]> => {
  const configuration: AxiosRequestConfig = {
    method: "get",
    url: `/api/watchlist`,
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

export const submitReview = async ({
  movieId,
  review,
}: SubmitReviewInput): Promise<MovieReview> => {
  const configuration: AxiosRequestConfig = {
    method: "post",
    url: `/api/review/${movieId}`,
    data: {
      review: review,
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

export const useGetFullWatchlist = () => {
  const { execute, ...state } = useAsyncAction<void, WatchlistEntry[]>(
    getFullWatchlist
  );
  return { ...state, attemptGet: execute };
};

export const useGetAllReviewsForMovie = () => {
  const { execute, ...state } = useAsyncAction<
    GetAllReviewsForMovieInput,
    MovieReview[]
  >(getAllReviewsForMovie);
  return { ...state, attemptGet: execute };
};

export const useSubmitReview = () => {
  const { execute, ...state } = useAsyncAction<SubmitReviewInput, MovieReview>(
    submitReview
  );
  return { ...state, attemptReview: execute };
};

export const extractAxiosErrorMessage = (err: any) => {
  if (axios.isAxiosError(err)) {
    return err.response?.data.message;
  }
  return null;
};
