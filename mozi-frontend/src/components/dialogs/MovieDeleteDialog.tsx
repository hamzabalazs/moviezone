import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { useApiContext } from "../../api/ApiContext";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { AlertType, Movie } from "../../api/types";

interface Props {
  movie?: Movie;
  onClose?: () => void;
  setAlert?: Dispatch<SetStateAction<AlertType>>;
  
}

export default function MovieDeleteDialog({
  movie,
  onClose,
  setAlert
}: Props) {
  const { deleteMovie } = useApiContext();
  const { t } = useTranslation();
  const navigate = useNavigate();

  
  const handleDeletion = async () => {
    if(movie === undefined) return;

    const movie_id = movie.id;
    const result = await deleteMovie(movie_id);
    if (result) {
      const msg = t("successMessages.movieDelete");
      setAlert?.({isOpen:true,message:msg,type:"success"})
      navigate("/");
    }

    onClose?.();
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
        <Button onClick={handleDeletion} autoFocus data-testid="movie-delete-accept">
          {t("buttons.accept")}
        </Button>
        <Button onClick={() => onClose?.()} data-testid="movie-delete-quit">
          {t("buttons.quit")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
