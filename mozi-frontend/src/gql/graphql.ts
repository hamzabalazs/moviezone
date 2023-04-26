/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type AddCastInput = {
  description: Scalars['String'];
  movie_id: Scalars['ID'];
  name: Scalars['String'];
  photo: Scalars['String'];
};

export type AddCategoryInput = {
  name: Scalars['String'];
};

export type AddMovieInput = {
  category_id: Scalars['String'];
  description: Scalars['String'];
  poster: Scalars['String'];
  release_date: Scalars['String'];
  title: Scalars['String'];
};

export type AddReviewInput = {
  description: Scalars['String'];
  movie_id: Scalars['String'];
  rating: Scalars['String'];
  user_id: Scalars['String'];
};

export type AddUserInput = {
  email: Scalars['String'];
  first_name: Scalars['String'];
  last_name: Scalars['String'];
  password: Scalars['String'];
};

export type Cast = {
  __typename?: 'Cast';
  description: Scalars['String'];
  id: Scalars['ID'];
  name: Scalars['String'];
  photo: Scalars['String'];
};

export type CastInput = {
  id: Scalars['ID'];
};

export type CastOfMovieInput = {
  movie_id: Scalars['ID'];
};

export type CastWithMovie = {
  __typename?: 'CastWithMovie';
  description: Scalars['String'];
  id: Scalars['ID'];
  movie_id: Scalars['ID'];
  name: Scalars['String'];
  photo: Scalars['String'];
};

