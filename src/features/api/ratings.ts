import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, DBDateFields, MovieRatingOptions } from "./utils";
import { AxiosRequestConfig } from "axios";

export type GetAverageMovieRatingInput = {
  movieId: number;
};

export type AverageMovieRating = DBDateFields & {
  movieId: number;
  average: string;
};

export type UserRating = DBDateFields & {
  movieId: number;
  userId: string;
  rating?: MovieRatingOptions;
};

export type GetUserRatingInput = {
  movieId: number;
  userId?: string;
};

export type RateMovieInput = {
  movieId: number;
  userId: string;
  rating?: MovieRatingOptions;
};

export const getAverageMovieRating = async ({
  movieId,
}: GetAverageMovieRatingInput): Promise<AverageMovieRating> => {
  const configuration: AxiosRequestConfig = {
    method: "get",
    url: `/api/rating/${movieId}`,
  };

  const response = await api(configuration);
  return response.data;
};

export const getUsersRatingForMovie = async ({
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

export const useMoviesAverateRating = (input: GetAverageMovieRatingInput) => {
  return useQuery<AverageMovieRating>({
    queryKey: ["average-rating", input.movieId],
    queryFn: () => getAverageMovieRating(input),
  });
};

export const useUsersRatingForMovie = (input: GetUserRatingInput) => {
  return useQuery<UserRating>({
    queryKey: ["user-rating", input.movieId, input.userId],
    queryFn: () => getUsersRatingForMovie(input),
    enabled: !!input.userId,
  });
};

export const useRateMovie = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: RateMovieInput) => rateMovie(input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["average-rating", variables.movieId],
      });
      queryClient.invalidateQueries({
        queryKey: ["user-rating", variables.movieId, variables.userId],
      });
      queryClient.invalidateQueries({
        queryKey: ["movie-reviews", variables.movieId],
      });
    },
  });
};
