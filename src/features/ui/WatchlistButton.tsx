import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import BookmarkRemoveIcon from "@mui/icons-material/BookmarkRemove";
import { Button } from "@mui/material";
import { useUpdateWatchlistEntry, useWatchlistEntry } from "../api/watchlist";
import { useAuth } from "../context/AuthContext";

export type WatchlistButtonProps = {
  movieId: number;
};

export const WatchlistButton = ({ movieId }: WatchlistButtonProps) => {
  const { user, authLoading, initialFetchLoading } = useAuth();
  const canFetchWatchlistEntry = !!user && !authLoading && !initialFetchLoading;

  const { mutateAsync, isPending: updateIsPending } = useUpdateWatchlistEntry();
  const { data: watchlistEntry, isLoading: fetchIsLoading } = useWatchlistEntry(
    { movieId },
    canFetchWatchlistEntry
  );

  const anyApiLoading = fetchIsLoading || updateIsPending;

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
