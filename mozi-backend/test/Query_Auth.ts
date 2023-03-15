import { gql } from "apollo-server";

export const LOGIN = gql`
  mutation LogIn($input: LoginInput!) {
    logIn(input: $input) {
      id
      first_name
      last_name
      role
      email
      token
    }
  }
`;
