import { ApolloError, useQuery } from "@apollo/client";
import {
  FullUser,
  GetFullUsersQuery,
} from "../gql/graphql";
import { GET_USERS } from "./userQueries";

type UsersData = {
  users: FullUser[];
  totalCount: number;
  loading: boolean;
  error: ApolloError | undefined;
  fetchMore: any;
};

export function useUserData(offset?: number, limit?: number): UsersData {
  const {
    data,
    loading,
    error,
    fetchMore,
  } = useQuery<GetFullUsersQuery>(GET_USERS, {
    variables: {
      input: {
        limit: limit || 3,
        offset: offset || 0,
      },
    },
    fetchPolicy: "cache-first",
    notifyOnNetworkStatusChange: true,
  });
  return {
    users: data?.getUsers || [],
    totalCount: data?.getNumberOfUsers.totalCount || 0,
    loading,
    error,
    fetchMore,
  };
}
