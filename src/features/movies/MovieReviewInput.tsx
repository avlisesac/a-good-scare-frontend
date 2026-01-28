import {
  Button,
  Card,
  CardActions,
  CardContent,
  TextField,
} from "@mui/material";
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { MovieReview } from "../api/utils";

export type MovieReviewInputProps = {
  disabled: boolean;
  loading: boolean;
  label: string;
  movieId: number;
  editingReview: boolean;
  loggedInUsersReview?: MovieReview;
  submitMovieReview: (movieId: number, reviewText: string) => Promise<void>;
  setEditingReview: Dispatch<SetStateAction<boolean>>;
};

export const MovieReviewInput = ({
  disabled,
  loading,
  label,
  movieId,
  editingReview,
  loggedInUsersReview,
  submitMovieReview,
  setEditingReview,
}: MovieReviewInputProps) => {
  const [reviewText, setReviewText] = useState(loggedInUsersReview?.reviewText);

  const handleReviewTextChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newValue = event.target.value;
    setReviewText(newValue);
  };

  useEffect(() => {
    if (loggedInUsersReview) {
      setReviewText(loggedInUsersReview.reviewText);
    }
  }, [loggedInUsersReview]);

  return (
    <Card sx={{ backgroundColor: "secondary.main", width: "100%" }}>
      <CardContent>
        <TextField
          id="review-input"
          disabled={disabled}
          label={label}
          multiline
          value={reviewText}
          onChange={handleReviewTextChange}
          rows={3}
          sx={{ width: "100%", color: "#000" }}
        />
        <CardActions>
          <Button
            loading={loading}
            loadingPosition="start"
            disabled={
              disabled || loggedInUsersReview?.reviewText === reviewText
            }
            variant="contained"
            onClick={() => {
              if (reviewText) {
                submitMovieReview(movieId, reviewText);
              }
            }}
          >
            Submit
          </Button>
          {editingReview && (
            <Button
              disabled={disabled}
              variant="outlined"
              onClick={() => setEditingReview(false)}
            >
              Cancel
            </Button>
          )}
        </CardActions>
      </CardContent>
    </Card>
  );
};
