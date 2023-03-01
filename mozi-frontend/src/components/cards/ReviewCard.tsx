import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { ReviewUpdated } from "../../api/types";
import { useTranslation } from "react-i18next";

interface Props {
  review: ReviewUpdated;
  setIsOpenEdit: Dispatch<SetStateAction<boolean>>;
  setIsOpenDelete: Dispatch<SetStateAction<boolean>>;
  setReviewId: Dispatch<SetStateAction<string>>;
  setUserId: Dispatch<SetStateAction<string>>;
  setDescription: Dispatch<SetStateAction<string>>;
  setMovieId: Dispatch<SetStateAction<string>>;
  setRating: Dispatch<SetStateAction<number>>;
  selectedUpdatedReview: ReviewUpdated;
  setSelectedUpdatedReview: Dispatch<SetStateAction<ReviewUpdated>>;
}

export default function ReviewCard(props: Props) {
  const { t } = useTranslation();
  const handleDeletePopup = () => {
    props.setIsOpenDelete(true);
    handleSelectedReview();
  };

  const handleEditPopup = () => {
    props.setIsOpenEdit(true);
    handleSelectedReview();
  };

  const handleSelectedReview = () => {
    props.setReviewId(props.selectedUpdatedReview.id);
    props.setUserId(props.selectedUpdatedReview.userId);
    props.setMovieId(props.selectedUpdatedReview.movieId);
    props.setDescription(props.selectedUpdatedReview.description);
    props.setRating(props.selectedUpdatedReview.rating);
  };

  return (
    <Card
      variant="outlined"
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderColor: "text.secondary",
        border: 3,
        borderRadius: 3,
        marginLeft: 5,
        marginRight: 5,
      }}
      data-testid="review-card"
    >
      <CardContent>
        <Typography variant="inherit" gutterBottom sx={{ mt: "auto" }}>
          {t("review.reviewCard.nameOfUser")} :
        </Typography>
        <Typography
          variant="h5"
          gutterBottom
          marginLeft={3}
          sx={{ mt: "auto" }}
          data-testid="review-card-name"
        >
          {props.review.firstName} {props.review.lastName}
        </Typography>
        <Typography variant="inherit" gutterBottom sx={{ mt: "auto" }}>
          {t("review.reviewCard.description")} :
        </Typography>
        <Typography
          variant="h5"
          gutterBottom
          marginLeft={3}
          sx={{ mt: "auto" }}
          data-testid="review-card-description"
        >
          {props.review.description}
        </Typography>
        <Typography variant="inherit" gutterBottom sx={{ mt: "auto" }}>
          {t("review.reviewCard.rating")} :
        </Typography>
        <Typography
          variant="h5"
          gutterBottom
          marginLeft={3}
          sx={{ mt: "auto" }}
          data-testid="review-card-rating"
        >
          {props.review.rating}
        </Typography>
      </CardContent>
      <CardActions disableSpacing sx={{ mt: "auto" }}>
        <Button
          size="small"
          sx={{ color: "text.secondary" }}
          onClick={handleEditPopup}
          onMouseEnter={() => {
            props.setSelectedUpdatedReview(props.review);
            handleSelectedReview();
          }}
          data-testid="review-edit-button"
        >
          {t("buttons.edit")}
        </Button>
        <Button
          size="small"
          sx={{ color: "text.secondary" }}
          onClick={handleDeletePopup}
          onMouseEnter={() => {
            props.setSelectedUpdatedReview(props.review);
            handleSelectedReview();
          }}
          data-testid="review-delete-button"
        >
          {t("buttons.delete")}
        </Button>
      </CardActions>
    </Card>
  );
}
