import { gql } from "apollo-server";

export const GET_USERS = gql`
  query GetUsers {
    getUsers {
      id
      first_name
      last_name
      role
      email
    }
  }
`;
export const GET_USER_BY_ID = gql`
  query GetUserById($input: UserInput!) {
    getUserById(input: $input) {
      id
      first_name
      last_name
      role
      email
    }
  }
`;
export const GET_USER_BY_EMAIL = gql`
  query CheckForUser($input: UserEmailInput!) {
    checkForUser(input: $input) {
      id
      first_name
      last_name
      role
      email
    }
  }
`;
export const GET_USER_BY_TOKEN = gql`
  query GetUserByToken {
    getUserByToken {
      id
      first_name
      last_name
      role
      email
      token
    }
  }
`;
export const GET_USER_FOR_LOGIN = gql`
  query GetUserForLogin($input: UserEmailInput!) {
    getUserForLogin(input: $input) {
      id
      first_name
      last_name
      role
      email
      password
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
    }
  }
`;
