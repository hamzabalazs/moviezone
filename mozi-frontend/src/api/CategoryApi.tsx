import { baseUrl } from "../url";
import { Category } from "./types";

// Category GET by ID
export const getCategoryById = async (
  categoryId: string
): Promise<Category | undefined> => {
  const testresponse = await fetch(baseUrl + "/category/" + categoryId, {
    method: "GET",
  });
  if (testresponse.status === 200) {
    const res = await fetch(baseUrl + "/category/" + categoryId, {
      method: "GET",
    });
    const body = await res.json();

    return body.data;
  }
};

// Category PATCH by ID
export async function UpdateCategoryAPI(
  category: Category,
  token: string
): Promise<boolean> {
  try {
    const response = await fetch(baseUrl + "/category/" + category.id, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
        "auth-token": token,
      },
      body: JSON.stringify({ name: category.name }),
    });
    return response.status === 200;
  } catch (err) {}
  return false;
}

// Category DELETE by ID
export async function DeleteCategoryAPI(
  id: string,
  token: string
): Promise<boolean> {
  try {
    const response = await fetch(baseUrl + "/category/" + id, {
      method: "DELETE",
      headers: {
        "auth-token": token,
      },
    });
    return response.status === 200;
  } catch (err) {}
  return false;
}

// Category GET ALL
export async function getCategoryList() {
  const res = await fetch(baseUrl + "/categories", { method: "GET" });
  if (res.status === 200) {
    const data = await res.json();
    return data.data;
  } else return [];
}

// Category POST
export async function AddCategoryAPI(
  category: Omit<Category, "id">,
  token: string
) {
  const response = await fetch(baseUrl + "/category", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      "auth-token": token,
    },
    body: JSON.stringify(category),
  });
  return response.status === 200;
}
