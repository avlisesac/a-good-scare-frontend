import { AxiosRequestConfig } from "axios";
import { api, DBDateFields, DefaultTableProperties } from "./utils";
import { useQuery } from "@tanstack/react-query";
import { MovieDetails, MovieResultItem } from "@lorenzopant/tmdb";

export type GetListInput = {
  id: string;
};

export type ListItem = DefaultTableProperties & {
  listId: string;
  movieId: number;
  listPosition: number;
  average: string;
  icon: string;
  movie: MovieDetails;
};

export type List = DefaultTableProperties & {
  createdByUserId: string;
  name: string;
  items: ListItem[];
};

export const getList = async ({ id }: GetListInput): Promise<List> => {
  const configuration: AxiosRequestConfig = {
    method: "get",
    url: `/api/lists/${id}`,
  };

  const response = await api(configuration);
  return response.data;
};

export const useList = (input: GetListInput) => {
  return useQuery<List>({
    queryKey: ["list", input.id],
    queryFn: () => getList(input),
  });
};
