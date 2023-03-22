import { ApolloError, gql, useQuery } from "@apollo/client";
import { FullUser, GetFullUsersQuery, GetUsersQuery, User } from "../gql/graphql";

type UsersData = {
  users: User[];
  fullUsers: FullUser[];
  usersLoading: boolean;
  fullUsersLoading: boolean;
  usersError: ApolloError | undefined;
  fullUsersError: ApolloError | undefined;
};

export const GET_USERS = gql`
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

export const GET_FULL_USERS = gql`
  query GetFullUsers {
    getFullUsers{
      id
      first_name
      last_name
      email
      password
      role
    }
  }
`

export function useUserData():UsersData{
    const {data:userData,loading:usersLoading,error:usersError} = useQuery<GetUsersQuery>(GET_USERS)
    const {data:fullUserData,loading:fullUsersLoading,error:fullUsersError} = useQuery<GetFullUsersQuery>(GET_FULL_USERS)

    return{
        users: userData?.getUsers || [],
        fullUsers: fullUserData?.getFullUsers || [],
        usersLoading,
        fullUsersLoading,
        usersError,
        fullUsersError
    }
}