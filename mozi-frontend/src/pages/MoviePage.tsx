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
import { Movie, Review, ReviewUpdated } from "../api/types";
import AlertComponent from "../components/AlertComponent";
import MoviePageCard from "../components/cards/MoviePageCard";
import ReviewDisplayCard from "../components/cards/ReviewDisplayCard";
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
import { useMovies } from "../api/useMovies";

export default function MoviePage() {
  const navigate = useNavigate();
  const context = useApiContext();
  const { refetchData, movies } = useMovies();
  const currUser = context.user;
  const { t } = useTranslation();
  const [isOpenMovieDelete, setIsOpenMovieDelete] = useState(false);
  const [isOpenMovieEdit, setIsOpenMovieEdit] = useState(false);
  const [isOpenReviewDelete, setIsOpenReviewDelete] = useState(false);
  const [isOpenReviewEdit, setIsOpenReviewEdit] = useState(false);
  const [isOpenAlert, setIsOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [rating, setRating] = useState(1);
  const [ratingDescription, setRatingDescription] = useState("");
  const [reviewId, setReviewId] = useState("");
  const [userId, setUserId] = useState("");
  const [movieId, setMovieId] = useState("");
  const [value, setValue] = useState<number | null>(0);
  const [userReviewList, setUserReviewList] = useState<Review[]>([]);
  const [movieReviewList, setMovieReviewList] = useState<ReviewUpdated[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie>({
    id: "",
    title: "",
    description: "",
    poster: "",
    releaseDate: "",
    rating: 0,
    categoryId: "",
  });
  const [selectedReview, setSelectedReview] = useState<ReviewUpdated>({
    id: "",
    userId: "",
    movieId: "",
    firstName: "",
    lastName: "",
    description: "",
    rating: 0,
  });

  const { currMovieId } = useParams();

  useEffect(() => {
    const usersReviews = context.reviews.filter(
      (x) => x.userId === currUser?.id
    );
    setUserReviewList(usersReviews);
    refetchData();
  }, [context.reviews]);

  useEffect(() => {
    const currMovie = movies.find((x) => x.id === currMovieId);
    if (currMovie !== undefined) {
      setSelectedMovie(currMovie);
      updateReviewList();
    }
  }, [movies]);

  useEffect(() => {
    if (alertMessage === "Movie was deleted successfully!") {
      navigate("/");
    }
  }, [alertMessage]);

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
      console.log(result);
      await refetchData();
      if (!result) return;

      setAlertMessage("Review success");
      setAlertType("success");
      setIsOpenAlert(true);
      setRatingDescription("");
      setValue(0);
    } else if (movieId === undefined) {
      setAlertMessage("There is no movie to be rated");
      setAlertType("error");
      setIsOpenAlert(true);
    } else if (userReviewList.length !== 0) {
      setAlertMessage("You have already rated this movie!");
      setAlertType("error");
      setIsOpenAlert(true);
    } else if (rating === 0) {
      setAlertMessage("No rating has been given!");
      setAlertType("error");
      setIsOpenAlert(true);
    } else if (description === "") {
      setAlertMessage("No description has been given!");
      setAlertType("error");
      setIsOpenAlert(true);
    } else {
      setAlertMessage("Some error");
      setAlertType("error");
      setIsOpenAlert(true);
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
        const firstName = user.firstName;
        const lastName = user.lastName;
        const id = context.reviews[i].id;
        const description = context.reviews[i].description;
        const rating = context.reviews[i].rating;
        updatedReviewList.push({
          id,
          movieId,
          userId,
          firstName,
          lastName,
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
          isOpenAlert={isOpenAlert}
          setIsOpenAlert={setIsOpenAlert}
          alertMessage={alertMessage}
          alertType={alertType}
          setAlertType={setAlertType}
        />
        <div style={{ paddingBottom: "2.5rem" }}>
          <MovieDeleteDialog
            isOpenDelete={isOpenMovieDelete}
            setIsOpenDelete={setIsOpenMovieDelete}
            movieId={selectedMovie.id}
            setIsOpenAlert={setIsOpenAlert}
            setAlertMessage={setAlertMessage}
            setAlertType={setAlertType}
          />
          <MovieEditModal
            isOpenEdit={isOpenMovieEdit}
            setIsOpenEdit={setIsOpenMovieEdit}
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            releaseDate={releaseDate}
            setReleaseDate={setReleaseDate}
            categoryId={categoryId}
            setCategoryId={setCategoryId}
            movieId={selectedMovie.id}
            poster={selectedMovie.poster}
            setIsOpenAlert={setIsOpenAlert}
            setAlertMessage={setAlertMessage}
            setAlertType={setAlertType}
          />
          <ReviewEditModal
            isOpenEdit={isOpenReviewEdit}
            setIsOpenEdit={setIsOpenReviewEdit}
            description={description}
            setDescription={setDescription}
            reviewId={reviewId}
            setIsOpenAlert={setIsOpenAlert}
            setAlertMessage={setAlertMessage}
            setAlertType={setAlertType}
          />
          <ReviewDeleteDialog
            isOpenDelete={isOpenReviewDelete}
            setIsOpenDelete={setIsOpenReviewDelete}
            reviewId={reviewId}
            setReviewId={setReviewId}
            setSelectedMovieId={setMovieId}
            setIsOpenAlert={setIsOpenAlert}
            setAlertMessage={setAlertMessage}
            setAlertType={setAlertType}
          />
          <div style={{ display: "flex", justifyContent: "center" }}>
            <MoviePageCard
              movie={selectedMovie}
              userRole={currUser?.role}
              setIsOpenDelete={setIsOpenMovieDelete}
              setIsOpenEdit={setIsOpenMovieEdit}
              setTitle={setTitle}
              setDescription={setDescription}
              setReleaseDate={setReleaseDate}
              setCategoryId={setCategoryId}
              setRating={setRating}
              selectedMovie={selectedMovie}
              setSelectedMovie={setSelectedMovie}
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
            <Grid container spacing={4}>
              {(currUser?.role === "admin" || currUser?.role === "editor") && (
                <>
                  {movieReviewList.length !== 0 && (
                    <>
                      {movieReviewList.map((review) => (
                        <Grid item key={review.id} xs={12}>
                          <ReviewCard
                            review={review}
                            setIsOpenEdit={setIsOpenReviewEdit}
                            setIsOpenDelete={setIsOpenReviewDelete}
                            setReviewId={setReviewId}
                            setUserId={setUserId}
                            setDescription={setDescription}
                            setMovieId={setMovieId}
                            setRating={setRating}
                            selectedUpdatedReview={selectedReview}
                            setSelectedUpdatedReview={setSelectedReview}
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
                </>
              )}
              {currUser?.role === "viewer" && (
                <>
                  {movieReviewList.length !== 0 && (
                    <>
                      {movieReviewList.map((review) => (
                        <Grid item key={review.id} xs={12}>
                          <ReviewDisplayCard review={review} />
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
                </>
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
