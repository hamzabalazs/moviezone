import { ApolloError, gql, useQuery } from "@apollo/client";
import { Category, Movie } from "../api/types";

type HomePageData = {
  movies: Movie[];
  categories: Category[];
  loading: boolean;
  error: ApolloError | undefined;
};

export const GET_HOME_PAGE_DATA = gql`
  query GetHomePageData {
    getCategories {
      id
      name
    }
    getMovies {
      id
      title
      poster
      release_date
      category {
        id
      }
      rating
    }
  }
`;

export function useHomePageData(): HomePageData {
  const { data, error, loading } = useQuery(GET_HOME_PAGE_DATA);

  return {
    movies: data?.getMovies || [],
    categories: data?.getCategories || [],
    error,
    loading,
  };
}
