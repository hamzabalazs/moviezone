import { Container, Fab, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import ReviewDeleteDialog from "./ReviewDeleteDialog";
import ReviewEditModal from "./ReviewEditModal";
import MyFooter from "../common/components/MyFooter";
import NavigationBar from "../common/components/NavigationBar";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ScrollTop from "../common/components/ScrollTop";
import { useTranslation } from "react-i18next";
import { useSessionContext } from "../auth/SessionContext";
import { useReviewsData } from "./useReviewsData";
import { useBottomScrollListener } from "react-bottom-scroll-listener";
import { ReviewListReview } from "../gql/graphql";
import CardSkeletonComponent from "../common/components/CardSkeletonComponent";
import ReviewCard from "./ReviewCard";

function Reviews() {
  const { t } = useTranslation();
  const context = useSessionContext();
  const currUser = context.user;
  const user_id = currUser!.id;
  const [editingReview, setEditingReview] = useState<
    ReviewListReview | undefined
  >(undefined);
  const [deletingReview, setDeletingReview] = useState<
    ReviewListReview | undefined
  >(undefined);
  const [reviewList, setReviewList] = useState<ReviewListReview[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const { reviews, loading, totalCount } = useReviewsData(user_id, offset);

  useBottomScrollListener(() => {
    if (totalCount - offset > 3) {
      setOffset(offset + 3);
    }
    return;
  });
  useEffect(() => {
    if (!loading) {
      const list: ReviewListReview[] = [];
      list.push(...reviews);
      setReviewList([...reviewList, ...list]);
    }
  }, [loading]);

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
          <Grid container spacing={4}>
            {reviewList.map((review: ReviewListReview) => (
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
            <Grid container spacing={4} sx={{marginTop:0}}>
              <CardSkeletonComponent />
              <CardSkeletonComponent />
              <CardSkeletonComponent />
            </Grid>
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
