import {
  Autocomplete,
  Box,
  Dialog,
  ListItem,
  ListItemText,
  TextField,
} from "@mui/material";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useGetTmdbConfig, useSearchMovies } from "../api/utils";
import { MovieResultItem } from "@lorenzopant/tmdb";
import { MovieDetailsScreen } from "../movies/MovieDetailsScreen";

export const MovieSearch = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedMovie, setSelectedMovie] = useState<MovieResultItem | null>(
    null
  );

  const {
    result: searchResult,
    status: searchStatus,
    attemptSearch,
  } = useSearchMovies();
  const {
    result: tmdbConfig,
    status: configStatus,
    attemptConfig,
  } = useGetTmdbConfig();

  const performSearch = async (searchTerm: string) => {
    try {
      await attemptSearch(searchTerm);
    } catch (err) {
      console.error("search error:", err);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      performSearch(searchTerm);
    }, 400);

    return () => clearTimeout(timeout);
  }, [searchTerm]);

  useEffect(() => {
    attemptConfig();
  }, []);

  return (
    <>
      <Autocomplete
        onInputChange={(event, newValue) => {
          setSearchTerm(newValue);
        }}
        disabled={configStatus !== "success" || !!selectedMovie}
        loading={searchStatus === "loading"}
        options={searchResult || []}
        filterOptions={(x) => x}
        sx={{ width: 300 }}
        noOptionsText="Start typing to search for a movie."
        getOptionLabel={(movie) => movie.title}
        renderInput={(params) => <TextField {...params} label="Movie Search" />}
        renderOption={({ key, ...props }, option) => (
          <ListItem
            key={option.id}
            {...props}
            sx={{ gap: 2 }}
            onClick={() => {
              setSelectedMovie(option);
            }}
          >
            <Box
              component="img"
              sx={{ width: 92 }}
              src={`${tmdbConfig?.images.base_url}${tmdbConfig?.images.poster_sizes[0]}/${option.poster_path}`}
            />
            <ListItemText
              primary={`${option.title}${
                option.release_date
                  ? ` - (${format(option.release_date, "y")})`
                  : ""
              }`}
            />
          </ListItem>
        )}
      />
      <Dialog onClose={() => setSelectedMovie(null)} open={!!selectedMovie}>
        {selectedMovie && tmdbConfig && (
          <MovieDetailsScreen movie={selectedMovie} tmdbConfig={tmdbConfig} />
        )}
      </Dialog>
    </>
  );
};
