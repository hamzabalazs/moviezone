import { MyContext } from "../server";
import { DbReview, Review} from "./types";

export function getReviews(_: any, context: MyContext): Promise<Review[]> {
  const sql = "SELECT * FROM review";
  return new Promise((resolve, reject) => {
    context.db.all(sql, [], (err: any, rows: Review[]) => {
      if (err) {
        reject(err);
      }
      resolve(rows);
    });
  });
}

export function getReviewById(id: string, context: MyContext): Promise<Review>{
  const sql = `SELECT * FROM review WHERE review.id = ?`;
  return new Promise((resolve, reject) => {
    context.db.get(sql, [id], (err: any, rows: Review) => {
      if (err) {
        reject(err);
      }
      resolve(rows);
    });
  });
}

export function getReviewForUpdate(
  id: string,
  context: MyContext
): Promise<DbReview> {
  const sql = `SELECT * FROM review WHERE review.id = ?`;
  return new Promise((resolve, reject) => {
    context.db.get(sql, [id], (err: any, rows: DbReview) => {
      if (err) {
        reject(err);
      }
      resolve(rows);
    });
  });
}

export function getReviewsOfUserForMovie(
  user_id: string,
  movie_id: string,
  context: MyContext
): Promise<Review[]> {
  const sql = `SELECT * FROM review WHERE review.user_id = ? AND review.movie_id = ?`;
  return new Promise((resolve, reject) => {
    context.db.all(sql, [user_id, movie_id], (err: any, rows: Review[]) => {
      if (err) {
        reject(err);
      }
      resolve(rows);
    });
  });
}

export function getReviewsOfMovie(
  movie_id: string,
  context: MyContext
): Promise<Review[]> {
  const sql = `SELECT * FROM review WHERE review.movie_id = ?`;
  return new Promise((resolve, reject) => {
    context.db.all(sql, [movie_id], (err: any, rows: Review[]) => {
      if (err) {
        reject(err);
      }
      resolve(rows);
    });
  });
}

export function getReviewsOfUser(
  user_id: string,
  context: MyContext
): Promise<Review[]> {
  const sql = `SELECT * FROM review WHERE review.user_id = ?`;
  return new Promise((resolve, reject) => {
    context.db.all(sql, [user_id], (err: any, rows: Review[]) => {
      if (err) {
        reject(err);
      }
      resolve(rows);
    });
  });
}

export function createReview(review: any, context: MyContext): Promise<Review> {
  const sql = `INSERT INTO review (id,rating,description,movie_id,user_id)
    VALUES (?,?,?,?,?)`;
  return new Promise((resolve, reject) => {
    context.db.run(
      sql,
      [
        review.id,
        review.rating,
        review.description,
        review.movie_id,
        review.user_id,
      ],
      (err: any) => {
        if (err) {
          reject(err);
        }
        resolve(review);
      }
    );
  });
}

export async function updateReview(
  review: any,
  context: MyContext
): Promise<Review> {
  const updatedReview: DbReview = await getReviewForUpdate(review.id, context);
  if (context.user) {
    if (
      context.user.id === updatedReview.user_id ||
      context.user.role.toString() !== "viewer"
    ) {
      const returnReview: Review = {
        ...review,
        movie_id: updatedReview.movie_id,
        user_id: updatedReview.user_id,
      };
      const sql = `UPDATE review SET rating=?, description=? WHERE review.id = ?`;
      return new Promise((resolve, reject) => {
        context.db.run(
          sql,
          [review.rating, review.description, review.id],
          (err: any) => {
            if (err) {
              reject(err);
            }
            resolve(returnReview);
          }
        );
      });
    }
  }
  throw new Error("Unauthorized!");
}

export async function deleteReview(
  id: string,
  context: MyContext
): Promise<Review> {
  const reviewToDelete = await getReviewForUpdate(id, context);
  if (context.user) {
    if (
      context.user.id === reviewToDelete.user_id ||
      context.user.role.toString() !== "viewer"
    ) {
      const review = await getReviewById(id, context);
      const sql = `DELETE FROM review WHERE review.id = ?`;
      return new Promise((resolve, reject) => {
        context.db.run(sql, [review.id], (err: any) => {
          if (err) {
            reject(err);
          }
          resolve(review);
        });
      });
    }
  }
  throw new Error("Unauthorized!")
}