import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";
import { Review, ReviewListReview } from "../../api/types";
import { useTranslation } from "react-i18next";
import { useSessionContext } from "../../api/SessionContext";

interface Props {
  review: Review;
  onEdit:() => void;
  onDelete:() => void;
}

export default function ReviewCard({review,onEdit,onDelete}: Props) {
  const { t } = useTranslation();
  const {user} = useSessionContext()

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
          {review.user.first_name} {review.user.last_name}
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
          {review.description}
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
          {review.rating}
        </Typography>
      </CardContent>
      {((user?.role === "admin" || user?.role === "editor") || (user?.id === review.user.id)) &&(
        <CardActions disableSpacing sx={{ mt: "auto" }}>
        {onEdit && (
          <Button
          size="small"
          sx={{ color: "text.secondary" }}
          onClick={() => onEdit()}
          data-testid="review-edit-button"
        >
          {t("buttons.edit")}
        </Button>
        )}
        {onDelete && (
          <Button
          size="small"
          sx={{ color: "text.secondary" }}
          onClick={() => onDelete()}
          data-testid="review-delete-button"
        >
          {t("buttons.delete")}
        </Button>
        )}
      </CardActions>
      )}
    </Card>
  );
}
