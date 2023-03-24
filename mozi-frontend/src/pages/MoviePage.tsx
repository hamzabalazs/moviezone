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
import {
  EXPIRED_TOKEN_MESSAGE,
  NOT_VALID_REVIEW,
} from "../common/errorMessages";
import { useMoviePageData } from "./useMoviePageData";
import { useReview } from "../api/review/useReview";
import { MovieWithReviews, ReviewListReview } from "../gql/graphql";
import AddReviewCard from "../components/cards/AddReviewCard";

export default function MoviePage() {
  const { currmovie_id } = useParams();
  const navigate = useNavigate();
  const { user: currUser } = useSessionContext();
  const { movie, error, loading } = useMoviePageData(currmovie_id!);

  const { t } = useTranslation();

  const [editingMovie, setEditingMovie] = useState<
    MovieWithReviews | undefined
  >(undefined);
  const [deletingMovie, setDeletingMovie] = useState<
    MovieWithReviews | undefined
  >(undefined);
  const [editingReview, setEditingReview] = useState<
    ReviewListReview | undefined
  >(undefined);
  const [deletingReview, setDeletingReview] = useState<
    ReviewListReview | undefined
  >(undefined);

  useEffect(() => {
    if (!currUser) navigate("/login");
  }, []);

  useEffect(() => {
    if (error) navigate("/");
  }, [error]);

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
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: 10,
            }}
          >
            {movie && (
              <MoviePageCard
                movie={movie}
                onEdit={() => setEditingMovie(movie)}
                onDelete={() => setDeletingMovie(movie)}
              />
            )}
          </div>
          <AddReviewCard currmovie_id={currmovie_id!} />
          <Typography variant="h4" sx={{ marginLeft: 10 , marginTop:10}}>
            All reviews
          </Typography>
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
                    {movie.reviews.map((review: ReviewListReview) => (
                      <Grid item key={review.id} xs={12}>
                        <ReviewCard
                          review={review}
                          onEdit={() => setEditingReview(review)}
                          onDelete={() => setDeletingReview(review)}
                        />
                      </Grid>
                    ))}
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
