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

interface Props {
  isOpenDelete: boolean;
  setIsOpenDelete: Dispatch<SetStateAction<boolean>>;
  movieId: string;
  setIsOpenAlert: Dispatch<SetStateAction<boolean>>;
  setAlertMessage: Dispatch<SetStateAction<string>>;
  setAlertType: Dispatch<SetStateAction<string>>;
}

export default function MovieDeleteDialog(props: Props) {
  const { deleteMovie } = useApiContext();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const movieId = props.movieId;
  const setIsOpenDelete = props.setIsOpenDelete;
  const setIsOpenAlert = props.setIsOpenAlert;
  const setAlertMessage = props.setAlertMessage;
  const setAlertType = props.setAlertType;
  const handleDeletion = async () => {
    const result = await deleteMovie(movieId);
    if (!result) return;

    const msg = t("successMessages.movieDelete");
    setIsOpenDelete(false);
    setIsOpenAlert(true);
    setAlertMessage(msg);
    setAlertType("success");
    navigate("/");
  };

  return (
    <Dialog
      open={props.isOpenDelete}
      onClose={() => props.setIsOpenDelete(false)}
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
        <Button onClick={handleDeletion} autoFocus>
          {t("buttons.accept")}
        </Button>
        <Button onClick={() => props.setIsOpenDelete(false)}>
          {t("buttons.quit")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
