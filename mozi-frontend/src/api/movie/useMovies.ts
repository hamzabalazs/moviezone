import { useEffect, useState } from "react";
import { Movie } from "../types";
import { useQuery, gql, useMutation, useApolloClient } from "@apollo/client";


export type MovieData = {
  movies: Movie[];
  moviesLoading: boolean;
  addMovie: (movie: Omit<Movie, "id" | "rating">) => Promise<boolean>;
  editMovie: (movie: Omit<Movie, "rating">) => Promise<boolean>;
  deleteMovie: (id: string) => Promise<boolean>;
  refetchData: () => Promise<void>;
};

const GET_MOVIES = gql`
  query GetMovies {
    getMovies {
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

const ADD_MOVIE = gql`
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

const UPDATE_MOVIE = gql`
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

const DELETE_MOVIE = gql`
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

export function useMovies(token?: string): MovieData {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [AddMovieAPI] = useMutation(ADD_MOVIE);
  const [UpdateMovieAPI] = useMutation(UPDATE_MOVIE);
  const [DeleteMovieAPI] = useMutation(DELETE_MOVIE);
  const { data: moviesData, loading } = useQuery(GET_MOVIES);
  const client = useApolloClient()

  async function refetchData() {
    await client.refetchQueries({
      include: [GET_MOVIES],
    });
    if(moviesData){
      setMovies(moviesData.getMovies);
    }
    
  }

  async function addMovie(
    movie: Omit<Movie, "id" | "rating">
  ): Promise<boolean> {
    if (!token) return false;
    const result = await AddMovieAPI({
      variables: {
        input: {
          title: movie.title,
          description: movie.description,
          poster: movie.poster,
          release_date: movie.release_date,
          category_id: movie.category.id,
        },
      },
    });
    refetchData();
    if (result === undefined) return false;
    return true;
  }

  async function editMovie(movie: Omit<Movie, "rating">): Promise<boolean> {
    if (!token) return false;
    const result = await UpdateMovieAPI({
      variables: {
        input: {
          id: movie.id,
          title: movie.title,
          description: movie.description,
          poster: movie.poster,
          release_date: movie.release_date,
          category_id: movie.category.id,
        },
      },
    });
    refetchData();
    if (result === undefined) return false;
    return true;
  }

  async function deleteMovie(id: string): Promise<boolean> {
    if (!token) return false;
    const result = await DeleteMovieAPI({ variables: { input: { id } } });
    refetchData();
    if (result === undefined) return false;
    return true;
  }

  useEffect(() => {
    if (moviesData) {
      refetchData();
    }
  }, [moviesData]);

  return {
    movies,
    moviesLoading: loading,
    addMovie,
    editMovie,
    deleteMovie,
    refetchData,
  };
}
