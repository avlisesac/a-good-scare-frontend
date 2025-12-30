import { MovieResultItem } from "@lorenzopant/tmdb";
import { ConfigurationResponse } from "@lorenzopant/tmdb/dist/types/configuration";
import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import { format } from "date-fns";

export type MovieDetailsProps = {
  movie: MovieResultItem;
  tmdbConfig: ConfigurationResponse;
};

export const MovieDetails = ({ movie, tmdbConfig }: MovieDetailsProps) => {
  return (
    <Card sx={{ maxWidth: 500, maxHeight: "80%", overflow: "scroll", p: 2 }}>
      <CardMedia
        component="img"
        sx={{ width: 154 }}
        src={`${tmdbConfig.images.base_url}${tmdbConfig.images.poster_sizes[1]}/${movie.poster_path}`}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component={"div"}>
          {movie.title}
        </Typography>
        {movie.release_date && (
          <Typography variant="h6">
            {format(movie.release_date, "y")}
          </Typography>
        )}
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {movie.overview}
        </Typography>
      </CardContent>
    </Card>
  );
};
