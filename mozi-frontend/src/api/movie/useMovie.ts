import { gql, useApolloClient, useMutation } from "@apollo/client";
import {
  CreateMovieMutation,
  DeleteMovieMutation,
  Movie,
  UpdateMovieMutation,
} from "../../gql/graphql";
import { GET_HOME_PAGE_DATA } from "../../pages/useHomePageData";
import { GET_MOVIE_BY_ID } from "../../pages/useMoviePageData";

export const UPDATE_MOVIE = gql`
  mutation UpdateMovie($input: UpdateMovieInput!) {
    updateMovie(input: $input) {
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
  }
`;

export const ADD_MOVIE = gql`
  mutation CreateMovie($input: AddMovieInput!) {
    createMovie(input: $input) {
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
  }
`;

export const DELETE_MOVIE = gql`
  mutation DeleteMovie($input: DeleteMovieInput!) {
    deleteMovie(input: $input) {
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
  }
`;

type MovieData = {
  addMovie: (
    title: string,
    description: string,
    poster: string,
    release_date: string,
    category_id: string
  ) => Promise<Movie | null | undefined>;
  updateMovie: (
    id: string,
    title: string,
    description: string,
    poster: string,
    release_date: string,
    category_id: string
  ) => Promise<Movie | null>;
  deleteMovie: (id: string) => Promise<Movie | null>;
};

export function useMovie(): MovieData {
  const [AddMovieAPI] = useMutation<CreateMovieMutation>(ADD_MOVIE);
  const [UpdateMovieAPI] = useMutation<UpdateMovieMutation>(UPDATE_MOVIE);
  const [DeleteMovieAPI] = useMutation<DeleteMovieMutation>(DELETE_MOVIE);
  const client = useApolloClient();

  async function addMovie(
    title: string,
    description: string,
    poster: string,
    release_date: string,
    category_id: string
  ): Promise<Movie | null | undefined> {
    const result = await AddMovieAPI({
      variables: {
        input: {
          title,
          description,
          poster,
          release_date,
          category_id,
        },
      },
      update: (cache, { data }) => {
        const pageData = client.readQuery({
          query: GET_HOME_PAGE_DATA,
        });
        if (!pageData) return;
        if (!data) return;
        cache.writeQuery({
          query: GET_HOME_PAGE_DATA,
          data: {
            ...pageData.getCategories,
            getMovies: [...pageData.getMovies, data.createMovie],
          },
        });
      },
    });
    if (result.data) {
      return result.data.createMovie;
    }
    return null;
  }

  async function updateMovie(
    id: string,
    title: string,
    description: string,
    poster: string,
    release_date: string,
    category_id: string
  ): Promise<Movie | null> {
    const result = await UpdateMovieAPI({
      variables: {
        input: {
          id,
          title,
          description,
          poster,
          release_date,
          category_id,
        },
      },
      update: (cache, { data }) => {
        const res = client.readQuery({
          query: GET_MOVIE_BY_ID,
          variables: {
            input: {
              id: id,
            },
            input2:{
              movie_id: id
            }
          },
        });
        if (!res) return;
        if (!data) return;
        cache.writeQuery({
          query: GET_MOVIE_BY_ID,
          variables: { input: { id: id } },
          data: {
            getMovieById: data.updateMovie,
          },
        });
      },
    });
    if (result.data) {
      return result.data.updateMovie;
    }
    return null;
  }

  async function deleteMovie(id: string): Promise<Movie | null> {
    const result = await DeleteMovieAPI({
      variables: { input: { id } },
      update: (cache, { data }) => {
        const pageData = client.readQuery({
          query: GET_HOME_PAGE_DATA,
        });
        if (!pageData) return;
        if (!data) return;
        cache.writeQuery({
          query: GET_HOME_PAGE_DATA,
          data: {
            ...pageData.getCategories,
            getMovies: pageData.getMovies.filter(
              (x: any) => x.id !== data.deleteMovie.id
            ),
          },
        });
      },
    });
    if (result.data) {
      return result.data.deleteMovie;
    }
    return null;
  }

  return {
    addMovie,
    updateMovie,
    deleteMovie,
  };
}
