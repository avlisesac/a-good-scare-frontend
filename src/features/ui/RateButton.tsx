import { Box, Button } from "@mui/material";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { MovieRatingOptions } from "../api/utils";
import { RateMovieInput, useRateMovie, UserRating } from "../api/ratings";
import { User } from "../../types/User";
import toast from "react-hot-toast";
import { QueryStatus } from "@tanstack/react-query";

type RateButtonProps = {
  movieId: number;
  userRating?: UserRating;
  user?: User | null;
  loadingUser: boolean;
  fetchingUsersRatingForMovie: boolean;
};

export const RateButton = ({
  movieId,
  userRating,
  user,
  loadingUser,
  fetchingUsersRatingForMovie,
}: RateButtonProps) => {
  const { mutateAsync, isPending: ratingPending } = useRateMovie();

  const anyApiLoading = fetchingUsersRatingForMovie || ratingPending;

  const handleRateClick = async (rating: MovieRatingOptions) => {
    if (!user) {
      toast.error("You must be logged in to rate a movie!");
      return;
    }
    let finalRating: MovieRatingOptions = rating;
    const currentRating = userRating?.rating;
    if (currentRating && currentRating === rating) {
      finalRating = null;
    }
    try {
      const ratingInput: RateMovieInput = {
        movieId: movieId,
        rating: finalRating,
        userId: user.id,
      };
      await mutateAsync(ratingInput);
    } catch (err) {
      console.error("rating error:", err);
    }
  };

  return (
    <Box sx={{ display: "flex", gap: 1 }}>
      <Button
        variant={userRating?.rating === "pos" ? "contained" : "outlined"}
        disabled={loadingUser}
        loading={anyApiLoading}
        loadingPosition="start"
        onClick={() => handleRateClick("pos")}
        startIcon={<ThumbUpIcon />}
      >
        Watch
      </Button>
      <Button
        variant={userRating?.rating === "neg" ? "contained" : "outlined"}
        disabled={loadingUser}
        loading={anyApiLoading}
        loadingPosition="start"
        onClick={() => handleRateClick("neg")}
        endIcon={<ThumbDownIcon />}
      >
        Skip
      </Button>
    </Box>
  );
};
