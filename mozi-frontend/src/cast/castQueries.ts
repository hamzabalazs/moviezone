import { gql } from "@apollo/client";

export const GET_CAST_BY_ID = gql`
  query GetCastById($input: CastInput!) {
    getCastById(input: $input) {
      id
      name
      photo
      description
    }
    getMoviesOfCast(input: $input) {
      id
      title
      description
      release_date
      poster
    }
  }
`;


export const CREATE_CAST = gql`
  mutation CreateCast($input: AddCastInput!) {
    createCast(input: $input) {
      id
      name
      photo
      description
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
      description
    }
  }
`;

export const DELETE_CAST = gql`
  mutation DeleteCast($input: DeleteCastInput!) {
    deleteCast(input: $input) {
      id
      name
      photo
      description
      movie_id
    }
  }
`;