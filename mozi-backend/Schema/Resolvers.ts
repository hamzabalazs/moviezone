import { v4 as uuidv4 } from "uuid";
import md5 from "md5";
import {
  createUser,
  deleteUser,
  updateUser,
  checkForUser,
  getUserById,
  getUserByToken,
  getUsers,
  getNumberOfUsers,
  changePassword,
  sendForgotPassEmail,
  getResetToken,
  getUserForPassChange,
} from "../utils/user";
import {
  getMovies,
  getMovieById,
  deleteMovie,
  updateMovie,
  createMovie,
  getNumberOfMovies,
  getAllMovies,
  getNumberOfMoviesPerYear,
} from "../utils/movie";
import {
  getReviews,
  getReviewById,
  deleteReview,
  updateReview,
  createReview,
  getReviewsOfMovie,
  getReviewsOfUser,
  getNumberOfReviewsOfUser,
  getNumberOfReviewsOfMovie,
  getNumberOfReviewsOfMoviePerMonth,
  getAverageOfReviewsOfMoviePerMonth,
} from "../utils/review";
import { deleteToken, getToken, getUserForLogin, logIn } from "../utils/auth";
import {
  getCategories,
  getCategoryById,
  deleteCategory,
  updateCategory,
  createCategory,
  checkForCategory,
  getNumberOfMoviesPerCategory,
  getAverageRatingOfCategories,
} from "../utils/category";
import { MyContext } from "../server";
import {
  CreateMovieType,
  FullUser,
  Movie,
  Review,
  UserRole,
} from "../utils/types";
import {
  BAD_CATEGORYID_MESSAGE,
  CATEGORY_EXISTS_MESSAGE,
  NOT_VALID_USER,
  NO_CATEGORY_MESSAGE,
  NO_MOVIE_MESSAGE,
  NO_TOKEN_MESSAGE,
  NO_USER_MESSAGE,
  REVIEW_INVALID_RATING_MESSAGE,
  USER_EMAIL_USED_MESSAGE,
} from "../../mozi-frontend/src/common/errorMessages";
import {
  createReviewErrorHandling,
  tokenChecker,
  userSchema,
} from "../common/validation";
import { GraphQLError } from "graphql";
import { checkForCast, createCast, deleteCast, getCast, getCastById, getMoviesOfCast, updateCast } from "../utils/cast";

