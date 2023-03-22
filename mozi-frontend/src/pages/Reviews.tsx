import { Container, Fab, Grid, Typography } from "@mui/material";
import { useState } from "react";
import { Review, ReviewListReview } from "../api/types";
import ReviewDeleteDialog from "../components/dialogs/ReviewDeleteDialog";
import ReviewEditModal from "../components/modals/ReviewEditModal";
import MyFooter from "../components/MyFooter";
import NavigationBar from "../components/NavigationBar";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ScrollTop from "../components/ScrollTop";
import ReviewCard from "../components/cards/ReviewCard";
import { useTranslation } from "react-i18next";
import LoadingComponent from "../components/LoadingComponent";
import { useSessionContext } from "../api/SessionContext";
import { useReviewsData } from "./useReviewsData";

function Reviews() {
  const { t } = useTranslation();
  const context = useSessionContext();
  const currUser = context.user;
  const user_id = currUser!.id
  const {reviews,loading} = useReviewsData(user_id);
  const [editingReview, setEditingReview] = useState<ReviewListReview | undefined>(undefined);
  const [deletingReview, setDeletingReview] = useState<ReviewListReview | undefined>(undefined);

  if(loading) return LoadingComponent(loading)
  return (
    <>
      <NavigationBar />
      <main style={{ position: "relative", minHeight: "100vh" }}>
        <ReviewEditModal
          review={editingReview}
          onClose={() => setEditingReview(undefined)}
        />
        <ReviewDeleteDialog
          review={deletingReview}
          onClose={() => setDeletingReview(undefined)}
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
          {reviews.length !== 0 && (
            <Grid container spacing={4}>
              {reviews.map((review:Review) => (
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
          {reviews.length === 0 && (
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
