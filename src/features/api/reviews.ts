import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, DBDateFields, MovieRatingOptions } from "./utils";
import { AxiosRequestConfig } from "axios";

export type GetAllReviewsForMovieInput = {
  movieId: number;
};

export type MovieReview = DBDateFields & {
  id: string;
  reviewText: string;
  reviewContainsSpoiler: boolean | null;
  userId: string;
  username: string;
  rating: MovieRatingOptions;
};

export type SubmitReviewInput = {
  movieId: number;
  review: string;
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

export const useMovieReviews = (input: GetAllReviewsForMovieInput) => {
  return useQuery<MovieReview[]>({
    queryKey: ["movie-reviews", input.movieId],
    queryFn: () => getAllReviewsForMovie(input),
  });
};

export const useSubmitMovieReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: SubmitReviewInput) => submitReview(input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["movie-reviews", variables.movieId],
      });
    },
  });
};
