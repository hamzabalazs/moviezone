import { ApolloError, gql, useQuery } from "@apollo/client";
import { ExtendedReview } from "../api/types";

type ReviewData = {
  reviews: ExtendedReview[];
  loading: boolean;
  error: ApolloError | undefined;
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

export function useReviewsData(user_id:string): ReviewData {
  const { data, loading, error } = useQuery(GET_EXTENDED_REVIEWS);

  return{
    reviews: data?.getExtendedReviews.filter((x:any) => x.user.id === user_id) || [],
    loading,
    error
  }
}
