import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useSessionContext } from "../../auth/context/SessionContext";
import { Movie } from "../../gql/graphql";

interface Props {
  movie: Movie;
  onEdit?: () => void;
  onDelete?: () => void;
  onCastAdd?: () => void;
}

export default function MoviePageCard({ movie, onEdit, onDelete, onCastAdd }: Props) {
  const { t } = useTranslation();
  const { user } = useSessionContext();

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
      {movie.poster && (
        <CardMedia
          sx={{ paddingTop: "100%" }}
          image={movie.poster}
          title={movie.title}
        />
      )}
      <CardContent>
        <Typography variant="h3" gutterBottom>
          {movie.title}
        </Typography>
        <Typography
          variant="h5"
          sx={{ mt: "auto" }}
          gutterBottom
          data-testid="moviepage-release_date"
        >
          <span style={{ fontWeight: "bold" }}>{t("movie.release_date")}:</span>{" "}
          {movie.release_date}
        </Typography>
        <Typography
          variant="h5"
          sx={{ mt: "auto" }}
          gutterBottom
          data-testid="moviepage-description"
        >
          <span style={{ fontWeight: "bold" }}>{t("movie.description")}:</span>{" "}
          {movie.description}
        </Typography>
        <Typography variant="h5" gutterBottom sx={{ mt: "auto" }}>
          <span style={{ fontWeight: "bold" }}>{t("movie.rating")}:</span>{" "}
          {
            <Rating
              size="large"
              name="read-only"
              value={parseFloat(movie.rating)}
              precision={0.5}
              readOnly
              data-testid="moviepage-rating"
              data-value={movie.rating}
            />
          }
        </Typography>
      </CardContent>
      {(user?.role === "admin" || user?.role === "editor") && (
        <CardActions disableSpacing sx={{ mt: "auto" }}>
          {onEdit && (
            <Button
              size="medium"
              sx={{
                color: "text.secondary",
                fontSize: 18,
              }}
              onClick={() => onEdit()}
              data-testid="moviepage-edit-button"
            >
              {t("buttons.edit")}
            </Button>
          )}
          {onCastAdd && (
            <Button
            size="medium"
            sx={{
              color: "text.secondary",
              fontSize: 18,
            }}
            onClick={() => onCastAdd()}
            data-testid="moviepage-cast-add-button"
          >
            {t('buttons.addCast')}
          </Button>
          )}
          {onDelete && (
            <Button
              size="medium"
              sx={{
                color: "text.secondary",
                fontSize: 18,
              }}
              onClick={() => onDelete()}
              data-testid="moviepage-delete-button"
            >
              {t("buttons.delete")}
            </Button>
          )}
        </CardActions>
      )}
    </Card>
  );
}
