import { ApolloError, gql, useQuery } from "@apollo/client";
import {
  ExtendedReview,
  ReviewListReview,
} from "../gql/graphql";

type ReviewData = {
  extendedReviews: ExtendedReview[];
  reviews: ReviewListReview[];
  totalCount: number;
  loading: boolean;
  error: ApolloError | undefined;
};

export const GET_DISPLAY_REVIEWS = gql`
  query GetDisplayReviews($input: ReviewPaginationInput,$input2: numOfReviewsInput!) {
    getDisplayReviews(input: $input) {
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
    getNumberOfReviews(input: $input2){
      totalCount
    }
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

export function useReviewsData(user_id: string,offset?:number): ReviewData {
  const {
    data,
    loading,
    error
  } = useQuery(GET_DISPLAY_REVIEWS,{variables:{
    input:{
      user_id,
      limit:3,
      offset:offset || 0
    },
    input2:{
      user_id
    }
  }, fetchPolicy:'network-only'});


  return {
    extendedReviews:
      data?.getExtendedReviews.filter(
        (x: any) => x.user.id === user_id
      ) || [],
    reviews:
      data?.getDisplayReviews.filter((x: any) => x.user.id === user_id) || [],
    totalCount: data?.getNumberOfReviews.totalCount || 0,
    loading,
    error,
  };
}
