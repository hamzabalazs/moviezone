import { ApolloError, useQuery } from "@apollo/client";
import { Cast, Movie } from "../../gql/graphql";
import { GET_CAST_BY_ID } from "../castQueries";

type CastPageData = {
  cast: Cast | null;
  movies: Movie[];
  error: ApolloError | undefined;
  loading: boolean;
};

export function useCastPageData(cast_id: string): CastPageData {
  const { data, error, loading } = useQuery(GET_CAST_BY_ID, {
    variables: { input: { id: cast_id } },fetchPolicy:'cache-and-network',notifyOnNetworkStatusChange:true
  });

  return {
    cast: data?.getCastById || null,
    movies: data?.getMoviesOfCast || [],
    error,
    loading
  }
}
