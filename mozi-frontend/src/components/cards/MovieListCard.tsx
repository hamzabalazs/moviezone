import {
  Card,
  CardContent,
  CardMedia,
  Link,
  Rating,
  Typography,
} from "@mui/material";
import { MovieListMovie } from "../../api/types";
import { useTranslation } from "react-i18next";

interface Props {
  movie: MovieListMovie;
}

export default function MovieListCard({movie}: Props) {
  const { t } = useTranslation();
  const rating = parseFloat(movie.rating)
  return (
    <Link
      href={"/movie/" + movie.id}
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
          image={movie.poster}
          title={movie.title}
          data-testid="movie-list-card-poster"
        />

        <CardContent>
          <Typography
            variant="h5"
            gutterBottom
            data-testid="movie-list-card-title"
          >
            {movie.title}
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{ mt: "auto" }}
            data-testid="movie-list-card-release_date"
          >
            {t("movie.release_date")}: {movie.release_date}
          </Typography>
          <Typography variant="subtitle2" gutterBottom sx={{ mt: "auto" }}>
            {t("movie.rating")}:{" "}
            {
              <Rating
                name="read-only"
                value={rating}
                precision={0.5}
                readOnly
                data-value={rating}
                data-testid="movie-list-card-rating"
              />
            }
          </Typography>
        </CardContent>
      </Card>
    </Link>
  );
}
