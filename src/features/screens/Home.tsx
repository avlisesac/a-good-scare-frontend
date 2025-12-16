import {
  Alert,
  AlertColor,
  AlertProps,
  AlertPropsColorOverrides,
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  Grid,
  Link,
} from "@mui/material";
import { OverridableStringUnion } from "@mui/types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Cookies from "universal-cookie";
import { useAuthEndpoint } from "../api/utils";
import { LoadingButton } from "@mui/lab";

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
  const cookies = new Cookies();
  const token = cookies.get("TOKEN");
  console.log("token:", token);
  const [tokenState, setTokenState] = useState(token);
  const { data, status, errMessage, callAuthEndpoint } = useAuthEndpoint();
  const [messageToDisplay, setMessageToDisplay] = useState<string>();

  const navigate = useNavigate();

  const logout = async () => {
    cookies.remove("TOKEN", { path: "./" });
    navigate("/");
  };

  useEffect(() => {
    setTokenState(token);
  }, [token]);

  useEffect(() => {
    setMessageToDisplay(data);
  }, [data]);

  useEffect(() => {
    setMessageToDisplay("Unauthorized!");
  }, [errMessage]);

  useEffect(() => {
    setMessageToDisplay(undefined);
  }, []);

  return (
    <Grid container spacing={2}>
      <Grid size={12}>
        <h1>Home</h1>
      </Grid>
      <Grid size={12}>
        <LoginFeedback isLoggedIn={!!token} />
      </Grid>
      <Grid>
        <Link href="/register">Register</Link>
      </Grid>
      <Grid>
        <Link href="/login">Login</Link>
      </Grid>
      <Grid size={12}>
        <Button variant="contained" onClick={() => logout()}>
          Logout
        </Button>
      </Grid>
      <Grid size={12}>
        <LoadingButton
          variant="outlined"
          onClick={() => callAuthEndpoint(token)}
          loading={status === "loading"}
          disabled={status === "loading"}
        >
          Fetch Private Data
        </LoadingButton>
      </Grid>
      <Dialog
        open={!!messageToDisplay}
        onClose={() => setMessageToDisplay(undefined)}
      >
        <DialogContent>
          <DialogContentText color={errMessage ? "red" : "green"}>
            {messageToDisplay}
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </Grid>
  );
};
