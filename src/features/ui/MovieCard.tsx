import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";

export type MovieCardProps = {
  cardClickAction: () => void;
  imgURL?: string;
  cardText: string;
  average?: string;
  buttonAction?: () => void;
  buttonText?: string;
  buttonActionLoading?: boolean;
};

export const MovieCard = ({
  cardClickAction,
  imgURL,
  cardText,
  average,
  buttonAction,
  buttonText,
  buttonActionLoading,
}: MovieCardProps) => {
  return (
    <>
      <Card
        sx={{
          width: 154,
          height: "100%",
        }}
      >
        <CardActionArea onClick={cardClickAction}>
          <CardMedia sx={{ width: 154, height: 231 }} image={imgURL} />
          <CardContent>
            <Typography variant="h6">{cardText}</Typography>
            {average && <Typography>{average}</Typography>}
          </CardContent>
        </CardActionArea>
        {buttonAction && buttonText && (
          <CardActions sx={{ marginTop: "auto" }}>
            <Button
              onClick={buttonAction}
              loading={buttonActionLoading}
              loadingPosition="start"
              size="small"
              variant="outlined"
            >
              {buttonText}
            </Button>
          </CardActions>
        )}
      </Card>
    </>
  );
};
