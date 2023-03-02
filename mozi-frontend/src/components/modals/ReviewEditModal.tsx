import {
  Box,
  Button,
  Card,
  CardContent,
  InputLabel,
  Modal,
  Rating,
  TextField,
  Typography,
} from "@mui/material";
import { FormikErrors, useFormik } from "formik";
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
  const updateReview = async (description: string) => {
    const reviewId = props.reviewId;
    const rating = value as number;
    const setIsOpenEdit = props.setIsOpenEdit;
    const setIsOpenAlert = props.setIsOpenAlert;
    const setAlertMessage = props.setAlertMessage;
    const setAlertType = props.setAlertType;
    if (rating === 0) {
      const msg = t("formikErrors.ratingReq");
      setIsOpenAlert(true);
      setAlertMessage(msg);
      setAlertType("error");
      return
    }
    const result = await editReview({ id: reviewId, rating, description });
    if (!result) return;

    const msg = t("successMessages.reviewEdit");
    setIsOpenEdit(false);
    setIsOpenAlert(true);
    setAlertMessage(msg);
    setAlertType("success");
  };

  interface Values {
    description: string;
  }

  const formik = useFormik({
    initialValues: {
      description: props.description,
    },
    onSubmit: async (values) => {
      updateReview(values.description);
    },
    validate: (values) => {
      let errors: FormikErrors<Values> = {};
      if (!values.description) {
        const msg = t("formikErrors.descriptionReq");
        errors.description = msg;
      }

      return errors;
    },
  });

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
        component="form"
        onSubmit={formik.handleSubmit}
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
              id="description"
              onChange={formik.handleChange}
              sx={{ border: 1, borderRadius: 1 }}
              inputProps={{ "data-testid": "review-edit-modal-description" }}
            ></TextField>
            {formik.errors.description ? (
              <Typography
                variant="subtitle2"
                sx={{ color: "red" }}
                data-testid="review-edit-error-description"
              >
                {formik.errors.description}
              </Typography>
            ) : null}
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
          type="submit"
          variant="contained"
          sx={{ border: 1, borderRadius: 1 }}
          data-testid="review-edit-modal-button"
        >
          {t("buttons.edit")}
        </Button>
      </Box>
    </Modal>
  );
}
