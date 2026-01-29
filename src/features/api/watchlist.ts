import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getFullWatchlist,
  getWatchlistEntry,
  GetWatchlistEntryInput,
  updateWatchlistEntry,
  UpdateWatchlistEntryInput,
  WatchlistEntry,
  WatchlistEntryAction,
} from "./utils";

export const useWatchlist = () => {
  return useQuery<WatchlistEntry[]>({
    queryKey: ["watchlist"],
    queryFn: getFullWatchlist,
  });
};

export const useWatchlistEntry = (input: GetWatchlistEntryInput) => {
  return useQuery<WatchlistEntry>({
    queryKey: ["watchlist-entry", input.movieId],
    queryFn: () => getWatchlistEntry(input),
    enabled: !!input.movieId,
  });
};

export const useUpdateWatchlistEntry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateWatchlistEntryInput) =>
      updateWatchlistEntry(input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["watchlist"] });
      queryClient.invalidateQueries({
        queryKey: ["watchlist-entry", variables.movieId],
      });
    },
  });
};
