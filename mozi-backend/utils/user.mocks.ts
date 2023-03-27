import { CurrentUser, FullUser, User } from "./types";

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
  password: "5610a275623908cb1c5e014c188bd62c",
  role: "editor",
};

export const editResponseUser2: Omit<FullUser, "role"> & { role: string } = {
  id: "idU4",
  first_name: "EDITED",
  last_name: "User4EDIT",
  email: "EDITEDuser4@gmail.com",
  password: "5610a275623908cb1c5e014c188bd62c",
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