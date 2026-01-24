import { Box, Button, ButtonGroup } from "@mui/material";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import {
  MovieRatingOptions,
  UserRating,
  RateMovieInput,
  useRateMovie,
  useGetUserRating,
  MovieRating,
  GetMovieRatingInput,
  GetAllReviewsForMovieInput,
  MovieReview,
} from "../api/utils";
import { Dispatch, SetStateAction } from "react";
import { AsyncActionStatus } from "../api/useAsyncAction";
import { LoadingButton } from "@mui/lab";

type RateButtonProps = {
  movieId: number;
  userRating: UserRating | null;
  setUserRating: Dispatch<SetStateAction<UserRating | null>>;
  loadingUser: boolean;
  fetchRatingStatus: AsyncActionStatus;
  refetchAverage: (input: GetMovieRatingInput) => Promise<MovieRating>;
  getAndSetMovieReviews: (movieId: number) => Promise<void>;
};

export const RateButton = ({
  movieId,
  refetchAverage,
  userRating,
  setUserRating,
  loadingUser,
  fetchRatingStatus,
  getAndSetMovieReviews,
}: RateButtonProps) => {
  const { attemptRate, status } = useRateMovie();
  const buttonDisablingStatuses = [status, fetchRatingStatus];

  const handleRateClick = async (rating: MovieRatingOptions) => {
    let finalRating: MovieRatingOptions = rating;
    const currentRating = userRating?.rating;
    if (currentRating && currentRating === rating) {
      finalRating = null;
    }
    try {
      const ratingInput: RateMovieInput = {
        movieId: movieId,
        rating: finalRating,
      };
      const result = await attemptRate(ratingInput);
      console.log("result:", result);
      setUserRating(result);
      refetchAverage({ movieId });
      getAndSetMovieReviews(movieId);
    } catch (err) {
      console.error("rating error:", err);
    }
  };

  return (
    <Box sx={{ display: "flex", gap: 1 }}>
      <LoadingButton
        variant={userRating?.rating === "pos" ? "contained" : "outlined"}
        disabled={loadingUser}
        loading={buttonDisablingStatuses.includes("loading")}
        onClick={() => handleRateClick("pos")}
        startIcon={<ThumbUpIcon />}
      >
        Watch
      </LoadingButton>
      <LoadingButton
        variant={userRating?.rating === "neg" ? "contained" : "outlined"}
        disabled={loadingUser}
        loading={buttonDisablingStatuses.includes("loading")}
        onClick={() => handleRateClick("neg")}
        endIcon={<ThumbDownIcon />}
      >
        Skip
      </LoadingButton>
    </Box>
  );
};
