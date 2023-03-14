import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useSnackbar } from 'notistack'
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Movie } from "../../api/types";
import { gql, useMutation } from "@apollo/client";

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

export default function MovieDeleteDialog({
  movie,
  onClose,
}: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [DeleteMovieAPI,{data}] = useMutation(DELETE_MOVIE);
  const { enqueueSnackbar} = useSnackbar()
  
  const handleDeletion = async () => {
    if(movie === undefined) return;

    const movie_id = movie.id;
    const result = await DeleteMovieAPI({variables:{input:{id:movie_id}}});
    if (result) {
      const msg = t("successMessages.movieDelete");
      enqueueSnackbar(msg,{variant:"success"})
      navigate("/");
    }

    onClose?.();
  };

  //if(data) return <p style={{visibility:"hidden",height:"0px",margin:"0px"}}>Success</p>

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
