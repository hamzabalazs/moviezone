import Resizer from "react-image-file-resizer";
import { API_URL } from "../constants";
import { Movie } from "../types";
// Movie DELETE by ID
export async function DeleteMovieAPI(
  id: string,
  token: string
): Promise<boolean> {
  try {
    const response = await fetch(API_URL + "/movie/" + id, {
      method: "DELETE",
      headers: {
        "auth-token": token,
      },
    });
    return response.status === 200;
  } catch (err) {}
  return false;
}

// Movie GET ALL
export async function getMovieList(): Promise<Movie[]> {
  const res = await fetch(API_URL + "/movies", {
    method: "GET",
  });
  if (res.status === 200) {
    const data = await res.json();
    return data.data;
  } else return [];
}

// Movie GET by ID
export const getMovieById = async (
  movieId: string
): Promise<Movie | undefined> => {
  const testresponse = await fetch(API_URL + "/movie/" + movieId, {
    method: "GET",
  });
  if (testresponse.status === 200) {
    const res = await fetch(API_URL + "/movie/" + movieId, {
      method: "GET",
    });
    const body = await res.json();

    return body.data;
  }
};

export async function getMovieByIdForReviews(movieId: string) {
  const res = await fetch(API_URL + "/movie/" + movieId, {
    method: "GET",
  });
  if (res.status === 200) {
    const data = await res.json();
    return data.data;
  } else return;
}

// Movie PATCH by ID
export async function UpdateMovieAPI(
  movie: Omit<Movie, "rating">,
  token: string
): Promise<boolean> {
  try {
    const response = await fetch(API_URL + "/movie/" + movie.id, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
        "auth-token": token,
      },
      body: JSON.stringify({
        title: movie.title,
        description: movie.description,
        releaseDate: movie.releaseDate,
        poster: movie.poster,
        categoryId: movie.categoryId,
      }),
    });
    return response.status === 200;
  } catch (err) {}
  return false;
}

// Movie POST
export async function AddMovieAPI(
  movie: Omit<Movie, "id" | "rating">,
  token: string
): Promise<boolean> {
  const response = await fetch(API_URL + "/movie", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      "auth-token": token,
    },
    body: JSON.stringify(movie),
  });
  console.log("resr", response);
  return response.status === 200;
}

// File resizer for image compression
export const resizeFile = (file: File) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      640,
      480,
      "JPEG",
      60,
      0,
      (uri) => {
        resolve(uri);
      },
      "base64"
    );
  });
