import { GraphQLError } from "graphql";
import {
  NOT_VALID_REVIEW,
  NO_REVIEW_MESSAGE,
  UNAUTHORIZED_MESSAGE,
} from "../common/errorMessages";
import { reviewSchema } from "../common/validation";
import { MyContext } from "../server";
import { DbReview, Review } from "./types";

export function getReviews(_: any, context: MyContext): Promise<Review[]> {
  const sql = "SELECT * FROM review";
  return context.db.all<Review>(sql);
}

export async function getReviewById(id: string, context: MyContext): Promise<Review|null> {
  const sql = `SELECT * FROM review WHERE review.id = ?`;
  const result = await context.db.get<Review>(sql, [id]);
  if(result === undefined) return null;
  return result
}

export async function getReviewForUpdate(
  id: string,
  context: MyContext
): Promise<DbReview|null> {
  const sql = `SELECT * FROM review WHERE review.id = ?`;
  const result = await context.db.get<DbReview>(sql, [id]);
  if(result === undefined) return null;
  return result
}

export function getReviewsOfUserForMovie(
  user_id: string,
  movie_id: string,
  context: MyContext
): Promise<Review[]> {
  const sql = `SELECT * FROM review WHERE review.user_id = ? AND review.movie_id = ?`;
  return context.db.all<Review>(sql, [user_id, movie_id]);
}

export function getReviewsOfMovie(
  movie_id: string,
  context: MyContext
): Promise<Review[]> {
  const sql = `SELECT * FROM review WHERE review.movie_id = ?`;
  return context.db.all<Review>(sql, [movie_id]);
}

export function getReviewsOfUser(
  user_id: string,
  context: MyContext
): Promise<Review[]> {
  const sql = `SELECT * FROM review WHERE review.user_id = ?`;
  return context.db.all<Review>(sql, [user_id]);
}

export async function createReview(
  review: any,
  context: MyContext
): Promise<Review|null> {
  console.log(review)
  const validation = await reviewSchema.isValid(review)
  if(!validation) throw new GraphQLError(NOT_VALID_REVIEW,{extensions:{code:'VALIDATION_FAILED'}})
  const sql = `INSERT INTO review (id,rating,description,movie_id,user_id)
    VALUES (?,?,?,?,?)`;
  context.db.run(sql, [
    review.id,
    review.rating,
    review.description,
    review.movie_id,
    review.user_id,
  ]);
  return getReviewById(review.id,context)
}

export async function updateReview(
  review: any,
  context: MyContext
): Promise<Review|null> {
  const updatedReview: DbReview|null = await getReviewForUpdate(review.id, context);
  if (updatedReview === null) throw new GraphQLError(NO_REVIEW_MESSAGE,{extensions:{code:'NOT_FOUND'}})
  if (context.user) {
    if (
      context.user.id === updatedReview.user_id ||
      context.user.role.toString() !== "viewer"
    ) {
      const validation = await reviewSchema.isValid(review)
      if(!validation) throw new GraphQLError(NOT_VALID_REVIEW,{extensions:{code:'VALIDATION_FAILED'}})
      const sql = `UPDATE review SET rating=?, description=? WHERE review.id = ?`;
      context.db.run(sql,[review.rating, review.description, review.id])
      return getReviewById(review.id,context)
    }
  }
  throw new GraphQLError(UNAUTHORIZED_MESSAGE,{extensions:{code:'UNAUTHORIZED'}})
}

export async function deleteReview(
  id: string,
  context: MyContext
): Promise<Review|null> {
  const reviewToDelete = await getReviewForUpdate(id, context);
  if (!reviewToDelete) throw new GraphQLError(NO_REVIEW_MESSAGE,{extensions:{code:'NOT_FOUND'}})
  if (
    context.user!.id === reviewToDelete.user_id ||
    context.user!.role.toString() !== "viewer"
  ) {
    const review = getReviewById(id, context);
    const sql = `DELETE FROM review WHERE review.id = ?`;
    context.db.run(sql,[id])
    return review
  }

  throw new GraphQLError(UNAUTHORIZED_MESSAGE,{extensions:{code:'UNAUTHORIZED'}})
}
