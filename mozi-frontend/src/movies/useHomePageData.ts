import { ApolloError, gql, useQuery } from "@apollo/client";
import { Category, GetHomePageDataQuery, Movie } from "../gql/graphql";

type HomePageData = {
  movies: Movie[];
  categories: Category[];
  totalCount: number;
  loading: boolean;
  error: ApolloError | undefined;
};

export const GET_HOME_PAGE_DATA = gql`
  query GetHomePageData($input: MoviePaginationInput!,$input2: numOfMoviesInput!) {
    getCategories {
      id
      name
    }
    getMovies(input: $input) {
      id
      title
      description
      poster
      release_date
      category {
        id
        name
      }
      rating
    }
    getNumberOfMovies(input: $input2) {
      totalCount
    }
  }
`;

export function useHomePageData(
  offset: number,
  category: string[],
  orderByTitle:boolean|null,
  orderByCategory:boolean|null,
  searchField?: string,
): HomePageData {
  const { data, error, loading } = useQuery<GetHomePageDataQuery>(
    GET_HOME_PAGE_DATA,
    {
      variables: {
        input: {
          limit: 9,
          category,
          searchField,
          offset,
          orderByTitle,
          orderByCategory
        },
        input2:{
          category,
          searchField
        }
      },
      fetchPolicy: "network-only",
    }
  );
  return {
    movies: data?.getMovies || [],
    categories: data?.getCategories || [],
    totalCount: data?.getNumberOfMovies.totalCount || 0,
    error,
    loading,
  };
}
