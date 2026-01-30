import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, DBDateFields } from "./utils";
import { AxiosRequestConfig } from "axios";

export type GetWatchlistEntryInput = {
  movieId: number;
};

export type WatchlistEntry = DBDateFields & {
  movieId: number;
  toWatch?: boolean;
};

export type WatchlistEntryAction = "add" | "remove";

export type UpdateWatchlistEntryInput = {
  movieId: number;
  action: WatchlistEntryAction;
};

export const getWatchlistEntry = async ({
  movieId,
}: GetWatchlistEntryInput): Promise<WatchlistEntry> => {
  const configuration: AxiosRequestConfig = {
    method: "get",
    url: `/api/watchlist/${movieId}`,
  };

  const response = await api(configuration);
  return response.data;
};

export const getFullWatchlist = async (): Promise<WatchlistEntry[]> => {
  const configuration: AxiosRequestConfig = {
    method: "get",
    url: `/api/watchlist`,
  };

  const response = await api(configuration);
  return response.data;
};

export const updateWatchlistEntry = async ({
  movieId,
  action,
}: UpdateWatchlistEntryInput): Promise<WatchlistEntry> => {
  const configuration: AxiosRequestConfig = {
    method: "post",
    url: `/api/watchlist/${movieId}/${action}`,
  };

  const response = await api(configuration);
  return response.data;
};

export const useWatchlist = (enabled: boolean) => {
  return useQuery<WatchlistEntry[]>({
    queryKey: ["watchlist"],
    queryFn: getFullWatchlist,
    enabled,
  });
};

// TODO: We could get away with fetching the user's full watchlist and extracting the entry-in-question without defining a separate query/endpoint
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