export type Category = {
  __typename?: 'Category';
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type CategoryInput = {
  id: Scalars['ID'];
};

export type CategoryNameInput = {
  name: Scalars['String'];
};

export type CheckForCastInput = {
  name: Scalars['String'];
};

export type CurrentUser = {
  __typename?: 'CurrentUser';
  email: Scalars['String'];
  first_name: Scalars['String'];
  id: Scalars['ID'];
  last_name: Scalars['String'];
  role: UserRole;
  token?: Maybe<Scalars['String']>;
};

export type DbMovie = {
  __typename?: 'DbMovie';
  category_id: Scalars['String'];
  description: Scalars['String'];
  id: Scalars['ID'];
  poster: Scalars['String'];
  rating: Scalars['String'];
  release_date: Scalars['String'];
  title: Scalars['String'];
};

export type DbReview = {
  __typename?: 'DbReview';
  description: Scalars['String'];
  id: Scalars['ID'];
  movie_id: Scalars['String'];
  rating: Scalars['String'];
  user_id: Scalars['String'];
};

export type DeleteCastInput = {
  id: Scalars['ID'];
  movie_id?: InputMaybe<Scalars['ID']>;
};

export type DeleteCategoryInput = {
  id: Scalars['ID'];
};

export type DeleteMovieInput = {
  id: Scalars['ID'];
};

export type DeleteReviewInput = {
  id: Scalars['ID'];
};

export type DeleteTokenInput = {
  token: Scalars['String'];
};

export type DeleteUserInput = {
  id: Scalars['ID'];
};

export type EditCastInput = {
  description: Scalars['String'];
  id: Scalars['ID'];
  movie_id?: InputMaybe<Scalars['ID']>;
  name: Scalars['String'];
};

export type Expiry = {
  __typename?: 'Expiry';
  expired: Scalars['Int'];
};

export type FullUser = {
  __typename?: 'FullUser';
  email: Scalars['String'];
  first_name: Scalars['String'];
  id: Scalars['ID'];
  last_name: Scalars['String'];
  password: Scalars['String'];
  role: UserRole;
};

export type GetReviewsOfMovieInput = {
  limit: Scalars['Int'];
  movie_id: Scalars['ID'];
  offset: Scalars['Int'];
};

export type GetReviewsOfUserInput = {
  limit: Scalars['Int'];
  offset: Scalars['Int'];
  user_id: Scalars['ID'];
};

export type LoginInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type Movie = {
  __typename?: 'Movie';
  category: Category;
  description: Scalars['String'];
  id: Scalars['ID'];
  poster: Scalars['String'];
  rating: Scalars['String'];
  release_date: Scalars['String'];
  title: Scalars['String'];
};

export type MovieAutocompleteList = {
  __typename?: 'MovieAutocompleteList';
  id: Scalars['ID'];
  title: Scalars['String'];
};

export type MovieInput = {
  id: Scalars['ID'];
};

export type MoviePaginationInput = {
  category: Array<Scalars['String']>;
  limit: Scalars['Int'];
  offset: Scalars['Int'];
  orderByCategory?: InputMaybe<Scalars['Boolean']>;
  orderByTitle?: InputMaybe<Scalars['Boolean']>;
  searchField?: InputMaybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  changePassword?: Maybe<RunResult>;
  createCast: CastWithMovie;
  createCategory?: Maybe<Category>;
  createMovie?: Maybe<Movie>;
  createReview?: Maybe<Review>;
  createUser?: Maybe<User>;
  deleteCast: CastWithMovie;
  deleteCategory: Category;
  deleteMovie: Movie;
  deleteReview: Review;
  deleteToken?: Maybe<RunResult>;
  deleteUser: FullUser;
  logIn: CurrentUser;
  sendForgotPassEmail: Scalars['Boolean'];
  updateCast: Cast;
  updateCategory: Category;
  updateMovie: Movie;
  updateReview?: Maybe<Review>;
  updateUser: FullUser;
};


export type MutationChangePasswordArgs = {
  input: ChangePasswordInput;
};


export type MutationCreateCastArgs = {
  input: AddCastInput;
};


export type MutationCreateCategoryArgs = {
  input: AddCategoryInput;
};


export type MutationCreateMovieArgs = {
  input: AddMovieInput;
};


export type MutationCreateReviewArgs = {
  input: AddReviewInput;
};


export type MutationCreateUserArgs = {
  input: AddUserInput;
};


export type MutationDeleteCastArgs = {
  input: DeleteCastInput;
};


export type MutationDeleteCategoryArgs = {
  input: DeleteCategoryInput;
};


export type MutationDeleteMovieArgs = {
  input: DeleteMovieInput;
};


export type MutationDeleteReviewArgs = {
  input: DeleteReviewInput;
};


export type MutationDeleteTokenArgs = {
  input: DeleteTokenInput;
};


export type MutationDeleteUserArgs = {
  input: DeleteUserInput;
};


export type MutationLogInArgs = {
  input: LoginInput;
};


export type MutationSendForgotPassEmailArgs = {
  input: ResetTokenInput;
};


export type MutationUpdateCastArgs = {
  input: EditCastInput;
};


export type MutationUpdateCategoryArgs = {
  input: UpdateCategoryInput;
};


export type MutationUpdateMovieArgs = {
  input: UpdateMovieInput;
};


export type MutationUpdateReviewArgs = {
  input: UpdateReviewInput;
};


export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
};

export type Query = {
  __typename?: 'Query';
  checkForCast: Cast;
  checkForCategory: Category;
  checkForUser?: Maybe<User>;
  getAllMovies: Array<Maybe<MovieAutocompleteList>>;
  getAverageOfReviewsOfMoviePerMonth: Array<AvgOfReviews>;
  getAverageRatingOfCategories: Array<AvgOfCategories>;
  getCast: Array<Cast>;
  getCastById: Cast;
  getCategories: Array<Category>;
  getCategoryById?: Maybe<Category>;
  getMovieById?: Maybe<Movie>;
  getMovies: Array<Movie>;
  getMoviesOfCast: Array<Movie>;
  getNumberOfMovies: NumOfMovies;
  getNumberOfMoviesPerCategory: Array<NumOfMoviesPerCategory>;
  getNumberOfMoviesPerYear: Array<NumOfMoviesPerYear>;
  getNumberOfReviewsOfMovie: NumOfReviews;
  getNumberOfReviewsOfMoviePerMonth: Array<NumOfReviews>;
  getNumberOfReviewsOfUser: NumOfReviews;
  getNumberOfUsers: NumOfUsers;
  getResetToken: Scalars['String'];
  getReviewById?: Maybe<Review>;
  getReviews: Array<Review>;
  getReviewsOfMovie: Array<Review>;
  getReviewsOfUser: Array<Review>;
  getToken: Expiry;
  getUserById?: Maybe<User>;
  getUserByToken: CurrentUser;
  getUserForLogin: CurrentUser;
  getUserForPassChange: FullUser;
  getUsers: Array<FullUser>;
};


