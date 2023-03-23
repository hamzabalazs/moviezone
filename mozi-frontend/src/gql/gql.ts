/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  mutation LogIn($input: LoginInput!) {\n  logIn(input: $input) {\n    id\n    first_name\n    last_name\n    role\n    email\n    token\n  }\n}\n": types.LogInDocument,
    "\n  mutation CreateCategory($input: AddCategoryInput!) {\n    createCategory(input: $input) {\n      id\n      name\n    }\n  }\n": types.CreateCategoryDocument,
    "\n  mutation UpdateCategory($input: UpdateCategoryInput!) {\n    updateCategory(input: $input) {\n      id\n      name\n    }\n  }\n": types.UpdateCategoryDocument,
    "\n  mutation DeleteCategory($input: DeleteCategoryInput!) {\n    deleteCategory(input: $input) {\n      id\n      name\n    }\n  }\n": types.DeleteCategoryDocument,
    "\n  mutation UpdateMovie($input: UpdateMovieInput!) {\n    updateMovie(input: $input) {\n      id\n      title\n      description\n      poster\n      release_date\n      category {\n        id\n        name\n      }\n      rating\n    }\n  }\n": types.UpdateMovieDocument,
    "\n  mutation CreateMovie($input: AddMovieInput!) {\n    createMovie(input: $input) {\n      id\n      title\n      description\n      poster\n      release_date\n      category {\n        id\n        name\n      }\n      rating\n    }\n  }\n": types.CreateMovieDocument,
    "\n  mutation DeleteMovie($input: DeleteMovieInput!) {\n    deleteMovie(input: $input) {\n      id\n      title\n      description\n      poster\n      release_date\n      category {\n        id\n        name\n      }\n      rating\n    }\n  }\n": types.DeleteMovieDocument,
    "\n  mutation CreateReview($input: AddReviewInput!) {\n    createReview(input: $input) {\n      id\n      rating\n      description\n      movie {\n        id\n        title\n        description\n        poster\n        release_date\n        rating\n        category {\n          id\n          name\n        }\n        reviews {\n          id\n          rating\n          description\n          user {\n            id\n            first_name\n            last_name\n          }\n          movie {\n            id\n          }\n        }\n      }\n      user {\n        id\n        first_name\n        last_name\n        role\n        email\n      }\n    }\n  }\n": types.CreateReviewDocument,
    "\n  mutation UpdateReview($input: UpdateReviewInput!) {\n    updateReview(input: $input) {\n      id\n      rating\n      description\n      movie {\n        id\n        title\n        description\n        poster\n        release_date\n        category {\n          id\n          name\n        }\n        rating\n        reviews {\n          id\n          rating\n          description\n          user {\n            id\n            first_name\n            last_name\n          }\n          movie {\n            id\n          }\n        }\n      }\n      user {\n        first_name\n        last_name\n        id\n        role\n        email\n      }\n    }\n  }\n": types.UpdateReviewDocument,
    "\n  mutation DeleteReview($input: DeleteReviewInput!) {\n    deleteReview(input: $input) {\n      id\n      rating\n      description\n      movie {\n        id\n        title\n        description\n        poster\n        release_date\n        category {\n          id\n          name\n        }\n        rating\n        reviews {\n          id\n          rating\n          description\n          user {\n            id\n            first_name\n            last_name\n          }\n          movie {\n            id\n          }\n        }\n      }\n      user {\n        first_name\n        last_name\n        id\n        role\n        email\n      }\n    }\n  }\n": types.DeleteReviewDocument,
    "\n  mutation CreateUser($input: AddUserInput!) {\n    createUser(input: $input) {\n      id\n      first_name\n      last_name\n      role\n      email\n    }\n  }\n": types.CreateUserDocument,
    "\n  mutation UpdateUser($input: UpdateUserInput!) {\n    updateUser(input: $input) {\n      id\n      first_name\n      last_name\n      role\n      email\n      password\n    }\n  }\n": types.UpdateUserDocument,
    "\n  mutation DeleteUser($input: DeleteUserInput!) {\n    deleteUser(input: $input) {\n      id\n      first_name\n      last_name\n      role\n      email\n      password\n    }\n  }\n": types.DeleteUserDocument,
    "\n  query GetCategories {\n  getCategories {\n    id\n    name\n  }\n}\n": types.GetCategoriesDocument,
    "\n  query GetHomePageData($input: SortMovieInput!) {\n    getCategories {\n      id\n      name\n    }\n    getMovies(input: $input) {\n      id\n      title\n      description\n      poster\n      release_date\n      category {\n        id\n        name\n      }\n      rating\n    }\n    getNumberOfMovies {\n      totalCount\n    }\n  }\n": types.GetHomePageDataDocument,
    "\n  query GetMovieWithReviewsById($input: MovieInput!) {\n    getMovieWithReviewsById(input: $input) {\n      id\n      title\n      description\n      poster\n      release_date\n      category {\n        id\n        name\n      }\n      rating\n      reviews {\n        id\n        rating\n        description\n        user {\n          id\n          first_name\n          last_name\n        }\n        movie{\n          id\n        }\n      }\n    }\n  }\n": types.GetMovieWithReviewsByIdDocument,
    "\n  query GetExtendedReviews {\n    getExtendedReviews {\n      id\n      rating\n      description\n      movie {\n        id\n        title\n        description\n        poster\n        release_date\n        category {\n          id\n          name\n        }\n        rating\n        reviews {\n          id\n          rating\n          description\n          user {\n            id\n            first_name\n            last_name\n          }\n          movie {\n            id\n          }\n        }\n      }\n      user {\n        id\n        first_name\n        last_name\n        role\n        email\n      }\n    }\n  }\n": types.GetExtendedReviewsDocument,
    "\n  query GetReviews {\n    getReviews {\n      id\n      rating\n      description\n      movie {\n        id\n      }\n      user {\n        id\n        first_name\n        last_name\n      }\n    }\n  }\n": types.GetReviewsDocument,
    "\n  query GetUsers {\n    getUsers {\n      id\n      first_name\n      last_name\n      email\n      role\n    }\n  }\n": types.GetUsersDocument,
    "\n  query GetFullUsers {\n    getFullUsers{\n      id\n      first_name\n      last_name\n      email\n      password\n      role\n    }\n  }\n": types.GetFullUsersDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation LogIn($input: LoginInput!) {\n  logIn(input: $input) {\n    id\n    first_name\n    last_name\n    role\n    email\n    token\n  }\n}\n"): (typeof documents)["\n  mutation LogIn($input: LoginInput!) {\n  logIn(input: $input) {\n    id\n    first_name\n    last_name\n    role\n    email\n    token\n  }\n}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateCategory($input: AddCategoryInput!) {\n    createCategory(input: $input) {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  mutation CreateCategory($input: AddCategoryInput!) {\n    createCategory(input: $input) {\n      id\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateCategory($input: UpdateCategoryInput!) {\n    updateCategory(input: $input) {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateCategory($input: UpdateCategoryInput!) {\n    updateCategory(input: $input) {\n      id\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteCategory($input: DeleteCategoryInput!) {\n    deleteCategory(input: $input) {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteCategory($input: DeleteCategoryInput!) {\n    deleteCategory(input: $input) {\n      id\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateMovie($input: UpdateMovieInput!) {\n    updateMovie(input: $input) {\n      id\n      title\n      description\n      poster\n      release_date\n      category {\n        id\n        name\n      }\n      rating\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateMovie($input: UpdateMovieInput!) {\n    updateMovie(input: $input) {\n      id\n      title\n      description\n      poster\n      release_date\n      category {\n        id\n        name\n      }\n      rating\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateMovie($input: AddMovieInput!) {\n    createMovie(input: $input) {\n      id\n      title\n      description\n      poster\n      release_date\n      category {\n        id\n        name\n      }\n      rating\n    }\n  }\n"): (typeof documents)["\n  mutation CreateMovie($input: AddMovieInput!) {\n    createMovie(input: $input) {\n      id\n      title\n      description\n      poster\n      release_date\n      category {\n        id\n        name\n      }\n      rating\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteMovie($input: DeleteMovieInput!) {\n    deleteMovie(input: $input) {\n      id\n      title\n      description\n      poster\n      release_date\n      category {\n        id\n        name\n      }\n      rating\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteMovie($input: DeleteMovieInput!) {\n    deleteMovie(input: $input) {\n      id\n      title\n      description\n      poster\n      release_date\n      category {\n        id\n        name\n      }\n      rating\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateReview($input: AddReviewInput!) {\n    createReview(input: $input) {\n      id\n      rating\n      description\n      movie {\n        id\n        title\n        description\n        poster\n        release_date\n        rating\n        category {\n          id\n          name\n        }\n        reviews {\n          id\n          rating\n          description\n          user {\n            id\n            first_name\n            last_name\n          }\n          movie {\n            id\n          }\n        }\n      }\n      user {\n        id\n        first_name\n        last_name\n        role\n        email\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CreateReview($input: AddReviewInput!) {\n    createReview(input: $input) {\n      id\n      rating\n      description\n      movie {\n        id\n        title\n        description\n        poster\n        release_date\n        rating\n        category {\n          id\n          name\n        }\n        reviews {\n          id\n          rating\n          description\n          user {\n            id\n            first_name\n            last_name\n          }\n          movie {\n            id\n          }\n        }\n      }\n      user {\n        id\n        first_name\n        last_name\n        role\n        email\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateReview($input: UpdateReviewInput!) {\n    updateReview(input: $input) {\n      id\n      rating\n      description\n      movie {\n        id\n        title\n        description\n        poster\n        release_date\n        category {\n          id\n          name\n        }\n        rating\n        reviews {\n          id\n          rating\n          description\n          user {\n            id\n            first_name\n            last_name\n          }\n          movie {\n            id\n          }\n        }\n      }\n      user {\n        first_name\n        last_name\n        id\n        role\n        email\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateReview($input: UpdateReviewInput!) {\n    updateReview(input: $input) {\n      id\n      rating\n      description\n      movie {\n        id\n        title\n        description\n        poster\n        release_date\n        category {\n          id\n          name\n        }\n        rating\n        reviews {\n          id\n          rating\n          description\n          user {\n            id\n            first_name\n            last_name\n          }\n          movie {\n            id\n          }\n        }\n      }\n      user {\n        first_name\n        last_name\n        id\n        role\n        email\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteReview($input: DeleteReviewInput!) {\n    deleteReview(input: $input) {\n      id\n      rating\n      description\n      movie {\n        id\n        title\n        description\n        poster\n        release_date\n        category {\n          id\n          name\n        }\n        rating\n        reviews {\n          id\n          rating\n          description\n          user {\n            id\n            first_name\n            last_name\n          }\n          movie {\n            id\n          }\n        }\n      }\n      user {\n        first_name\n        last_name\n        id\n        role\n        email\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteReview($input: DeleteReviewInput!) {\n    deleteReview(input: $input) {\n      id\n      rating\n      description\n      movie {\n        id\n        title\n        description\n        poster\n        release_date\n        category {\n          id\n          name\n        }\n        rating\n        reviews {\n          id\n          rating\n          description\n          user {\n            id\n            first_name\n            last_name\n          }\n          movie {\n            id\n          }\n        }\n      }\n      user {\n        first_name\n        last_name\n        id\n        role\n        email\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateUser($input: AddUserInput!) {\n    createUser(input: $input) {\n      id\n      first_name\n      last_name\n      role\n      email\n    }\n  }\n"): (typeof documents)["\n  mutation CreateUser($input: AddUserInput!) {\n    createUser(input: $input) {\n      id\n      first_name\n      last_name\n      role\n      email\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateUser($input: UpdateUserInput!) {\n    updateUser(input: $input) {\n      id\n      first_name\n      last_name\n      role\n      email\n      password\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateUser($input: UpdateUserInput!) {\n    updateUser(input: $input) {\n      id\n      first_name\n      last_name\n      role\n      email\n      password\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteUser($input: DeleteUserInput!) {\n    deleteUser(input: $input) {\n      id\n      first_name\n      last_name\n      role\n      email\n      password\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteUser($input: DeleteUserInput!) {\n    deleteUser(input: $input) {\n      id\n      first_name\n      last_name\n      role\n      email\n      password\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetCategories {\n  getCategories {\n    id\n    name\n  }\n}\n"): (typeof documents)["\n  query GetCategories {\n  getCategories {\n    id\n    name\n  }\n}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetHomePageData($input: SortMovieInput!) {\n    getCategories {\n      id\n      name\n    }\n    getMovies(input: $input) {\n      id\n      title\n      description\n      poster\n      release_date\n      category {\n        id\n        name\n      }\n      rating\n    }\n    getNumberOfMovies {\n      totalCount\n    }\n  }\n"): (typeof documents)["\n  query GetHomePageData($input: SortMovieInput!) {\n    getCategories {\n      id\n      name\n    }\n    getMovies(input: $input) {\n      id\n      title\n      description\n      poster\n      release_date\n      category {\n        id\n        name\n      }\n      rating\n    }\n    getNumberOfMovies {\n      totalCount\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetMovieWithReviewsById($input: MovieInput!) {\n    getMovieWithReviewsById(input: $input) {\n      id\n      title\n      description\n      poster\n      release_date\n      category {\n        id\n        name\n      }\n      rating\n      reviews {\n        id\n        rating\n        description\n        user {\n          id\n          first_name\n          last_name\n        }\n        movie{\n          id\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetMovieWithReviewsById($input: MovieInput!) {\n    getMovieWithReviewsById(input: $input) {\n      id\n      title\n      description\n      poster\n      release_date\n      category {\n        id\n        name\n      }\n      rating\n      reviews {\n        id\n        rating\n        description\n        user {\n          id\n          first_name\n          last_name\n        }\n        movie{\n          id\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetExtendedReviews {\n    getExtendedReviews {\n      id\n      rating\n      description\n      movie {\n        id\n        title\n        description\n        poster\n        release_date\n        category {\n          id\n          name\n        }\n        rating\n        reviews {\n          id\n          rating\n          description\n          user {\n            id\n            first_name\n            last_name\n          }\n          movie {\n            id\n          }\n        }\n      }\n      user {\n        id\n        first_name\n        last_name\n        role\n        email\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetExtendedReviews {\n    getExtendedReviews {\n      id\n      rating\n      description\n      movie {\n        id\n        title\n        description\n        poster\n        release_date\n        category {\n          id\n          name\n        }\n        rating\n        reviews {\n          id\n          rating\n          description\n          user {\n            id\n            first_name\n            last_name\n          }\n          movie {\n            id\n          }\n        }\n      }\n      user {\n        id\n        first_name\n        last_name\n        role\n        email\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetReviews {\n    getReviews {\n      id\n      rating\n      description\n      movie {\n        id\n      }\n      user {\n        id\n        first_name\n        last_name\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetReviews {\n    getReviews {\n      id\n      rating\n      description\n      movie {\n        id\n      }\n      user {\n        id\n        first_name\n        last_name\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetUsers {\n    getUsers {\n      id\n      first_name\n      last_name\n      email\n      role\n    }\n  }\n"): (typeof documents)["\n  query GetUsers {\n    getUsers {\n      id\n      first_name\n      last_name\n      email\n      role\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetFullUsers {\n    getFullUsers{\n      id\n      first_name\n      last_name\n      email\n      password\n      role\n    }\n  }\n"): (typeof documents)["\n  query GetFullUsers {\n    getFullUsers{\n      id\n      first_name\n      last_name\n      email\n      password\n      role\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;