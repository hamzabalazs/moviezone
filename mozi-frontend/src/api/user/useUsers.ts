import { useEffect, useState } from "react";
import { User } from "../types";
import {
  DeleteUserAPI,
  getUserList,
  PostUserAPI,
  UpdateCurrentUserAPI,
  UpdateUserAPI,
} from "./UserApi";

export type UserData = {
  users: User[];
  usersLoading: boolean;
  registerUser: (user: Omit<User, "id" | "role">) => Promise<boolean>;
  editUser: (
    user: Omit<User, "role"> & { role?: User["role"] }
  ) => Promise<boolean>;
  editCurrentUser: (user: User) => Promise<boolean>;
  deleteUser: (id: string) => Promise<boolean>;
  refetchData: () => Promise<void>;
};

export function useUsers(token?: string): UserData {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  async function refetchData() {
    setLoading(true);
    const users = await getUserList();
    setUsers(users);
    setLoading(false);
  }

  async function registerUser(
    user: Omit<User, "id" | "role">
  ): Promise<boolean> {
    const result = await PostUserAPI(user);
    refetchData();
    return result;
  }

  async function editUser(user: Omit<User, "role"> & { role?: User["role"] }): Promise<boolean> {
    if (!token) return false;
    console.log(user);
    const result = await UpdateUserAPI(user, token);
    refetchData();
    return result;
  }

  async function editCurrentUser(user: User): Promise<boolean> {
    if (!token) return false;
    const result = await UpdateCurrentUserAPI(user, token);
    refetchData();
    return result;
  }

  async function deleteUser(id: string): Promise<boolean> {
    if (!token) return false;
    const result = await DeleteUserAPI(id, token);
    refetchData();
    return result;
  }

  useEffect(() => {
    refetchData();
  }, []);

  return {
    users,
    usersLoading: loading,
    registerUser,
    editUser,
    editCurrentUser,
    deleteUser,
    refetchData,
  };
}
