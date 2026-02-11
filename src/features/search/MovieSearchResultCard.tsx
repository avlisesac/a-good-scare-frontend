import { MovieResultItem } from "@lorenzopant/tmdb";
import { ConfigurationResponse } from "@lorenzopant/tmdb/dist/types/configuration";
import { Box, ListItemText, Skeleton } from "@mui/material";
import { format } from "date-fns";
import { useMoviesAverateRating } from "../api/ratings";

export const MovieSearchResultCard = ({
  resultItem,
  tmdbConfig,
}: {
  resultItem: MovieResultItem;
  tmdbConfig: ConfigurationResponse | null;
}) => {
  const {
    data: averageRating,
    isFetching: fetchingMoviesAverageRating,
    isSuccess,
  } = useMoviesAverateRating({
    movieId: resultItem.id,
  });
  return (
    <>
      <Box
        component="img"
        sx={{ width: 92 }}
        src={`${tmdbConfig?.images.base_url}${tmdbConfig?.images.poster_sizes[0]}/${resultItem.poster_path}`}
      />
      <ListItemText
        sx={{ width: "100%" }}
        primary={`${resultItem.title}${
          resultItem.release_date
            ? ` - (${format(resultItem.release_date, "y")})`
            : ""
        }`}
        secondary={
          fetchingMoviesAverageRating
            ? "Loading rating..."
            : isSuccess
              ? averageRating?.average
              : "Unable to retrieve rating."
        }
      />
    </>
  );
};
