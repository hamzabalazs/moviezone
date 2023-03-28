import { Fab, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MoviePageCard from "./MoviePageCard";
import MovieDeleteDialog from "./MovieDeleteDialog";
import ReviewDeleteDialog from "../reviews/ReviewDeleteDialog";
import ReviewEditModal from "../reviews/ReviewEditModal";
import NavigationBar from "../common/components/NavigationBar";
import ScrollTop from "../common/components/ScrollTop";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useSessionContext } from "../auth/SessionContext";
import { useMoviePageData } from "./useMoviePageData";
import { Movie, Review } from "../gql/graphql";
import AddReviewCard from "../reviews/AddReviewCard";
import { useBottomScrollListener } from "react-bottom-scroll-listener";
import CardSkeletonComponent from "../common/components/CardSkeletonComponent";
import MovieEditModal from "./MovieEditModal";
import ReviewCard from "../reviews/ReviewCard";

export default function MoviePage() {
  const { currmovie_id } = useParams();
  const navigate = useNavigate();
  const { user: currUser } = useSessionContext();
  let currentLength = 0;
  const { movie, reviews, loading, totalCount, fetchMore } = useMoviePageData(
    currmovie_id!
  );

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
  const [editingReview, setEditingReview] = useState<Review | undefined>(
    undefined
  );
  const [deletingReview, setDeletingReview] = useState<Review | undefined>(
    undefined
  );

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
          <AddReviewCard currmovie_id={currmovie_id!} reviews={reviews}/>
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
      </main>
      <ScrollTop>
        <Fab size="small" aria-label="scroll back to top">
          <KeyboardArrowUpIcon />
        </Fab>
      </ScrollTop>
    </>
  );
}
