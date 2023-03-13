import { gql } from "apollo-server";

export const GET_CATEGORIES = gql`
  query GetCategories {
    getCategories {
      id
      name
    }
  }
`;
export const GET_CATEGORY_BY_ID = gql`
  query GetCategoryById($input: CategoryInput!) {
    getCategoryById(input: $input) {
      id
      name
    }
  }
`;
export const GET_CATEGORY_BY_NAME = gql`
  query CheckForCategory($input: CategoryNameInput!) {
    checkForCategory(input: $input) {
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
