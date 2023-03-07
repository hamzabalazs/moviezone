import { useEffect, useState } from "react";
import { User } from "../types";
import { gql, useQuery, useMutation } from "@apollo/client";
import { client } from "../../index";

export type UserData = {
  users: User[];
  usersLoading: boolean;
  registerUser: (user: Omit<User, "id" | "role">) => Promise<boolean>;
  editUser: (
    user: Omit<User, "role"> & { role?: User["role"] }
  ) => Promise<boolean>;
  deleteUser: (id: string) => Promise<boolean>;
  refetchData: () => Promise<void>;
};

const GET_USERS = gql`
  query GetUsers {
    getUsers {
      id
      first_name
      last_name
      email
      role
    }
  }
`;

const ADD_USER = gql`
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

const UPDATE_USER = gql`
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

const DELETE_USER = gql`
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

export function useUsers(token?: string): UserData {
  const [users, setUsers] = useState<User[]>([]);
  const [PostUserAPI] = useMutation(ADD_USER);
  const [UpdateUserAPI] = useMutation(UPDATE_USER);
  const [DeleteUserAPI] = useMutation(DELETE_USER);
  const { data: usersData, loading } = useQuery(GET_USERS);

  async function refetchData() {
    await client.refetchQueries({
      include: [GET_USERS],
    });
    setUsers(usersData.getUsers);
  }

  async function registerUser(
    user: Omit<User, "id" | "role">
  ): Promise<boolean> {
    const result = await PostUserAPI({
      variables: {
        input: {
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          password: user.password,
        },
      },
    });
    refetchData();
    if (result === undefined) return false;
    return true;
  }

  async function editUser(
    user: Omit<User, "role"> & { role?: User["role"] }
  ): Promise<boolean> {
    if (!token) return false;
    const result = await UpdateUserAPI({
      variables: {
        input: {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          email:user.email,
          password:user.password,
          role:user.role
        },
      },
    });
    refetchData();
    if (result === undefined) return false;
    return true;
  }

  async function deleteUser(id: string): Promise<boolean> {
    if (!token) return false;
    const result = await DeleteUserAPI({variables:{input:{id}}});
    refetchData();
    if (result === undefined) return false;
    return true;
  }

  useEffect(() => {
    if(usersData){
      refetchData();
    }
  }, [usersData]);

  return {
    users,
    usersLoading: loading,
    registerUser,
    editUser,
    deleteUser,
    refetchData,
  };
}
