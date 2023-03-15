import { v4 as uuidv4 } from "uuid";
import md5 from "md5";
import {
  createUser,
  deleteUser,
  updateUser,
  getUsers,
  checkForUser,
  getUserById,
  getCurrentUser,
  getUserByToken,
  
} from "../utils/user"
import { getMovies, getMovieById,deleteMovie,updateMovie,createMovie, getMoviesByCategoryId } from "../utils/movie"
import {
  getReviews,
  getReviewById,
  getReviewsOfUserForMovie,
  getReviewsOfMovie,
  deleteReview,
  updateReview,
  createReview,
} from "../utils/review";
import { getUserForLogin, logIn } from "../utils/auth";
import {getCategories,getCategoryById,deleteCategory,updateCategory,createCategory,checkForCategory} from "../utils/category"
import { MyContext } from "../server";
import { Category, FullUser, Movie,  Review,  Role,  UserRole } from "../utils/types";

export const resolvers = {
  Query: {
    // Users
    async getUsers(_:any, __:any, context:MyContext) {
      return await getUsers(_, context);
    },
    async getUserById(_:any,  {input}:any , context:MyContext) {
      return await getUserById(input.id, context);
    },
    async getUserByToken(_:any, __:any, context:MyContext) {
      return await getUserByToken(context)
    },
    async checkForUser(_:any,  {input}:any , context:MyContext) {
      return await checkForUser(input.email, context);
    },
    async getCurrentUser(_:any,__:any,context:MyContext){
      return await getCurrentUser(context)
    },
    // Categories
    async getCategories(_:any, __:any, context:MyContext) {
      return await getCategories(_, context);
    },
    async getCategoryById(_:any, {input}:any , context:MyContext) {
      return await getCategoryById(input.id, context);
    },
    async checkForCategory(_:any, {input}:any, context:MyContext) {
      return await checkForCategory(input.name, context);
    },
    // Reviews
    async getReviews(_:any, __:any, context:MyContext) {
      return await getReviews(_, context);
    },
    async getReviewById(_:any, {input}:any, context:MyContext) {
      return await getReviewById(input.id, context);
    },
    async getReviewsOfMovie(_:any,{input}:any,context:MyContext){
      return await getReviewsOfMovie(input.movie_id,context)
    },
    async getReviewsOfUserForMovie(_:any,{input}:any,context:MyContext){
      return await getReviewsOfUserForMovie(input.user_id,input.movie_id,context)
    },
    // Movies
    async getMovies(_:any, __:any, context:MyContext) {
      return await getMovies(_, context);
    },
    async getMovieById(_:any, {input}:any, context:MyContext) {
      return await getMovieById(input.id, context);
    },
    async getMoviesByCategoryId(_:any, {input}:any, context:MyContext){
      return await getMoviesByCategoryId(input.id,context);
    }
  },
  Review: {
    async movie(review:any, __:any, context:MyContext) {
      return await getMovieById(review.movie_id, context);
    },
    async user(review:any, __:any, context:MyContext) {
      return await getUserById(review.user_id, context);
    },
  },
  Movie: {
    async rating(movie:Movie, __:any, context:MyContext) {
      const reviews = await getReviewsOfMovie(movie.id, context);
      let avg = 0;
      reviews.map((review) => (avg += parseInt(review.rating)));
      if (avg !== 0) {
        avg /= reviews.length;
        return avg.toString();
      } else return 0;
    },
    async category(movie:any, __:any, context:MyContext) {
      return await getCategoryById(movie.category_id, context);
    },
  },

  Mutation: {
    // Users
    async createUser(_:any, args:any, context:MyContext) {
      const newUser = args.input;
      const isUser = await checkForUser(newUser.email, context);
      if (isUser !== undefined) {
        throw new Error("Email in use!");
      }
      const user:FullUser = {
        id: uuidv4(),
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        email: newUser.email,
        password: md5(newUser.password),
        role: "viewer" as unknown as UserRole,
      };
      const createdUser = await createUser(user, context);
      if (createdUser === undefined) {
        throw new Error("User creation failed!");
      }
      return createdUser
    },
    async updateUser(_:any, args:any, context:MyContext) {
      const updatedUser = args.input;
      const isUser = await getUserById(updatedUser.id, context);
      const user = await getUserByToken(context)
      if(!user) throw new Error("No Token!")
      context.user = user
      if (isUser === undefined) throw new Error("User does not exist!");
      return await updateUser(updatedUser, context);
    },
    async deleteUser(_:any, args:any, context:MyContext) {
      const user_id = args.input.id;
      const isUser = await getUserById(user_id, context);
      const user = await getUserByToken(context)
      if(!user) throw new Error("No Token!")
      context.user = user
      if (isUser === undefined) throw new Error("User does not exist!");
      return await deleteUser(user_id, context);
    },

    // Categories
    async createCategory(_:any, args:any, context:MyContext) {
      const user = await getUserByToken(context)
      if(!user) throw new Error("No Token!")
      context.user = user
      const newCategory = args.input.name;
      const isCategory = await checkForCategory(
        newCategory,
        context
      );
      if (isCategory !== undefined) {
        throw new Error("Category already exists!");
      }
      return await createCategory(newCategory, context);
    },
    async updateCategory(_:any, args:any, context:MyContext) {
      const user = await getUserByToken(context)
      if(!user) throw new Error("No token")
      context.user = user
      const updatedCategory = args.input;
      const categoryExists = await checkForCategory(updatedCategory.name,context)
      console.log(categoryExists)
      if(categoryExists) throw new Error("Category already exists!")
      const isCategory = await getCategoryById(
        updatedCategory.id,
        context
      );
      if (isCategory === undefined) throw new Error("Category does not exist!");
      return await updateCategory(updatedCategory, context);
    },
    async deleteCategory(_:any, args:any, context:MyContext) {
      const user = await getUserByToken(context)
      if(!user) throw new Error("No Token!")
      context.user = user
      const categoryId = args.input.id;
      const category = await getCategoryById(
        categoryId,
        context
      );
      if (category === undefined) throw new Error("Category does not exist!");
      return await deleteCategory(categoryId, context);
    },
    // Movies
    async createMovie(_:any, args:any, context:MyContext) {
      const user = await getUserByToken(context)
      if(!user) throw new Error("No Token!")
      context.user = user
      const newMovie = args.input;
      const isCategory:Category = await getCategoryById(
        newMovie.category_id,
        context
      );
      if (isCategory === undefined) {
        throw new Error("Invalid category_id, could not add movie!");
      }
      const movie:Movie = {
        id: uuidv4(),
        title:newMovie.title,
        description:newMovie.description,
        poster:newMovie.poster,
        release_date:newMovie.release_date,
        category:isCategory,
        rating: "0",
      };
      return await createMovie(movie, context);
    },
    async updateMovie(_:any, args:any, context:MyContext) {
      const user = await getUserByToken(context)
      if(!user) throw new Error("No Token!")
      context.user = user
      const updatedMovie = args.input;
      const isMovie = await getMovieById(updatedMovie.id,context)
      if(!isMovie) throw new Error("Movie not found")
      const isCategory = await getCategoryById(
        updatedMovie.category_id,
        context
      );
      if (isCategory === undefined) {
        throw new Error("Invalid category_id, could not add movie!");
      }
      return await updateMovie(updatedMovie, context);
    },
    async deleteMovie(_:any, args:any, context:MyContext) {
      const user = await getUserByToken(context)
      if(!user) throw new Error("No Token!")
      context.user = user
      const movie_id:string = args.input.id;
      const isMovie = await getMovieById(movie_id, context);
      if (isMovie === undefined) {
        throw new Error("Movie not found!");
      }
      return await deleteMovie(movie_id, context);
    },
    // Reviews
    async createReview(_:any, args:any, context:MyContext) {
      const newReview = args.input;
      const isUser = await getUserById(newReview.user_id, context);
      if (isUser === undefined)
        throw new Error("User not found! Cannot add review!");
      const isMovie = await getMovieById(
        newReview.movie_id,
        context
      );
      if (isMovie === undefined)
        throw new Error("Movie not found! Cannot add review!");
      const hasReview = await getReviewsOfUserForMovie(
        newReview.user_id,
        newReview.movie_id,
        context
      );
      if (hasReview.length !== 0)
        throw new Error("Movie already rated by User!");
      const review:Review = {
        id: uuidv4(),
        ...newReview
      };
      return await createReview(review, context);
    },
    async updateReview(_:any, args:any, context:MyContext) {
      const updatedReview = args.input;
      const user = await getUserByToken(context)
      context.user = user
      if (updatedReview.rating === "0") throw new Error("Cannot rate with 0!");
      return await updateReview(updatedReview, context);
    }, 
    async deleteReview(_:any, args:any, context:MyContext) {
      const reviewId = args.input.id;
      const isReview = await getReviewById(reviewId, context);
      const user = await getUserByToken(context)
      if(!user) throw new Error("No Token!")
      context.user = user
      if (isReview === undefined) throw new Error("Review does not exist!");
      return await deleteReview(reviewId, context);
    },
    // Authentication
    async logIn(_:any, {input}:any, context:MyContext) {
      const user = await getUserForLogin(input,context)
      if(user) context.user = user
      return await logIn(input, context);
    },
  },
};

