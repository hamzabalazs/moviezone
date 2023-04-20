import { gql } from "apollo-server";
import { CurrentUser, FullUser, User } from "./types";

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


export const adminUser: Omit<CurrentUser, "role"> & { role: string } = {
    id: "idU3",
    first_name: "Test",
    last_name: "User3",
    email: "testuser3@gmail.com",
    role: "admin",
    token: "admintoken1423"
};

export const testUser: Omit<FullUser, "role"> & { role: string } = {
    id: "idU1",
    first_name: "Test",
    last_name: "User1",
    email: "testuser1@gmail.com",
    password: "testtest1",
    role: "viewer",
};

export const testUser2: Omit<FullUser, "role"> & { role: string } = {
  id: "idU4",
  first_name: "Test",
  last_name: "User4",
  email: "testuser4@gmail.com",
  password: "testtest4",
  role: "viewer",
};

export const testResponseUser: Omit<User, "role"> & { role: string } = {
  id: "idU1",
  first_name: "Test",
  last_name: "User1",
  email: "testuser1@gmail.com",
  role: "viewer",
};

export const testResponseUser2: Omit<User, "role"> & { role: string } = {
  id: "idU4",
  first_name: "Test",
  last_name: "User4",
  email: "testuser4@gmail.com",
  role: "viewer",
};

export const editUser: Omit<FullUser, "role"> & { role: string } = {
  id: "idU1",
  first_name: "EDITED",
  last_name: "User1EDIT",
  email: "EDITEDuser1@gmail.com",
  password: "EDITEDPASS",
  role: "editor",
};

export const editUser2: Omit<FullUser, "role">= {
  id: "idU4",
  first_name: "EDITED",
  last_name: "User4EDIT",
  email: "EDITEDuser4@gmail.com",
  password: "EDITEDPASS",
};

export const editResponseUser: Omit<FullUser, "role"> & { role: string } = {
  id: "idU1",
  first_name: "EDITED",
  last_name: "User1EDIT",
  email: "EDITEDuser1@gmail.com",
  password: "EDITEDPASS",
  role: "editor",
};

export const editResponseUser2: Omit<FullUser, "role"> & { role: string } = {
  id: "idU4",
  first_name: "EDITED",
  last_name: "User4EDIT",
  email: "EDITEDuser4@gmail.com",
  password: "EDITEDPASS",
  role: "viewer",
};

export const deleteUser: Omit<FullUser, "role"> & { role: string } = {
  id: "idU1",
  first_name: "EDITED",
  last_name: "User1EDIT",
  email: "EDITEDuser1@gmail.com",
  password: "5610a275623908cb1c5e014c188bd62c",
  role: "editor",
};

export const addUser = {
  first_name: "Test",
  last_name: "User6",
  email: "testuser6@gmail.com",
  password: "testtest6",
};