import { useEffect, useState } from "react";
import { MovieCard } from "../ui/MovieCard";
import { CircularProgress, Dialog, Grid, Typography } from "@mui/material";
import { MovieDetails } from "@lorenzopant/tmdb";
import { MovieDetailsScreen } from "../movies/MovieDetailsScreen";
import { useTMDBConfig } from "../context/TMDBConfigContext";
import { useWatchlist } from "../api/watchlist";
import { useAuth } from "../context/AuthContext";

export const Watchlist = () => {
  const { user, authLoading, initialFetchLoading } = useAuth();
  const canFetchWatchlist = !!user && !authLoading && !initialFetchLoading;

  const { data: watchlist, isLoading } = useWatchlist(canFetchWatchlist);
  const [selectedMovie, setSelectedMovie] = useState<MovieDetails | null>(null);
  const { tmdbConfig, loading: tmdbConfigLoading } = useTMDBConfig();

  useEffect(() => {
    const handler = () => setSelectedMovie(null);
    window.addEventListener("auth:expired", handler);
    return () => window.removeEventListener("auth:expired", handler);
  }, []);

  if (isLoading) {
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
