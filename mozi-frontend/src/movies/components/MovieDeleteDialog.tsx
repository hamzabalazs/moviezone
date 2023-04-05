import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { EXPIRED_TOKEN_MESSAGE } from "../../common/errorMessages";
import { useSessionContext } from "../../auth/context/SessionContext";
import { useMovie } from "../hooks/useMovie";
import { Movie } from "../../gql/graphql";

interface Props {
  movie?: Movie;
  onClose?: () => void;
}

export default function MovieDeleteDialog({ movie, onClose }: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { logOut } = useSessionContext();
  const { deleteMovie: DeleteMovieAPI } = useMovie();

  const handleDeletion = async () => {
    if (movie === undefined) return;

    const movie_id = movie.id;
    try {
      const result = await DeleteMovieAPI(movie_id);
      if (result) {
        const msg = t("successMessages.movieDelete");
        enqueueSnackbar(msg, { variant: "success" });
        onClose?.();
        navigate("/");
      }
    } catch (error: any) {
      if (error.message === EXPIRED_TOKEN_MESSAGE) {
        const msg = t("failMessages.expiredToken");
        enqueueSnackbar(msg, { variant: "error" });
        logOut();
      } else {
        const msg = t("someError");
        enqueueSnackbar(msg, { variant: "error" });
      }
    }
  };

  return (
    <Dialog
      open={Boolean(movie)}
      onClose={() => onClose?.()}
      aria-labelledby="alert-delete-title"
      aria-describedby="alert-delete-description"
      data-testid="movie-delete-dialog"
    >
      <DialogTitle id="alert-delete-title">
        {t("deleteMessages.deleteMovieTitle")}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-delete-description">
          {t("deleteMessages.deleteMovieContent")}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleDeletion}
          autoFocus
          data-testid="movie-delete-accept"
        >
          {t("buttons.accept")}
        </Button>
        <Button onClick={() => onClose?.()} data-testid="movie-delete-quit">
          {t("buttons.quit")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
