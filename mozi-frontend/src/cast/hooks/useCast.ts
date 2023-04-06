import { useApolloClient, useMutation } from "@apollo/client";
import {
  Cast,
  CastWithMovie,
  CreateCastMutation,
  DeleteCastMutation,
  UpdateCastMutation,
} from "../../gql/graphql";
import {
  CREATE_CAST,
  DELETE_CAST,
  GET_MOVIE_BY_ID,
  UPDATE_CAST,
} from "../../movies/movieQueries";

type CastData = {
  addCast: (
    name: string,
    photo: string,
  ) => Promise<CastWithMovie | null>;
  updateCast: (
    id:string,
    name: string,
  ) => Promise<Cast | null>;
  deleteCast: (id: string) => Promise<CastWithMovie | null>;
};

export function useCast(movie_id?:string): CastData {
  const [AddCastAPI] = useMutation<CreateCastMutation>(CREATE_CAST);
  const [UpdateCastAPI] = useMutation<UpdateCastMutation>(UPDATE_CAST);
  const [DeleteCastAPI] = useMutation<DeleteCastMutation>(DELETE_CAST);
  const client = useApolloClient();

  async function addCast(
    name: string,
    photo: string,
  ): Promise<CastWithMovie | null> {
    const result = await AddCastAPI({
      variables: {
        input: {
          name,
          photo,
          movie_id,
        },
      },
      update: (cache, { data }) => {
        const res = client.readQuery({
          query: GET_MOVIE_BY_ID,
          variables: {
            input: {
              id: movie_id,
            },
            input2: {
              movie_id: movie_id,
              limit: 3,
              offset: 0,
            },
            input3: {
              movie_id: movie_id,
              user_id: "",
            },
            input4: {
              movie_id: movie_id,
            },
          },
        });
        console.log("res", res);
        console.log("data", data);
        if (!res) return;
        if (!data) return;
        cache.writeQuery({
          query: GET_MOVIE_BY_ID,
          variables: {
            input: {
              id: movie_id,
            },
            input2: {
              movie_id: movie_id,
              limit: 3,
              offset: 0,
            },
            input3: {
              movie_id: movie_id,
              user_id: "",
            },
            input4: {
              movie_id: movie_id,
            },
          },
          data: {
            getMovieById: res.getMovieById,
            getReviewsOfMovie: res.getReviewsOfMovie,
            getNumberOfReviewsOfMovie: res.getNumberOfReviewsOfMovie,
            getCast: [...res.getCast, data.createCast],
          },
        });
      },
    });
    if (result.data) {
      return result.data.createCast;
    }
    return null;
  }
  async function updateCast(
    id:string,
    name: string,
  ): Promise<Cast | null> {
    const result = await UpdateCastAPI({
      variables: {
        input: {
          id,
          name,
          movie_id,
        },
      },
      update: (cache, { data }) => {
        const res = client.readQuery({
          query: GET_MOVIE_BY_ID,
          variables: {
            input: {
              id: movie_id,
            },
            input2: {
              movie_id: movie_id,
              limit: 3,
              offset: 0,
            },
            input3: {
              movie_id: movie_id,
              user_id: "",
            },
            input4: {
              movie_id: movie_id,
            },
          },
        });
        console.log("res",res)
        console.log("data",data)
        if (!res) return;
        if (!data) return;
        
        cache.writeQuery({
          query: GET_MOVIE_BY_ID,
          variables: {
            input: { id: movie_id },
            input2: {
              movie_id: movie_id,
              limit: 3,
              offset: 0,
            },
            input3: {
              movie_id: movie_id,
              user_id: "",
            },
            input4: {
              movie_id: movie_id,
            },
          },
          data: {
            getMovieById: res.getMovieById,
            getReviewsOfMovie: res.getReviewsOfMovie,
            getNumberOfReviewsOfMovie: res.getNumberOfReviewsOfMovie,
            getCast: [...res.getCast],
          },
        });
      },
    });
    if (result.data) {
      return result.data.updateCast;
    }
    return null;
  }

  async function deleteCast(
    id: string,
  ): Promise<CastWithMovie | null> {
    const result = await DeleteCastAPI({
      variables: {
        input: {
          id,
          movie_id,
        },
      },
      update: (cache, { data }) => {
        const res = client.readQuery({
          query: GET_MOVIE_BY_ID,
          variables: {
            input: {
              id: movie_id,
            },
            input2: {
              movie_id: movie_id,
              limit: 3,
              offset: 0,
            },
            input3: {
              movie_id: movie_id,
              user_id: "",
            },
            input4: {
              movie_id: movie_id,
            },
          },
        });
        if (!res) return;
        if (!data) return;
        cache.writeQuery({
          query: GET_MOVIE_BY_ID,
          variables: {
            input: { id: movie_id },
            input2: {
              movie_id: movie_id,
              limit: 3,
              offset: 0,
            },
            input3: {
              movie_id: movie_id,
              user_id: "",
            },
            input4: {
              movie_id: movie_id,
            },
          },
          data: {
            getMovieById: res.getMovieById,
            getReviewsOfMovie: res.getReviewsOfMovie,
            getNumberOfReviewsOfMovie: res.getNumberOfReviewsOfMovie,
            getCast: res.getCast.filter(
              (x: Cast) => x.id !== data.deleteCast.id
            ),
          },
        });
      },
    });
    if(result.data) {
        return result.data.deleteCast;
    }
    return null;
  }

  return {
    addCast,
    updateCast,
    deleteCast
  }
}
