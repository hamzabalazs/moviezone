import { GraphQLError } from "graphql";
import {
  NOT_VALID_REVIEW,
  NO_REVIEW_MESSAGE,
  UNAUTHORIZED_MESSAGE,
} from "../common/errorMessages";
import { reviewSchema } from "../common/validation";
import { MyContext } from "../server";
import { DbReview, Review } from "./types";

export function getReviews(context: MyContext): Promise<Review[]> {
  const sql = "SELECT * FROM review";
  return new Promise((resolve, reject) => {
    context.db.query(sql, (err: any, res: any) => {
      if (err) {
        reject(err);
      }
      if (res) resolve(res);
    });
  });
}

export function getNumberOfReviewsOfUser(
  user_id: string,
  context: MyContext
): Promise<number | null> {
  const sql = `SELECT COUNT(*) as totalCount FROM review WHERE user_id = ?`;
  return new Promise((resolve, reject) => {
    context.db.query(sql, [user_id], (err: any, res: any) => {
      if (err) {
        reject(err);
      }
      if (res) resolve(res[0]);
    });
  });
}

export function getNumberOfReviewsOfMovie(
  movie_id: string,
  context: MyContext
): Promise<number | null> {
  const sql = `SELECT COUNT(*) as totalCount FROM review WHERE movie_id = ?`;
  return new Promise((resolve, reject) => {
    context.db.query(sql, [movie_id], (err: any, res: any) => {
      if (err) {
        reject(err);
      }
      if (res) resolve(res[0]);
    });
  });
}

export function getNumberOfReviewsOfMoviePerMonth(
  movie_id: any,
  context: MyContext
): Promise<any[]> {
  let sql = `SELECT COUNT(*) as totalCount FROM review WHERE movie_id = ? GROUP BY MONTH(timestamp) ORDER BY MONTH(timestamp)`;
  if (context.db.filename === ":memory:")
    sql = `SELECT COUNT(*) as totalCount FROM review WHERE movie_id = ? GROUP BY strftime('%m',timestamp) ORDER BY strftime('%m',timestamp)`;
  return new Promise((resolve, reject) => {
    context.db.query(sql, [movie_id], (err: any, res: any) => {
      if (err) {
        reject(err);
      }
      if (res) resolve(res);
    });
  });
}

export function getAverageOfReviewsOfMoviePerMonth(
  movie_id: any,
  context: MyContext
): Promise<any[]> {
  let sql = `SELECT ROUND(AVG(rating),2) as average FROM review WHERE movie_id = ? GROUP BY MONTH(timestamp) ORDER BY MONTH(timestamp)`;
  if (context.db.filename === ":memory:")
    sql = `SELECT ROUND(AVG(rating),2) as average FROM review WHERE movie_id = ? GROUP BY strftime('%m',timestamp) ORDER BY strftime('%m',timestamp)`;
  return new Promise((resolve, reject) => {
    context.db.query(sql, [movie_id], (err: any, res: any) => {
      if (err) {
        reject(err);
      }
      if (res) resolve(res);
    });
  });
}

export async function getReviewById(
  id: string,
  context: MyContext
): Promise<Review | undefined> {
  const sql = `SELECT * FROM review WHERE review.id = ?`;
  return new Promise((resolve, reject) => {
    context.db.query(sql, [id], (err: any, res: any) => {
      if (err) {
        reject(err);
      }
      if (res) resolve(res[0]);
    });
  });
}

export async function getReviewsOfMovie(
  input: any,
  context: MyContext
): Promise<Review[]> {
  let sql = `SELECT * FROM review WHERE movie_id = ? LIMIT ?`;
  let params = [input.movie_id, input.limit];
  if (input.offset !== 0) {
    sql = sql.concat(` OFFSET ?`);
    params.push(input.offset);
  }
  return new Promise((resolve, reject) => {
    context.db.query(sql, params, (err: any, res: any) => {
      if (err) {
        reject(err);
      }
      if (res) resolve(res);
    });
  });
}

export async function getReviewsOfUser(
  input: any,
  context: MyContext
): Promise<Review[]> {
  let sql = `SELECT * FROM review WHERE user_id = ? LIMIT ?`;
  let params = [input.user_id, input.limit];
  if (input.offset !== 0) {
    sql = sql.concat(` OFFSET ?`);
    params.push(input.offset);
  }
  return new Promise((resolve, reject) => {
    context.db.query(sql, params, (err: any, res: any) => {
      if (err) {
        reject(err);
      }
      if (res) resolve(res);
    });
  });
}

export async function getReviewForUpdate(
  id: string,
  context: MyContext
): Promise<DbReview | undefined> {
  const sql = `SELECT * FROM review WHERE review.id = ?`;
  return new Promise((resolve, reject) => {
    context.db.query(sql, [id], (err: any, res: any) => {
      if (err) {
        reject(err);
      }
      if (res) resolve(res[0]);
    });
  });
}

export async function createReview(
  review: any,
  context: MyContext
): Promise<DbReview | undefined> {
  let sql = `INSERT INTO review (id,rating,description,movie_id,user_id,timestamp)
  VALUES (?,?,?,?,?,CURDATE())`;
  const validation = await reviewSchema.isValid(review);
  if (!validation)
    throw new GraphQLError(NOT_VALID_REVIEW, {
      extensions: { code: "VALIDATION_FAILED" },
    });
  if (context.db.filename === ":memory:")
    sql = `INSERT INTO review (id,rating,description,movie_id,user_id,timestamp) VALUES
      (?,?,?,?,?,date("now"))`;

  context.db.query(sql, [
    review.id,
    review.rating,
    review.description,
    review.movie_id,
    review.user_id,
  ]);

  return {
    id: review.id,
    rating: review.rating,
    description: review.description,
    movie_id: review.movie_id,
    user_id: review.user_id,
  };
}

export async function updateReview(
  review: DbReview,
  context: MyContext
): Promise<DbReview | undefined> {
  if (context.user) {
    if (
      context.user.id === review.user_id ||
      context.user.role.toString() !== "viewer"
    ) {
      const validation = await reviewSchema.isValid(review);
      if (!validation)
        throw new GraphQLError(NOT_VALID_REVIEW, {
          extensions: { code: "VALIDATION_FAILED" },
        });
      const sql = `UPDATE review SET rating=?, description=? WHERE review.id = ?`;
      context.db.query(sql, [review.rating, review.description, review.id]);
      return {
        id: review.id,
        rating: review.rating,
        description: review.description,
        movie_id: review.movie_id,
        user_id: review.user_id,
      };
    }
  }
  throw new GraphQLError(UNAUTHORIZED_MESSAGE, {
    extensions: { code: "UNAUTHORIZED" },
  });
}

export async function deleteReview(
  id: string,
  context: MyContext
): Promise<Review | undefined> {
  const reviewToDelete = await getReviewForUpdate(id, context);
  if (!reviewToDelete)
    throw new GraphQLError(NO_REVIEW_MESSAGE, {
      extensions: { code: "NOT_FOUND" },
    });
  if (
    context.user!.id === reviewToDelete.user_id ||
    context.user!.role.toString() !== "viewer"
  ) {
    const review = await getReviewById(id, context);
    const sql = `DELETE FROM review WHERE review.id = ?`;
    context.db.query(sql, [id]);
    return review;
  }

  throw new GraphQLError(UNAUTHORIZED_MESSAGE, {
    extensions: { code: "UNAUTHORIZED" },
  });
}
