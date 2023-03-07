import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { useApiContext } from "../../api/ApiContext";
import { AlertType, Review } from "../../api/types";

interface Props {
  review?: Review;
  onClose?: () => void;
  setAlert: Dispatch<SetStateAction<AlertType>>;
  
}

export default function ReviewDeleteDialog({
  review,
  onClose,
  setAlert
}: Props) {
  const { t } = useTranslation();
  const { deleteReview } = useApiContext();

  const handleDeletion = async () => {
    if (review === undefined) return;
    const result = await deleteReview(review.id);
    if (result) {
      const msg = t("successMessages.reviewDelete");
      setAlert({isOpen:true,message:msg,type:"success"})
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
        <Button onClick={handleDeletion} autoFocus data-testid="review-delete-dialog-accept">
          {t("buttons.accept")}
        </Button>
        <Button onClick={() => onClose?.()} data-testid="review-delete-dialog-quit">
          {t("buttons.quit")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
