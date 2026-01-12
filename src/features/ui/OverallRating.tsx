import { Skeleton, Typography } from "@mui/material";

type OverallRatingProps = {
  rating?: string;
  loading: boolean;
};

export const OverallRating = ({ rating, loading }: OverallRatingProps) => {
  console.log("OverallRating rating:", rating);
  if (loading) {
    return <Skeleton variant="text" sx={{ fontSize: "1rem" }} />;
  } else {
    return <Typography>Overall Rating: {rating}</Typography>;
  }
};
