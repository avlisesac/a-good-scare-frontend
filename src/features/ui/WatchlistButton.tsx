import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import BookmarkRemoveIcon from "@mui/icons-material/BookmarkRemove";
import {
  UpdateWatchlistEntryInput,
  useUpdateWatchlistEntry,
  useGetWatchlistEntry,
  WatchlistEntryAction,
} from "../api/utils";
import { useEffect, useState } from "react";
import { LoadingButton } from "@mui/lab";

export type WatchlistButtonProps = {
  movieId: number;
  postUpdateAction?: () => Promise<void>;
};

export const WatchlistButton = ({
  movieId,
  postUpdateAction,
}: WatchlistButtonProps) => {
  const { status: initialFetchStatus, attemptGet } = useGetWatchlistEntry();
  const { status: addToWatchlistStatus, attemptUpdate } =
    useUpdateWatchlistEntry();

  const [wantToWatch, setWantToWatch] = useState<boolean>(false);

  const anyApiLoading = [initialFetchStatus, addToWatchlistStatus].includes(
    "loading"
  );

  useEffect(() => {
    const initialWatchlistFetch = async () => {
      try {
        const initialWatchlistEntry = await attemptGet({ movieId });
        if (initialWatchlistEntry && initialWatchlistEntry.toWatch === true) {
          setWantToWatch(true);
        } else {
          setWantToWatch(false);
        }
      } catch (err) {
        console.error("error with initial fetch:", err);
      }
    };

    initialWatchlistFetch();
  }, []);

  const handleButtonClick = async (movieId: number, wantToWatch: boolean) => {
    const action: WatchlistEntryAction = wantToWatch ? "remove" : "add";
    try {
      const input: UpdateWatchlistEntryInput = {
        movieId,
        action,
      };
      const result = await attemptUpdate(input);
      console.log("result:", result);
      if (result && result.toWatch === true) {
        setWantToWatch(true);
      } else {
        setWantToWatch(false);
      }
      if (postUpdateAction) {
        postUpdateAction();
      }
    } catch (err) {
      console.error("rating error:", err);
    }
  };

  return (
    <LoadingButton
      aria-label="add-movie-to-watchlist"
      variant={wantToWatch ? "outlined" : "contained"}
      sx={{
        position: "absolute",
        right: `1rem`,
        top: `1rem`,
      }}
      loading={anyApiLoading}
      disabled={anyApiLoading}
      startIcon={wantToWatch ? <BookmarkRemoveIcon /> : <BookmarkAddIcon />}
      onClick={() => handleButtonClick(movieId, wantToWatch)}
    >
      {wantToWatch ? `Remove from Watchlist` : `Add to Watchlist`}
    </LoadingButton>
  );
};
