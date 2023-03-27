import { gql, useApolloClient, useMutation } from "@apollo/client";
import { Review } from "../gql/graphql";
import { GET_MOVIE_BY_ID } from "../movies/useMoviePageData";
import { GET_REVIEWS } from "./useReviewsData";

type ReviewData = {
  updateReview: (
    id: string,
    rating: string,
    description: string
  ) => Promise<Review | null | undefined>;
  addReview: (
    rating: string,
    description: string,
    movie_id: string,
    user_id: string
  ) => Promise<Review | null | undefined>;
  deleteReview: (id: string) => Promise<Review | null | undefined>;
};

export const CREATE_REVIEW = gql`
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
  }
`;

export const UPDATE_REVIEW = gql`
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

export const DELETE_REVIEW = gql`
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

export function useReview(movie_id: string,user_id:string): ReviewData {
  const [AddReviewAPI] = useMutation(CREATE_REVIEW);
  const [UpdateReviewAPI] = useMutation(UPDATE_REVIEW);
  const [DeleteReviewAPI] = useMutation(DELETE_REVIEW);
  const client = useApolloClient();

  async function addReview(
    rating: string,
    description: string,
    movie_id: string,
    user_id: string
  ): Promise<Review | null | undefined> {
    const result = await AddReviewAPI({
      variables: { input: { rating, description, movie_id, user_id } },
      update: (cache, { data }) => {
        const res = client.readQuery({
          query: GET_MOVIE_BY_ID,
          variables: {
            input: { movie_id: movie_id },
            input2: { movie_id: movie_id, limit:3, offset:0 },
            input3: { movie_id: movie_id, user_id:""}
          },
        });
        if (!res) return;
        if (!data?.createReview) return;
        cache.writeQuery({
          query: GET_MOVIE_BY_ID,
          variables: {
            input: { movie_id: movie_id },
            input2: { movie_id: movie_id, limit:3, offset:0 },
            input3: { movie_id: movie_id, user_id:""}
          },
          data: {
            getMovieById: data.createReview.movie,
            getReviewsOfMovie: data.createReview,
            getNumberOfReviewsOfMovie: res.getNumberOfReviewsOfMovie + 1
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
  ): Promise<Review | null | undefined> {
    const result = await UpdateReviewAPI({
      variables: { input: { id, rating, description } },
      update: (cache, { data }) => {
        const res = client.readQuery({
          query: GET_MOVIE_BY_ID,
          variables: {
            input: { movie_id: movie_id },
            input2:{
              movie_id:movie_id,
              limit:3,
              offset:0,
            },
            input3: { movie_id:movie_id,user_id: "" },
          },
        });
        if (!res || !data || !data.updateReview) return;
        cache.writeQuery({
          query: GET_MOVIE_BY_ID,
          variables: {
            input: { movie_id: movie_id },
            input2:{
              movie_id:movie_id,
              limit:3,
              offset:0,
            },
            input3: { movie_id:movie_id,user_id: "" },
          },
          data: {
            getMovieById: data.updateReview.movie,
            getReviewsOfMovie: [...res.getReviewsOfMovie],
            getNumberOfReviewsOfMovie: res.getNumberOfReviewsOfMovie
          },
        });
        const reviewData = client.readQuery({
          query: GET_REVIEWS,
          variables:{
            input:{
              user_id,
              limit:3,
              offset:0
            },
            input2:{
              user_id,
              movie_id:""
            }
          },
        });
        if (!reviewData || !data || !data.deleteReview) return;
        cache.writeQuery({
          query: GET_REVIEWS,
          variables:{
            input:{
              user_id,
              limit:3,
              offset:0
            },
            input2:{
              user_id,
              movie_id:""
            }
          },
          data: {
            getReviewsOfUser: data.updateReview,
            getNumberOfReviewsOfUser: reviewData.getNumberOfReviewsOfUser
          },
        });
      },
    });
    if (result.data) {
      return result.data.updateReview;
    }
    return null;
  }

  async function deleteReview(
    id: string
  ): Promise<Review | null | undefined> {
    const result = await DeleteReviewAPI({
      variables: { input: { id } },
      update: (cache, { data }) => {
        const res = client.readQuery({
          query: GET_MOVIE_BY_ID,
          variables: {
            input: { movie_id: movie_id },
            input2:{
              movie_id:movie_id,
              limit:3,
              offset:0,
            },
            input3: { movie_id:movie_id,user_id: "" },
          },
        });
        if (!data || !data.deleteReview || !res) return;
        cache.writeQuery({
          query: GET_MOVIE_BY_ID,
          variables: {
            input: { movie_id: movie_id },
            input2:{
              movie_id:movie_id,
              limit:3,
              offset:0,
            },
            input3: { movie_id:movie_id,user_id: "" },
          },
          data: {
            getMovieById: data.deleteReview.movie,
            getReviewsOfMovie: res.getReviewsOfMovie.filter((x:Review) => x.id !== data.deleteReview.id),
            getNumberOfReviewsOfMovie: res.getNumberOfReviewsOfMovie - 1
          },
        });
        const reviewData = client.readQuery({
          query: GET_REVIEWS,
          variables:{
            input:{
              user_id,
              limit:3,
              offset:0
            },
            input2:{
              user_id,
              movie_id:""
            }
          },
        });
        if (!reviewData || !data || !data.deleteReview) return;
        cache.writeQuery({
          query: GET_REVIEWS,
          variables:{
            input:{
              user_id,
              limit:3,
              offset:0
            },
            input2:{
              user_id,
              movie_id:""
            }
          },
          data: {
            getReviewsOfUser: reviewData.getReviewsOfUser.filter((x:Review) => x.user.id !== data.deleteReview.user_id),
            getNumberOfReviewsOfUser: reviewData.getNumberOfReviewsOfUser - 1
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
