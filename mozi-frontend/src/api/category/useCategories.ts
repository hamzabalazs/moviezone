import { useEffect, useState } from "react";
import { Category } from "../types";
import { useQuery, gql, useMutation } from '@apollo/client'
import { client } from "../../index";

export type CategoryData = {
  categories: Category[];
  categoriesLoading: boolean;
  addCategory: (category: Omit<Category, "id">) => Promise<boolean>;
  editCategory: (category: Category) => Promise<boolean>;
  deleteCategory: (id: string) => Promise<boolean>;
  refetchData: () => Promise<void>;
};

const ADD_CATEGORY = gql`
  mutation CreateCategory($input: AddCategoryInput!) {
  createCategory(input: $input) {
    id
    name
  }
}
`

const UPDATE_CATEGORY = gql`
  mutation UpdateCategory($input: UpdateCategoryInput!) {
  updateCategory(input: $input) {
    id
    name
  }
}
`

const DELETE_CATEGORY = gql`
  mutation DeleteCategory($input: DeleteCategoryInput!) {
  deleteCategory(input: $input) {
    id
    name
  }
}
`

const GET_CATEGORIES = gql`
  query GetCategories {
  getCategories {
    id
    name
  }
}
`

export function useCategories(token?: string): CategoryData {
  const [categories, setCategories] = useState<Category[]>([]);
  const [AddCategoryAPI] = useMutation(ADD_CATEGORY)
  const [UpdateCategoryAPI] = useMutation(UPDATE_CATEGORY)
  const [DeleteCategoryAPI] = useMutation(DELETE_CATEGORY)
  const {data:categoriesData,loading} = useQuery(GET_CATEGORIES)
  async function refetchData() {
    await client.refetchQueries({
      include: [GET_CATEGORIES]
    })
    setCategories(categoriesData.getCategories)
  }

  async function addCategory(category: Omit<Category, "id">): Promise<boolean> {
    if (!token) return false;
    const result = await AddCategoryAPI({variables:{input:{name: category.name}}});
    refetchData();
    if(result === undefined) return false;
    return true;
  }

  // Update
  async function editCategory(category: Category): Promise<boolean> {
    if (!token) return false;
    const result = await UpdateCategoryAPI({variables:{input:{id:category.id,name: category.name}}});
    refetchData();
    if(result === undefined) return false;
    return true;
  }

  // Delete
  async function deleteCategory(id: string): Promise<boolean> {
    if (!token) return false;
    console.log(id)
    const result = await DeleteCategoryAPI({variables:{input:{id}}});
    refetchData();
    if(result === undefined) return false;
    return true;
  }

  useEffect(() => {
    if(categoriesData){
      refetchData();
    }
    
  }, [categoriesData]);

  return {
    categories,
    categoriesLoading: loading,
    addCategory,
    editCategory,
    deleteCategory,
    refetchData,
  };
}
