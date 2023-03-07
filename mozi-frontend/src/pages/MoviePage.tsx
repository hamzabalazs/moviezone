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
import { AlertType, Movie, Review } from "../api/types";
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
import { useMovies } from "../api/movie/useMovies";

export default function MoviePage() {
  const navigate = useNavigate();
  const context = useApiContext();
  const {refetchData} = useMovies()
  const currUser = context.user;
  const { t } = useTranslation();
  const [editingMovie, setEditingMovie] = useState<Movie | undefined>(
    undefined
  );
  const [deletingMovie, setDeletingMovie] = useState<Movie | undefined>(
    undefined
  );
  const [editingReview, setEditingReview] = useState<Review | undefined>(
    undefined
  );
  const [deletingReview, setDeletingReview] = useState<
    Review | undefined
  >(undefined);

  const [alert,setAlert] = useState<AlertType>({isOpen:false,message:"",type:undefined})
  const [ratingDescription, setRatingDescription] = useState("");
  const [value, setValue] = useState<number | null>(0);
  const [userReviewList, setUserReviewList] = useState<Review[]>([]);
  const [movieReviewList, setMovieReviewList] = useState<Review[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie>({
    id: "",
    title: "",
    description: "",
    poster: "",
    release_date: "",
    rating: "0",
    category: {
      id:"",
      name:""
    },
  });

  const { currmovie_id } = useParams();
  const currMovie = context.movies.find((x) => x.id === currmovie_id);

  useEffect(() => {
    const usersReviews = context.reviews.filter(
      (x) => x.user.id === currUser?.id
    );
    setUserReviewList(usersReviews);
    if(currMovie){
      setSelectedMovie(currMovie)
      
    }
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
    const movie_id = currmovie_id;
    let rating;
    if(value){
      rating = value.toString()
    }
    else rating = "0"
    const description = ratingDescription;
    if(currUser){
      const user_id = currUser.id
      if (
        movie_id !== undefined &&
        userReviewList.length === 0 &&
        rating !== "0" &&
        description !== "" &&
        currUser
      ) {
        const result = await context.addReview(rating,description,movie_id,user_id);
        if (!result) return;
  
        
        setAlert({isOpen:true,message:"Review success",type:"success"})
        setRatingDescription("");
        setValue(0);
      } else if (movie_id === undefined) {
        setAlert({isOpen:true,message:"There is no movie to be rated",type:"error"})
      } else if (userReviewList.length !== 0) {
        setAlert({isOpen:true,message:"You have already rated this movie!",type:"error"})
      } else if (rating === "0") {
        setAlert({isOpen:true,message:"No rating has been given!",type:"error"})
  
      } else if (description === "") {
        setAlert({isOpen:true,message:"No description has been given!",type:"error"})
      } else {
        setAlert({isOpen:true,message:"Some error",type:"error"})
      }
    }
    
  };

  async function updateReviewList() {
    const userReviews = context.reviews.filter(
      (x) => x.movie.id === currmovie_id && x.user.id === currUser?.id
    );
    const movieReviews = context.reviews.filter(
      (x) => x.movie.id === currmovie_id
    );
    setUserReviewList(userReviews);
    setMovieReviewList(movieReviews);
  }

  useEffect(() => {
    updateReviewList();
    refetchData();
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
          {context.movies.find((x) => x.id === currmovie_id) && (
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
