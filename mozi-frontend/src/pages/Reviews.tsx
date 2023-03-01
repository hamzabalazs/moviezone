import { Container, Fab, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { ReviewUpdated } from "../api/types";
import ReviewDeleteDialog from "../components/dialogs/ReviewDeleteDialog";
import ReviewEditModal from "../components/modals/ReviewEditModal";
import MyFooter from "../components/MyFooter";
import NavigationBar from "../components/NavigationBar";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ScrollTop from "../components/ScrollTop";
import ReviewCard from "../components/cards/ReviewCard";
import AlertComponent from "../components/AlertComponent";
import { useApiContext } from "../api/ApiContext";
import { useTranslation } from "react-i18next";

function Reviews() {
  const { t } = useTranslation();
  const context = useApiContext();
  const currUser = context.user;
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [isOpenAlert, setIsOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [reviewId, setReviewId] = useState("");
  const [userId, setUserId] = useState("");
  const [movieId, setMovieId] = useState("");
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState(0);
  const [updatedReviewLists, setUpdatedReviewLists] = useState<ReviewUpdated[]>(
    []
  );
  const [reviewListOfUser, setReviewListOfUser] = useState<ReviewUpdated[]>([]);
  const [selectedUpdatedReview, setSelectedUpdatedReview] =
    useState<ReviewUpdated>({
      id: "",
      userId: "",
      movieId: "",
      firstName: "",
      lastName: "",
      description: "",
      rating: 0,
    });

  useEffect(() => {
    fillUpdatedReviewList();
  }, [context.reviews]);

  async function fillUpdatedReviewList() {
    const updatedReviewList: ReviewUpdated[] = [];
    for (let i = 0; i < context.reviews.length; i++) {
      const userId = context.reviews[i].userId;
      const user = context.users.find((x) => x.id === userId);
      if (user !== undefined) {
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
    if (currUser) {
      const usersReviews = updatedReviewList.filter(
        (x) => x.userId === currUser.id
      );
      setReviewListOfUser(usersReviews);
      setUpdatedReviewLists(updatedReviewList);
    }
  }

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
        <ReviewEditModal
          isOpenEdit={isOpenEdit}
          setIsOpenEdit={setIsOpenEdit}
          description={description}
          setDescription={setDescription}
          reviewId={reviewId}
          setIsOpenAlert={setIsOpenAlert}
          setAlertMessage={setAlertMessage}
          setAlertType={setAlertType}
        />
        <ReviewDeleteDialog
          isOpenDelete={isOpenDelete}
          setIsOpenDelete={setIsOpenDelete}
          reviewId={reviewId}
          setReviewId={setReviewId}
          setSelectedMovieId={setMovieId}
          setIsOpenAlert={setIsOpenAlert}
          setAlertMessage={setAlertMessage}
          setAlertType={setAlertType}
        />
        <div>
          <Container maxWidth="sm" sx={{ marginBottom: 3, marginTop: "56px" }}>
            <Typography
              variant="h2"
              align="center"
              color="textPrimary"
              gutterBottom
            >
              {t("navbar.Reviews")}
            </Typography>
          </Container>
        </div>
        <div>
          {reviewListOfUser.length !== 0 && (
            <Grid container spacing={4}>
              {reviewListOfUser.map((review) => (
                <Grid item key={review.id} xs={12}>
                  <ReviewCard
                    review={review}
                    setIsOpenEdit={setIsOpenEdit}
                    setIsOpenDelete={setIsOpenDelete}
                    setReviewId={setReviewId}
                    setUserId={setUserId}
                    setDescription={setDescription}
                    setMovieId={setMovieId}
                    setRating={setRating}
                    selectedUpdatedReview={selectedUpdatedReview}
                    setSelectedUpdatedReview={setSelectedUpdatedReview}
                  />
                </Grid>
              ))}
            </Grid>
          )}
          {reviewListOfUser.length === 0 && (
            <Typography
              variant="h4"
              align="center"
              color="textPrimary"
              gutterBottom
            >
              {t("review.noReviewFound")}
            </Typography>
          )}
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

export default Reviews;
