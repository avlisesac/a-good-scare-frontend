import { Button, Card, CardContent, Grid, Typography } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";

export const Home = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <Grid container spacing={2}>
      <Grid size={12}>
        <Typography variant="h2" sx={{ textAlign: "center" }}>
          Welcome to
        </Typography>
      </Grid>
      <Grid size={12}>
        <Typography color="primary" variant="h1" sx={{ textAlign: "center" }}>
          A Good Scare
        </Typography>
      </Grid>
      <Grid size={12}>
        <Typography variant="h4" sx={{ textAlign: "center" }}>
          A rating and review site for horror fans.
        </Typography>
      </Grid>
      {!user && (
        <Grid
          sx={{
            display: "flex",
            gap: 2,
            flex: 1,
            justifyContent: "center",
          }}
        >
          <Button
            variant="contained"
            size="large"
            color="secondary"
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
          <Button
            variant="contained"
            size="large"
            color="secondary"
            onClick={() => navigate("/register")}
          >
            Register
          </Button>
        </Grid>
      )}
      <Grid size={12}>
        <Card>
          <CardContent
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <Typography variant="body1" sx={{ textAlign: "center" }}>
              Horror fans know that we have different criteria for what makes a
              good horror flick than the general moviegoer. While there are
              ample movie review sites out there, we want to give the gorehound
              and the spooklover the chance to get reviews from likeminded
              creeps. And, while horror-leaning streaming services exist and
              allow for ratings and reviews, they're limited to the content that
              the platform currently has licensed.
            </Typography>
            <Typography
              color="primary"
              variant="h6"
              sx={{
                fontFamily: ["Archivo Black", "sans-serif"].join(", "),
                textAlign: "center",
              }}
            >
              Enter: "A Good Scare"!
            </Typography>
            <Typography sx={{ textAlign: "center" }}>
              We let you rate on a simple metric that other horror watchers
              appreciate: "Check it out!" or "Skip it." Feel like you've got
              something to say? Leave a review! Come across a movie you've been
              meaning to get to? Add it to your watchlist.
            </Typography>
            <Typography
              color="secondary"
              sx={{
                fontFamily: ["Archivo Black", "sans-serif"].join(", "),
                textAlign: "center",
              }}
            >
              "A Good Scare" aims to be your horror movie sidekick to help you
              get the most out of your darker viewing.
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      {user && (
        <Grid>
          <Typography>Features coming soon:</Typography>
          <ul>
            <li>Spoiler tags for reviews</li>
            <li>Ability to delete a review that you've left</li>
            <li>Personal rate/review activity list</li>
            <li>
              On homescreen:
              <ul>
                <li>Highest rated movies</li>
                <li>Most rated movies</li>
                <li>Most reviewed movies</li>
              </ul>
            </li>
            <li>
              Random horror movie suggester w/ ability to narrow by:
              <ul>
                <li>Decade</li>
                <li>Country</li>
              </ul>
            </li>
          </ul>
        </Grid>
      )}
    </Grid>
  );
};
