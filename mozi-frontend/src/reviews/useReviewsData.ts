import { ApolloError, useQuery } from "@apollo/client";
import { GetReviewsQuery, Review } from "../gql/graphql";
import { GET_REVIEWS } from "./reviewQueries";

type ReviewData = {
  reviews: Review[];
  totalCount: number;
  loading: boolean;
  error: ApolloError | undefined;
  fetchMore:any
};

export function useReviewsData(
  user_id: string,
  offset?: number
): ReviewData {
  const { data, loading, error,fetchMore } = useQuery<GetReviewsQuery>(GET_REVIEWS, {
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
    fetchPolicy: "network-only",
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
