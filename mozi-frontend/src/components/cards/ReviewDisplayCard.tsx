import { Card, CardContent, Typography } from "@mui/material";
import { Review} from "../../api/types";
import { useTranslation } from "react-i18next";

interface Props {
  review: Review;
}

export default function ReviewDisplayCard(props: Props) {
  const { t } = useTranslation();
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
          {props.review.user.first_name} {props.review.user.last_name}
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
    </Card>
  );
}
