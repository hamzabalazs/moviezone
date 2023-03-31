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

export const CHECK_FOR_USER = gql`
  query CheckForUser($input: UserEmailInput!) {
  checkForUser(input: $input) {
    id
    first_name
    last_name
    role
    email
  }
}
`

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

export const CHANGE_PASSWORD = gql`
  mutation ChangePassword($input: changePasswordInput!) {
  changePassword(input: $input) {
    lastID
    changes
  }
}
`

export const CREATE_RESET_TOKEN = gql`
  mutation CreateResetToken($input: resetTokenInput!) {
  createResetToken(input: $input) {
    lastID
    changes
  }
}
`