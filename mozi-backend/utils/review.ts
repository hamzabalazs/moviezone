import { MyContext } from "../server";
import { determineRole, getToken } from "./token";
import { DbReview, Review, Session, User } from "./types";
import { getCurrentUser, getUserById } from "./user";

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

export function getReviewById(id: string, context: MyContext): Promise<Review> {
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

export function getReviewsOfUser(user_id:string,context:MyContext): Promise<Review[]> {
  const sql = `SELECT * FROM review WHERE review.user_id = ?`;
  return new Promise((resolve,reject) => {
    context.db.all(sql,[user_id],(err:any,rows:Review[]) => {
      if(err){
        reject(err);
      }
      resolve(rows)
    })
  })
}

export function createReview(
  review: any,
  context: MyContext
): Promise<Review> {
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
  const updatedReview: DbReview = await getReviewForUpdate(
    review.id,
    context
  );
  const user: User = await getUserById(updatedReview.user_id,context);
  const token: Session = await getToken(user, context);
  if (!token) throw new Error("No Token");
  const role = await determineRole(context);
  if (role === undefined) throw new Error("Role not found");
  const headerToken = context.req.headers["auth-token"] as string;
  const contextToken = headerToken.replace(/['"]/g, "");
  if (token.token === contextToken || role.role !== "viewer") {
    
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
  throw new Error("Unauthorized!");
}

export async function deleteReview(
  id: string,
  context: MyContext
): Promise<Review> {
  const reviewToDelete = await getReviewForUpdate(id,context)
  const user: User = await getUserById(reviewToDelete.user_id,context);
  const token: Session = await getToken(user, context);
  if (!token) throw new Error("No Token");
  const role = await determineRole(context);
  if (role === undefined) throw new Error("Role not found");
  const headerToken = context.req.headers["auth-token"] as string;
  const contextToken = headerToken.replace(/['"]/g, "");
  if (token.token === contextToken || role.role !== "viewer") {
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
  throw new Error("Unauthorized!");
}

export async function deleteReviewsOfMovie(id:string,context:MyContext): Promise<Review[]> {
  const role = await determineRole(context);
  if (role === undefined) throw new Error("Role not found");
  if(role.role !== "viewer"){
    const sql = `DELETE FROM review WHERE review.movie_id = ?`;
    const reviews = await getReviewsOfMovie(id,context)
    return new Promise((resolve,reject) => {
      context.db.run(sql,[id],(err:any) => {
        if(err){
          reject(err);
        }
        resolve(reviews)
      })
    })
  }
  throw new Error("Unauthorized!")
}

export async function deleteReviewsOfUser(id:string,context:MyContext): Promise<Review[]>{
  const user = await getUserById(id, context);
  const token = await getToken(user, context);
  if (!token) throw new Error("No Token");
  const role = await determineRole(context);
  console.log(role)
  const headerToken = context.req.headers['auth-token'] as string
  const contextToken = headerToken.replace(/['"]/g, "");
  if(role === undefined) throw new Error(" Role not found");
  if(token.token === contextToken || role.role === "admin"){
    const sql = `DELETE FROM review WHERE review.user_id = ?`;
    const reviews = await getReviewsOfUser(id,context)
    return new Promise((resolve,reject) => {
      context.db.run(sql,[id],(err:any) => {
        if(err){
          reject(err);
        }
        resolve(reviews)
      })
    })
  }
  throw new Error("Unauthorized")
}