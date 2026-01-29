import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import BookmarkRemoveIcon from "@mui/icons-material/BookmarkRemove";
import { Button } from "@mui/material";
import { useUpdateWatchlistEntry, useWatchlistEntry } from "../api/watchlist";

export type WatchlistButtonProps = {
  movieId: number;
};

export const WatchlistButton = ({ movieId }: WatchlistButtonProps) => {
  const { mutateAsync, isPending: updateIsPending } = useUpdateWatchlistEntry();
  const { data: watchlistEntry, isPending: fetchIsPending } = useWatchlistEntry(
    { movieId }
  );

  const anyApiLoading = fetchIsPending || updateIsPending;

  const wantToWatch = watchlistEntry?.toWatch;

  const handleButtonClick = async () => {
    try {
      await mutateAsync({
        movieId,
        action: wantToWatch ? "remove" : "add",
      });
    } catch (err) {
      console.error("watchlist update error:", err);
    }
  };

  return (
    <Button
      aria-label="add-movie-to-watchlist"
      variant={wantToWatch ? "outlined" : "contained"}
      sx={{
        position: "absolute",
        right: `1rem`,
        top: `1rem`,
      }}
      loading={anyApiLoading}
      loadingPosition="start"
      startIcon={wantToWatch ? <BookmarkRemoveIcon /> : <BookmarkAddIcon />}
      onClick={() => handleButtonClick()}
    >
      {wantToWatch ? `Remove from Watchlist` : `Add to Watchlist`}
    </Button>
  );
};
