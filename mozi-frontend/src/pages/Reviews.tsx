import { Container, Fab, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { ReviewListReview } from "../api/types";
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
import { gql, useQuery } from "@apollo/client";

export const GET_REVIEWS_OF_USER = gql`
  query GetReviewsOfUser($input: GetReviewsOfUserInput!) {
  getReviewsOfUser(input: $input) {
    id
    rating
    description
    movie {
      id
      title
      description
      poster
      release_date
      category {
        id
        name
      }
      rating
    }
    user {
      id
      first_name
      last_name
    }
  }
}
`;

function Reviews() {
  const { t } = useTranslation();
  const context = useSessionContext();
  const currUser = context.user;
  const user_id = currUser!.id
  const { data: reviewsData, loading:reviewsLoading } = useQuery(GET_REVIEWS_OF_USER,{variables:{input:{user_id}}});

  const [editingReview, setEditingReview] = useState<ReviewListReview | undefined>(undefined);
  const [deletingReview, setDeletingReview] = useState<ReviewListReview | undefined>(undefined);

  if(reviewsLoading) return LoadingComponent(reviewsLoading)
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
          {reviewsData.getReviewsOfUser.length !== 0 && (
            <Grid container spacing={4}>
              {reviewsData.getReviewsOfUser.map((review:ReviewListReview) => (
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
          {reviewsData.getReviewsOfUser.length === 0 && (
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
