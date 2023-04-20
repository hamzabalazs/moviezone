import { gql } from "apollo-server";
import { Category } from "./types"

export const GET_CATEGORIES = gql`
  query GetCategories {
    getCategories {
      id
      name
    }
  }
`;

export const CREATE_CATEGORY = gql`
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


export const testCategory:Category = {
    id:"idC1",
    name:"name1"
}

export const editCategory:Category = {
    id:"idC1",
    name:"nameEDITED"
}

export const deleteCategory:Category = {
    id:"idC3",
    name:"name3"
}

export const addCategory = {
    name:"name4"
}