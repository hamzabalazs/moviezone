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
import { AlertType, Movie, Review, ReviewUpdated } from "../api/types";
import AlertComponent from "../components/AlertComponent";
import MoviePageCard from "../components/cards/MoviePageCard";
import MovieDeleteDialog from "../components/dialogs/MovieDeleteDialog";
import ReviewDeleteDialog from "../components/dialogs/ReviewDeleteDialog";
import MovieEditModal from "../components/modals/MovieEditModal";
import ReviewEditModal from "../components/modals/ReviewEditModal";
import NavigationBar from "../components/NavigationBar";
import ScrollTop from "../components/ScrollTop";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ReviewCard from "../components/cards/ReviewCard";
import { useApiContext } from "../api/ApiContext";
import { useTranslation } from "react-i18next";

export default function MoviePage() {
  const navigate = useNavigate();
  const context = useApiContext();
  const currUser = context.user;
  const { t } = useTranslation();
  const [editingMovie, setEditingMovie] = useState<Movie | undefined>(
    undefined
  );
  const [deletingMovie, setDeletingMovie] = useState<Movie | undefined>(
    undefined
  );
  const [editingReview, setEditingReview] = useState<ReviewUpdated | undefined>(
    undefined
  );
  const [deletingReview, setDeletingReview] = useState<
    ReviewUpdated | undefined
  >(undefined);

  const [alert,setAlert] = useState<AlertType>({isOpen:false,message:"",type:undefined})
  const [ratingDescription, setRatingDescription] = useState("");
  const [value, setValue] = useState<number | null>(0);
  const [userReviewList, setUserReviewList] = useState<Review[]>([]);
  const [movieReviewList, setMovieReviewList] = useState<ReviewUpdated[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie>({
    id: "",
    title: "",
    description: "",
    poster: "",
    release_date: "",
    rating: 0,
    category: {
      id:"",
      name:""
    },
  });

  const { currMovieId } = useParams();
  const currMovie = context.movies.find((x) => x.id === currMovieId);

  useEffect(() => {
    const usersReviews = context.reviews.filter(
      (x) => x.userId === currUser?.id
    );
    setUserReviewList(usersReviews);
  }, [context.reviews]);

  useEffect(() => {
    
    if (currMovie !== undefined) {
      setSelectedMovie(currMovie);
      updateReviewList();
    }
  }, [context.movies]);

  useEffect(() => {
    if (alert.message === "Movie was deleted successfully!") {
      navigate("/");
    }
  }, [alert.message]);

  const handleAddReview = async () => {
    const movieId = currMovieId;
    const rating = value as number;
    const description = ratingDescription;

    if (
      movieId !== undefined &&
      userReviewList.length === 0 &&
      rating !== 0 &&
      description !== ""
    ) {
      const result = await context.addReview({ movieId, rating, description });
      if (!result) return;

      
      setAlert({isOpen:true,message:"Review success",type:"success"})
      setRatingDescription("");
      setValue(0);
    } else if (movieId === undefined) {
      setAlert({isOpen:true,message:"There is no movie to be rated",type:"error"})
    } else if (userReviewList.length !== 0) {
      setAlert({isOpen:true,message:"You have already rated this movie!",type:"error"})
    } else if (rating === 0) {
      setAlert({isOpen:true,message:"No rating has been given!",type:"error"})

    } else if (description === "") {
      setAlert({isOpen:true,message:"No description has been given!",type:"error"})
    } else {
      setAlert({isOpen:true,message:"Some error",type:"error"})
    }
  };

  async function updateReviewList() {
    const updatedReviewList: ReviewUpdated[] = [];
    for (let i = 0; i < context.reviews.length; i++) {
      const userId = context.reviews[i].userId;
      const user = context.users.find((x) => x.id === userId);
      if (user !== undefined) {
        const movieId = context.reviews[i].movieId;
        const userId = context.reviews[i].userId;
        const first_name = user.first_name;
        const last_name = user.last_name;
        const id = context.reviews[i].id;
        const description = context.reviews[i].description;
        const rating = context.reviews[i].rating;
        updatedReviewList.push({
          id,
          movieId,
          userId,
          first_name,
          last_name,
          description,
          rating,
        });
      } else continue;
    }
    const userReviews = updatedReviewList.filter(
      (x) => x.movieId === currMovieId && x.userId === currUser?.id
    );
    const movieReviews = updatedReviewList.filter(
      (x) => x.movieId === currMovieId
    );
    setUserReviewList(userReviews);
    setMovieReviewList(movieReviews);
  }

  useEffect(() => {
    updateReviewList();
  }, [context.reviews]);

  return (
    <>
      <NavigationBar />
      <main style={{ position: "relative", minHeight: "100vh" }}>
        <AlertComponent
          alert={alert}
          setAlert={setAlert}
        />
        <div style={{ paddingBottom: "2.5rem" }}>
          <MovieDeleteDialog
            movie={deletingMovie}
            onClose={() => setDeletingMovie(undefined)}
            setAlert={setAlert}
          />
          <MovieEditModal
            movie={editingMovie}
            onClose={() => setEditingMovie(undefined)}
            setAlert={setAlert}
          />
          <ReviewEditModal
            review={editingReview}
            onClose={() => setEditingReview(undefined)}
            setAlert={setAlert}
          />
          <ReviewDeleteDialog
            review={deletingReview}
            onClose={() => setDeletingReview(undefined)}
            setAlert={setAlert}
          />
          {context.movies.find((x) => x.id === currMovieId) && (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <MoviePageCard
                movie={selectedMovie}
                onEdit={() => setEditingMovie(selectedMovie)}
                onDelete={() => setDeletingMovie(selectedMovie)}
              />
            </div>
          )}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: 10,
              marginBottom: 30,
            }}
          >
            <Grid container spacing={4}>
              {movieReviewList.length !== 0 && (
                <>
                  {movieReviewList.map((review) => (
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
              {movieReviewList.length === 0 && (
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
                data-value={value}
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
