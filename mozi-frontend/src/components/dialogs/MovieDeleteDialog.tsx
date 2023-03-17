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
import { Movie } from "../../api/types";
import { gql, useMutation } from "@apollo/client";
import { EXPIRED_TOKEN_MESSAGE } from "../../common/errorMessages";
import { useSessionContext } from "../../api/SessionContext";

interface Props {
  movie?: Movie;
  onClose?: () => void;
}

const DELETE_MOVIE = gql`
  mutation DeleteMovie($input: DeleteMovieInput!) {
    deleteMovie(input: $input) {
      id
      title
      description
      poster
      release_date
      category {
        id
        name
      }
      rating
    }
  }
`;

export default function MovieDeleteDialog({ movie, onClose }: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [DeleteMovieAPI] = useMutation(DELETE_MOVIE);
  const { enqueueSnackbar } = useSnackbar();
  const { logOut } = useSessionContext()

  const handleDeletion = async () => {
    if (movie === undefined) return;

    const movie_id = movie.id;
    try{
      await DeleteMovieAPI({
        variables: { input: { id: movie_id } },
      });
        const msg = t("successMessages.movieDelete");
        enqueueSnackbar(msg, { variant: "success" });
        onClose?.();
        navigate("/");

        
    }catch(error:any){
      if(error.message === EXPIRED_TOKEN_MESSAGE){
        const msg = t("failMessages.expiredToken");
        enqueueSnackbar(msg, { variant: "error" });
        logOut();
      }
      else{
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