export type QueryCheckForCastArgs = {
  input: CheckForCastInput;
};


export type QueryCheckForCategoryArgs = {
  input: CategoryNameInput;
};


export type QueryCheckForUserArgs = {
  input: UserEmailInput;
};


export type QueryGetAverageOfReviewsOfMoviePerMonthArgs = {
  input: NumOfReviewsForChart;
};


export type QueryGetCastArgs = {
  input: CastOfMovieInput;
};


export type QueryGetCastByIdArgs = {
  input: CastInput;
};


export type QueryGetCategoryByIdArgs = {
  input: CategoryInput;
};


export type QueryGetMovieByIdArgs = {
  input: MovieInput;
};


export type QueryGetMoviesArgs = {
  input: MoviePaginationInput;
};


export type QueryGetMoviesOfCastArgs = {
  input: CastInput;
};


export type QueryGetNumberOfMoviesArgs = {
  input?: InputMaybe<NumOfMoviesInput>;
};


export type QueryGetNumberOfReviewsOfMovieArgs = {
  input: NumOfReviewsInput;
};


export type QueryGetNumberOfReviewsOfMoviePerMonthArgs = {
  input: NumOfReviewsForChart;
};


export type QueryGetNumberOfReviewsOfUserArgs = {
  input: NumOfReviewsInput;
};


export type QueryGetResetTokenArgs = {
  input: ResetTokenInput;
};


export type QueryGetReviewByIdArgs = {
  input: ReviewInput;
};


export type QueryGetReviewsOfMovieArgs = {
  input: GetReviewsOfMovieInput;
};


export type QueryGetReviewsOfUserArgs = {
  input: GetReviewsOfUserInput;
};


export type QueryGetUserByIdArgs = {
  input: UserInput;
};


export type QueryGetUserForLoginArgs = {
  input: LoginInput;
};


export type QueryGetUserForPassChangeArgs = {
  input: GetUserForPassChangeInput;
};


export type QueryGetUsersArgs = {
  input?: InputMaybe<UserPaginationInput>;
};

export type Review = {
  __typename?: 'Review';
  description: Scalars['String'];
  id: Scalars['ID'];
  movie: Movie;
  rating: Scalars['String'];
  user: User;
};

export type ReviewInput = {
  id: Scalars['ID'];
};

export type RunResult = {
  __typename?: 'RunResult';
  changes?: Maybe<Scalars['Int']>;
  lastID?: Maybe<Scalars['Int']>;
};

