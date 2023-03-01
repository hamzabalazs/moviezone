import { useEffect, useState } from "react";
import {
  AddMovieAPI,
  DeleteMovieAPI,
  getMovieList,
  UpdateMovieAPI,
} from "./MovieApi";
import { Movie } from "./types";

export type MovieData = {
  movies: Movie[];
  moviesLoading: boolean;
  addMovie: (movie: Omit<Movie, "id" | "rating">) => Promise<boolean>;
  editMovie: (movie: Omit<Movie, "rating">) => Promise<boolean>;
  deleteMovie: (id: string) => Promise<boolean>;
  refetchData: () => Promise<void>;
};

export function useMovies(token?: string): MovieData {
  const [loading, setLoading] = useState(false);
  const [movies, setMovies] = useState<Movie[]>([]);

  async function refetchData() {
    setLoading(true);
    const movies = await getMovieList();
    setMovies(movies);
    setLoading(false);
  }

  async function addMovie(
    movie: Omit<Movie, "id" | "rating">
  ): Promise<boolean> {
    if (!token) return false;
    const result = await AddMovieAPI(movie, token);
    refetchData();
    return result;
  }

  async function editMovie(movie: Omit<Movie, "rating">): Promise<boolean> {
    if (!token) return false;
    const result = await UpdateMovieAPI(movie, token);
    refetchData();
    return result;
  }

  async function deleteMovie(id: string): Promise<boolean> {
    if (!token) return false;
    const result = await DeleteMovieAPI(id, token);
    refetchData();
    return result;
  }

  useEffect(() => {
    refetchData();
  }, []);

  return {
    movies,
    moviesLoading: loading,
    addMovie,
    editMovie,
    deleteMovie,
    refetchData,
  };
}
