import {
  Box,
  Button,
  Card,
  CardContent,
  InputLabel,
  Modal,
  Rating,
  TextField as MuiTextField,
  TextFieldProps,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { ReviewListReview } from "../../api/types";
import * as Yup from "yup";
import { EXPIRED_TOKEN_MESSAGE, NOT_VALID_REVIEW } from "../../common/errorMessages";
import { useSessionContext } from "../../api/SessionContext";
import { useReview } from "../../api/review/useReview";

interface Props {
  review?: ReviewListReview;
  onClose?: () => void;
}

export default function ReviewEditModal({ review, onClose }: Props) {
  let id = ""
  if(review){
    if(review.movie){
      id = review.movie.id
    }
  }
  const {updateReview:UpdateReviewAPI} = useReview(id)
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { logOut } = useSessionContext();
  const updateReview = async (
    editedReview: Omit<ReviewListReview, "id" | "movie" | "user">
  ) => {
    if (review === undefined) return;

    try {
      const result = await UpdateReviewAPI(review.id,editedReview.rating,editedReview.description)
      if(result){
        const msg = t("successMessages.reviewEdit");
        enqueueSnackbar(msg, { variant: "success" });
        onClose?.();
      }
    } catch (error: any) {
      if (error.message === EXPIRED_TOKEN_MESSAGE) {
        const msg = t("failMessages.expiredToken");
        enqueueSnackbar(msg, { variant: "error" });
        logOut();
      } 
      else if(error.message === NOT_VALID_REVIEW){
        const msg = t("validityFailure.reviewNotValid")
        enqueueSnackbar(msg, { variant: "error" });
      }else {
        const msg = t("someError");
        enqueueSnackbar(msg, { variant: "error" });
      }
    }
  };
  const schema = useEditReviewSchema();

  const formik = useFormik({
    initialValues: {
      description: review?.description || "",
      rating: review?.rating || "0",
    },
    onSubmit: updateReview,
    enableReinitialize: true,
    validationSchema: schema,
  });
  return (
    <Modal
      open={Boolean(review)}
      onClose={() => onClose?.()}
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
              id="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              sx={{ border: 1, borderRadius: 1 }}
              inputProps={{ "data-testid": "review-edit-modal-description" }}
              error={formik.errors.description}
            ></TextField>
            <InputLabel id="rating-select">
              {t("review.reviewCard.rating")}
            </InputLabel>
            <Rating
              name="rating"
              id="rating"
              value={parseInt(formik.values.rating)}
              onChange={formik.handleChange}
              data-value={formik.values.rating}
              data-testid="review-edit-modal-rating"
            />
          </CardContent>
        </Card>
        <Button
          type="submit"
          variant="contained"
          sx={{ border: 1, borderRadius: 1 }}
          data-testid="review-edit-modal-edit"
        >
          {t("buttons.edit")}
        </Button>
      </Box>
    </Modal>
  );
}

function TextField({
  error,
  ...props
}: Omit<TextFieldProps, "error"> & { error?: string }): JSX.Element {
  return (
    <>
      <MuiTextField {...props} />
      {error ? (
        <Typography
          variant="subtitle2"
          sx={{ color: "red" }}
          data-testid="register-error-first_name"
        >
          {error}
        </Typography>
      ) : null}
    </>
  );
}

function useEditReviewSchema() {
  const { t } = useTranslation();

  return Yup.object({
    description: Yup.string().required(t("formikErrors.descriptionReq") || ""),
    rating: Yup.number().required(t("formikErrors.ratingReq") || ""),
  });
}
