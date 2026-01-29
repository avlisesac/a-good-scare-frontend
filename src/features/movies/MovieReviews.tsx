import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Grid,
  Icon,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import {
  GetAllReviewsForMovieInput,
  MovieReview,
  useGetAllReviewsForMovie,
  UserRating,
  useSubmitReview,
} from "../api/utils";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { useAuth } from "../context/AuthContext";
import { MovieReviewInput } from "./MovieReviewInput";
import { AsyncActionStatus } from "../api/useAsyncAction";

type MovieReviewsProps = {
  movieId: number;
  userRating: UserRating | null;
  getAllReviewsStatus: AsyncActionStatus;
  loggedInUsersReview?: MovieReview;
  movieReviews: MovieReview[];
  attemptGetReviews: (
    input: GetAllReviewsForMovieInput
  ) => Promise<MovieReview[]>;
  getAndSetMovieReviews: (movieId: number) => Promise<void>;
};

export const MovieReviews = ({
  movieId,
  userRating,
  getAllReviewsStatus,
  loggedInUsersReview,
  movieReviews,
  attemptGetReviews,
  getAndSetMovieReviews,
}: MovieReviewsProps) => {
  const { attemptReview, status: submitReviewStatus } = useSubmitReview();
  const { user } = useAuth();
  const [reviewFieldDisabled, setReviewFieldDisabled] = useState<boolean>(true);
  const [reviewFieldLabel, setReviewFieldLabel] = useState("");

  const [editingReview, setEditingReview] = useState(false);

  const submitMovieReview = async (movieId: number, reviewText: string) => {
    try {
      const newReview = await attemptReview({
        movieId,
        review: reviewText,
      });
      console.log("newReview:", newReview);
      getAndSetMovieReviews(movieId);
      setEditingReview(false);
    } catch (err) {
      console.error("error submitting review:", err);
    }
  };

  useEffect(() => {
    if (!user) {
      setReviewFieldDisabled(true);
      setReviewFieldLabel("You must be logged in to review a movie.");
    }
    if (user && !userRating?.rating) {
      setReviewFieldDisabled(true);
      setReviewFieldLabel("You must submit a rating before adding a review.");
    }
    if (user && userRating?.rating) {
      setReviewFieldDisabled(false);
      setReviewFieldLabel("Your review.");
    }
    if (user && loggedInUsersReview) {
      setReviewFieldDisabled(false);
      setReviewFieldLabel("Your review");
    }
  }, [user, loggedInUsersReview, userRating]);

  useEffect(() => {}, []);

  return (
    <>
      <Typography variant="h4">Reviews</Typography>
      {!loggedInUsersReview && (
        <MovieReviewInput
          disabled={reviewFieldDisabled || getAllReviewsStatus === "loading"}
          loading={submitReviewStatus === "loading"}
          label={reviewFieldLabel}
          movieId={movieId}
          editingReview={editingReview}
          loggedInUsersReview={loggedInUsersReview}
          submitMovieReview={submitMovieReview}
          setEditingReview={setEditingReview}
        />
      )}
      {getAllReviewsStatus === "loading" && <CircularProgress />}
      {getAllReviewsStatus === "success" &&
        (movieReviews?.length ? (
          <Grid container gap={2} sx={{ marginTop: 2 }}>
            {movieReviews.map((review) => {
              const isLoggedInUsersReview = review.userId === user?.id;
              if (isLoggedInUsersReview && editingReview) {
                return (
                  <MovieReviewInput
                    disabled={reviewFieldDisabled}
                    loading={submitReviewStatus === "loading"}
                    label={reviewFieldLabel}
                    movieId={movieId}
                    editingReview={editingReview}
                    loggedInUsersReview={loggedInUsersReview}
                    submitMovieReview={submitMovieReview}
                    setEditingReview={setEditingReview}
                  />
                );
              }
              return (
                <Card
                  sx={{
                    backgroundColor: "#515151ff",
                    color: "000",
                    outlineColor: "#000",
                  }}
                  key={review.id}
                  variant={isLoggedInUsersReview ? "outlined" : "elevation"}
                >
                  <CardContent>
                    {/* <Grid container sx={{ gap: 2 }}> */}
                    <Box
                      sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}
                    >
                      <Icon
                        component={
                          review.rating === "pos" ? ThumbUpIcon : ThumbDownIcon
                        }
                      ></Icon>
                      <Typography variant="body1">
                        {review.reviewText}
                      </Typography>
                      {/* TODO - Add this user's rating of the movie with their review */}
                    </Box>
                    <Typography sx={{ paddingTop: 2 }} variant="subtitle2">
                      by {review.username} on{" "}
                      {format(review.createdAt, "MMM dd, yyyy @ h:mm aaaa")}
                      {review.updatedAt !== review.createdAt
                        ? ` (updated ${format(
                            review.updatedAt,
                            "MMM dd, yyyy @ h:mm aaaa"
                          )})`
                        : ""}
                    </Typography>
                    {/* </Grid> */}
                    {isLoggedInUsersReview && (
                      <CardActions>
                        <Button
                          onClick={() => setEditingReview(true)}
                          startIcon={<EditIcon />}
                          variant="contained"
                        >
                          Edit
                        </Button>
                        {/* TODO - Delete will require a new api endpoint */}
                        {/* <Button startIcon={<DeleteIcon />} variant="contained">
                          Delete
                        </Button> */}
                      </CardActions>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </Grid>
        ) : (
          <Typography>No reviews yet</Typography>
        ))}
    </>
  );
};
