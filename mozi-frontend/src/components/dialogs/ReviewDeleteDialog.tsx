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
import { ReviewListReview } from "../../api/types";
import { gql, useApolloClient, useMutation } from "@apollo/client";
import {
  GET_MOVIE_BY_ID,
  GET_REVIEWS_OF_MOVIE,
  GET_USERS_REVIEWS_OF_MOVIE,
} from "../../pages/MoviePage";
import { useSessionContext } from "../../api/SessionContext";
import { EXPIRED_TOKEN_MESSAGE } from "../../common/errorMessages";
import { GET_REVIEWS_OF_USER } from "../../pages/Reviews";

interface Props {
  review?: ReviewListReview;
  onClose?: () => void;
}

const DELETE_REVIEW = gql`
  mutation DeleteReview($input: DeleteReviewInput!) {
    deleteReview(input: $input) {
      id
      rating
      description
      movie {
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
      user {
        first_name
        last_name
        id
      }
    }
  }
`;

export default function ReviewDeleteDialog({ review, onClose }: Props) {
  const { t } = useTranslation();
  const [DeleteReviewAPI] = useMutation(DELETE_REVIEW);
  const { enqueueSnackbar } = useSnackbar();
  const client = useApolloClient();
  const { logOut } = useSessionContext();

  const handleDeletion = async () => {
    if (review === undefined) return;
    const movie_id = review.movie.id;
    const user_id = review.user.id;
    try {
      await DeleteReviewAPI({
        variables: { input: { id: review.id } },
        update: (cache, { data }) => {
          if(window.location.pathname === "/reviews"){
            const reviewsOfUserData = client.readQuery({
              query: GET_REVIEWS_OF_USER,
              variables: { input: { user_id } },
            });
            if(!reviewsOfUserData) return
            cache.writeQuery({
              query: GET_REVIEWS_OF_USER,
              variables: { input: { user_id } },
              data: {
                getReviewsOfUser: reviewsOfUserData.getReviewsOfUser.filter(
                  (x: any) => x.id != data.deleteReview.id
                ),
              },
            });
          }
          else{
            const reviewsOfMovieData = client.readQuery({
              query: GET_REVIEWS_OF_MOVIE,
              variables: { input: { movie_id } },
            });
            if(!reviewsOfMovieData) return
            cache.writeQuery({
              query: GET_REVIEWS_OF_MOVIE,
              variables: { input: { movie_id } },
              data: {
                getReviewsOfMovie: reviewsOfMovieData.getReviewsOfMovie.filter(
                  (x: any) => x.id != data.deleteReview.id
                ),
              },
            });
            const reviewsOfUserForMovieData = client.readQuery({
              query: GET_USERS_REVIEWS_OF_MOVIE,
              variables: { input: { movie_id, user_id } },
            });
            if(!reviewsOfUserForMovieData) return
            cache.writeQuery({
              query: GET_USERS_REVIEWS_OF_MOVIE,
              variables: { input: { movie_id, user_id } },
              data: {
                getReviewsOfUserForMovie: reviewsOfUserForMovieData.getReviewsOfUserForMovie.filter(
                  (x: any) => x.id != data.deleteReview.id
                ),
              },
            });
              client.readQuery({
              query: GET_MOVIE_BY_ID,
              variables: { input: { id: movie_id } },
            });
            cache.writeQuery({
              query: GET_MOVIE_BY_ID,
              variables: { input: { id: movie_id } },
              data: {
                getMovieById: data.deleteReview.movie,
              },
            });
          }
        },
      });
      const msg = t("successMessages.reviewDelete");
      enqueueSnackbar(msg, { variant: "success" });
      onClose?.();
    } catch (error: any) {
      console.log(error.message)
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
      open={Boolean(review)}
      onClose={() => onClose?.()}
      aria-labelledby="alert-delete-title"
      aria-describedby="alert-delete-description"
      data-testid="review-delete-dialog"
    >
      <DialogTitle id="alert-delete-title">
        {t("deleteMessages.deleteReviewTitle")}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-delete-description">
          {t("deleteMessages.deleteReviewContent")}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleDeletion}
          autoFocus
          data-testid="review-delete-dialog-accept"
        >
          {t("buttons.accept")}
        </Button>
        <Button
          onClick={() => onClose?.()}
          data-testid="review-delete-dialog-quit"
        >
          {t("buttons.quit")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
