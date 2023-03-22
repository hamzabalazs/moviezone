import { ApolloError, gql, useQuery } from "@apollo/client";
import {
  ExtendedReview,
  GetExtendedReviewsQuery,
  GetReviewsQuery,
  ReviewListReview,
} from "../gql/graphql";

type ReviewData = {
  extendedReviews: ExtendedReview[];
  reviews: ReviewListReview[];
  extendedReviewLoading: boolean;
  reviewLoading: boolean;
  extendedReviewError: ApolloError | undefined;
  reviewError: ApolloError | undefined;
};

export const GET_EXTENDED_REVIEWS = gql`
  query GetExtendedReviews {
    getExtendedReviews {
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
        reviews {
          id
          rating
          description
          user {
            id
            first_name
            last_name
          }
          movie {
            id
          }
        }
      }
      user {
        id
        first_name
        last_name
        role
        email
      }
    }
  }
`;

export const GET_REVIEWS = gql`
  query GetReviews {
    getReviews {
      id
      rating
      description
      movie {
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

export function useReviewsData(user_id: string): ReviewData {
  const {
    data: extendedReviews,
    loading: extendedReviewLoading,
    error: extendedReviewError,
  } = useQuery<GetExtendedReviewsQuery>(GET_EXTENDED_REVIEWS);
  const {
    data: reviews,
    loading: reviewLoading,
    error: reviewError,
  } = useQuery<GetReviewsQuery>(GET_REVIEWS);

  return {
    extendedReviews:
      extendedReviews?.getExtendedReviews.filter(
        (x: any) => x.user.id === user_id
      ) || [],
    reviews:
      reviews?.getReviews.filter((x: any) => x.user.id === user_id) || [],
    extendedReviewLoading,
    reviewLoading,
    extendedReviewError,
    reviewError,
  };
}
