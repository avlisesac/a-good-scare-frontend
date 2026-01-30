import { MovieDetails, MovieResultItem } from "@lorenzopant/tmdb";
import { ConfigurationResponse } from "@lorenzopant/tmdb/dist/types/configuration";
import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import { format } from "date-fns";
import { RateButton } from "../ui/RateButton";
import { OverallRating } from "../ui/OverallRating";
import { WatchlistButton } from "../ui/WatchlistButton";
import { MovieReviews } from "./MovieReviews";
import { useAuth } from "../context/AuthContext";
import { useMovieReviews } from "../api/reviews";
import { useMoviesAverateRating, useUsersRatingForMovie } from "../api/ratings";

export type MovieDetailsProps = {
  movie: MovieResultItem | MovieDetails;
  tmdbConfig: ConfigurationResponse;
};

export const MovieDetailsScreen = ({
  movie,
  tmdbConfig,
}: MovieDetailsProps) => {
  const { user, initialFetchLoading, authLoading } = useAuth();
  const { data: averageRating, isFetching: fetchingMoviesAverageRating } =
    useMoviesAverateRating({
      movieId: movie.id,
    });
  const {
    data: reviews,
    isFetching: fetchingAllReviews,
    isSuccess: allReviewsFetched,
  } = useMovieReviews({
    movieId: movie.id,
  });
  const { data: userRating, isFetching: fetchingUsersRatingForMovie } =
    useUsersRatingForMovie({ movieId: movie.id, userId: user?.id });
  const loadingUser = initialFetchLoading || authLoading;

  const loggedInUsersReview = reviews?.find(
    (review) => review.userId === user?.id
  );

  return (
    <Card sx={{ maxWidth: 500, maxHeight: "80%", overflow: "scroll", p: 2 }}>
      <WatchlistButton movieId={movie.id} />
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
          rating={averageRating?.average}
          loading={fetchingMoviesAverageRating}
        />
        <RateButton
          movieId={movie.id}
          user={user}
          userRating={userRating}
          loadingUser={loadingUser}
          fetchingUsersRatingForMovie={fetchingUsersRatingForMovie}
        />
        <Typography variant="body2" sx={{ paddingTop: 2 }}>
          {movie.overview}
        </Typography>
        <MovieReviews
          movieId={movie.id}
          userRating={userRating}
          fetchingAllReviews={fetchingAllReviews}
          allReviewsFetched={allReviewsFetched}
          loggedInUsersReview={loggedInUsersReview}
          movieReviews={reviews || []}
        />
      </CardContent>
    </Card>
  );
};
