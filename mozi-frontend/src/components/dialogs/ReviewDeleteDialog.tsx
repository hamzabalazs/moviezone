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
import { GET_MOVIE_BY_ID, GET_REVIEWS_OF_MOVIE, GET_USERS_REVIEWS_OF_MOVIE } from "../../pages/MoviePage";

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
  const client = useApolloClient()

  const handleDeletion = async () => {
    if (review === undefined) return;
    const movie_id = review.movie.id;
    const user_id = review.user.id;
    const result = await DeleteReviewAPI({
      variables: { input: { id: review.id } },
      update:(cache,{data}) => {
        const { getReviewsOfMovie } = client.readQuery({
          query: GET_REVIEWS_OF_MOVIE,
          variables:{input:{movie_id}}
        })
        cache.writeQuery({
          query:GET_REVIEWS_OF_MOVIE,
          variables:{input:{movie_id}},
          data:{
            getReviewsOfMovie:getReviewsOfMovie.filter((x:any) => x.id != data.deleteReview.id)
          }
        })
        const { getReviewsOfUserForMovie} = client.readQuery({
          query: GET_USERS_REVIEWS_OF_MOVIE,
          variables:{input:{movie_id,user_id}}
        })
        cache.writeQuery({
          query:GET_USERS_REVIEWS_OF_MOVIE,
          variables:{input:{movie_id,user_id}},
          data:{
            getReviewsOfUserForMovie:getReviewsOfUserForMovie.filter((x:any) => x.id != data.deleteReview.id)
          }
        })
        const { getMovieById } = client.readQuery({
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
    });
    if (result) {
      const msg = t("successMessages.reviewDelete");
      enqueueSnackbar(msg, { variant: "success" });
    }
    onClose?.();
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
