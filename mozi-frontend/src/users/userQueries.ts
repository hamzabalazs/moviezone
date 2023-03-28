import { gql } from "@apollo/client";

export const GET_USERS = gql`
  query GetFullUsers($input: UserPaginationInput) {
    getUsers(input: $input) {
      id
      first_name
      last_name
      email
      password
      role
    }
    getNumberOfUsers {
      totalCount
    }
  }
`;

export const CREATE_USER = gql`
  mutation CreateUser($input: AddUserInput!) {
    createUser(input: $input) {
      id
      first_name
      last_name
      role
      email
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      id
      first_name
      last_name
      role
      email
      password
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($input: DeleteUserInput!) {
    deleteUser(input: $input) {
      id
      first_name
      last_name
      role
      email
      password
    }
  }
`;
