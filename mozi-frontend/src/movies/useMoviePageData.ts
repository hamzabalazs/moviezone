import { ApolloError, gql, useQuery } from "@apollo/client";
import { Movie, ReviewListReview } from "../gql/graphql";

type MoviePageData = {
  movie: Movie | null;
  reviews: ReviewListReview[];
  error: ApolloError | undefined;
  totalCount: number;
  loading: boolean;
};

export const GET_MOVIE_BY_ID = gql`
  query GetMovies(
    $input: MovieInput!
    $input2: GetReviewsOfMovieInput!
    $input3: numOfReviewsInput!
  ) {
    getMovieById(input: $input) {
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
    }
    getReviewsOfMovie(input: $input2) {
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
    getNumberOfReviewsOfMovie(input: $input3) {
        totalCount
      }
  }
`;

export function useMoviePageData(
  movie_id: string,
  offset: number
): MoviePageData {
  const { data, error, loading } = useQuery(GET_MOVIE_BY_ID, {
    variables: {
      input: {
        id: movie_id,
      },
      input2: {
        movie_id,
        limit: 3,
        offset,
      },
      input3: {
        movie_id,
        user_id: "",
      },
    },
  });

  return {
    movie: data?.getMovieById || null,
    reviews: data?.getReviewsOfMovie || [],
    totalCount: data?.getNumberOfReviewsOfMovie.totalCount || 0,
    error,
    loading,
  };
}
