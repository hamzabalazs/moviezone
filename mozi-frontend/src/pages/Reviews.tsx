import { Container, Fab, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { AlertType, Review, ReviewUpdated } from "../api/types";
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

  const [editingReview, setEditingReview] = useState<Review | undefined>(undefined);
  const [deletingReview, setDeletingReview] = useState<Review | undefined>(undefined);

  const [alert,setAlert] = useState<AlertType>({isOpen:false,message:"",type:undefined})
  
  const [reviewListOfUser, setReviewListOfUser] = useState<Review[]>([]);
  

  useEffect(() => {
    fillUpdatedReviewList();
  }, [context.reviews]);

  async function fillUpdatedReviewList() {
    if (currUser) {
      const usersReviews = context.reviews.filter(
        (x) => x.user.id === currUser.id
      );
      setReviewListOfUser(usersReviews);
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
