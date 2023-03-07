export type User = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: "admin" | "editor" | "viewer";
};

export type CurrUser = User & {
  token: string;
};

export type Review = {
  id: string;
  user: User;
  movie: Movie;
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
  release_date: string;
  category: Category;
};

export type ReviewUpdated = {
  id: string;
  movie: Movie;
  user: User;
  first_name: string;
  last_name: string;
  description: string;
  rating: number;
};

export type AlertType = {
  isOpen: boolean;
  message: string;
  type: "success" | "error" | undefined
}
