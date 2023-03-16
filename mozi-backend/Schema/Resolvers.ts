import { v4 as uuidv4 } from "uuid";
import md5 from "md5";
import {
  createUser,
  deleteUser,
  updateUser,
  getUsers,
  checkForUser,
  getUserById,
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
  getReviewsOfUser,
} from "../utils/review";
import { getUserForLogin, logIn } from "../utils/auth";
import {getCategories,getCategoryById,deleteCategory,updateCategory,createCategory,checkForCategory} from "../utils/category"
import { MyContext } from "../server";
import { FullUser, Movie,  Review,  Role,  UserRole } from "../utils/types";
import { BAD_CATEGORYID_MESSAGE, CATEGORY_EXISTS_MESSAGE, NO_CATEGORY_MESSAGE, NO_CURRENT_USER_MESSAGE, NO_MOVIE_MESSAGE, NO_REVIEW_MESSAGE, NO_TOKEN_MESSAGE, NO_USER_MESSAGE, REVIEW_EXISTS_MESSAGE, REVIEW_INVALID_RATING_MESSAGE, UNAUTHORIZED_MESSAGE, USER_CREATION_FAILED_MESSAGE, USER_EMAIL_USED_MESSAGE } from "../common/errorMessages";

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
    async getUserForLogin(_:any,{input}:any,context:MyContext){
      return await getUserForLogin(input,context)
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
    async getReviewsOfUser(_:any,{input}:any,context:MyContext){
      return await getReviewsOfUser(input.user_id,context);
    },
    // Movies
    async getMovies(_:any, __:any, context:MyContext) {
      return await getMovies(_, context);
    },
    async getMovieById(_:any, {input}:any, context:MyContext) {
      return await getMovieById(input.id, context);
    },
    async getMoviesByCategoryId(_:any, {input}:any, context:MyContext){
      return await getMoviesByCategoryId(input.category_id,context);
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
        throw new Error(USER_EMAIL_USED_MESSAGE);
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
        throw new Error(USER_CREATION_FAILED_MESSAGE);
      }
      return createdUser
    },
    async updateUser(_:any, args:any, context:MyContext) {
      const updatedUser = args.input;
      const isUser = await getUserById(updatedUser.id, context);
      const user = await getUserByToken(context)
      if(!user) throw new Error(NO_TOKEN_MESSAGE)
      context.user = user
      if (isUser === undefined) throw new Error(NO_USER_MESSAGE);
      return await updateUser(updatedUser, context);
    },
    async deleteUser(_:any, args:any, context:MyContext) {
      const user_id = args.input.id;
      const isUser = await getUserById(user_id, context);
      const user = await getUserByToken(context)
      if(!user) throw new Error(NO_TOKEN_MESSAGE)
      context.user = user
      if (isUser === undefined) throw new Error(NO_USER_MESSAGE);
      return await deleteUser(user_id, context);
    },
    // Categories
    async createCategory(_:any, args:any, context:MyContext) {
      const user = await getUserByToken(context)
      if(!user) throw new Error(NO_TOKEN_MESSAGE)
      context.user = user
      const newCategory = args.input.name;
      const isCategory = await checkForCategory(
        newCategory,
        context
      );
      if (isCategory !== undefined) {
        throw new Error(CATEGORY_EXISTS_MESSAGE);
      }
      return await createCategory(newCategory, context);
    },
    async updateCategory(_:any, args:any, context:MyContext) {
      const user = await getUserByToken(context)
      if(!user) throw new Error(NO_TOKEN_MESSAGE)
      context.user = user
      const updatedCategory = args.input;
      const categoryExists = await checkForCategory(updatedCategory.name,context)
      if(categoryExists) throw new Error(CATEGORY_EXISTS_MESSAGE)
      const isCategory = await getCategoryById(
        updatedCategory.id,
        context
      );
      if (isCategory === undefined) throw new Error(NO_CATEGORY_MESSAGE);
      return await updateCategory(updatedCategory, context);
    },
    async deleteCategory(_:any, args:any, context:MyContext) {
      const user = await getUserByToken(context)
      if(!user) throw new Error(NO_TOKEN_MESSAGE)
      context.user = user
      const categoryId = args.input.id;
      const category = await getCategoryById(
        categoryId,
        context
      );
      if (category === undefined) throw new Error(NO_CATEGORY_MESSAGE);
      return await deleteCategory(categoryId, context);
    },
    // Movies
    async createMovie(_:any, args:any, context:MyContext) {
      const user = await getUserByToken(context)
      if(!user) throw new Error(NO_TOKEN_MESSAGE)
      context.user = user
      const newMovie = args.input;
      const isCategory = await getCategoryById(
        newMovie.category_id,
        context
      );
      if (isCategory === undefined) {
        throw new Error(BAD_CATEGORYID_MESSAGE);
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
      if(!user) throw new Error(NO_TOKEN_MESSAGE)
      context.user = user
      const updatedMovie = args.input;
      return await updateMovie(updatedMovie, context);
    },
    async deleteMovie(_:any, args:any, context:MyContext) {
      const user = await getUserByToken(context)
      if(!user) throw new Error(NO_TOKEN_MESSAGE)
      context.user = user
      const movie_id:string = args.input.id;
      return await deleteMovie(movie_id, context);
    },
    // Reviews
    async createReview(_:any, args:any, context:MyContext) {
      const newReview = args.input;
      const isUser = await getUserById(newReview.user_id, context);
      if (isUser === undefined)
        throw new Error(NO_USER_MESSAGE);
      const isMovie = await getMovieById(
        newReview.movie_id,
        context
      );
      if (isMovie === undefined)
        throw new Error(NO_MOVIE_MESSAGE);
      const hasReview = await getReviewsOfUserForMovie(
        newReview.user_id,
        newReview.movie_id,
        context
      );
      if (hasReview.length !== 0)
        throw new Error(REVIEW_EXISTS_MESSAGE);
      const review:Review = {
        id: uuidv4(),
        ...newReview
      };
      return await createReview(review, context);
    },
    async updateReview(_:any, args:any, context:MyContext) {
      const updatedReview = args.input;
      const user = await getUserByToken(context)
      if(!user) throw new Error(NO_TOKEN_MESSAGE)
      context.user = user
      if (updatedReview.rating === "0") throw new Error(REVIEW_INVALID_RATING_MESSAGE);
      return await updateReview(updatedReview, context);
    }, 
    async deleteReview(_:any, args:any, context:MyContext) {
      const reviewId = args.input.id;
      const isReview = await getReviewById(reviewId, context);
      const user = await getUserByToken(context)
      if(!user) throw new Error(NO_TOKEN_MESSAGE)
      context.user = user
      if (isReview === undefined) throw new Error(NO_REVIEW_MESSAGE);
      return await deleteReview(reviewId, context);
    },
    // Authentication
    async logIn(_:any, {input}:any, context:MyContext) {
      const user = await getUserForLogin(input,context)
      context.user = user
      return await logIn(input, context);
    },
  },
};

