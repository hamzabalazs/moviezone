import { gql, useApolloClient, useMutation} from "@apollo/client";
import { CreateUserMutation, DeleteUserMutation, FullUser, GetFullUsersQuery, UpdateUserMutation, User } from "../../gql/graphql";
import { GET_FULL_USERS} from "../../pages/useUserData";

type UserData = {
  addUser: (
    first_name: string,
    last_name: string,
    email: string,
    password: string
  ) => Promise<User | null | undefined>;
  updateUser: (
    id: string,
    first_name: string,
    last_name: string,
    email: string,
    password: string,
    role?: string
  ) => Promise<FullUser | null>;
  deleteUser: (id: string) => Promise<FullUser | null>;
};

export const ADD_USER = gql`
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

export function useUser(): UserData {
  const [AddUserAPI] = useMutation<CreateUserMutation>(ADD_USER);
  const [UpdateUserAPI] = useMutation<UpdateUserMutation>(UPDATE_USER);
  const [DeleteUserAPI] = useMutation<DeleteUserMutation>(DELETE_USER);
  const client = useApolloClient()

  async function addUser(
    first_name: string,
    last_name: string,
    email: string,
    password: string
  ): Promise<User | null | undefined> {
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
  ): Promise<FullUser | null> {
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
      update:(cache) => {
        const users = client.readQuery<GetFullUsersQuery>({
          query:GET_FULL_USERS,
        })
        if(!users) return;
        cache.writeQuery<GetFullUsersQuery>({
          query:GET_FULL_USERS,
          data:{
            getFullUsers: [...users.getFullUsers]
          }
        })
      }
    });
    if (result.data) {
      return result.data.updateUser;
    }
    return null;
  }

  async function deleteUser(id: string): Promise<FullUser | null> {
    const result = await DeleteUserAPI({
      variables: {
        input: {
          id,
        },
      },
      update:(cache,{data}) => {
        const users = client.readQuery<GetFullUsersQuery>({
          query:GET_FULL_USERS,
        })
        if(!users) return;
        if(!data?.deleteUser) return;
        cache.writeQuery<GetFullUsersQuery>({
          query:GET_FULL_USERS,
          data:{
            getFullUsers: users.getFullUsers.filter((x:FullUser) => x.id !== data.deleteUser.id)
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
