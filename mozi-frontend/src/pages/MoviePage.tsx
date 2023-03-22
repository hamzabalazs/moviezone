import {
  Button,
  Card,
  CardActions,
  CardContent,
  Fab,
  Grid,
  InputLabel,
  Rating,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MovieWithReviews, Review, ReviewListReview } from "../api/types";
import { useSnackbar } from "notistack";
import MoviePageCard from "../components/cards/MoviePageCard";
import MovieDeleteDialog from "../components/dialogs/MovieDeleteDialog";
import ReviewDeleteDialog from "../components/dialogs/ReviewDeleteDialog";
import MovieEditModal from "../components/modals/MovieEditModal";
import ReviewEditModal from "../components/modals/ReviewEditModal";
import NavigationBar from "../components/NavigationBar";
import ScrollTop from "../components/ScrollTop";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ReviewCard from "../components/cards/ReviewCard";
import { useTranslation } from "react-i18next";
import LoadingComponent from "../components/LoadingComponent";
import { useSessionContext } from "../api/SessionContext";
import { EXPIRED_TOKEN_MESSAGE, NOT_VALID_REVIEW } from "../common/errorMessages";
import { useMoviePageData } from "./useMoviePageData";
import { useReview } from "../api/review/useReview";

export default function MoviePage() {
  const { currmovie_id } = useParams();
  const navigate = useNavigate();
  const context = useSessionContext();
  const currUser = context.user!;
  const { enqueueSnackbar } = useSnackbar();
  const { movie, error, loading } = useMoviePageData(currmovie_id!)
  const {addReview:AddReviewAPI} = useReview(currmovie_id!)
  const { t } = useTranslation();

  const [editingMovie, setEditingMovie] = useState<MovieWithReviews | undefined>(
    undefined
  );
  const [deletingMovie, setDeletingMovie] = useState<MovieWithReviews | undefined>(
    undefined
  );
  const [editingReview, setEditingReview] = useState<
    ReviewListReview | undefined
  >(undefined);
  const [deletingReview, setDeletingReview] = useState<
    ReviewListReview | undefined
  >(undefined);
  const [ratingDescription, setRatingDescription] = useState("");
  const [value, setValue] = useState<number | null>(0);
  const reviewsOfUser = movie?.reviews.filter((x) => x.user.id === currUser.id)

  useEffect(() => {
    if (!currUser) navigate("/login");
  }, []);

  useEffect(() => {
    if (error) navigate("/");
  }, [error]);

  const handleAddReview = async () => {
    const movie_id = currmovie_id;
    let rating;
    if (value) {
      rating = value.toString();
    } else rating = "0";
    const description = ratingDescription;
    if (currUser) {
      const user_id = currUser.id;
      if (
        movie_id !== undefined &&
        reviewsOfUser.length === 0 &&
        rating !== "0" &&
        description !== "" &&
        currUser
      ) {
        try {
          const result = await AddReviewAPI(rating,description,movie_id,user_id);
          if(result){
            const msg = t("successMessages.reviewAdd");
            enqueueSnackbar(msg, { variant: "success" });
  
            setRatingDescription("");
            setValue(0);
          }
        } catch (error: any) {
          if (error.message === EXPIRED_TOKEN_MESSAGE) {
            const msg = t("failMessages.expiredToken");
            enqueueSnackbar(msg, { variant: "error" });
            context.logOut();
          }
          else if(error.message === NOT_VALID_REVIEW){
            const msg = t("validityFailure.reviewNotValid")
            enqueueSnackbar(msg, { variant: "error" });
          }
          else {
            const msg = t("someError");
            enqueueSnackbar(msg, { variant: "error" });
          }
        }
      } else if (description === "") {
        const msg = t("failMessages.reviewDescriptionMissing");
        enqueueSnackbar(msg, { variant: "error" });
      } else if (rating === "0") {
        const msg = t("failMessages.reviewRatingMissing");
        enqueueSnackbar(msg, { variant: "error" });
      } else if (movie.reviews.filter((x) => x.user.id === user_id).length !== 0) {
        const msg = t("failMessages.reviewAddMultiple");
        enqueueSnackbar(msg, { variant: "error" });
      }
    }
  };

  if (loading) return LoadingComponent(loading);

  return (
    <>
      <NavigationBar />
      <main style={{ position: "relative", minHeight: "100vh" }}>
        <div style={{ paddingBottom: "2.5rem" }}>
          <MovieDeleteDialog
            movie={deletingMovie}
            onClose={() => setDeletingMovie(undefined)}
          />
          <MovieEditModal
            movie={editingMovie}
            onClose={() => setEditingMovie(undefined)}
          />
          <ReviewEditModal
            review={editingReview}
            onClose={() => setEditingReview(undefined)}
          />
          <ReviewDeleteDialog
            review={deletingReview}
            onClose={() => setDeletingReview(undefined)}
          />
          <div style={{ display: "flex", justifyContent: "center" }}>
            <MoviePageCard
              movie={movie}
              onEdit={() => setEditingMovie(movie)}
              onDelete={() => setDeletingMovie(movie)}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: 10,
              marginBottom: 30,
            }}
          >
            {movie !== null && (

              <Grid container spacing={4}>
              {movie.reviews.length !== 0 && (
                <>
                  {movie.reviews.map(
                    (review: Review) => (
                      <Grid item key={review.id} xs={12}>
                        <ReviewCard
                          review={review}
                          onEdit={() => setEditingReview(review)}
                          onDelete={() => setDeletingReview(review)}
                          />
                      </Grid>
                    )
                  )}
                </>
              )}
              {movie.reviews.length === 0 && (
                <Grid item xs={12}>
                  <Typography
                    variant="h6"
                    align="center"
                    color="textPrimary"
                    gutterBottom
                    >
                    {t("review.noReviewFoundForMovie")}
                  </Typography>
                </Grid>
              )}
            </Grid>
                    )}
          </div>
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
                value={value}
                onChange={(event, newValue) => {
                  setValue(newValue);
                }}
                data-testid="moviepage-review-rating"
                data-value={value?.toString()}
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
        </div>
      </main>
      <ScrollTop>
        <Fab size="small" aria-label="scroll back to top">
          <KeyboardArrowUpIcon />
        </Fab>
      </ScrollTop>
    </>
  );
}
