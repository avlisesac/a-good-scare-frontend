import {
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import {
  MovieReview,
  useGetAllReviewsForMovie,
  UserRating,
} from "../api/utils";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { useAuth } from "../context/AuthContext";

type MovieReviewsProps = {
  movieId: number;
  userRating: UserRating | null;
};

export const MovieReviews = ({ movieId, userRating }: MovieReviewsProps) => {
  // TODO: Rectify "no reviews" vs only one review from the currently logged in usesr.
  const { attemptGet, status } = useGetAllReviewsForMovie();
  // TODO: Implement actually submitting (create util entries)
  const { user } = useAuth();
  const [movieReviews, setMovieReviews] = useState<MovieReview[]>([]);
  const [loggedInUsersReview, setLoggedInUsersReview] = useState<MovieReview>();
  const [reviewFieldDisabled, setReviewFieldDisabled] = useState<boolean>(true);
  const [reviewFieldLabel, setReviewFieldLabel] = useState("");
  const [buttonText, setButtonText] = useState("");

  // TODO: allow edit.
  const [editingReview, setEditingReview] = useState("");

  // TODO: main review section should filter out the review (if any) that the logged in user made.
  // That one should live at the top.

  const getAndSetMovieReviews = async (movieId: number) => {
    try {
      const result = await attemptGet({ movieId });
      console.log("reviews:", result);
      const loggedInUsersReview = result?.find(
        (review) => review.userId === user?.id
      );
      console.log("loggedInUsersReview:", loggedInUsersReview);
      setLoggedInUsersReview(loggedInUsersReview);
      const minusLoggedInUsersReviews = result.filter(
        (result) => result.userId != user?.id
      );
      console.log("minusLoggedInUsersReviews:", minusLoggedInUsersReviews);
      setMovieReviews(minusLoggedInUsersReviews);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    let buttonText = "Submit";
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
      setReviewFieldLabel("Add your review.");
    }
    if (user && loggedInUsersReview) {
      setReviewFieldDisabled(true);
      setReviewFieldLabel(loggedInUsersReview.reviewText);
      buttonText = "This is your review.";
    }
    setButtonText(buttonText);
  }, [user, loggedInUsersReview, userRating]);

  useEffect(() => {
    getAndSetMovieReviews(movieId);
  }, []);

  return (
    <>
      <Typography variant="h4">Reviews</Typography>
      <Card sx={{ backgroundColor: "secondary.main" }}>
        <CardContent>
          <TextField
            // Disabled if:
            // - existing review, kind of. it will be a component swapout
            id="review-input"
            disabled={reviewFieldDisabled}
            label={reviewFieldLabel}
            multiline
            rows={3}
            sx={{ width: "100%", color: "#000" }}
          />
          <CardActions>
            <Button disabled={reviewFieldDisabled} variant="contained">
              {buttonText}
            </Button>
            {loggedInUsersReview && (
              <Button variant="contained">Edit Review</Button>
            )}
          </CardActions>
        </CardContent>
      </Card>
      {status === "loading" && <CircularProgress />}
      {status === "success" &&
        (movieReviews?.length ? (
          movieReviews.map((review) => (
            <Card
              sx={{ backgroundColor: "#515151ff", color: "000" }}
              key={review.id}
            >
              <CardContent>
                <Typography variant="body1">{review.reviewText}</Typography>
                <Typography sx={{ paddingTop: 2 }} variant="subtitle2">
                  by {review.username} on{" "}
                  {format(review.updatedAt, "MMM dd, yyyy @ h aaaa")}
                </Typography>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography>No reviews yet</Typography>
        ))}
    </>
  );
};
