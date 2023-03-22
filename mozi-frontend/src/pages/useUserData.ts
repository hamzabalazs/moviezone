import { ApolloError, gql, useQuery } from "@apollo/client";
import { User } from "../api/types";

type UsersData = {
  users: User[];
  loading: boolean;
  error: ApolloError | undefined;
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

export function useUserData():UsersData{
    const {data,loading,error} = useQuery(GET_USERS)

    return{
        users: data?.getUsers || [],
        loading,
        error
    }
}