import { gql } from "@apollo/client";

export const GET_MOVIE_BY_ID = gql`
  query GetMovies(
    $input: MovieInput!
    $input2: GetReviewsOfMovieInput!
    $input3: numOfReviewsInput!
    $input4: CastOfMovieInput!
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
    getNumberOfReviewsOfMovie(input: $input3) {
      totalCount
    }
    getCast(input: $input4) {
      id
      name
      photo
    }
  }
`;

export const GET_HOME_PAGE_DATA = gql`
  query GetHomePageData(
    $input: MoviePaginationInput!
    $input2: numOfMoviesInput!
  ) {
    getCategories {
      id
      name
    }
    getMovies(input: $input) {
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
    getNumberOfMovies(input: $input2) {
      totalCount
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

export const CREATE_CAST = gql`
  mutation CreateCast($input: AddCastInput!) {
    createCast(input: $input) {
      id
      name
      photo
      movie_id
    }
  }
`;

export const UPDATE_CAST = gql`
  mutation UpdateCast($input: EditCastInput!) {
    updateCast(input: $input) {
      id
      name
      photo
    }
  }
`;

export const DELETE_CAST = gql`
  mutation DeleteCast($input: DeleteCastInput!) {
    deleteCast(input: $input) {
      id
      name
      photo
      movie_id
    }
  }
`;
