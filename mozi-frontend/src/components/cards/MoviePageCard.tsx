import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { Movie } from "../../api/types";
import { useTranslation } from "react-i18next";

interface Props {
  movie: Movie;
  userRole: "admin" | "editor" | "viewer" | undefined;
  setIsOpenDelete: Dispatch<SetStateAction<boolean>>;
  setIsOpenEdit: Dispatch<SetStateAction<boolean>>;
  setTitle: Dispatch<SetStateAction<string>>;
  setDescription: Dispatch<SetStateAction<string>>;
  setReleaseDate: Dispatch<SetStateAction<string>>;
  setCategoryId: Dispatch<SetStateAction<string>>;
  setRating: Dispatch<SetStateAction<number>>;
  selectedMovie: Movie;
  setSelectedMovie: Dispatch<SetStateAction<Movie>>;
}

export default function MoviePageCard(props: Props) {
  const { t } = useTranslation();
  const handleDeletePopup = () => {
    props.setIsOpenDelete(true);
    handleSelectedMovie();
  };

  const handleEditPopup = () => {
    props.setIsOpenEdit(true);
    handleSelectedMovie();
  };

  const handleSelectedMovie = () => {
    props.setTitle(props.selectedMovie.title);
    props.setDescription(props.selectedMovie.description);
    props.setReleaseDate(props.selectedMovie.releaseDate);
    props.setCategoryId(props.selectedMovie.categoryId);
    props.setRating(props.selectedMovie.rating);
  };

  return (
    <Card
      variant="outlined"
      sx={{
        height: "100%",
        width: "33%",
        display: "flex",
        flexDirection: "column",
        marginTop: 3,
      }}
      data-testid="moviepage-card"
    >
      {props.movie.poster && (
        <CardMedia
          sx={{ paddingTop: "100%" }}
          image={props.movie.poster}
          title={props.movie.title}
        />
      )}
      <CardContent>
        <Typography variant="h3" gutterBottom>
          {props.movie.title}
        </Typography>
        <Typography
          variant="h5"
          sx={{ mt: "auto" }}
          gutterBottom
          data-testid="moviepage-releaseDate"
        >
          <span style={{ fontWeight: "bold" }}>{t("movie.releaseDate")}:</span>{" "}
          {props.movie.releaseDate}
        </Typography>
        <Typography
          variant="h5"
          sx={{ mt: "auto" }}
          gutterBottom
          data-testid="moviepage-description"
        >
          <span style={{ fontWeight: "bold" }}>{t("movie.description")}:</span>{" "}
          {props.movie.description}
        </Typography>
        <Typography variant="h5" gutterBottom sx={{ mt: "auto" }}>
          <span style={{ fontWeight: "bold" }}>{t("movie.rating")}:</span>{" "}
          {
            <Rating
              size="large"
              name="read-only"
              value={props.movie.rating}
              precision={0.5}
              readOnly
              data-testid="moviepage-rating"
              data-value={props.movie.rating}
            />
          }
        </Typography>
      </CardContent>
      {(props.userRole === "admin" || props.userRole === "editor") && (
        <CardActions disableSpacing sx={{ mt: "auto" }}>
          <Button
            size="medium"
            sx={{
              color: "text.secondary",
              fontSize: 20,
            }}
            onClick={handleEditPopup}
            onMouseEnter={() => {
              props.setSelectedMovie(props.movie);
              handleSelectedMovie();
            }}
            data-testid="moviepage-edit-button"
          >
            {t("buttons.edit")}
          </Button>
          <Button
            size="medium"
            sx={{
              color: "text.secondary",
              fontSize: 20,
            }}
            onClick={handleDeletePopup}
            onMouseEnter={() => {
              props.setSelectedMovie(props.movie);
              handleSelectedMovie();
            }}
            data-testid="moviepage-delete-button"
          >
            {t("buttons.delete")}
          </Button>
        </CardActions>
      )}
    </Card>
  );
}
