import { ApolloError, gql, useQuery } from "@apollo/client";
import { GetMovieWithReviewsByIdQuery, MovieWithReviews } from "../gql/graphql";

type MoviePageData = {
  movie: MovieWithReviews | null;
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
        movie{
          id
        }
      }
    }
  }
`;

export function useMoviePageData(movie_id: string): MoviePageData {
  const { data, error, loading } = useQuery<GetMovieWithReviewsByIdQuery>(GET_MOVIE_BY_ID, {
    variables: { input: { id: movie_id } },
  });

  return {
    movie: data?.getMovieWithReviewsById || null,
    error,
    loading,
  };
}
