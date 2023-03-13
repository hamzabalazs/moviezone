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
import { AlertType, ReviewListReview } from "../../api/types";
import { gql, useMutation } from "@apollo/client";

interface Props {
  review?: ReviewListReview;
  onClose?: () => void;
  setAlert: Dispatch<SetStateAction<AlertType>>;
}

const DELETE_REVIEW = gql`
  mutation DeleteReview($input: DeleteReviewInput!) {
    deleteReview(input: $input) {
      id
      rating
      description
      movie {
        id
      }
      user {
        first_name
        last_name
        id
      }
    }
  }
`;

export default function ReviewDeleteDialog({
  review,
  onClose,
  setAlert
}: Props) {
  const { t } = useTranslation();
  const [DeleteReviewAPI,{data}] = useMutation(DELETE_REVIEW);

  const handleDeletion = async () => {
    if (review === undefined) return;
    const result = await DeleteReviewAPI({variables:{input:{id:review.id}}});
    if (result) {
      const msg = t("successMessages.reviewDelete");
      setAlert({isOpen:true,message:msg,type:"success"})
    }
    onClose?.();
  };

  if(data) return <p style={{visibility:"hidden",height:"0px",margin:"0px"}}>Success</p>


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
