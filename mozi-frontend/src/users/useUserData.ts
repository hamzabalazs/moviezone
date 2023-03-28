import { ApolloError, gql, useQuery } from "@apollo/client";
import {
  FullUser,
  GetFullUsersQuery,
} from "../gql/graphql";

type UsersData = {
  users: FullUser[];
  totalCount: number;
  loading: boolean;
  error: ApolloError | undefined;
  fetchMore: any;
};

export const GET_FULL_USERS = gql`
  query GetFullUsers($input: UserPaginationInput) {
    getUsers(input: $input) {
      id
      first_name
      last_name
      email
      password
      role
    }
    getNumberOfUsers {
      totalCount
    }
  }
`;

export function useUserData(offset?: number, limit?: number): UsersData {
  const {
    data,
    loading,
    error,
    fetchMore,
  } = useQuery<GetFullUsersQuery>(GET_FULL_USERS, {
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
