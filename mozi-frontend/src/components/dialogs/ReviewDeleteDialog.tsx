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

interface Props {
  isOpenDelete: boolean;
  setIsOpenDelete: Dispatch<SetStateAction<boolean>>;
  reviewId: string;
  setReviewId: Dispatch<SetStateAction<string>>;
  setSelectedMovieId: Dispatch<SetStateAction<string>>;
  setIsOpenAlert: Dispatch<SetStateAction<boolean>>;
  setAlertMessage: Dispatch<SetStateAction<string>>;
  setAlertType: Dispatch<SetStateAction<string>>;
}

export default function ReviewDeleteDialog(props: Props) {
  const { t } = useTranslation();
  const { deleteReview } = useApiContext();
  const handleDeletion = async () => {
    const reviewId = props.reviewId;
    const setIsOpenDelete = props.setIsOpenDelete;
    const setReviewId = props.setReviewId;
    const setSelectedMovieId = props.setSelectedMovieId;
    const setIsOpenAlert = props.setIsOpenAlert;
    const setAlertMessage = props.setAlertMessage;
    const setAlertType = props.setAlertType;
    const result = await deleteReview(reviewId);
    if (!result) return;

    const msg = t("successMessages.reviewDelete");
    setIsOpenDelete(false);
    setIsOpenAlert(true);
    setAlertMessage(msg);
    setAlertType("success");
  };

  return (
    <Dialog
      open={props.isOpenDelete}
      onClose={() => props.setIsOpenDelete(false)}
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
        <Button onClick={() => props.setIsOpenDelete(false)}>
          {t("buttons.quit")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
