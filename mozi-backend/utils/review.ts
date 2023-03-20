import {
  NO_REVIEW_MESSAGE,
  UNAUTHORIZED_MESSAGE,
} from "../common/errorMessages";
import { MyContext } from "../server";
import { DbReview, Review } from "./types";

export function getReviews(_: any, context: MyContext): Promise<Review[]> {
  const sql = "SELECT * FROM review";
  return context.db.all<Review>(sql);
}

export function getReviewById(id: string, context: MyContext): Promise<Review> {
  const sql = `SELECT * FROM review WHERE review.id = ?`;
  return context.db.get<Review>(sql, [id]);
}

export function getReviewForUpdate(
  id: string,
  context: MyContext
): Promise<DbReview> {
  const sql = `SELECT * FROM review WHERE review.id = ?`;
  return context.db.get<DbReview>(sql, [id]);
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
): Promise<Review> {
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
): Promise<Review> {
  const updatedReview: DbReview = await getReviewForUpdate(review.id, context);
  if (!updatedReview) throw new Error(NO_REVIEW_MESSAGE);
  if (context.user) {
    if (
      context.user.id === updatedReview.user_id ||
      context.user.role.toString() !== "viewer"
    ) {
      const sql = `UPDATE review SET rating=?, description=? WHERE review.id = ?`;
      context.db.run(sql,[review.rating, review.description, review.id])
      return getReviewById(review.id,context)
    }
  }
  throw new Error(UNAUTHORIZED_MESSAGE);
}

export async function deleteReview(
  id: string,
  context: MyContext
): Promise<Review> {
  const reviewToDelete = await getReviewForUpdate(id, context);
  if (!reviewToDelete) throw new Error(NO_REVIEW_MESSAGE);
  if (
    context.user!.id === reviewToDelete.user_id ||
    context.user!.role.toString() !== "viewer"
  ) {
    const review = getReviewById(id, context);
    const sql = `DELETE FROM review WHERE review.id = ?`;
    context.db.run(sql,[id])
    return review
  }

  throw new Error(UNAUTHORIZED_MESSAGE);
}
