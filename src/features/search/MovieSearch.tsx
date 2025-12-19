import { MovieResultItem, TMDB, TMDBError } from "@lorenzopant/tmdb";
import { ConfigurationResponse } from "@lorenzopant/tmdb/dist/types/configuration";
import {
  Autocomplete,
  Box,
  ListItem,
  ListItemText,
  TextField,
} from "@mui/material";
import { format } from "date-fns";
import { useEffect, useState } from "react";

const tmdb = new TMDB(process.env.REACT_APP_TMDB_ACCESS_TOKEN ?? "");

export const MovieSearch = () => {
  const [matchingMovies, setMatchingMovies] = useState<MovieResultItem[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [tmdbConfig, setTmdbConfig] = useState<ConfigurationResponse>();

  const getTMDBConfig = async () => {
    try {
      const tmdbConfig = await tmdb.config.get();
      console.log("tmdbConfig:", tmdbConfig);
      setTmdbConfig(tmdbConfig);
    } catch (err) {
      console.error(err);
    }
  };

  const searchMovies = async (searchTerm: string) => {
    try {
      console.log("searching w/ term:", searchTerm);
      const movies = await tmdb.search.movies({
        query: searchTerm,
      });
      console.log("movies:", movies);
      setMatchingMovies(movies.results);
    } catch (error) {
      if (error instanceof TMDBError) {
        console.error("TMDB Error:", error.message);
        console.error("HTTP Status:", error.http_status_code);
        console.error("TMDB Status Code:", error.tmdb_status_code);
      } else {
        console.error("Unknown error:", error);
      }
    }
  };

  useEffect(() => {
    if (!searchTerm) {
      setMatchingMovies([]);
      return;
    }

    const timeout = setTimeout(() => {
      searchMovies(searchTerm);
    }, 400);

    return () => clearTimeout(timeout);
  }, [searchTerm]);

  useEffect(() => {
    getTMDBConfig();
  }, []);

  return (
    <>
      <Autocomplete
        onInputChange={(event, newValue) => {
          setSearchTerm(newValue);
        }}
        options={matchingMovies}
        filterOptions={(x) => x}
        sx={{ width: 400 }}
        noOptionsText="Start typing to search for a movie."
        getOptionLabel={(movie) => movie.title}
        renderInput={(params) => <TextField {...params} label="Movie" />}
        renderOption={({ key, ...props }, option) => (
          <ListItem key={option.id} {...props} sx={{ gap: 2 }}>
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
    </>
  );
};
