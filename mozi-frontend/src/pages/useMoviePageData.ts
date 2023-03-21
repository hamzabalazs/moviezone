import {
  ApolloError,
  gql,
  useApolloClient,
  useMutation,
  useQuery,
} from "@apollo/client";
import { ExtendedReview, MovieWithReviews } from "../api/types";

type MoviePageData = {
  movie: MovieWithReviews;
  error: ApolloError | undefined;
  loading: boolean;
  addReview: (
    rating: string,
    description: string,
    movie_id: string,
    user_id: string
  ) => Promise<ExtendedReview | null>;
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

const ADD_REVIEW = gql`
  mutation CreateReview($input: AddReviewInput!) {
    createReview(input: $input) {
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
        }
      }
      user {
        first_name
        last_name
        id
      }
    }
  }
`;

export function useMoviePageData(movie_id: string): MoviePageData {
  const { data, error, loading } = useQuery(GET_MOVIE_BY_ID, {
    variables: { input: { id: movie_id } },
  });
  const [AddReviewAPI] = useMutation(ADD_REVIEW);
  const client = useApolloClient();

  async function addReview(
    rating: string,
    description: string,
    movie_id: string,
    user_id: string
  ): Promise<ExtendedReview | null> {
    const result = await AddReviewAPI({
      variables: { input: { rating, description, movie_id, user_id } },
      update: (cache, { data }) => {
        client.readQuery({
          query: GET_MOVIE_BY_ID,
          variables: { input: { id: movie_id } },
        });
        cache.writeQuery({
          query: GET_MOVIE_BY_ID,
          variables: { input: { id: movie_id } },
          data: {
            getMovieWithReviewsById: data.createReview.movie,
          },
        });
      },
    });
    if (result.data) {
      return result.data.createReview;
    }
    return null;
  }

  return {
    movie: data?.getMovieWithReviewsById || null,
    error,
    loading,
    addReview,
  };
}
