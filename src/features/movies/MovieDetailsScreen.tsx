import { MovieDetails, MovieResultItem } from "@lorenzopant/tmdb";
import { ConfigurationResponse } from "@lorenzopant/tmdb/dist/types/configuration";
import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import { format } from "date-fns";
import { RateButton } from "../ui/RateButton";
import { useGetMovieRating } from "../api/utils";
import { SetStateAction, useEffect } from "react";
import { OverallRating } from "../ui/OverallRating";
import { WatchlistButton } from "../ui/WatchlistButton";

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
  const { result, status, attemptGet } = useGetMovieRating();

  useEffect(() => {
    console.log("result:", result);
  }, [result]);

  useEffect(() => {
    attemptGet({
      movieId: movie.id,
    });
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
        <RateButton movieId={movie.id} refetchAverage={attemptGet} />
        <Typography
          variant="body2"
          sx={{ color: "text.secondary", paddingTop: 2 }}
        >
          {movie.overview}
        </Typography>
      </CardContent>
    </Card>
  );
};
