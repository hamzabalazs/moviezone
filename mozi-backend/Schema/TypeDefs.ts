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

  type Movie {
    id: ID!
    title: String!
    description: String!
    poster: String!
    release_date: String!
    category: Category!
    rating: String!
  }

  type CastWithMovie{
    id: ID!
    name: String!
    photo: String!
    description: String!
    movie_id: ID!
  }

  type Review {
    id: ID!
    rating: String!
    description: String!
    movie: Movie!
    user: User!
  }

  type Cast {
    id: ID!
    name: String!
    photo: String!
    description: String!
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
    lastID: Int
    changes: Int
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

  type MovieAutocompleteList {
    id:ID!,
    title:String!
  }

  input numOfReviewsForChart {
    movie_id:String!
  }

  type avgOfReviews {
    average: Float!
  }

  type numOfMoviesPerCategory { 
    name: String!
    totalCount: Int!
  }

  type numOfMoviesPerYear {
    totalCount: Int!
    year: String!
  }

  type avgOfCategories {
    name:String!,
    average: Float!
  }

  input CastOfMovieInput {
    movie_id: ID!
  }

  input CheckForCastInput {
    name:String!
  }

  input AddCastInput {
    name: String!
    photo: String!
    description: String!
    movie_id: ID!
  }

  input EditCastInput {
    id:ID!
    name: String!
    description: String!
    movie_id: ID
  }

  input DeleteCastInput {
    id: ID!
    movie_id: ID
  }

  input CastInput { 
    id: ID!
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
    getAllMovies: [MovieAutocompleteList]!
    getMovies(input: MoviePaginationInput!): [Movie!]!
    getMovieById(input: MovieInput!): Movie
    getNumberOfMovies(input: numOfMoviesInput): numOfMovies!
    getNumberOfMoviesPerCategory: [numOfMoviesPerCategory!]!
    getNumberOfMoviesPerYear: [numOfMoviesPerYear!]!
    getCategories: [Category!]!
    getCategoryById(input: CategoryInput!): Category
    checkForCategory(input: CategoryNameInput!): Category!
    getAverageRatingOfCategories: [avgOfCategories!]!
    getReviews: [Review!]!
    getReviewById(input: ReviewInput!): Review
    getReviewsOfMovie(input: GetReviewsOfMovieInput!): [Review!]!
    getReviewsOfUser(input: GetReviewsOfUserInput!): [Review!]!
    getNumberOfReviewsOfUser(input: numOfReviewsInput!): numOfReviews!
    getNumberOfReviewsOfMovie(input: numOfReviewsInput!): numOfReviews!
    getNumberOfReviewsOfMoviePerMonth(input: numOfReviewsForChart!): [numOfReviews!]!
    getAverageOfReviewsOfMoviePerMonth(input: numOfReviewsForChart!): [avgOfReviews!]!
    getToken: Expiry!
    getResetToken(input: resetTokenInput!): String!
    getCast(input: CastOfMovieInput!): [Cast!]!
    getCastById(input: CastInput!): Cast!
    checkForCast(input: CheckForCastInput!): Cast!
    getMoviesOfCast(input: CastInput!): [Movie!]!
  }

  # Mutations
  type Mutation {
    logIn(input: LoginInput!): CurrentUser!
    createUser(input: AddUserInput!): User
    updateUser(input: UpdateUserInput!): FullUser!
    deleteUser(input: DeleteUserInput!): FullUser!
    changePassword(input: changePasswordInput!): RunResult
    createCategory(input: AddCategoryInput!): Category
    updateCategory(input: UpdateCategoryInput!): Category!
    deleteCategory(input: DeleteCategoryInput!): Category!
    createMovie(input: AddMovieInput!): Movie
    updateMovie(input: UpdateMovieInput!): Movie!
    deleteMovie(input: DeleteMovieInput!): Movie!
    createReview(input: AddReviewInput!): DbReview
    updateReview(input: UpdateReviewInput!): Review
    deleteReview(input: DeleteReviewInput!): Review!
    deleteToken(input: DeleteTokenInput!): RunResult
    sendForgotPassEmail(input: resetTokenInput!): Boolean!
    createCast(input: AddCastInput!): CastWithMovie!
    updateCast(input: EditCastInput!): Cast!
    deleteCast(input: DeleteCastInput!): CastWithMovie!
  }
`;
