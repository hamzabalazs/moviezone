export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "admin" | "editor" | "viewer";
};

export type CurrUser = User & {
  token: string;
};

export type Review = {
  id: string;
  userId: string;
  movieId: string;
  description: string;
  rating: number;
};

export type Category = {
  id: string;
  name: string;
};

export type Movie = {
  id: string;
  title: string;
  description: string;
  poster: string;
  rating: number;
  releaseDate: string;
  categoryId: string;
};

export type ReviewUpdated = {
  id: string;
  movieId: string;
  userId: string;
  firstName: string;
  lastName: string;
  description: string;
  rating: number;
};

export type AlertType = {
  isOpen: boolean;
  message: string;
  type: "success" | "error" | undefined
}
