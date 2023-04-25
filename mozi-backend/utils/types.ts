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

export type ExtendedReview = {
  id: string;
  user: User;
  movie: MovieWithReviews;
  description: string;
  rating: string;
};

export type Cast = {
  id:string;
  name:string;
  photo:string;
  description:string;
}

export type MovieCast = {
  cast_id:string,
  movie_id:string,
}

export type Role = {
  role: string;
};

export type CurrentUser = {
  id: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  email: string;
  token: string;
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
};
