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
import { useSessionContext } from "../auth/SessionContext";
import { EXPIRED_TOKEN_MESSAGE } from "../common/errorMessages";
import { useReview } from "./useReview";
import { ReviewListReview } from "../gql/graphql";

interface Props {
  review?: ReviewListReview;
  onClose?: () => void;
}

export default function ReviewDeleteDialog({ review, onClose }: Props) {
  let id = ""
  if(review){
    if(review.movie){
      id = review.movie.id
    }
  } 
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { logOut,user } = useSessionContext();
  const {deleteReview:DeleteReviewAPI} = useReview(id,user!.id)

  const handleDeletion = async () => {
    if (review === undefined) return;
    try {
      const result = await DeleteReviewAPI(review.id)
      if(result){
        const msg = t("successMessages.reviewDelete");
        enqueueSnackbar(msg, { variant: "success" });
        onClose?.();
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
