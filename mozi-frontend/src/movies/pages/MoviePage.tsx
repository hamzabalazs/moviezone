import { Fab, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MoviePageCard from "../components/MoviePageCard";
import MovieDeleteDialog from "../components/MovieDeleteDialog";
import ReviewDeleteDialog from "../../reviews/components/ReviewDeleteDialog";
import ReviewEditModal from "../../reviews/components/ReviewEditModal";
import NavigationBar from "../../common/components/NavigationBar";
import ScrollTop from "../../common/components/ScrollTop";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useSessionContext } from "../../auth/context/SessionContext";
import { useMoviePageData } from "../hooks/useMoviePageData";
import { Cast, Movie, Review } from "../../gql/graphql";
import AddReviewCard from "../../reviews/components/AddReviewCard";
import { useBottomScrollListener } from "react-bottom-scroll-listener";
import CardSkeletonComponent from "../../common/components/CardSkeletonComponent";
import MovieEditModal from "../components/MovieEditModal";
import ReviewCard from "../../reviews/components/ReviewCard";
import CastAddModal from "../../cast/components/CastAddModal";
import CastCard from "../../cast/components/CastCard";
import { useTranslation } from "react-i18next";
import MyFooter from "../../common/components/MyFooter";

export default function MoviePage() {
  const { currmovie_id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user: currUser } = useSessionContext();
  let currentLength = 0;
  const { movie, reviews, cast, loading, totalCount, fetchMore } =
    useMoviePageData(currmovie_id!);

  useBottomScrollListener(() => {
    if (!loading) {
      currentLength += reviews.length;
      if (currentLength >= totalCount) return;
      fetchMore({
        variables: {
          input: {
            id: currmovie_id,
          },
          input2: {
            movie_id: currmovie_id,
            limit: 3,
            offset: currentLength,
          },
          input3: {
            user_id: "",
            movie_id: currmovie_id,
          },
        },
      });
    }
  });

  const [editingMovie, setEditingMovie] = useState<Movie | undefined>(
    undefined
  );
  const [deletingMovie, setDeletingMovie] = useState<Movie | undefined>(
    undefined
  );
  const [castAddMovie, setCastAddMovie] = useState<Movie | undefined>(
    undefined
  );
  const [editingReview, setEditingReview] = useState<Review | undefined>(
    undefined
  );
  const [deletingReview, setDeletingReview] = useState<Review | undefined>(
    undefined
  );

  useEffect(() => {
    if (!currUser) navigate("/login");
    window.scrollTo(0, 0);
  }, []);

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
          <CastAddModal
            movie={castAddMovie}
            onClose={() => setCastAddMovie(undefined)}
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
                onCastAdd={() => setCastAddMovie(movie)}
              />
            )}
          </div>
          <Typography
            variant="h4"
            sx={{ marginLeft: "7%", marginTop: "3%", marginBottom: "2%" }}
          >
            {t("moviepage.cast")}
          </Typography>
          <Grid
            container
            spacing={2}
            sx={{
              marginLeft: "7%",
              marginRight: "7%",
              marginBottom: "3%",
              border: 2,
              borderRadius: 5,
              width: "86%",
            }}
          >
            {cast.map((cast: Cast) => (
              <Grid item key={cast.id} xs="auto">
                <CastCard cast={cast} />
              </Grid>
            ))}
          </Grid>
          <AddReviewCard currmovie_id={currmovie_id!} reviews={reviews} />
          <Typography variant="h4" sx={{ marginLeft: 10, marginTop: 10 }}>
            {t("moviepage.allReviews")}
          </Typography>
          <div
            style={{
              marginTop: 10,
              marginBottom: 30,
            }}
          >
            <Grid container spacing={4}>
              {reviews.map((review: Review) => (
                <Grid item key={review.id} xs={12}>
                  <ReviewCard
                    review={review}
                    onEdit={() => setEditingReview(review)}
                    onDelete={() => setDeletingReview(review)}
                  />
                </Grid>
              ))}
            </Grid>
            {loading && (
              <Grid container spacing={4} sx={{ marginTop: 0 }}>
                <CardSkeletonComponent />
                <CardSkeletonComponent />
                <CardSkeletonComponent />
              </Grid>
            )}
          </div>
        </div>
        <MyFooter />
      </main>
      <ScrollTop>
        <Fab size="small" aria-label="scroll back to top">
          <KeyboardArrowUpIcon />
        </Fab>
      </ScrollTop>
    </>
  );
}
