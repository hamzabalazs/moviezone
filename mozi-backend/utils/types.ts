export enum UserRole {
  admin,
  editor,
  viewer,
}

export type User = {
  id: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  email: string;
};

export type FullUser = {
  id: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  email: string;
  password: string;
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
  release_date: string;
  category: Category;
  rating: string;
};

export type MovieWithReviews = {
  id: string;
  title: string;
  description: string;
  poster: string;
  release_date: string;
  category: Category;
  rating: string;
  reviews: Review[];
};

export type CreateMovieType = {
  id: string;
  title: string;
  description: string;
  poster: string;
  release_date: string;
  category: Category;
};

export type Review = {
  id: string;
  rating: string;
  description: string;
  movie: Movie;
  user: User;
};

export type ReviewListReview = {
  id: string;
  rating: string;
  description: string;
  user: { id: string; first_name: string; last_name: string };
  movie: { id: string };
};

export type ExtendedReview = {
  id: string;
  user: User;
  movie: MovieWithReviews;
  description: string;
  rating: string;
};

export type Role = {
  role: string;
};

export type Session = {
  id: number;
  token: string;
  user_id: string;
};

export type CurrentUser = {
  id: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  email: string;
  token: string;
};

export type IdInput = {
  id: string;
};

export type EmailInput = {
  email: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type NameInput = {
  name: string;
};

export type ReviewForMovieInput = {
  movie_id: string;
};

export type CreateUserInput = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
};

export type CreateMovieInput = {
  title: string;
  description: string;
  poster: string;
  release_date: string;
  category_id: string;
};

export type CreateReviewInput = {
  rating: string;
  description: string;
  movie_id: string;
  user_id: string;
};

export type UpdateMovieInput = {
  id: string;
  title: string;
  description: string;
  poster: string;
  release_date: string;
  category_id: string;
};

export type DbReview = {
  id: string;
  rating: string;
  description: string;
  movie_id: string;
  user_id: string;
};

export type DbMovie = {
  id: string;
  title: string;
  description: string;
  poster: string;
  release_date: string;
  category_id: string;
  rating: string;
};

export type DbUser = {
  id: string;
  first_name: string;
  last_name: string;
  role: string;
  email: string;
};
