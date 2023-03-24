import { Fab, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { useMoviePageData } from "./useMoviePageData";
import { Movie, ReviewListReview } from "../gql/graphql";
import AddReviewCard from "../components/cards/AddReviewCard";
import { useBottomScrollListener } from "react-bottom-scroll-listener";
import CardSkeletonComponent from "../components/CardSkeletonComponent";

export default function MoviePage() {
  const { currmovie_id } = useParams();
  const navigate = useNavigate();
  const { user: currUser } = useSessionContext();
  const [offset, setOffset] = useState<number>(0);
  const [reviewList, setReviewList] = useState<ReviewListReview[]>([]);
  const { movie, reviews, error, loading, totalCount } = useMoviePageData(
    currmovie_id!,
    offset
  );

  useBottomScrollListener(() => {
    console.log("scrolledbottom");
    console.log(totalCount)
    if (totalCount - offset > 3) {
      setOffset(offset + 3);
    }
    return;
  });

  useEffect(() => {
    if (!loading) {
      console.log(reviews);
      const list: ReviewListReview[] = [];
      list.push(...reviews);
      setReviewList([...reviewList, ...list]);
    }
  }, [loading]);

  const [editingMovie, setEditingMovie] = useState<Movie | undefined>(
    undefined
  );
  const [deletingMovie, setDeletingMovie] = useState<Movie | undefined>(
    undefined
  );
  const [editingReview, setEditingReview] = useState<
    ReviewListReview | undefined
  >(undefined);
  const [deletingReview, setDeletingReview] = useState<
    ReviewListReview | undefined
  >(undefined);

  useEffect(() => {
    if (!currUser) navigate("/login");
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
          <Typography variant="h4" sx={{ marginLeft: 10, marginTop: 10 }}>
            All reviews
          </Typography>
          <div
            style={{
              marginTop: 10,
              marginBottom: 30,
            }}
          >
            <Grid container spacing={4}>
              <>
                {reviewList.map((review: ReviewListReview) => (
                  <Grid item key={review.id} xs={12}>
                    <ReviewCard
                      review={review}
                      onEdit={() => setEditingReview(review)}
                      onDelete={() => setDeletingReview(review)}
                    />
                  </Grid>
                ))}
              </>
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
      </main>
      <ScrollTop>
        <Fab size="small" aria-label="scroll back to top">
          <KeyboardArrowUpIcon />
        </Fab>
      </ScrollTop>
    </>
  );
}
