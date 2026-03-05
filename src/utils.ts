import { ConfigurationResponse } from "@lorenzopant/tmdb/dist/types/configuration";
import { format } from "date-fns";

type imgURLProps = {
  tmdbConfig: ConfigurationResponse;
  sizePos: number;
  posterPath: string | null;
};

export const constructImageURL = ({
  tmdbConfig,
  sizePos,
  posterPath,
}: imgURLProps) => {
  return `${tmdbConfig.images.base_url}${tmdbConfig.images.poster_sizes[sizePos]}/${posterPath}`;
};

export const constructCardText = (
  title: string,
  releaseDate: string | undefined,
) => {
  return `${title}${releaseDate ? ` (${format(releaseDate, "y")})` : ""}`;
};
