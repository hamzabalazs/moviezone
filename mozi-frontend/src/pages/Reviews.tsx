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
import { gql, useQuery, useApolloClient } from "@apollo/client";

const GET_REVIEWS = gql`
  query GetReviews {
  getReviews {
    id
    rating
    description
    movie {
      title
      id
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
  const { data: reviewsData, loading:reviewsLoading } = useQuery(GET_REVIEWS);
  const client = useApolloClient()

  const [editingReview, setEditingReview] = useState<ReviewListReview | undefined>(undefined);
  const [deletingReview, setDeletingReview] = useState<ReviewListReview | undefined>(undefined);
  
  const [reviewListOfUser, setReviewListOfUser] = useState<ReviewListReview[]>([]);
  
  async function refetchData(){
    await client.refetchQueries({
      include: [GET_REVIEWS]
    })
  }
  
  useEffect(() => {
    if(editingReview === undefined && deletingReview === undefined){
      refetchData()
    }
  },[editingReview,deletingReview])

  useEffect(() => {
    if(!reviewsLoading) fillUpdatedReviewList();
  }, [reviewsData]);

  async function fillUpdatedReviewList() {
    if (currUser) {
      const usersReviews = reviewsData.getReviews.filter(
        (x:ReviewListReview) => x.user.id === currUser.id
      );
      setReviewListOfUser(usersReviews);
    }
  }

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
