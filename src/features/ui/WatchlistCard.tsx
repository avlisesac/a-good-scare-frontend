import { CircularProgress } from "@mui/material";
import { useGetTmdbDetails } from "../api/utils";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { MovieDetails } from "@lorenzopant/tmdb";
import { ConfigurationResponse } from "@lorenzopant/tmdb/dist/types/configuration";
import { useUpdateWatchlistEntry } from "../api/watchlist";
import { MovieCard } from "./MovieCard";
import { constructCardText, constructImageURL } from "../../utils";

export type WatchlistCardProps = {
  movieId: number;
  setSelectedMovie: Dispatch<SetStateAction<MovieDetails | null>>;
  tmdbConfigLoading: boolean;
  tmdbConfig: ConfigurationResponse | null;
};

export const WatchlistCard = ({
  movieId,
  setSelectedMovie,
  tmdbConfigLoading,
  tmdbConfig,
}: WatchlistCardProps) => {
  const { status: getDetailsStatus, attemptGet } = useGetTmdbDetails();
  const { isPending, mutateAsync } = useUpdateWatchlistEntry();
  const [details, setDetails] = useState<MovieDetails>();

  const handleRemoveClick = async (movieId: number) => {
    try {
      await mutateAsync({
        movieId,
        action: "remove",
      });
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
    const imgURL = constructImageURL({
      tmdbConfig,
      sizePos: 1,
      posterPath: details.poster_path,
    });
    const cardText = constructCardText(details.title, details.release_date);
    return (
      <MovieCard
        cardClickAction={() => setSelectedMovie(details)}
        imgURL={imgURL}
        cardText={cardText}
        buttonAction={() => handleRemoveClick(movieId)}
        buttonText="Remove from Watchlist"
        buttonActionLoading={isPending}
      />
    );
  }

  return null;
};
