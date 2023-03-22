import { ApolloError, gql, useQuery } from "@apollo/client";
import { MovieWithReviews } from "../api/types";

type MoviePageData = {
  movie: MovieWithReviews;
  error: ApolloError | undefined;
  loading: boolean;
};

export const GET_MOVIE_BY_ID = gql`
  query GetMovieWithReviewsById($input: MovieInput!) {
    getMovieWithReviewsById(input: $input) {
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
  }
`;

export function useMoviePageData(movie_id: string): MoviePageData {
  const { data, error, loading } = useQuery(GET_MOVIE_BY_ID, {
    variables: { input: { id: movie_id } },
  });

  return {
    movie: data?.getMovieWithReviewsById || null,
    error,
    loading,
  };
}
