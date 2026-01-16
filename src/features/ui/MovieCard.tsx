import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  CircularProgress,
  Typography,
} from "@mui/material";
import {
  UpdateWatchlistEntryInput,
  useGetTmdbDetails,
  useUpdateWatchlistEntry,
} from "../api/utils";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { MovieDetails } from "@lorenzopant/tmdb";
import { format } from "date-fns";
import { ConfigurationResponse } from "@lorenzopant/tmdb/dist/types/configuration";

export type MovieCard = {
  movieId: number;
  fetchAndSetWatchlist: () => Promise<void>;
  setSelectedMovie: Dispatch<SetStateAction<MovieDetails | null>>;
  tmdbConfigLoading: boolean;
  tmdbConfig: ConfigurationResponse | null;
};

export const MovieCard = ({
  movieId,
  fetchAndSetWatchlist,
  setSelectedMovie,
  tmdbConfigLoading,
  tmdbConfig,
}: MovieCard) => {
  const { status: getDetailsStatus, attemptGet } = useGetTmdbDetails();
  const { status: updateWatchlistStatus, attemptUpdate } =
    useUpdateWatchlistEntry();
  const [details, setDetails] = useState<MovieDetails>();

  const handleRemoveClick = async (movieId: number) => {
    try {
      const input: UpdateWatchlistEntryInput = {
        movieId,
        action: "remove",
      };
      const result = await attemptUpdate(input);
      console.log("result:", result);
      // Fire a refresh of the full watchlist. Must be passed down.
      fetchAndSetWatchlist();
    } catch (err) {
      console.error("rating error:", err);
    }
  };

  useEffect(() => {
    // Get details from TMDB
    const getDetails = async () => {
      try {
        const result = await attemptGet(movieId);
        if (result) {
          setDetails(result);
        }
      } catch (err) {
        console.error(`error getting movie details for id: ${movieId}`, err);
      }
    };

    getDetails();
  }, []);

  if (getDetailsStatus === "loading" || tmdbConfigLoading === true) {
    return <CircularProgress />;
  }

  if (details && tmdbConfig) {
    const imgURL = `${tmdbConfig.images.base_url}${tmdbConfig.images.poster_sizes[1]}/${details.poster_path}`;
    return (
      <>
        <Card
          sx={{
            width: 154,
            height: "100%",
          }}
        >
          <CardActionArea onClick={() => setSelectedMovie(details)}>
            <CardMedia sx={{ width: 154, height: 231 }} image={imgURL} />
            <CardContent>
              <Typography variant="h6">{`${details.title}${
                details.release_date
                  ? ` (${format(details.release_date, "y")})`
                  : ""
              }`}</Typography>
            </CardContent>
          </CardActionArea>
          <CardActions sx={{ marginTop: "auto" }}>
            <Button
              onClick={() => handleRemoveClick(movieId)}
              disabled={updateWatchlistStatus === "loading"}
              size="small"
              variant="outlined"
            >
              Remove from watchlist
            </Button>
          </CardActions>
        </Card>
      </>
    );
  }

  return null;
};
