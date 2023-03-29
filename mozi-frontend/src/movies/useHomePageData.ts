import { ApolloError, useQuery } from "@apollo/client";
import { Category, GetHomePageDataQuery, Movie } from "../gql/graphql";
import { GET_HOME_PAGE_DATA } from "./movieQueries";

type HomePageData = {
  movies: Movie[];
  categories: Category[];
  totalCount: number;
  loading: boolean;
  error: ApolloError | undefined;
  fetchMore:any
};



export function useHomePageData(
  category: string[],
  orderByTitle:boolean|null,
  orderByCategory:boolean|null,
  searchField?: string,
  offset?: number,
  limit?: number
): HomePageData {
  const { data, error, loading,fetchMore } = useQuery<GetHomePageDataQuery>(
    GET_HOME_PAGE_DATA,
    {
      variables: {
        input: {
          limit: limit || 9,
          category,
          searchField,
          offset: offset || 0,
          orderByTitle,
          orderByCategory
        },
        input2:{
          category,
          searchField
        }
      },
      fetchPolicy: "network-only",
      notifyOnNetworkStatusChange:true
    }
  );
  return {
    movies: data?.getMovies || [],
    categories: data?.getCategories || [],
    totalCount: data?.getNumberOfMovies.totalCount || 0,
    error,
    loading,
    fetchMore
  };
}
