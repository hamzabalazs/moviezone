import { gql } from "apollo-server";
import { Movie } from "./types"

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
      description
    }
  }
`;

export const GET_MOVIES = gql`
  query GetMovies($input: MoviePaginationInput!) {
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

export const testMovie:Movie = {
    id:"idM1",
    title:"title1",
    description:"description1",
    poster:"poster1",
    release_date:"2020-12-20",
    category:{
        id:"idC2",
        name:"name2"
    },
    rating:"5"
}

export const editMovie = {
    id:"idM1",
    title:"title1EDITED",
    description:"description1ED",
    poster:"poster1ED",
    release_date:"2012-12-20",
    category_id:"idC3"
}

export const editResponseMovie:Movie = {
    id:"idM1",
    title:"title1EDITED",
    description:"description1ED",
    poster:"poster1ED",
    release_date:"2012-12-20",
    category:{
        id:"idC3",
        name:"name3"
    },
    rating:"5"
}

export const deleteMovie:Movie = {
    id:"idM3",
    title:"title3",
    description:"description3",
    poster:"poster3",
    release_date:"2000-09-25",
    category:{
        id:"idC1",
        name:"name1"
    },
    rating:"0"
}

export const addMovie = {
    title:"newTitle",
    description:"newDescription",
    poster:"newPoster",
    release_date:"2023-03-13",
    category_id:"idC3"
}