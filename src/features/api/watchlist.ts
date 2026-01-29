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

export const useWatchlist = (enabled: boolean) => {
  return useQuery<WatchlistEntry[]>({
    queryKey: ["watchlist"],
    queryFn: getFullWatchlist,
    enabled,
  });
};

export const useWatchlistEntry = (
  input: GetWatchlistEntryInput,
  enabled: boolean
) => {
  return useQuery<WatchlistEntry>({
    queryKey: ["watchlist-entry", input.movieId],
    queryFn: () => getWatchlistEntry(input),
    enabled: !!input.movieId && enabled,
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
