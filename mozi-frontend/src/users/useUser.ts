import { useApolloClient, useMutation} from "@apollo/client";
import { CreateUserMutation, DeleteUserMutation, FullUser, GetFullUsersQuery, UpdateUserMutation, User } from "../gql/graphql";
import { CREATE_USER, DELETE_USER, UPDATE_USER } from "./userQueries";
import { GET_USERS } from "./userQueries";

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

export function useUser(): UserData {
  const [AddUserAPI] = useMutation<CreateUserMutation>(CREATE_USER);
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
          query:GET_USERS,
          variables:{
            input:{
              limit:3,
              offset:0
            }
          }
        })
        if(!users) return;
        if(!data?.deleteUser) return;
        cache.writeQuery<GetFullUsersQuery>({
          query:GET_USERS,
          variables:{
            input:{
              limit:3,
              offset:0
            }
          },
          data:{
            getUsers: [...users.getUsers.filter((x:FullUser) => x.id !== data.deleteUser.id)],
            getNumberOfUsers:{
              totalCount: users.getNumberOfUsers.totalCount! - 1
            }
          }
        })
      }
    });
    if(result?.data){
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
