import { useState } from "react";
import { MovieCard } from "../ui/MovieCard";
import { CircularProgress, Dialog, Grid, Typography } from "@mui/material";
import { MovieDetails } from "@lorenzopant/tmdb";
import { MovieDetailsScreen } from "../movies/MovieDetailsScreen";
import { useTMDBConfig } from "../context/TMDBConfigContext";
import { useWatchlist } from "../api/watchlist";

export const Watchlist = () => {
  const { data: watchlist, isPending } = useWatchlist();
  const [selectedMovie, setSelectedMovie] = useState<MovieDetails | null>(null);
  const { tmdbConfig, loading: tmdbConfigLoading } = useTMDBConfig();

  if (isPending) {
    return <CircularProgress />;
  }

  return (
    <>
      <Typography variant="h1">Watchlist</Typography>
      {watchlist?.length === 0 && <h2>Your watchlist is currently empty</h2>}
      {watchlist && watchlist.length > 0 && (
        <Grid container spacing={2}>
          {watchlist.map((entry) => (
            <MovieCard
              movieId={entry.movieId}
              key={entry.movieId}
              setSelectedMovie={setSelectedMovie}
              tmdbConfigLoading={tmdbConfigLoading}
              tmdbConfig={tmdbConfig}
            />
          ))}
        </Grid>
      )}
      <Dialog onClose={() => setSelectedMovie(null)} open={!!selectedMovie}>
        {selectedMovie && tmdbConfig && (
          <MovieDetailsScreen movie={selectedMovie} tmdbConfig={tmdbConfig} />
        )}
      </Dialog>
    </>
  );
};
