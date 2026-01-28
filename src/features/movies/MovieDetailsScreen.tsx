import { MovieDetails, MovieResultItem } from "@lorenzopant/tmdb";
import { ConfigurationResponse } from "@lorenzopant/tmdb/dist/types/configuration";
import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import { format } from "date-fns";
import { RateButton } from "../ui/RateButton";
import {
  MovieReview,
  useGetAllReviewsForMovie,
  useGetMovieRating,
  useGetUserRating,
  UserRating,
} from "../api/utils";
import { useEffect, useState } from "react";
import { OverallRating } from "../ui/OverallRating";
import { WatchlistButton } from "../ui/WatchlistButton";
import { MovieReviews } from "./MovieReviews";
import { useAuth } from "../context/AuthContext";

export type MovieDetailsProps = {
  movie: MovieResultItem | MovieDetails;
  tmdbConfig: ConfigurationResponse;
  fetchAndSetWatchlist?: () => Promise<void>;
};

export const MovieDetailsScreen = ({
  movie,
  tmdbConfig,
  fetchAndSetWatchlist,
}: MovieDetailsProps) => {
  const { result, status, attemptGet: attemptGetRating } = useGetMovieRating();
  const { attemptGet: attemptGetReviews, status: getAllReviewsStatus } =
    useGetAllReviewsForMovie();
  const { status: getUserRatingStatus, attemptGet: attemptGetUserRating } =
    useGetUserRating();
  const { user, initialFetchLoading, authLoading } = useAuth();
  const loadingUser = initialFetchLoading || authLoading;
  const [userRating, setUserRating] = useState<UserRating | null>(null);
  const [movieReviews, setMovieReviews] = useState<MovieReview[]>([]);
  const [loggedInUsersReview, setLoggedInUsersReview] = useState<MovieReview>();

  const userRatingFetch = async (userId: string) => {
    try {
      const result = await attemptGetUserRating({
        userId: userId,
        movieId: movie.id,
      });
      setUserRating(result);
    } catch (err) {
      console.error("error with initial rating data fetch:", err);
    }
  };

  const getAndSetMovieReviews = async (movieId: number) => {
    try {
      const result = await attemptGetReviews({ movieId });
      console.log("reviews:", result);
      const loggedInUsersReview = result?.find(
        (review) => review.userId === user?.id
      );
      console.log("loggedInUsersReview:", loggedInUsersReview);
      setLoggedInUsersReview(loggedInUsersReview);
      setMovieReviews(result);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user) {
      userRatingFetch(user.id);
    }
  }, [user]);

  useEffect(() => {
    console.log("result:", result);
  }, [result]);

  useEffect(() => {
    attemptGetRating({
      movieId: movie.id,
    });
    getAndSetMovieReviews(movie.id);
  }, []);

  return (
    <Card sx={{ maxWidth: 500, maxHeight: "80%", overflow: "scroll", p: 2 }}>
      <WatchlistButton
        movieId={movie.id}
        postUpdateAction={fetchAndSetWatchlist}
      />
      <CardMedia
        component="img"
        sx={{ width: 154 }}
        src={`${tmdbConfig.images.base_url}${tmdbConfig.images.poster_sizes[1]}/${movie.poster_path}`}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component={"div"}>
          {movie.title}
        </Typography>
        {movie.release_date && (
          <Typography variant="h6">
            {format(movie.release_date, "y")}
          </Typography>
        )}
        <OverallRating
          rating={result?.average}
          loading={status === "loading"}
        />
        <RateButton
          movieId={movie.id}
          refetchAverage={attemptGetRating}
          userRating={userRating}
          setUserRating={setUserRating}
          loadingUser={loadingUser}
          fetchRatingStatus={getUserRatingStatus}
          getAndSetMovieReviews={getAndSetMovieReviews}
        />
        <Typography variant="body2" sx={{ paddingTop: 2 }}>
          {movie.overview}
        </Typography>
        <MovieReviews
          movieId={movie.id}
          userRating={userRating}
          getAllReviewsStatus={getAllReviewsStatus}
          loggedInUsersReview={loggedInUsersReview}
          movieReviews={movieReviews}
          attemptGetReviews={attemptGetReviews}
          getAndSetMovieReviews={getAndSetMovieReviews}
        />
      </CardContent>
    </Card>
  );
};
