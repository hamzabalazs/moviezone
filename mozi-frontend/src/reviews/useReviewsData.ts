import { ApolloError, gql, useQuery } from "@apollo/client";
import { Review } from "../gql/graphql";

type ReviewData = {
  reviews: Review[];
  totalCount: number;
  loading: boolean;
  error: ApolloError | undefined;
  fetchMore:any
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
        title
        description
        poster
        release_date
        rating
        category {
          id
          name
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
    getNumberOfReviewsOfUser(input: $input2) {
      totalCount
    }
  }
`;

export function useReviewsData(
  user_id: string,
  offset?: number
): ReviewData {
  const { data, loading, error,fetchMore } = useQuery(GET_REVIEWS, {
    variables: {
      input: {
        user_id,
        limit: 3,
        offset: offset || 0,
      },
      input2: {
        user_id,
        movie_id: "",
      },
    },
    fetchPolicy: "cache-first",
    notifyOnNetworkStatusChange: true,
  });

  return {
    reviews: data?.getReviewsOfUser || [],
    totalCount: data?.getNumberOfReviewsOfUser.totalCount || 0,
    loading,
    error,
    fetchMore
  };
}
