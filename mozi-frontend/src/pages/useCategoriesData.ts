import { ApolloError, gql, useQuery } from "@apollo/client";
import { Category, GetCategoriesQuery } from "../gql/graphql";


type CategoriesData = {
  categories: Category[];
  loading: boolean;
  error: ApolloError | undefined;
};

export const GET_CATEGORIES = gql`
  query GetCategories {
  getCategories {
    id
    name
  }
}
`

export function useCategoriesData():CategoriesData{
    const {data,loading,error} = useQuery<GetCategoriesQuery>(GET_CATEGORIES)

    return{
        categories:data?.getCategories || [],
        loading,
        error
    }
}
