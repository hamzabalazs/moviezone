import { ApolloError, gql, useQuery } from "@apollo/client";
import { FullUser, GetFullUsersQuery, GetUsersQuery, User } from "../gql/graphql";

type UsersData = {
  users: User[];
  fullUsers: FullUser[];
  totalCount: number;
  usersLoading: boolean;
  fullUsersLoading: boolean;
  usersError: ApolloError | undefined;
  fullUsersError: ApolloError | undefined;
  fetchMore: any
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
  query GetFullUsers($input:UserPaginationInput) {
    getFullUsers(input: $input){
      id
      first_name
      last_name
      email
      password
      role
    }
    getNumberOfUsers{
      totalCount
    }
  }
`

export function useUserData(offset?:number,limit?:number):UsersData{
    const {data:userData,loading:usersLoading,error:usersError} = useQuery<GetUsersQuery>(GET_USERS)
    const {data:fullUserData,loading:fullUsersLoading,error:fullUsersError,fetchMore} = useQuery<GetFullUsersQuery>(GET_FULL_USERS,{variables:
    {
      input:{
        limit:limit || 3,
        offset:offset || 0
      }
    },fetchPolicy:'cache-first',notifyOnNetworkStatusChange:true})
    return{
        users: userData?.getUsers || [],
        fullUsers: fullUserData?.getFullUsers || [],
        totalCount: fullUserData?.getNumberOfUsers.totalCount || 0,
        usersLoading,
        fullUsersLoading,
        usersError,
        fullUsersError,
        fetchMore
    }
}