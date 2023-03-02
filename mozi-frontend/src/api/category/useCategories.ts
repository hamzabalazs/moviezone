import { useEffect, useState } from "react";
import {
  AddCategoryAPI,
  DeleteCategoryAPI,
  getCategoryList,
  UpdateCategoryAPI,
} from "./CategoryApi";
import { Category } from "../types";

export type CategoryData = {
  categories: Category[];
  categoriesLoading: boolean;
  addCategory: (category: Omit<Category, "id">) => Promise<boolean>;
  editCategory: (category: Category) => Promise<boolean>;
  deleteCategory: (id: string) => Promise<boolean>;
  refetchData: () => Promise<void>;
};

export function useCategories(token?: string): CategoryData {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  async function refetchData() {
    setLoading(true);
    const categories = await getCategoryList();
    setCategories(categories);
    setLoading(false);
  }

  async function addCategory(category: Omit<Category, "id">): Promise<boolean> {
    if (!token) return false;
    const result = await AddCategoryAPI(category, token);
    refetchData();
    return result;
  }

  // Update
  async function editCategory(category: Category): Promise<boolean> {
    if (!token) return false;
    const result = await UpdateCategoryAPI(category, token);
    refetchData();
    return result;
  }

  // Delete
  async function deleteCategory(id: string): Promise<boolean> {
    if (!token) return false;
    const result = await DeleteCategoryAPI(id, token);
    refetchData();
    return result;
  }

  useEffect(() => {
    refetchData();
  }, []);

  return {
    categories,
    categoriesLoading: loading,
    addCategory,
    editCategory,
    deleteCategory,
    refetchData,
  };
}
