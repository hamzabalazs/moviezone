import { gql, useApolloClient, useMutation } from "@apollo/client";
import { Category, CreateCategoryMutation, DeleteCategoryMutation, UpdateCategoryMutation } from "../../gql/graphql";
import { GET_CATEGORIES } from "../../pages/useCategoriesData";

type CategoryData = {
  addCategory: (name: string) => Promise<Category | null | undefined>;
  updateCategory: (id: string, name: string) => Promise<Category | null>;
  deleteCategory: (id: string) => Promise<Category | null>;
};

export const ADD_CATEGORY = gql`
  mutation CreateCategory($input: AddCategoryInput!) {
    createCategory(input: $input) {
      id
      name
    }
  }
`;

export const UPDATE_CATEGORY = gql`
  mutation UpdateCategory($input: UpdateCategoryInput!) {
    updateCategory(input: $input) {
      id
      name
    }
  }
`;

export const DELETE_CATEGORY = gql`
  mutation DeleteCategory($input: DeleteCategoryInput!) {
    deleteCategory(input: $input) {
      id
      name
    }
  }
`;

export function useCategory():CategoryData {
  const [AddCategoryAPI] = useMutation<CreateCategoryMutation>(ADD_CATEGORY);
  const [UpdateCategoryAPI] = useMutation<UpdateCategoryMutation>(UPDATE_CATEGORY);
  const [DeleteCategoryAPI] = useMutation<DeleteCategoryMutation>(DELETE_CATEGORY);
  const client = useApolloClient();

  async function addCategory(name: string): Promise<Category | null | undefined> {
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
        if(!categoriesData) return;
            if(!data) return;
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
            if(!categoriesData) return;
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
            if(!categoriesData) return;
            if(!data) return;
            cache.writeQuery({
                query:GET_CATEGORIES,
                data:{
                    getCategories: categoriesData.getCategories.filter((x:Category) => x.id !== data.deleteCategory.id)
                }
            })
        }
    });
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