export type UpdateCategoryInput = {
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type UpdateMovieInput = {
  category_id: Scalars['String'];
  description: Scalars['String'];
  id: Scalars['ID'];
  poster: Scalars['String'];
  release_date: Scalars['String'];
  title: Scalars['String'];
};

export type UpdateReviewInput = {
  description: Scalars['String'];
  id: Scalars['ID'];
  rating: Scalars['String'];
};

export type UpdateUserInput = {
  email: Scalars['String'];
  first_name: Scalars['String'];
  id: Scalars['ID'];
  last_name: Scalars['String'];
  password: Scalars['String'];
  role?: InputMaybe<UserRole>;
};

export type User = {
  __typename?: 'User';
  email: Scalars['String'];
  first_name: Scalars['String'];
  id: Scalars['ID'];
  last_name: Scalars['String'];
  role: UserRole;
};

export type UserEmailInput = {
  email: Scalars['String'];
};

export type UserInput = {
  id: Scalars['ID'];
};

export type UserPaginationInput = {
  limit: Scalars['Int'];
  offset: Scalars['Int'];
};

export enum UserRole {
  Admin = 'admin',
  Editor = 'editor',
  Viewer = 'viewer'
}

export type AvgOfCategories = {
  __typename?: 'avgOfCategories';
  average: Scalars['Float'];
  name: Scalars['String'];
};

export type AvgOfReviews = {
  __typename?: 'avgOfReviews';
  average: Scalars['Float'];
};

export type ChangePasswordInput = {
  password: Scalars['String'];
  user_id: Scalars['String'];
};

export type GetUserForPassChangeInput = {
  token: Scalars['String'];
};

export type NumOfMovies = {
  __typename?: 'numOfMovies';
  totalCount?: Maybe<Scalars['Int']>;
};

export type NumOfMoviesInput = {
  category: Array<Scalars['String']>;
  searchField?: InputMaybe<Scalars['String']>;
};

export type NumOfMoviesPerCategory = {
  __typename?: 'numOfMoviesPerCategory';
  name: Scalars['String'];
  totalCount: Scalars['Int'];
};

export type NumOfMoviesPerYear = {
  __typename?: 'numOfMoviesPerYear';
  totalCount: Scalars['Int'];
  year: Scalars['String'];
};

export type NumOfReviews = {
  __typename?: 'numOfReviews';
  totalCount?: Maybe<Scalars['Int']>;
};

export type NumOfReviewsForChart = {
  movie_id: Scalars['String'];
};

export type NumOfReviewsInput = {
  movie_id?: InputMaybe<Scalars['ID']>;
  user_id?: InputMaybe<Scalars['ID']>;
};

export type NumOfUsers = {
  __typename?: 'numOfUsers';
  totalCount?: Maybe<Scalars['Int']>;
};

export type ResetTokenInput = {
  email: Scalars['String'];
};

export type LogInMutationVariables = Exact<{
  input: LoginInput;
}>;


export type LogInMutation = { __typename?: 'Mutation', logIn: { __typename?: 'CurrentUser', id: string, first_name: string, last_name: string, role: UserRole, email: string, token?: string | null } };

export type GetCastByIdQueryVariables = Exact<{
  input: CastInput;
}>;


export type GetCastByIdQuery = { __typename?: 'Query', getCastById: { __typename?: 'Cast', id: string, name: string, photo: string, description: string }, getMoviesOfCast: Array<{ __typename?: 'Movie', id: string, title: string, description: string, release_date: string, poster: string, rating: string }> };

export type CreateCastMutationVariables = Exact<{
  input: AddCastInput;
}>;


export type CreateCastMutation = { __typename?: 'Mutation', createCast: { __typename?: 'CastWithMovie', id: string, name: string, photo: string, description: string, movie_id: string } };

export type UpdateCastMutationVariables = Exact<{
  input: EditCastInput;
}>;


export type UpdateCastMutation = { __typename?: 'Mutation', updateCast: { __typename?: 'Cast', id: string, name: string, photo: string, description: string } };

export type DeleteCastMutationVariables = Exact<{
  input: DeleteCastInput;
}>;


export type DeleteCastMutation = { __typename?: 'Mutation', deleteCast: { __typename?: 'CastWithMovie', id: string, name: string, photo: string, description: string, movie_id: string } };

export type GetCategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCategoriesQuery = { __typename?: 'Query', getCategories: Array<{ __typename?: 'Category', id: string, name: string }> };

export type CreateCategoryMutationVariables = Exact<{
  input: AddCategoryInput;
}>;


export type CreateCategoryMutation = { __typename?: 'Mutation', createCategory?: { __typename?: 'Category', id: string, name: string } | null };

export type UpdateCategoryMutationVariables = Exact<{
  input: UpdateCategoryInput;
}>;


export type UpdateCategoryMutation = { __typename?: 'Mutation', updateCategory: { __typename?: 'Category', id: string, name: string } };

export type DeleteCategoryMutationVariables = Exact<{
  input: DeleteCategoryInput;
}>;


export type DeleteCategoryMutation = { __typename?: 'Mutation', deleteCategory: { __typename?: 'Category', id: string, name: string } };

export type GetMoviesQueryVariables = Exact<{
  input: MovieInput;
  input2: GetReviewsOfMovieInput;
  input3: NumOfReviewsInput;
  input4: CastOfMovieInput;
}>;


export type GetMoviesQuery = { __typename?: 'Query', getMovieById?: { __typename?: 'Movie', id: string, title: string, description: string, poster: string, release_date: string, rating: string, category: { __typename?: 'Category', id: string, name: string } } | null, getReviewsOfMovie: Array<{ __typename?: 'Review', id: string, rating: string, description: string, movie: { __typename?: 'Movie', id: string, title: string, description: string, poster: string, release_date: string, rating: string, category: { __typename?: 'Category', id: string, name: string } }, user: { __typename?: 'User', id: string, first_name: string, last_name: string, role: UserRole, email: string } }>, getNumberOfReviewsOfMovie: { __typename?: 'numOfReviews', totalCount?: number | null }, getCast: Array<{ __typename?: 'Cast', id: string, name: string, photo: string, description: string }> };

export type GetHomePageDataQueryVariables = Exact<{
  input: MoviePaginationInput;
  input2: NumOfMoviesInput;
}>;


export type GetHomePageDataQuery = { __typename?: 'Query', getCategories: Array<{ __typename?: 'Category', id: string, name: string }>, getMovies: Array<{ __typename?: 'Movie', id: string, title: string, description: string, poster: string, release_date: string, rating: string, category: { __typename?: 'Category', id: string, name: string } }>, getNumberOfMovies: { __typename?: 'numOfMovies', totalCount?: number | null } };

export type UpdateMovieMutationVariables = Exact<{
  input: UpdateMovieInput;
}>;


export type UpdateMovieMutation = { __typename?: 'Mutation', updateMovie: { __typename?: 'Movie', id: string, title: string, description: string, poster: string, release_date: string, rating: string, category: { __typename?: 'Category', id: string, name: string } } };

export type CreateMovieMutationVariables = Exact<{
  input: AddMovieInput;
}>;


export type CreateMovieMutation = { __typename?: 'Mutation', createMovie?: { __typename?: 'Movie', id: string, title: string, description: string, poster: string, release_date: string, rating: string, category: { __typename?: 'Category', id: string, name: string } } | null };

export type DeleteMovieMutationVariables = Exact<{
  input: DeleteMovieInput;
}>;


export type DeleteMovieMutation = { __typename?: 'Mutation', deleteMovie: { __typename?: 'Movie', id: string, title: string, description: string, poster: string, release_date: string, rating: string, category: { __typename?: 'Category', id: string, name: string } } };

export type GetReviewsQueryVariables = Exact<{
  input: GetReviewsOfUserInput;
  input2: NumOfReviewsInput;
}>;


export type GetReviewsQuery = { __typename?: 'Query', getReviewsOfUser: Array<{ __typename?: 'Review', id: string, rating: string, description: string, movie: { __typename?: 'Movie', id: string, title: string, description: string, poster: string, release_date: string, rating: string, category: { __typename?: 'Category', id: string, name: string } }, user: { __typename?: 'User', id: string, first_name: string, last_name: string, role: UserRole, email: string } }>, getNumberOfReviewsOfUser: { __typename?: 'numOfReviews', totalCount?: number | null } };

export type CreateReviewMutationVariables = Exact<{
  input: AddReviewInput;
}>;


export type CreateReviewMutation = { __typename?: 'Mutation', createReview?: { __typename?: 'Review', id: string, rating: string, description: string, movie: { __typename?: 'Movie', id: string, title: string, description: string, poster: string, release_date: string, rating: string, category: { __typename?: 'Category', id: string, name: string } }, user: { __typename?: 'User', first_name: string, last_name: string, id: string, role: UserRole, email: string } } | null };

export type UpdateReviewMutationVariables = Exact<{
  input: UpdateReviewInput;
}>;


export type UpdateReviewMutation = { __typename?: 'Mutation', updateReview?: { __typename?: 'Review', id: string, rating: string, description: string, movie: { __typename?: 'Movie', id: string, title: string, description: string, poster: string, release_date: string, rating: string, category: { __typename?: 'Category', id: string, name: string } }, user: { __typename?: 'User', first_name: string, last_name: string, id: string, role: UserRole, email: string } } | null };

export type DeleteReviewMutationVariables = Exact<{
  input: DeleteReviewInput;
}>;


export type DeleteReviewMutation = { __typename?: 'Mutation', deleteReview: { __typename?: 'Review', id: string, rating: string, description: string, movie: { __typename?: 'Movie', id: string, title: string, description: string, poster: string, release_date: string, rating: string, category: { __typename?: 'Category', id: string, name: string } }, user: { __typename?: 'User', id: string, first_name: string, last_name: string, role: UserRole, email: string } } };

export type GetFullUsersQueryVariables = Exact<{
  input?: InputMaybe<UserPaginationInput>;
}>;


export type GetFullUsersQuery = { __typename?: 'Query', getUsers: Array<{ __typename?: 'FullUser', id: string, first_name: string, last_name: string, email: string, password: string, role: UserRole }>, getNumberOfUsers: { __typename?: 'numOfUsers', totalCount?: number | null } };

export type CheckForUserQueryVariables = Exact<{
  input: UserEmailInput;
}>;


export type CheckForUserQuery = { __typename?: 'Query', checkForUser?: { __typename?: 'User', id: string, first_name: string, last_name: string, role: UserRole, email: string } | null };

export type CreateUserMutationVariables = Exact<{
  input: AddUserInput;
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser?: { __typename?: 'User', id: string, first_name: string, last_name: string, role: UserRole, email: string } | null };

export type UpdateUserMutationVariables = Exact<{
  input: UpdateUserInput;
}>;


export type UpdateUserMutation = { __typename?: 'Mutation', updateUser: { __typename?: 'FullUser', id: string, first_name: string, last_name: string, role: UserRole, email: string, password: string } };

export type DeleteUserMutationVariables = Exact<{
  input: DeleteUserInput;
}>;


export type DeleteUserMutation = { __typename?: 'Mutation', deleteUser: { __typename?: 'FullUser', id: string, first_name: string, last_name: string, role: UserRole, email: string, password: string } };

export type ChangePasswordMutationVariables = Exact<{
  input: ChangePasswordInput;
}>;


export type ChangePasswordMutation = { __typename?: 'Mutation', changePassword?: { __typename?: 'RunResult', lastID?: number | null, changes?: number | null } | null };

export type SendForgotPassEmailMutationVariables = Exact<{
  input: ResetTokenInput;
}>;


export type SendForgotPassEmailMutation = { __typename?: 'Mutation', sendForgotPassEmail: boolean };

export type GetUserForPassChangeQueryVariables = Exact<{
  input: GetUserForPassChangeInput;
}>;


export type GetUserForPassChangeQuery = { __typename?: 'Query', getUserForPassChange: { __typename?: 'FullUser', id: string, first_name: string, last_name: string, role: UserRole, email: string, password: string } };

export type GetDashboardDataQueryVariables = Exact<{
  input: NumOfReviewsForChart;
}>;


export type GetDashboardDataQuery = { __typename?: 'Query', getAllMovies: Array<{ __typename?: 'MovieAutocompleteList', id: string, title: string } | null>, getNumberOfReviewsOfMoviePerMonth: Array<{ __typename?: 'numOfReviews', totalCount?: number | null }>, getAverageOfReviewsOfMoviePerMonth: Array<{ __typename?: 'avgOfReviews', average: number }>, getNumberOfMoviesPerCategory: Array<{ __typename?: 'numOfMoviesPerCategory', name: string, totalCount: number }>, getNumberOfMoviesPerYear: Array<{ __typename?: 'numOfMoviesPerYear', totalCount: number, year: string }>, getAverageRatingOfCategories: Array<{ __typename?: 'avgOfCategories', name: string, average: number }> };


export const LogInDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"LogIn"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LoginInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"logIn"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"token"}}]}}]}}]} as unknown as DocumentNode<LogInMutation, LogInMutationVariables>;
export const GetCastByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCastById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CastInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getCastById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"photo"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"getMoviesOfCast"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"release_date"}},{"kind":"Field","name":{"kind":"Name","value":"poster"}},{"kind":"Field","name":{"kind":"Name","value":"rating"}}]}}]}}]} as unknown as DocumentNode<GetCastByIdQuery, GetCastByIdQueryVariables>;
export const CreateCastDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateCast"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AddCastInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createCast"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"photo"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"movie_id"}}]}}]}}]} as unknown as DocumentNode<CreateCastMutation, CreateCastMutationVariables>;
export const UpdateCastDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateCast"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EditCastInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateCast"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"photo"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]} as unknown as DocumentNode<UpdateCastMutation, UpdateCastMutationVariables>;
export const DeleteCastDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteCast"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteCastInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteCast"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"photo"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"movie_id"}}]}}]}}]} as unknown as DocumentNode<DeleteCastMutation, DeleteCastMutationVariables>;
export const GetCategoriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCategories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getCategories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<GetCategoriesQuery, GetCategoriesQueryVariables>;
export const CreateCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AddCategoryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<CreateCategoryMutation, CreateCategoryMutationVariables>;
export const UpdateCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateCategoryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<UpdateCategoryMutation, UpdateCategoryMutationVariables>;
export const DeleteCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteCategoryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<DeleteCategoryMutation, DeleteCategoryMutationVariables>;
export const GetMoviesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMovies"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MovieInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input2"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetReviewsOfMovieInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input3"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"numOfReviewsInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input4"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CastOfMovieInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getMovieById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"poster"}},{"kind":"Field","name":{"kind":"Name","value":"release_date"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"rating"}}]}},{"kind":"Field","name":{"kind":"Name","value":"getReviewsOfMovie"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input2"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"rating"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"movie"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"poster"}},{"kind":"Field","name":{"kind":"Name","value":"release_date"}},{"kind":"Field","name":{"kind":"Name","value":"rating"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"getNumberOfReviewsOfMovie"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input3"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"getCast"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input4"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"photo"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]} as unknown as DocumentNode<GetMoviesQuery, GetMoviesQueryVariables>;
export const GetHomePageDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetHomePageData"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MoviePaginationInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input2"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"numOfMoviesInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getCategories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"getMovies"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"poster"}},{"kind":"Field","name":{"kind":"Name","value":"release_date"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"rating"}}]}},{"kind":"Field","name":{"kind":"Name","value":"getNumberOfMovies"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input2"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}}]} as unknown as DocumentNode<GetHomePageDataQuery, GetHomePageDataQueryVariables>;
export const UpdateMovieDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateMovie"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateMovieInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateMovie"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"poster"}},{"kind":"Field","name":{"kind":"Name","value":"release_date"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"rating"}}]}}]}}]} as unknown as DocumentNode<UpdateMovieMutation, UpdateMovieMutationVariables>;
export const CreateMovieDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateMovie"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AddMovieInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createMovie"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"poster"}},{"kind":"Field","name":{"kind":"Name","value":"release_date"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"rating"}}]}}]}}]} as unknown as DocumentNode<CreateMovieMutation, CreateMovieMutationVariables>;
export const DeleteMovieDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteMovie"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteMovieInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteMovie"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"poster"}},{"kind":"Field","name":{"kind":"Name","value":"release_date"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"rating"}}]}}]}}]} as unknown as DocumentNode<DeleteMovieMutation, DeleteMovieMutationVariables>;
export const GetReviewsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getReviews"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetReviewsOfUserInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input2"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"numOfReviewsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getReviewsOfUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"rating"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"movie"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"poster"}},{"kind":"Field","name":{"kind":"Name","value":"release_date"}},{"kind":"Field","name":{"kind":"Name","value":"rating"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"getNumberOfReviewsOfUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input2"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}}]} as unknown as DocumentNode<GetReviewsQuery, GetReviewsQueryVariables>;
export const CreateReviewDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateReview"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AddReviewInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createReview"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"rating"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"movie"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"poster"}},{"kind":"Field","name":{"kind":"Name","value":"release_date"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"rating"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]}}]} as unknown as DocumentNode<CreateReviewMutation, CreateReviewMutationVariables>;
export const UpdateReviewDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateReview"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateReviewInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateReview"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"rating"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"movie"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"poster"}},{"kind":"Field","name":{"kind":"Name","value":"release_date"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"rating"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateReviewMutation, UpdateReviewMutationVariables>;
export const DeleteReviewDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteReview"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteReviewInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteReview"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"rating"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"movie"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"poster"}},{"kind":"Field","name":{"kind":"Name","value":"release_date"}},{"kind":"Field","name":{"kind":"Name","value":"rating"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]}}]} as unknown as DocumentNode<DeleteReviewMutation, DeleteReviewMutationVariables>;
export const GetFullUsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetFullUsers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"UserPaginationInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getUsers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"password"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}},{"kind":"Field","name":{"kind":"Name","value":"getNumberOfUsers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}}]} as unknown as DocumentNode<GetFullUsersQuery, GetFullUsersQueryVariables>;
export const CheckForUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CheckForUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UserEmailInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"checkForUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]} as unknown as DocumentNode<CheckForUserQuery, CheckForUserQueryVariables>;
export const CreateUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AddUserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]} as unknown as DocumentNode<CreateUserMutation, CreateUserMutationVariables>;
export const UpdateUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateUserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"password"}}]}}]}}]} as unknown as DocumentNode<UpdateUserMutation, UpdateUserMutationVariables>;
export const DeleteUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteUserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"password"}}]}}]}}]} as unknown as DocumentNode<DeleteUserMutation, DeleteUserMutationVariables>;
export const ChangePasswordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ChangePassword"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"changePasswordInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"changePassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lastID"}},{"kind":"Field","name":{"kind":"Name","value":"changes"}}]}}]}}]} as unknown as DocumentNode<ChangePasswordMutation, ChangePasswordMutationVariables>;
export const SendForgotPassEmailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SendForgotPassEmail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"resetTokenInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sendForgotPassEmail"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<SendForgotPassEmailMutation, SendForgotPassEmailMutationVariables>;
export const GetUserForPassChangeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUserForPassChange"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"getUserForPassChangeInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getUserForPassChange"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"password"}}]}}]}}]} as unknown as DocumentNode<GetUserForPassChangeQuery, GetUserForPassChangeQueryVariables>;
export const GetDashboardDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetDashboardData"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"numOfReviewsForChart"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAllMovies"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"Field","name":{"kind":"Name","value":"getNumberOfReviewsOfMoviePerMonth"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"getAverageOfReviewsOfMoviePerMonth"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"average"}}]}},{"kind":"Field","name":{"kind":"Name","value":"getNumberOfMoviesPerCategory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"getNumberOfMoviesPerYear"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"year"}}]}},{"kind":"Field","name":{"kind":"Name","value":"getAverageRatingOfCategories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"average"}}]}}]}}]} as unknown as DocumentNode<GetDashboardDataQuery, GetDashboardDataQueryVariables>;