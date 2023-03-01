import {
  Card,
  CardContent,
  CardMedia,
  Link,
  Rating,
  Typography,
} from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { Movie } from "../../api/types";
import { useTranslation } from "react-i18next";

interface Props {
  movie: Movie;
  setIsOpenDelete: Dispatch<SetStateAction<boolean>>;
  setIsOpenEdit: Dispatch<SetStateAction<boolean>>;
  setIsOpenReview: Dispatch<SetStateAction<boolean>>;
  setTitle: Dispatch<SetStateAction<string>>;
  setDescription: Dispatch<SetStateAction<string>>;
  setReleaseDate: Dispatch<SetStateAction<string>>;
  setCategoryId: Dispatch<SetStateAction<string>>;
  setRating: Dispatch<SetStateAction<number>>;
  selectedMovie: Movie;
  setSelectedMovie: Dispatch<SetStateAction<Movie>>;
}

export default function MovieListCard(props: Props) {
  const { t } = useTranslation();
  return (
    <Link
      href={"/movie/" + props.movie.id}
      underline="none"
      data-testid="movie-list-card-link"
    >
      <Card
        variant="outlined"
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          borderColor: "text.secondary",
          border: 3,
          borderRadius: 2,
        }}
        data-testid="movie-list-card"
      >
        <CardMedia
          sx={{ paddingTop: "56.25%", height: "250px" }}
          image={props.movie.poster}
          title={props.movie.title}
          data-testid="movie-list-card-poster"
        />

        <CardContent>
          <Typography
            variant="h5"
            gutterBottom
            data-testid="movie-list-card-title"
          >
            {props.movie.title}
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{ mt: "auto" }}
            data-testid="movie-list-card-releaseDate"
          >
            {t("movie.releaseDate")}: {props.movie.releaseDate}
          </Typography>
          <Typography variant="subtitle2" gutterBottom sx={{ mt: "auto" }}>
            {t("movie.rating")}:{" "}
            {
              <Rating
                name="read-only"
                value={props.movie.rating}
                precision={0.5}
                readOnly
                data-value={props.movie.rating}
                data-testid="movie-list-card-rating"
              />
            }
          </Typography>
        </CardContent>
      </Card>
    </Link>
  );
}
