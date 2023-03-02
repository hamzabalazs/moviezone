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
import { ReviewUpdated } from "../../api/types";

interface Props {
  review?: ReviewUpdated;
  onClose?: () => void;
  setIsOpenAlert: Dispatch<SetStateAction<boolean>>;
  setAlertMessage: Dispatch<SetStateAction<string>>;
  setAlertType: Dispatch<SetStateAction<string>>;
}

export default function ReviewDeleteDialog({
  review,
  onClose,
  setIsOpenAlert,
  setAlertMessage,
  setAlertType,
}: Props) {
  const { t } = useTranslation();
  const { deleteReview } = useApiContext();

  const handleDeletion = async () => {
    if (review === undefined) return;
    const result = await deleteReview(review.id);
    if (result) {
      const msg = t("successMessages.reviewDelete");
      setIsOpenAlert(true);
      setAlertMessage(msg);
      setAlertType("success");
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
        <Button onClick={handleDeletion} autoFocus>
          {t("buttons.accept")}
        </Button>
        <Button onClick={() => onClose?.()}>
          {t("buttons.quit")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
