import { ApolloError, useQuery } from "@apollo/client";
import { Category, GetCategoriesQuery } from "../gql/graphql";
import { GET_CATEGORIES } from "./categoryQueries";


type CategoriesData = {
  categories: Category[];
  loading: boolean;
  error: ApolloError | undefined;
};
export function useCategoriesData():CategoriesData{
    const {data,loading,error} = useQuery<GetCategoriesQuery>(GET_CATEGORIES)
    return{
        categories:data?.getCategories || [],
        loading,
        error
    }
}
