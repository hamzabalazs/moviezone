import { useEffect, useState } from "react";
import { client } from "../../index";
import { Review } from "../types";
import { gql, useQuery, useMutation } from "@apollo/client";

export type ReviewData = {
  reviews: Review[];
  reviewsLoading: boolean;
  addReview: (rating:string,description:string,movie_id:string,user_id:string) => Promise<boolean>;
  editReview: (
    review: Omit<Review, "user" | "movie">
  ) => Promise<boolean>;
  deleteReview: (id: string) => Promise<boolean>;
  refetchData: () => Promise<void>;
};

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

const ADD_REVIEW = gql`
  mutation CreateReview($input: AddReviewInput!) {
    createReview(input: $input) {
      id
      rating
      description
      movie {
        id
      }
      user {
        first_name
        last_name
        id
      }
    }
  }
`;

const UPDATE_REVIEW = gql`
  mutation UpdateReview($input: UpdateReviewInput!) {
    updateReview(input: $input) {
      id
      rating
      description
      movie {
        id
      }
      user {
        first_name
        last_name
        id
      }
    }
  }
`;

const DELETE_REVIEW = gql`
  mutation DeleteReview($input: DeleteReviewInput!) {
    deleteReview(input: $input) {
      id
      rating
      description
      movie {
        id
      }
      user {
        first_name
        last_name
        id
      }
    }
  }
`;

export function useReviews(token?: string): ReviewData {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [AddReviewAPI] = useMutation(ADD_REVIEW);
  const [UpdateReviewAPI] = useMutation(UPDATE_REVIEW);
  const [DeleteReviewAPI] = useMutation(DELETE_REVIEW);
  const { data: reviewsData, loading } = useQuery(GET_REVIEWS);
  async function refetchData() {
    await client.refetchQueries({
      include: [GET_REVIEWS],
    });
    setReviews(reviewsData.getReviews);
  }

  async function addReview(rating:string,description:string,movie_id:string,user_id:string): Promise<boolean> {
    if (!token) return false;
    const result = await AddReviewAPI({
      variables: {
        input: {
          rating: rating,
          description: description,
          movie_id:movie_id,
          user_id:user_id
        },
      },
    });
    refetchData();
    if (result === undefined) return false;
    return true;
  }

  async function editReview(
    review: Omit<Review, "user" | "movie">
  ): Promise<boolean> {
    if (!token) return false;
    const result = await UpdateReviewAPI({
      variables: {
        input: {
          id: review.id,
          rating: review.rating,
          description: review.description,
        },
      },
    });
    refetchData();
    if (result === undefined) return false;
    return true;
  }

  async function deleteReview(id: string): Promise<boolean> {
    if (!token) return false;
    const result = await DeleteReviewAPI({ variables: { input: { id } } });
    refetchData();
    if (result === undefined) return false;
    return true;
  }

  useEffect(() => {
    if (reviewsData) {
      refetchData();
    }
  }, [reviewsData]);

  return {
    reviews,
    reviewsLoading: loading,
    addReview,
    editReview,
    deleteReview,
    refetchData,
  };
}
