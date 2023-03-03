import { Container, Fab, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { AlertType, ReviewUpdated } from "../api/types";
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

  const [editingReview, setEditingReview] = useState<ReviewUpdated | undefined>(undefined);
  const [deletingReview, setDeletingReview] = useState<ReviewUpdated | undefined>(undefined);

  const [alert,setAlert] = useState<AlertType>({isOpen:false,message:"",type:undefined})
  const [movieId, setMovieId] = useState("");
  const [updatedReviewLists, setUpdatedReviewLists] = useState<ReviewUpdated[]>(
    []
  );
  const [reviewListOfUser, setReviewListOfUser] = useState<ReviewUpdated[]>([]);
  

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
          alert={alert}
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
                    onEdit={() => setEditingReview(review)}
                    onDelete={() => setDeletingReview(review)}
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
