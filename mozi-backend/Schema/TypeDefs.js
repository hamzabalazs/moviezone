const { gql } = require("apollo-server-express");

const typeDefs = gql`
  # Database types
  enum UserRole {
    admin
    editor
    viewer
  }

  type User {
    id: ID!
    first_name: String!
    last_name: String!
    role: UserRole!
    email: String!
  }

  type CurrentUser {
    id: ID!
    first_name: String!
    last_name: String!
    role: UserRole!
    email: String!
    token: String!
  }

  type Category {
    id: ID!
    name: String!
  }

  type Movie {
    id: ID!
    title: String!
    description: String!
    poster: String!
    release_date: String!
    category: Category!
    rating: String!
  }

  type Review {
    id: ID!
    rating: String!
    description: String!
    movie: Movie!
    user: User!
  }

  input MovieInput {
    id: ID!
  }

  input UserInput {
    id: ID!
  }

  input ReviewsInput {
    movie_id: ID
  }

  input ReviewInput {
    id: ID!
  }

  input CategoryInput {
    id: ID!
  }

  input AddUserInput {
    first_name: String!
    last_name: String!
    email: String!
    password: String!
  }

  input UserEmailInput {
    email: String!
  }

  input UpdateUserInput {
    id: ID!
    first_name: String!
    last_name: String!
    email: String!
    password: String!
    role: UserRole
  }

  input DeleteUserInput {
    id: ID!
  }

  input AddCategoryInput {
    name: String!
  }

  input UpdateCategoryInput {
    id: ID!
    name: String!
  }

  input DeleteCategoryInput {
    id: ID!
  }

  input CategoryNameInput {
    name: String!
  }

  input AddMovieInput {
    title: String!
    description: String!
    poster: String!
    release_date: String!
    category_id: String!
  }

  input UpdateMovieInput {
    id: ID!
    title: String!
    description: String!
    poster: String!
    release_date: String!
    category_id: String!
  }

  input DeleteMovieInput {
    id: ID!
  }

  input AddReviewInput {
    rating: String!
    description: String!
    movie_id: String!
    user_id: String!
  }

  input UpdateReviewInput {
    id: ID!
    rating: String!
    description: String!
  }

  input DeleteReviewInput {
    id: ID!
  }

  input GetReviewsOfUserForMovieInput {
    user_id: ID!
    movie_id: ID!
  }

  input LoginInput{
    email:String!
    password:String!
  }

  # Queries
  type Query {
    getUsers: [User!]!
    getUserById(input: UserInput!): User!
    logIn(input: LoginInput!): CurrentUser! 
    getMovies: [Movie!]!
    getMovieById(input: MovieInput!): Movie!
    getCategories: [Category!]!
    getCategoryById(input: CategoryInput!): Category!
    getReviews(input: ReviewsInput): [Review!]!
    getReviewById(input: ReviewInput!): Review!
    getReviewsOfUserForMovie(input: GetReviewsOfUserForMovieInput!): [Review!]!
    checkForUser(input: UserEmailInput!): User!
    checkForCategory(input: CategoryNameInput!): Category!
  }

  # Mutations
  type Mutation {
    createUser(input: AddUserInput!): User!
    updateUser(input: UpdateUserInput!): User!
    deleteUser(input: DeleteUserInput!): User!
    createCategory(input: AddCategoryInput!): Category!
    updateCategory(input: UpdateCategoryInput!): Category!
    deleteCategory(input: DeleteCategoryInput!): Category!
    createMovie(input: AddMovieInput!): Movie!
    updateMovie(input: UpdateMovieInput!): Movie!
    deleteMovie(input: DeleteMovieInput!): Movie!
    createReview(input: AddReviewInput!): Review!
    updateReview(input: UpdateReviewInput!): Review!
    deleteReview(input: DeleteReviewInput!): Review!
  }
`;

module.exports = { typeDefs };
