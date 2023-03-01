import { useEffect, useState } from "react";
import {
  AddReviewAPI,
  DeleteReviewAPI,
  getReviewsList,
  UpdateReviewAPI,
} from "./ReviewApi";
import { Review } from "./types";

export type ReviewData = {
  reviews: Review[];
  reviewsLoading: boolean;
  addReview: (review: Omit<Review, "id" | "userId">) => Promise<boolean>;
  editReview: (review: Omit<Review, "userId" | "movieId">) => Promise<boolean>;
  deleteReview: (id: string) => Promise<boolean>;
  refetchData: () => Promise<void>;
};

export function useReviews(token?: string): ReviewData {
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);

  async function refetchData() {
    setLoading(true);
    const reviews = await getReviewsList();
    setReviews(reviews);
    setLoading(false);
  }

  async function addReview(
    review: Omit<Review, "id" | "userId">
  ): Promise<boolean> {
    if (!token) return false;
    const result = await AddReviewAPI(review, token);
    refetchData();
    return result;
  }

  async function editReview(
    review: Omit<Review, "userId" | "movieId">
  ): Promise<boolean> {
    if (!token) return false;
    const result = await UpdateReviewAPI(review, token);
    refetchData();
    return result;
  }

  async function deleteReview(id: string): Promise<boolean> {
    if (!token) return false;
    const result = await DeleteReviewAPI(id, token);
    refetchData();
    return result;
  }

  useEffect(() => {
    refetchData();
  }, []);

  return {
    reviews,
    reviewsLoading: loading,
    addReview,
    editReview,
    deleteReview,
    refetchData,
  };
}
