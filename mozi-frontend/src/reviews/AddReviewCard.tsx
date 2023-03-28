import {
  Button,
  Card,
  CardActions,
  CardContent,
  InputLabel,
  Rating,
  TextField,
  Typography,
} from "@mui/material";
import { t } from "i18next";
import { enqueueSnackbar } from "notistack";
import { useState } from "react";
import { useReview } from "./useReview";
import { useSessionContext } from "../auth/SessionContext";
import {
  EXPIRED_TOKEN_MESSAGE,
  NOT_VALID_REVIEW,
} from "../common/errorMessages";
import { Review } from "../gql/graphql";

interface Props{
    currmovie_id: string;
    reviews: Review[]
}

export default function AddReviewCard({
  currmovie_id,
  reviews
}:Props) {
  const context = useSessionContext();
  const currUser = context.user!;
  const { addReview: AddReviewAPI } = useReview(currmovie_id!,currUser!.id);
  const [ratingDescription,setRatingDescription] = useState<string>("")
  const [rating,setRating] = useState<number>(0)
  const reviewsOfUser = reviews.filter(
    (x: Review) => x.user.id === currUser.id
  );

  const handleAddReview = async () => {
    const movie_id = currmovie_id;
    let ratingString;
    if (rating) {
      ratingString = rating.toString();
    } else ratingString = "0";
    const description = ratingDescription;
    if (currUser && reviewsOfUser) {
      const user_id = currUser.id;
      if (
        movie_id !== undefined &&
        reviewsOfUser.length === 0 &&
        ratingString !== "0" &&
        description !== "" &&
        currUser
      ) {
        try {
          const result = await AddReviewAPI(
            ratingString,
            description,
            movie_id,
            user_id
          );
          if (result) {
            const msg = t("successMessages.reviewAdd");
            enqueueSnackbar(msg, { variant: "success" });

            setRatingDescription("");
            setRating(0);
          }
        } catch (error: any) {
          if (error.message === EXPIRED_TOKEN_MESSAGE) {
            const msg = t("failMessages.expiredToken");
            enqueueSnackbar(msg, { variant: "error" });
            context.logOut();
          } else if (error.message === NOT_VALID_REVIEW) {
            const msg = t("validityFailure.reviewNotValid");
            enqueueSnackbar(msg, { variant: "error" });
          } else {
            const msg = t("someError");
            enqueueSnackbar(msg, { variant: "error" });
          }
        }
      } else if (description === "") {
        const msg = t("failMessages.reviewDescriptionMissing");
        enqueueSnackbar(msg, { variant: "error" });
      } else if (ratingString === "0") {
        const msg = t("failMessages.reviewRatingMissing");
        enqueueSnackbar(msg, { variant: "error" });
      } else if (reviewsOfUser.length !== 0) {
        const msg = t("failMessages.reviewAddMultiple");
        enqueueSnackbar(msg, { variant: "error" });
      }
    }
  };
  return (
    <Card
      variant="outlined"
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        marginLeft: 10,
        marginRight: 10,
      }}
    >
      <CardContent>
        <Typography variant="h2">{t("addTitle.review")}</Typography>
        <TextField
          label={t("review.reviewCard.description")}
          value={ratingDescription}
          sx={{
            marginBottom: 1,
            border: 1,
            borderRadius: 1,
          }}
          fullWidth
          onChange={(e) => setRatingDescription(e.target.value)}
          inputProps={{ "data-testid": "moviepage-review-description" }}
        ></TextField>

        <InputLabel id="rating-select">
          {t("review.reviewCard.rating")}
        </InputLabel>
        <Rating
          name="movie-rating"
          value={rating}
          onChange={(event, newValue) => {
            setRating(newValue!);
          }}
          data-testid="moviepage-review-rating"
          data-value={rating?.toString()}
        />
        <CardActions>
          <Button
            sx={{
              marginTop: 2,
              border: 1,
              borderRadius: 1,
              backgroundColor: "secondary.main",
              color: "#fff",
            }}
            onClick={handleAddReview}
          >
            {t("buttons.add")}
          </Button>
        </CardActions>
      </CardContent>
    </Card>
  );
}
