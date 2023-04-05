import { useApolloClient, useMutation } from "@apollo/client";
import { CreateReviewMutation, DeleteReviewMutation, Review, UpdateReviewMutation } from "../../gql/graphql";
import { GET_MOVIE_BY_ID } from "../../movies/movieQueries";
import { CREATE_REVIEW, DELETE_REVIEW, UPDATE_REVIEW } from "../reviewQueries";
import { GET_REVIEWS } from "../reviewQueries";

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

export function useReview(movie_id: string,user_id:string): ReviewData {
  const [AddReviewAPI] = useMutation<CreateReviewMutation>(CREATE_REVIEW);
  const [UpdateReviewAPI] = useMutation<UpdateReviewMutation>(UPDATE_REVIEW);
  const [DeleteReviewAPI] = useMutation<DeleteReviewMutation>(DELETE_REVIEW);
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
            input: { id: movie_id },
            input2: { movie_id: movie_id, limit:3, offset:0 },
            input3: { user_id:"",movie_id: movie_id}
          },
        });
        if (!res) return;
        if (!data?.createReview) return;
        cache.writeQuery({
          query: GET_MOVIE_BY_ID,
          variables: {
            input: { id: movie_id },
            input2: { movie_id: movie_id, limit:3, offset:0 },
            input3: { user_id:"",movie_id: movie_id}
          },
          data: {
            getMovieById: data.createReview.movie,
            getReviewsOfMovie: [...res.getReviewsOfMovie,data.createReview],
            getNumberOfReviewsOfMovie: {
              totalCount: res.getNumberOfReviewsOfMovie.totalCount + 1
            }
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
            input3: { user_id: "",movie_id:movie_id },
          },
          data: {
            getMovieById: data.updateReview.movie,
            getReviewsOfMovie: [...res.getReviewsOfMovie],
            getNumberOfReviewsOfMovie: res.getNumberOfReviewsOfMovie
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
            input: { id: movie_id },
            input2:{
              movie_id:movie_id,
              limit:3,
              offset:0,
            },
            input3: { user_id: "",movie_id:movie_id },
          },
        });
        if (!data || res === undefined) return;
        if(res !== null){
          cache.writeQuery({
            query: GET_MOVIE_BY_ID,
            variables: {
              input: { id: movie_id },
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
              getNumberOfReviewsOfMovie: {
                totalCount: res.getNumberOfReviewsOfMovie.totalCount - 1
              }
            },
          });
        }
        const reviewData = client.readQuery({
          query: GET_REVIEWS,
          variables:{
            input:{
              user_id:user_id,
              limit:3,
              offset:0
            },
            input2:{
              user_id:user_id,
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
            getReviewsOfUser: [...reviewData.getReviewsOfUser.filter((x:Review) => x.id !== data.deleteReview.id)],
            getNumberOfReviewsOfUser:{
              totalCount: reviewData.getNumberOfReviewsOfUser.totalCount! - 1
            }
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
