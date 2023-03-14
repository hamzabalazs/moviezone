import { gql } from "apollo-server";

export const GET_TOKEN = gql`
  query GetToken($input: GetTokenInput!) {
    getToken(input: $input) {
      id
      token
      user_id
    }
  }
`;
export const CREATE_TOKEN = gql`
  mutation CreateToken($input: AddTokenInput!) {
    createToken(input: $input) {
      id
      first_name
      last_name
      role
      email
      token
    }
  }
`;
export const GET_ROLE = gql`
  query GetToken {
    determineRole {
      role
    }
  }
`;