export const resolvers = {
  Query: {
    // Users
    async getUsers(_: any, {input}: any, context: MyContext) {
      return await getUsers(input,context);
    },
    async getNumberOfUsers(_: any, __: any, context: MyContext) {
      return await getNumberOfUsers(context);
    },
    async getUserById(_: any, { input }: any, context: MyContext) {
      return await getUserById(input.id, context);
    },
    async getUserByToken(_: any, __: any, context: MyContext) {
      return await getUserByToken(context);
    },
    async checkForUser(_: any, { input }: any, context: MyContext) {
      return await checkForUser(input.email, context);
    },
    async getUserForLogin(_: any, { input }: any, context: MyContext) {
      return await getUserForLogin(input, context);
    },
    async getUserForPassChange(_:any,{input}:any,context:MyContext) {
      return await getUserForPassChange(input.token,context)
    },
    // Categories
    async getCategories(_: any, __: any, context: MyContext) {
      return await getCategories(_, context);
    },
    async getCategoryById(_: any, { input }: any, context: MyContext) {
      return await getCategoryById(input.id, context);
    },
    async checkForCategory(_: any, { input }: any, context: MyContext) {
      return await checkForCategory(input.name, context);
    },
    async getNumberOfMoviesPerCategory(_:any,__:any,context:MyContext){
      return await getNumberOfMoviesPerCategory(context)
    },
    async getAverageRatingOfCategories(_:any,__:any,context:MyContext){
      return await getAverageRatingOfCategories(context)
    },
    // Reviews
    async getReviews(_: any, __: any, context: MyContext) {
      return await getReviews(context);
    },
    async getReviewById(_: any, { input }: any, context: MyContext) {
      return await getReviewById(input.id, context);
    },
    async getNumberOfReviewsOfUser(_:any,{input}:any,context:MyContext){
      return await getNumberOfReviewsOfUser(input.user_id,context)
    },
    async getNumberOfReviewsOfMovie(_:any,{input}:any,context:MyContext){
      return await getNumberOfReviewsOfMovie(input.movie_id,context)
    },
    async getReviewsOfMovie(_:any,{input}:any,context:MyContext){
      return await getReviewsOfMovie(input,context)
    },
    async getReviewsOfUser(_:any,{input}:any,context:MyContext){
      return await getReviewsOfUser(input,context);
    },
    async getNumberOfReviewsOfMoviePerMonth(_:any,{input}:any,context:MyContext){
      return await getNumberOfReviewsOfMoviePerMonth(input.movie_id,context);
    },
    async getAverageOfReviewsOfMoviePerMonth(_:any,{input}:any,context:MyContext){
      return await getAverageOfReviewsOfMoviePerMonth(input.movie_id,context)
    },

    // Movies
    async getAllMovies(_:any, __:any, context:MyContext){
      return await getAllMovies(context)
    },
    async getMovies(_: any, { input }: any, context: MyContext) {
      return await getMovies(input, context);
    },
    async getNumberOfMovies(_: any, { input }: any, context: MyContext) {
      return await getNumberOfMovies(input, context);
    },
    async getMovieById(_: any, { input }: any, context: MyContext) {
      return await getMovieById(input.id, context);
    },
    async getNumberOfMoviesPerYear(_:any,__:any,context:MyContext){
      return await getNumberOfMoviesPerYear(context);
    },
    // Authentication
    async getToken(_: any, __: any, context: MyContext) {
      const user = await getUserByToken(context);
      if (!user)
        throw new GraphQLError(NO_TOKEN_MESSAGE, {
          extensions: { code: "UNAUTHENTICATED" },
        });
      context.user = user;
      return await getToken(context);
    },
    async getResetToken(_:any,{input}:any,context:MyContext){
      return await getResetToken(input.email,context)
    },
    // Cast
    async getCast(_:any, { input }: any, context: MyContext){
      return await getCast(input.movie_id,context)
    },
    async getCastById(_:any, { input }:any, context:MyContext){
      return await getCastById(input.id,context)
    },
    async checkForCast(_:any, { input }:any, context:MyContext){
      return await checkForCast(input.name,context)
    },
    async getMoviesOfCast(_:any, { input }:any, context:MyContext){
      return await getMoviesOfCast(input.id,context);
    }
  },
  Review: {
    async movie(review: any, __: any, context: MyContext) {
      return await getMovieById(review.movie_id, context);
    },
    async user(review: any, __: any, context: MyContext) {
      return await getUserById(review.user_id, context);
    },
  },
  Movie: {
    async rating(movie: Movie, __: any, context: MyContext) {
      const reviews = await getReviews(context);
      let avg = 0;
      let length = 0;
      reviews.map((x: any) => {
        if (x.movie_id === movie.id) {
          avg += parseInt(x.rating);
          length++;
        }
      });
      if (avg !== 0) {
        avg /= length;
        return avg.toString();
      } else return 0;
    },
    async category(movie: any, __: any, context: MyContext) {
      return await getCategoryById(movie.category_id, context);
    },
  },

  Mutation: {
    // Users
    async createUser(_: any, args: any, context: MyContext) {
      const newUser = args.input;
      const isUser = await checkForUser(newUser.email, context);
      if (isUser !== null) {
        throw new GraphQLError(USER_EMAIL_USED_MESSAGE, {
          extensions: { code: "ALREADY_EXISTS" },
        });
      }
      const validation = await userSchema.isValid(newUser);
      if (!validation)
        throw new GraphQLError(NOT_VALID_USER, {
          extensions: { code: "VALIDATION_FAILED" },
        });
      const user: FullUser = {
        id: uuidv4(),
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        email: newUser.email,
        password: md5(newUser.password),
        role: "viewer" as unknown as UserRole,
      };
      return await createUser(user, context);
    },
    async updateUser(_: any, args: any, context: MyContext) {
      const updatedUser = args.input;
      const isUser = await getUserById(updatedUser.id, context);
      context.user = await tokenChecker(context);
      if (isUser === null)
        throw new GraphQLError(NO_USER_MESSAGE, {
          extensions: { code: "NOT_FOUND" },
        });
      return await updateUser(updatedUser, context);
    },
    async deleteUser(_: any, args: any, context: MyContext) {
      const user_id = args.input.id;
      const isUser = await getUserById(user_id, context);
      context.user = await tokenChecker(context);
      if (isUser === null)
        throw new GraphQLError(NO_USER_MESSAGE, {
          extensions: { code: "NOT_FOUND" },
        });
      return await deleteUser(user_id, context);
    },
    async changePassword(_:any, args:any, context:MyContext){
      return await changePassword(args.input,context)
    },
    // Categories
    async createCategory(_: any, args: any, context: MyContext) {
      context.user = await tokenChecker(context);
      const newCategory = args.input.name;
      const isCategory = await checkForCategory(newCategory, context);
      if (isCategory !== null) {
        throw new GraphQLError(CATEGORY_EXISTS_MESSAGE, {
          extensions: { code: "ALREADY_EXISTS" },
        });
      }
      return await createCategory(newCategory, context);
    },
    async updateCategory(_: any, args: any, context: MyContext) {
      context.user = await tokenChecker(context);
      const updatedCategory = args.input;
      const categoryExists = await checkForCategory(
        updatedCategory.name,
        context
      );
      if (categoryExists)
        throw new GraphQLError(CATEGORY_EXISTS_MESSAGE, {
          extensions: { code: "ALREADY_EXISTS" },
        });
      const isCategory = await getCategoryById(updatedCategory.id, context);
      if (isCategory === null)
        throw new GraphQLError(NO_CATEGORY_MESSAGE, {
          extensions: { code: "NOT_FOUND" },
        });
      return await updateCategory(updatedCategory, context);
    },
    async deleteCategory(_: any, args: any, context: MyContext) {
      context.user = await tokenChecker(context);
      const categoryId = args.input.id;
      const category = await getCategoryById(categoryId, context);
      if (category === null)
        throw new GraphQLError(NO_CATEGORY_MESSAGE, {
          extensions: { code: "NOT_FOUND" },
        });
      return await deleteCategory(categoryId, context);
    },
    // Movies
    async createMovie(_: any, args: any, context: MyContext) {
      context.user = await tokenChecker(context);
      const newMovie = args.input;
      const isCategory = await getCategoryById(newMovie.category_id, context);
      if (isCategory === null) {
        throw new GraphQLError(BAD_CATEGORYID_MESSAGE, {
          extensions: { code: "NOT_FOUND" },
        });
      }
      const movie: CreateMovieType = {
        id: uuidv4(),
        title: newMovie.title,
        description: newMovie.description,
        poster: newMovie.poster,
        release_date: newMovie.release_date,
        category: isCategory,
      };
      return await createMovie(movie, context);
    },
    async updateMovie(_: any, args: any, context: MyContext) {
      context.user = await tokenChecker(context);
      const updatedMovie = args.input;
      return await updateMovie(updatedMovie, context);
    },
    async deleteMovie(_: any, args: any, context: MyContext) {
      context.user = await tokenChecker(context);
      const movie_id: string = args.input.id;
      return await deleteMovie(movie_id, context);
    },
    // Reviews
    async createReview(_: any, args: any, context: MyContext) {
      const newReview = args.input;
      context.user = await tokenChecker(context);
      await createReviewErrorHandling(newReview, context);
      const review: Review = {
        id: uuidv4(),
        ...newReview,
      };
      return await createReview(review, context);
    },
    async updateReview(_: any, args: any, context: MyContext) {
      const updatedReview = args.input;
      context.user = await tokenChecker(context);
      if (updatedReview.rating === "0")
        throw new GraphQLError(REVIEW_INVALID_RATING_MESSAGE, {
          extensions: { code: "BAD_USER_INPUT" },
        });
      return await updateReview(updatedReview, context);
    },
    async deleteReview(_: any, args: any, context: MyContext) {
      const reviewId = args.input.id;
      context.user = await tokenChecker(context);
      return await deleteReview(reviewId, context);
    },
    // Authentication
    async logIn(_: any, { input }: any, context: MyContext) {
      const user = await getUserForLogin(input, context);
      context.user = user;
      return await logIn(input, context);
    },
    async deleteToken(_: any, { input }: any, context: MyContext) {
      return await deleteToken(input.token, context);
    },
    async sendForgotPassEmail(_:any,{ input }:any, context: MyContext) {
      return await sendForgotPassEmail(input.email,context);
    },
    // Cast
    async createCast(_:any,{ input }:any, context:MyContext){
      context.user = await tokenChecker(context);
      const isMovie = await getMovieById(input.movie_id,context);
      if(!isMovie) throw new GraphQLError(NO_MOVIE_MESSAGE,{extensions:{code:"NOT_FOUND"}})
      return await createCast(input,context)
    },
    async updateCast(_:any, { input }:any, context:MyContext){
      context.user = await tokenChecker(context);
      return await updateCast(input,context);
    },
    async deleteCast(_:any, { input }:any, context:MyContext){
      context.user = await tokenChecker(context);
      return await deleteCast(input,context)
    }
  },
};
