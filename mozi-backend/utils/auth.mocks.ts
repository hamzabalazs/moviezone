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

export const newTestUser = {
    first_name: "Test",
    last_name: "User",
    email: "testyuser@gmail.com",
    password: "testtest",
  };

  export const existingTestUser = {
    email:"testuser2@gmail.com",
    password:"testtest2",
}