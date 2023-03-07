const { v4: uuidv4 } = require("uuid");
const md5 = require("md5");
const userModule = require("../utils/user");
const movieModule = require("../utils/movie");
const categoryModule = require("../utils/category");
const reviewModule = require("../utils/review");
const authModule = require("../utils/auth")

const resolvers = {
  Query: {
    // Users
    async getUsers(_, __, context) {
      return await userModule.getUsers(_, context);
    },
    async getUserById(_, { input }, context) {
      return await userModule.getUserById(input.id, context);
    },
    async checkForUser(_, { input }, context) {
      return await userModule.checkForUser(input.email, context);
    },
    async getUserForLogin(_, {input},context){
      return await userModule.getUserForLogin(input.email,context);
    },
    async logIn(_,{input},context){
      await authModule.logIn(input,context);
    },

    async getExistingToken(_,{input},context){
      await authModule.getExistingToken(input,context);
    },
    // Categories
    async getCategories(_, __, context) {
      return await categoryModule.getCategories(_, context);
    },
    async getCategoryById(_, { input }, context) {
      return await categoryModule.getCategoryById(input.id, context);
    },
    async checkForCategory(_, { input }, context) {
      return await categoryModule.checkForCategory(input.name, context);
    },
    // Reviews
    async getReviews(_, { input }, context) {
      return await reviewModule.getReviews(input, context);
    },
    async getReviewById(_, { input }, context) {
      return await reviewModule.getReviewById(input.id, context);
    },
    // Movies
    async getMovies(_, __, context) {
      return await movieModule.getMovies(_, context);
    },
    async getMovieById(_, { input }, context) {
      return await movieModule.getMovieById(input.id, context);
    },
    
  },
  Review: {
    async movie(review, __, context) {
      return await movieModule.getMovieById(review.movie_id, context);
    },
    async user(review, __, context) {
      return await userModule.getUserById(review.user_id, context);
    },
  },
  Movie: {
    async rating(movie, __, context) {
      input = { movie_id: movie.id };
      const reviews = await reviewModule.getReviews(input, context);
      let avg = 0;
      reviews.map((review) => (avg += parseInt(review.rating)));
      if (avg !== 0) {
        avg /= reviews.length;
        return avg.toString();
      } else return 0;
    },
    async category(movie, __, context) {
      return await categoryModule.getCategoryById(movie.category_id, context);
    },
  },

  Mutation: {
    // Users
    async createUser(_, args, context) {
      const newUser = args.input;
      const isUser = await userModule.checkForUser(newUser.email, context);
      if (isUser !== undefined) {
        throw new Error("Email in use!");
      }
      const user = {
        id: uuidv4(),
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        email: newUser.email,
        password: md5(newUser.password),
        role: "viewer",
      };
      const createdUser = await userModule.createUser(user, context);
      if(createdUser === undefined){
        throw new Error("User creation failed!")
      }

    },
    async updateUser(_, args, context) {
      const updatedUser = args.input;
      const isUser = await userModule.getUserById(updatedUser.id, context);
      if (isUser === undefined) throw new Error("User does not exist!");
      return await userModule.updateUser(updatedUser, context);
    },
    async deleteUser(_, args, context) {
      const userId = args.input.id;
      const user = await userModule.getUserById(userId, context);
      if (user === undefined) throw new Error("User does not exist!");
      return await userModule.deleteUser(userId, context);
    },
    
    // Categories
    async createCategory(_, args, context) {
      const newCategory = args.input;
      const isCategory = await categoryModule.checkForCategory(
        newCategory.name,
        context
      );
      if (isCategory !== undefined) {
        throw new Error("Category already exists!");
      }
      return await categoryModule.createCategory(newCategory, context);
    },
    async updateCategory(_, args, context) {
      const updatedCategory = args.input;
      const isCategory = await categoryModule.getCategoryById(
        updatedCategory.id,
        context
      );
      if (isCategory === undefined) throw new Error("Category does not exist!");
      return await categoryModule.updateCategory(updatedCategory, context);
    },
    async deleteCategory(_, args, context) {
      const categoryId = args.input.id;
      const category = await categoryModule.getCategoryById(
        categoryId,
        context
      );
      if (category === undefined) throw new Error("Category does not exist!");
      return await categoryModule.deleteCategory(categoryId, context);
    },
    // Movies
    async createMovie(_, args, context) {
      const newMovie = args.input;
      const isCategory = await categoryModule.getCategoryById(
        newMovie.category_id,
        context
      );
      if (isCategory === undefined) {
        throw new Error("Invalid category_id, could not add movie!");
      }
      const movie = {
        id: uuidv4(),
        ...newMovie,
        rating: 0,
      };
      return await movieModule.createMovie(movie, context);
    },
    async updateMovie(_, args, context) {
      const updatedMovie = args.input;
      const isCategory = await categoryModule.getCategoryById(
        updatedMovie.category_id,
        context
      );
      if (isCategory === undefined) {
        throw new Error("Invalid category_id, could not add movie!");
      }
      return await movieModule.updateMovie(updatedMovie, context);
    },
    async deleteMovie(_, args, context) {
      const movieId = args.input.id;
      const isMovie = await movieModule.getMovieById(movieId, context);
      if (isMovie === undefined) {
        throw new Error("Movie not found!");
      }
      return await movieModule.deleteMovie(movieId, context);
    },
    // Reviews
    async createReview(_, args, context) {
      const newReview = args.input;
      const isUser = await userModule.getUserById(newReview.user_id, context);
      if (isUser === undefined)
        throw new Error("User not found! Cannot add review!");
      const isMovie = await movieModule.getMovieById(
        newReview.movie_id,
        context
      );
      if (isMovie === undefined)
        throw new Error("Movie not found! Cannot add review!");
      const hasReview = await reviewModule.getReviewsOfUserForMovie(
        newReview.user_id,
        newReview.movie_id,
        context
      );
      if (hasReview.length !== 0)
        throw new Error("Movie already rated by User!");
      const review = {
        id: uuidv4(),
        ...newReview,
      };
      return await reviewModule.createReview(review, context);
    },
    async updateReview(_, args, context) {
      const updatedReview = args.input;
      if (updatedReview.rating === "0") throw new Error("Cannot rate with 0!");
      return await reviewModule.updateReview(updatedReview, context);
    },
    async deleteReview(_, args, context) {
      const reviewId = args.input.id;
      const isReview = await reviewModule.getReviewById(reviewId, context);
      if (isReview === undefined) throw new Error("Review does not exist!");
      return await reviewModule.deleteReview(reviewId, context);
    },
    // Authentication
    async createToken(_,args,context){
      const user = args.input;
      return await authModule.createToken(user,context)
    },
    
  },
};

module.exports = { resolvers };
