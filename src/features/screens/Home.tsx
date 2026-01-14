import {
  Alert,
  AlertColor,
  AlertPropsColorOverrides,
  Grid,
} from "@mui/material";
import { OverridableStringUnion } from "@mui/types";
import { MovieSearch } from "../search/MovieSearch";
import { useAuth } from "../context/AuthContext";

const LoginFeedback = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  let severity:
    | OverridableStringUnion<AlertColor, AlertPropsColorOverrides>
    | undefined = "error";
  let message = "You are not currently logged in.";
  if (isLoggedIn) {
    severity = "success";
    message = "You are logged in!";
  }
  return <Alert severity={severity}>{message}</Alert>;
};

export const Home = () => {
  const { user, loading } = useAuth();

  return (
    <Grid container spacing={2}>
      <Grid size={12}>
        <h1>Home</h1>
      </Grid>
      <Grid size={12}>
        <LoginFeedback isLoggedIn={!!user} />
      </Grid>
      <Grid size={12}>
        <MovieSearch />
      </Grid>
    </Grid>
  );
};
