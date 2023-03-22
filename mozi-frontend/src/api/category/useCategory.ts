import { gql, useApolloClient, useMutation, useQuery } from "@apollo/client";
import { GET_CATEGORIES } from "../../pages/useCategoriesData";
import { Category } from "../types";

type CategoryData = {
  addCategory: (name: string) => Promise<Category | null>;
  updateCategory: (id: string, name: string) => Promise<Category | null>;
  deleteCategory: (id: string) => Promise<Category | null>;
};

const ADD_CATEGORY = gql`
  mutation CreateCategory($input: AddCategoryInput!) {
    createCategory(input: $input) {
      id
      name
    }
  }
`;

const UPDATE_CATEGORY = gql`
  mutation UpdateCategory($input: UpdateCategoryInput!) {
    updateCategory(input: $input) {
      id
      name
    }
  }
`;

const DELETE_CATEGORY = gql`
  mutation DeleteCategory($input: DeleteCategoryInput!) {
    deleteCategory(input: $input) {
      id
      name
    }
  }
`;

export function useCategory() {
  const [AddCategoryAPI] = useMutation(ADD_CATEGORY);
  const [UpdateCategoryAPI] = useMutation(UPDATE_CATEGORY);
  const [DeleteCategoryAPI] = useMutation(DELETE_CATEGORY);
  const client = useApolloClient();

  async function addCategory(name: string): Promise<Category | null> {
    const result = await AddCategoryAPI({
      variables: {
        input: {
          name,
        },
      },
      update:(cache,{data}) => {
        const categoriesData = client.readQuery({
            query: GET_CATEGORIES,
            
        })
        cache.writeQuery({
            query: GET_CATEGORIES,
            data:{
                getCategories:[...categoriesData.getCategories, data.createCategory]
            }
        })
      }
    });
    if(result.data){
        return result.data.createCategory;
    }
    return null;
  }

  async function updateCategory(id:string,name:string): Promise<Category | null> {
    const result = await UpdateCategoryAPI({
        variables:{
            input:{
                id,
                name
            }
        },
        update:(cache) => {
            const categoriesData = client.readQuery({
                query: GET_CATEGORIES
            })
            cache.writeQuery({
                query: GET_CATEGORIES,
                data:{
                    getCategories: [...categoriesData.getCategories]
                }
            })
        }
    });
    
    if(result.data){
        return result.data.updateCategory
    }
    return null;
  }

  async function deleteCategory(id:string): Promise<Category | null> {
    const result = await DeleteCategoryAPI({
        variables:{
            input:{
                id
            }
        },
        update:(cache,{data}) => {
            const categoriesData = client.readQuery({
                query: GET_CATEGORIES
            })
            cache.writeQuery({
                query:GET_CATEGORIES,
                data:{
                    getCategories: categoriesData.getCategories.filter((x:Category) => x.id !== data.deleteCategory.id)
                }
            })
        }
    });
    console.log(result.errors)
    if(result.data){
        return result.data.deleteCategory
    }
    return null;
  }

  return{
    addCategory,
    updateCategory,
    deleteCategory
  }
}
