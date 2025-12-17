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
import { AxiosResponse } from "axios";

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
  const { result, status, err, callAuthEndpoint } = useAuthEndpoint();
  const [messageToDisplay, setMessageToDisplay] = useState<String | null>(null);

  const navigate = useNavigate();

  const logout = async () => {
    cookies.remove("TOKEN", { path: "./" });
    navigate("/");
  };

  const handleAuthCall = async (token: String) => {
    let newMessageToDisplay: String | null = null;
    try {
      const result = await callAuthEndpoint(token);
      console.log("result:", result);
      newMessageToDisplay = result;
    } catch (errLocal) {
      console.error("errLocal:", errLocal);
      newMessageToDisplay = errLocal as String;
    }
    setMessageToDisplay(newMessageToDisplay);
  };

  useEffect(() => {
    setTokenState(token);
  }, [token]);

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
          onClick={() => {
            handleAuthCall(token);
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
