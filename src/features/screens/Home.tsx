import {
  Alert,
  AlertColor,
  AlertPropsColorOverrides,
  Dialog,
  DialogContent,
  DialogContentText,
  Grid,
} from "@mui/material";
import { OverridableStringUnion } from "@mui/types";
import { useState } from "react";
import { useAuthEndpoint } from "../api/utils";
import { LoadingButton } from "@mui/lab";
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
  const { result, status, err, callAuthEndpoint } = useAuthEndpoint();
  const [messageToDisplay, setMessageToDisplay] = useState<String | null>(null);

  const handleAuthCall = async () => {
    let newMessageToDisplay: String | null = null;
    try {
      const result = await callAuthEndpoint();
      console.log("result:", result);
      newMessageToDisplay = result;
    } catch (errLocal) {
      console.error("errLocal:", errLocal);
      newMessageToDisplay = errLocal as String;
    }
    setMessageToDisplay(newMessageToDisplay);
  };

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
      <Grid size={12}>
        <LoadingButton
          variant="outlined"
          onClick={() => {
            handleAuthCall();
          }}
          loading={status === "loading"}
          disabled={status === "loading"}
        >
          Fetch Private Data
        </LoadingButton>
      </Grid>
      <Dialog
        open={!!messageToDisplay}
        onClose={() => setMessageToDisplay(null)}
      >
        <DialogContent>
          <DialogContentText color={err ? "red" : "green"}>
            {messageToDisplay}
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </Grid>
  );
};
