import { useEffect, useState } from "react";
import { useGetFullWatchlist, WatchlistEntry } from "../api/utils";
import { MovieCard } from "../ui/MovieCard";
import { CircularProgress, Dialog, Grid, Typography } from "@mui/material";
import { MovieDetails } from "@lorenzopant/tmdb";
import { MovieDetailsScreen } from "../movies/MovieDetailsScreen";
import { useTMDBConfig } from "../context/TMDBConfigContext";

export const Watchlist = () => {
  const [watchlist, setWatchlist] = useState<WatchlistEntry[]>([]);
  const { status, attemptGet } = useGetFullWatchlist();
  const [selectedMovie, setSelectedMovie] = useState<MovieDetails | null>(null);
  const { tmdbConfig, loading: tmdbConfigLoading } = useTMDBConfig();

  const fetchAndSetWatchlist = async () => {
    try {
      const result = await attemptGet();
      if (result) {
        setWatchlist(result);
        setSelectedMovie(null);
      }
    } catch (err) {
      console.error("error with initial watchlist fetch:", err);
    }
  };

  useEffect(() => {
    fetchAndSetWatchlist();
  }, []);

  if (status === "loading") {
    return <CircularProgress />;
  }

  return (
    <>
      <Typography variant="h1">Watchlist</Typography>
      {watchlist.length === 0 && <h2>Your watchlist is currently empty</h2>}
      {watchlist.length > 0 && (
        <Grid container spacing={2}>
          {watchlist.map((entry) => (
            <MovieCard
              movieId={entry.movieId}
              key={entry.movieId}
              fetchAndSetWatchlist={fetchAndSetWatchlist}
              setSelectedMovie={setSelectedMovie}
              tmdbConfigLoading={tmdbConfigLoading}
              tmdbConfig={tmdbConfig}
            />
          ))}
        </Grid>
      )}
      <Dialog onClose={() => setSelectedMovie(null)} open={!!selectedMovie}>
        {selectedMovie && tmdbConfig && (
          <MovieDetailsScreen
            movie={selectedMovie}
            tmdbConfig={tmdbConfig}
            fetchAndSetWatchlist={fetchAndSetWatchlist}
          />
        )}
      </Dialog>
    </>
  );
};
