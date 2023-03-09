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
  rating: string;
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
  rating: string;
  release_date: string;
  category: Category;
};


export type AlertType = {
  isOpen: boolean;
  message: string;
  type: "success" | "error" | undefined
}

export type MovieListMovie = {
  id:string;
  title:string;
  poster:string;
  release_date:string;
  category: {id:string}
  rating:string;
}

export type ReviewListReview = {
  id:string;
  user:{id:string,first_name:string,last_name:string}
  description:string;
  rating:string;
  movie:{id:string};

}
