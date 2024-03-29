import { ApolloError, useQuery } from "@apollo/client";
import { Cast, Movie, Review} from "../../gql/graphql";
import { GET_MOVIE_BY_ID } from "../movieQueries";

type MoviePageData = {
  movie: Movie | null;
  reviews: Review[];
  cast: Cast[];
  error: ApolloError | undefined;
  totalCount: number;
  loading: boolean;
  fetchMore:any
};



export function useMoviePageData(
  movie_id: string,
  offset?: number
): MoviePageData {
  const { data, error, loading,fetchMore } = useQuery(GET_MOVIE_BY_ID, {
    variables: {
      input: {
        id: movie_id,
      },
      input2: {
        movie_id,
        limit: 3,
        offset: offset || 0,
      },
      input3: {
        user_id: "",
        movie_id,
      },
      input4:{
        movie_id
      }
    },
    fetchPolicy:'cache-and-network',notifyOnNetworkStatusChange:true
  });

  return {
    movie: data?.getMovieById || null,
    reviews: data?.getReviewsOfMovie || [],
    cast: data?.getCast || [],
    totalCount: data?.getNumberOfReviewsOfMovie.totalCount || 0,
    error,
    loading,
    fetchMore
  };
}
