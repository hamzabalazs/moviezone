import { gql, useApolloClient, useMutation } from "@apollo/client";
import { GET_MOVIE_BY_ID } from "../../pages/useMoviePageData";
import { GET_EXTENDED_REVIEWS } from "../../pages/useReviewsData";
import { ExtendedReview, Review } from "../types";

type ReviewData = {
  updateReview: (
    id: string,
    rating: string,
    description: string
  ) => Promise<ExtendedReview | null>;
  addReview: (
    rating: string,
    description: string,
    movie_id: string,
    user_id: string
  ) => Promise<ExtendedReview | null>;
  deleteReview: (id: string) => Promise<ExtendedReview | null>;
};

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
          user {
          id
          first_name
          last_name
        }
        }
      }
      user {
        first_name
        last_name
        id
        role
        email
      }
    }
  }
`;

const UPDATE_REVIEW = gql`
  mutation UpdateReview($input: UpdateReviewInput!) {
    updateReview(input: $input) {
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
        }
      }
      user {
        first_name
        last_name
        id
        role
        email
      }
    }
  }
`;

const DELETE_REVIEW = gql`
  mutation DeleteReview($input: DeleteReviewInput!) {
    deleteReview(input: $input) {
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
        }
      }
      user {
        first_name
        last_name
        id
        role
        email
      }
    }
  }
`;

export function useReview(movie_id: string): ReviewData {
  const [AddReviewAPI] = useMutation(ADD_REVIEW);
  const [UpdateReviewAPI] = useMutation(UPDATE_REVIEW);
  const [DeleteReviewAPI] = useMutation(DELETE_REVIEW);
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
        const reviewData = client.readQuery({
          query: GET_EXTENDED_REVIEWS,
        });
        if(!reviewData) return
        cache.writeQuery({
          query: GET_EXTENDED_REVIEWS,
          data: {
            getExtendedReviews: [...reviewData.getExtendedReviews, data.createReview],
          },
        });
      },
    });
    if (result.data) {
      return result.data.createReview;
    }
    return null;
  }

  async function updateReview(
    id: string,
    rating: string,
    description: string
  ): Promise<ExtendedReview | null> {
    const result = await UpdateReviewAPI({
      variables: { input: { id, rating, description } },
      update: (cache, { data }) => {
        client.readQuery({
          query: GET_MOVIE_BY_ID,
          variables: { input: { id: movie_id } },
        });
        cache.writeQuery({
          query: GET_MOVIE_BY_ID,
          variables: { input: { id: movie_id } },
          data: {
            getMovieWithReviewsById: data.updateReview.movie,
          },
        });
        const reviewData = client.readQuery({
          query: GET_EXTENDED_REVIEWS,
        });
        if(!reviewData) return
        cache.writeQuery({
          query: GET_EXTENDED_REVIEWS,
          data: {
            getExtendedReviews: [...reviewData.getExtendedReviews],
          },
        });
      },
    });
    if (result.data) {
      return result.data.updateReview;
    }
    return null;
  }

  async function deleteReview(id: string): Promise<ExtendedReview | null> {
    const result = await DeleteReviewAPI({
      variables: { input: { id } },
      update: (cache, { data }) => {
        client.readQuery({
          query: GET_MOVIE_BY_ID,
          variables: { input: { id: movie_id } },
        });
        cache.writeQuery({
          query: GET_MOVIE_BY_ID,
          variables: { input: { id: movie_id } },
          data: {
            getMovieWithReviewsById: data.deleteReview.movie,
          },
        });
        const reviewData = client.readQuery({
          query: GET_EXTENDED_REVIEWS,
        });
        if(!reviewData) return
        cache.writeQuery({
          query: GET_EXTENDED_REVIEWS,
          data: {
            getExtendedReviews: reviewData.getExtendedReviews.filter(
              (x: Review) => x.id !== data.deleteReview.id
            ),
          },
        });
      },
    });
    if (result.data) {
      return result.data.deleteReview;
    }
    return null;
  }

  return {
    addReview,
    updateReview,
    deleteReview,
  };
}
