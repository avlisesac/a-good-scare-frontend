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
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

type RateButtonProps = {
  movieId: number;
  refetchAverage: (input: GetMovieRatingInput) => Promise<MovieRating>;
};

export const RateButton = ({ movieId, refetchAverage }: RateButtonProps) => {
  const { attemptRate, status } = useRateMovie();
  const { attemptGet, status: initialFetchStatus } = useGetUserRating();
  const buttonDisablingStatuses = [status, initialFetchStatus];
  const { user, loading: loadingUser } = useAuth();
  const [ratingToUse, setRatingToUse] = useState<UserRating | null>(null);

  const handleRateClick = async (rating: MovieRatingOptions) => {
    let finalRating: MovieRatingOptions = rating;
    const currentRating = ratingToUse?.rating;
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
      setRatingToUse(result);
      refetchAverage({ movieId });
    } catch (err) {
      console.error("rating error:", err);
    }
  };

  const initialFetch = async (userId: string) => {
    try {
      const result = await attemptGet({
        userId: userId,
        movieId,
      });
      setRatingToUse(result);
    } catch (err) {
      console.error("error with initial rating data fetch:", err);
    }
  };

  useEffect(() => {
    if (user) {
      initialFetch(user.id);
    }
  }, [user]);

  return (
    <ButtonGroup>
      <Button
        variant={ratingToUse?.rating === "pos" ? "contained" : "outlined"}
        disabled={buttonDisablingStatuses.includes("loading") || loadingUser}
        onClick={() => handleRateClick("pos")}
        startIcon={<ThumbUpIcon />}
      >
        Watch
      </Button>
      <Button
        variant={ratingToUse?.rating === "neg" ? "contained" : "outlined"}
        disabled={buttonDisablingStatuses.includes("loading") || loadingUser}
        onClick={() => handleRateClick("neg")}
        endIcon={<ThumbDownIcon />}
      >
        Skip
      </Button>
    </ButtonGroup>
  );
};
