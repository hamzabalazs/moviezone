import { ApolloError, gql, useQuery } from "@apollo/client";
import {
  ReviewListReview,
} from "../gql/graphql";

type ReviewData = {
  reviews: ReviewListReview[]
  totalCount: number;
  loading: boolean;
  error: ApolloError | undefined;
};

export const GET_REVIEWS = gql`
  query getReviews(
    $input: GetReviewsOfUserInput!
    $input2: numOfReviewsInput!
  ) {
    getReviewsOfUser(input: $input) {
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
    getNumberOfReviewsOfUser(input: $input2) {
      totalCount
    }
    
  }
`;

export function useReviewsData(user_id: string,offset?:number): ReviewData {
  const {
    data,
    loading,
    error
  } = useQuery(GET_REVIEWS,{variables:{
    input:{
      user_id,
      limit:3,
      offset:offset || 0
    },
    input2:{
      user_id,
      movie_id:""
    }
  }, fetchPolicy:'network-only'});


  return {
    reviews: data?.getReviewsOfUser || [],
    totalCount: data?.getNumberOfReviewsOfUser.totalCount || 0,
    loading,
    error,
  };
}
