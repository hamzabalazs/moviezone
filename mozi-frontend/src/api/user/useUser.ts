import { gql, useApolloClient, useMutation, useQuery } from "@apollo/client";
import { GET_USERS } from "../../pages/useUserData";
import { User } from "../types";

type UserData = {
  addUser: (
    first_name: string,
    last_name: string,
    email: string,
    password: string
  ) => Promise<User | null>;
  updateUser: (
    id: string,
    first_name: string,
    last_name: string,
    email: string,
    password: string,
    role?: string
  ) => Promise<User | null>;
  deleteUser: (id: string) => Promise<User | null>;
};

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

export function useUser(): UserData {
  const [AddUserAPI] = useMutation(ADD_USER);
  const [UpdateUserAPI] = useMutation(UPDATE_USER);
  const [DeleteUserAPI] = useMutation(DELETE_USER);
  const client = useApolloClient()

  async function addUser(
    first_name: string,
    last_name: string,
    email: string,
    password: string
  ): Promise<User | null> {
    const result = await AddUserAPI({
      variables: {
        input: {
          first_name,
          last_name,
          email,
          password,
        },
      },
    });
    if (result.data) {
      return result.data.createUser;
    }
    return null;
  }

  async function updateUser(
    id: string,
    first_name: string,
    last_name: string,
    email: string,
    password: string,
    role?: string
  ): Promise<User | null> {
    const result = await UpdateUserAPI({
      variables: {
        input: {
          id,
          first_name,
          last_name,
          email,
          password,
          role,
        },
      },
      update:(cache,{data}) => {
        const users = client.readQuery({
          query:GET_USERS,
        })
        cache.writeQuery({
          query:GET_USERS,
          data:{
            getUsers: [...users.getUsers]
          }
        })
      }
    });
    if (result.data) {
      return result.data.updateUser;
    }
    return null;
  }

  async function deleteUser(id: string): Promise<User | null> {
    const result = await DeleteUserAPI({
      variables: {
        input: {
          id,
        },
      },
      update:(cache,{data}) => {
        const users = client.readQuery({
          query:GET_USERS,
        })
        cache.writeQuery({
          query:GET_USERS,
          data:{
            getUsers: users.getUsers.filter((x:User) => x.id !== data.deleteUser.id)
          }
        })
      }
    });
    if(result.data){
      return result.data.deleteUser
    }
    return null;
  }

  return{
    addUser,
    updateUser,
    deleteUser
  }
}
