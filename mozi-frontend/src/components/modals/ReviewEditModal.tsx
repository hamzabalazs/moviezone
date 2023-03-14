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
import { useSnackbar } from 'notistack'
import { useTranslation } from "react-i18next";
import { gql, useMutation } from "@apollo/client";
import { AlertType, ReviewListReview } from "../../api/types";
import * as Yup from "yup";

interface Props {
  review?: ReviewListReview;
  onClose?: () => void;
}

const UPDATE_REVIEW = gql`
  mutation UpdateReview($input: UpdateReviewInput!) {
    updateReview(input: $input) {
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

export default function ReviewEditModal({ review, onClose }: Props) {
  const [UpdateReviewAPI,{data}] = useMutation(UPDATE_REVIEW);
  const { t } = useTranslation();
  const {enqueueSnackbar} = useSnackbar()
  const updateReview = async (
    editedReview: Omit<ReviewListReview, "id" | "movie" | "user">
  ) => {
    if (review === undefined) return;
    const result = await UpdateReviewAPI({
      variables: {
        input: {
          id: review.id,
          description: editedReview.description,
          rating: editedReview.rating,
        },
      },
    });
    if (result) {
      const msg = t("successMessages.reviewEdit");
      enqueueSnackbar(msg,{variant:"success"})
    }
    onClose?.();
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

  //if(data) return <p style={{visibility:"hidden",height:"0px",margin:"0px"}}>Success</p>

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
