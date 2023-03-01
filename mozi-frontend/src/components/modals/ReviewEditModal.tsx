import {
  Box,
  Button,
  Card,
  CardContent,
  InputLabel,
  MenuItem,
  Modal,
  Rating,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import { useTranslation } from "react-i18next";
import { useApiContext } from "../../api/ApiContext";

interface Props {
  isOpenEdit: boolean;
  setIsOpenEdit: Dispatch<SetStateAction<boolean>>;
  description: string;
  setDescription: Dispatch<SetStateAction<string>>;
  reviewId: string;
  setIsOpenAlert: Dispatch<SetStateAction<boolean>>;
  setAlertMessage: Dispatch<SetStateAction<string>>;
  setAlertType: Dispatch<SetStateAction<string>>;
}

export default function ReviewEditModal(props: Props) {
  const [value, setValue] = useState<number | null>(0);
  const { editReview } = useApiContext();
  const { t } = useTranslation();
  const updateReview = async () => {
    const reviewId = props.reviewId;
    const rating = value as number;
    const description = props.description;
    const setIsOpenEdit = props.setIsOpenEdit;
    const setIsOpenAlert = props.setIsOpenAlert;
    const setAlertMessage = props.setAlertMessage;
    const setAlertType = props.setAlertType;
    const result = await editReview({ id: reviewId, rating, description });
    if (!result) return;

    const msg = t("successMessages.reviewEdit");
    setIsOpenEdit(false);
    setIsOpenAlert(true);
    setAlertMessage(msg);
    setAlertType("success");
  };

  return (
    <Modal
      open={props.isOpenEdit}
      onClose={() => props.setIsOpenEdit(false)}
      data-testid="review-edit-modal"
    >
      <Box
        sx={{
          position: "absolute" as "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {t("review.selectedReview")}
        </Typography>
        <Card
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <CardContent>
            <Typography variant="subtitle1">
              {t("review.reviewCard.description")}:{" "}
            </Typography>
            <TextField
              defaultValue={props.description}
              onChange={(e) => props.setDescription(e.target.value)}
              sx={{ border: 1, borderRadius: 1 }}
              inputProps={{ "data-testid": "review-edit-modal-description" }}
            ></TextField>

            <InputLabel id="rating-select">
              {t("review.reviewCard.rating")}
            </InputLabel>
            <Rating
              name="movie-rating"
              value={value}
              onChange={(event, newValue) => {
                setValue(newValue);
              }}
              data-value={value}
              data-testid="review-edit-modal-rating"
            />
          </CardContent>
        </Card>
        <Button
          variant="contained"
          onClick={updateReview}
          sx={{ border: 1, borderRadius: 1 }}
          data-testid="review-edit-modal-button"
        >
          {t("buttons.edit")}
        </Button>
      </Box>
    </Modal>
  );
}
