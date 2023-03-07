
import { API_URL } from "../constants";
import { Review } from "../types";

//Review POST
export async function AddReviewAPI(
  review: Omit<Review, "id" | "user_id">,
  token: string
) {
  if (review.rating !== 0) {
    const response = await fetch(API_URL + "/review", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "auth-token": token,
      },
      body: JSON.stringify(review),
    });

    return response.status === 200;
  }
  return false;
}

//Review DELETE by ID
export async function DeleteReviewAPI(
  id: string,
  token: string
): Promise<boolean> {
  try {
    const response = await fetch(API_URL + "/review/" + id, {
      method: "DELETE",
      headers: {
        "auth-token": token,
      },
    });
    return response.status === 200;
  } catch (err) {}
  return false;
}

//Review PATCH by ID
export async function UpdateReviewAPI(
  review: Omit<Review, "user_id" | "movie_id">,
  token: string
): Promise<boolean> {
  const rating = review.rating;
  const description = review.description;

  try {
    const response = await fetch(API_URL + "/review/" + review.id, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
        "auth-token": token,
      },
      body: JSON.stringify({ rating, description }),
    });
    return response.status === 200;
  } catch (err) {}
  return false;
}

//Review GET ALL
export async function getReviewsList() {
  const res = await fetch(API_URL + "/reviews", { method: "GET" });
  const data = await res.json();
  return data.data;
}

//Review GET by ID
export const getReviewById = async (
  reviewId: string
): Promise<Review | undefined> => {
  const testresponse = await fetch(API_URL + "/review/" + reviewId, {
    method: "GET",
  });
  if (testresponse.status === 200) {
    const res = await fetch(API_URL + "/review/" + reviewId, {
      method: "GET",
    });
    const body = await res.json();
    return body.data;
  }
};
