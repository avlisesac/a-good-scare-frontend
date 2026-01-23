import { Button, ButtonGroup } from "@mui/material";
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
} from "../api/utils";
import { Dispatch, SetStateAction } from "react";
import { AsyncActionStatus } from "../api/useAsyncAction";

type RateButtonProps = {
  movieId: number;
  userRating: UserRating | null;
  setUserRating: Dispatch<SetStateAction<UserRating | null>>;
  loadingUser: boolean;
  fetchRatingStatus: AsyncActionStatus;
  refetchAverage: (input: GetMovieRatingInput) => Promise<MovieRating>;
};

export const RateButton = ({
  movieId,
  refetchAverage,
  userRating,
  setUserRating,
  loadingUser,
  fetchRatingStatus,
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
    } catch (err) {
      console.error("rating error:", err);
    }
  };

  return (
    <ButtonGroup>
      <Button
        variant={userRating?.rating === "pos" ? "contained" : "outlined"}
        disabled={buttonDisablingStatuses.includes("loading") || loadingUser}
        onClick={() => handleRateClick("pos")}
        startIcon={<ThumbUpIcon />}
      >
        Watch
      </Button>
      <Button
        variant={userRating?.rating === "neg" ? "contained" : "outlined"}
        disabled={buttonDisablingStatuses.includes("loading") || loadingUser}
        onClick={() => handleRateClick("neg")}
        endIcon={<ThumbDownIcon />}
      >
        Skip
      </Button>
    </ButtonGroup>
  );
};
