import { gql } from "apollo-server-express";

export const typeDefs = gql`
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

  type FullUser {
    id: ID!
    first_name: String!
    last_name: String!
    role: UserRole!
    email: String!
    password: String!
  }

  type CurrentUser {
    id: ID!
    first_name: String!
    last_name: String!
    role: UserRole!
    email: String!
    token: String
  }

  type Category {
    id: ID!
    name: String!
  }

  type Session {
    id: ID!
    token: String!
    user_id: ID!
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

  type DbReview {
    id: ID!
    rating: String!
    description: String!
    movie_id: String!
    user_id: String!
  }

  type DbMovie {
    id: ID!
    title: String!
    description: String!
    poster: String!
    release_date: String!
    category_id: String!
    rating: String!
  }

  type DbUser {
    id: ID!
    first_name: String!
    last_name: String!
    role: String!
    email: String!
  }

  input MovieInput {
    id: ID!
  }

  input UserInput {
    id: ID!
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

  input LoginInput {
    email: String!
    password: String!
  }

  input AddTokenInput {
    email: String!
    password: String!
  }

  input GetTokenInput {
    id: ID!
    first_name: String!
    last_name: String!
    email: String!
    role: String!
  }

  input GetReviewsOfMovieInput {
    movie_id: ID!
    limit: Int!
    offset: Int!
  }

  input GetReviewsOfUserInput {
    user_id: ID!
    limit: Int!
    offset: Int!
  }

  type Expiry {
    expired: Int!
  }

  input DeleteTokenInput {
    token: String!
  }

  type RunResult {
    lastID: Int!
    changes: Int!
  }

  input MoviePaginationInput {
    limit: Int!
    offset: Int!
    category: [String!]!
    searchField: String
    orderByTitle: Boolean
    orderByCategory: Boolean
  }

  input UserPaginationInput {
    limit: Int!
    offset: Int!
  }

  input numOfMoviesInput {
    category: [String!]!
    searchField: String
  }

  input numOfReviewsInput {
    user_id: ID
    movie_id: ID
  }

  type numOfMovies {
    totalCount: Int
  }

  type numOfUsers {
    totalCount: Int
  }

  type numOfReviews {
    totalCount: Int
  }

  input resetTokenInput {
    email:String!
  }

  input changePasswordInput {
    user_id:String!
    password:String!
  }

  input getUserForPassChangeInput {
    token:String!
  }

  # Queries
  type Query {
    getUsers(input: UserPaginationInput): [FullUser!]!
    getUserById(input: UserInput!): User
    getUserByToken: CurrentUser!
    getUserForLogin(input: LoginInput!): CurrentUser!
    getUserForPassChange(input:getUserForPassChangeInput!): FullUser!
    checkForUser(input: UserEmailInput!): User
    getNumberOfUsers: numOfUsers!
    getMovies(input: MoviePaginationInput!): [Movie!]!
    getMovieById(input: MovieInput!): Movie
    getNumberOfMovies(input: numOfMoviesInput): numOfMovies!
    getCategories: [Category!]!
    getCategoryById(input: CategoryInput!): Category
    checkForCategory(input: CategoryNameInput!): Category!
    getReviews: [Review!]!
    getReviewById(input: ReviewInput!): Review
    getReviewsOfMovie(input: GetReviewsOfMovieInput!): [Review!]!
    getReviewsOfUser(input: GetReviewsOfUserInput!): [Review!]!
    getNumberOfReviewsOfUser(input: numOfReviewsInput!): numOfReviews!
    getNumberOfReviewsOfMovie(input: numOfReviewsInput!): numOfReviews!
    getToken: Expiry!
    getResetToken(input: resetTokenInput!): String!
  }

  # Mutations
  type Mutation {
    logIn(input: LoginInput!): CurrentUser!
    createUser(input: AddUserInput!): User
    updateUser(input: UpdateUserInput!): FullUser!
    deleteUser(input: DeleteUserInput!): FullUser!
    changePassword(input: changePasswordInput!): RunResult!
    createCategory(input: AddCategoryInput!): Category
    updateCategory(input: UpdateCategoryInput!): Category!
    deleteCategory(input: DeleteCategoryInput!): Category!
    createMovie(input: AddMovieInput!): Movie
    updateMovie(input: UpdateMovieInput!): Movie!
    deleteMovie(input: DeleteMovieInput!): Movie!
    createReview(input: AddReviewInput!): Review
    updateReview(input: UpdateReviewInput!): Review
    deleteReview(input: DeleteReviewInput!): Review!
    createToken(input: AddTokenInput!): RunResult!
    deleteToken(input: DeleteTokenInput!): RunResult!
    sendForgotPassEmail(input: resetTokenInput!): Boolean!
  }
`;
