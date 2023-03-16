import { gql } from "apollo-server";

export const GET_MOVIES = gql`
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
export const GET_MOVIES_BY_CATEGORY = gql`
  query GetMoviesByCategoryId($input: GetMoviesByCategoryIdInput!) {
    getMoviesByCategoryId(input: $input) {
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
export const GET_MOVIE_BY_ID = gql`
  query GetMovieById($input: MovieInput!) {
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
  }
`;
export const CREATE_MOVIE = gql`
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
