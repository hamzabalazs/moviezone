import { GraphQLError } from "graphql";
import {
  NOT_VALID_REVIEW,
  NO_REVIEW_MESSAGE,
  UNAUTHORIZED_MESSAGE,
} from "../common/errorMessages";
import { reviewSchema } from "../common/validation";
import { MyContext } from "../server";
import { DbReview, ExtendedReview, Review, ReviewListReview } from "./types";

export function getReviews(context: MyContext): Promise<ReviewListReview[]> {
  const sql = "SELECT * FROM review";
  return context.db.all<ReviewListReview>(sql);
}

export function getDisplayReviews(input:any,context: MyContext): Promise<ReviewListReview[]> {
  let sql = "SELECT * FROM review WHERE user_id = ?";
  let params = [input.user_id]
  sql = sql.concat(` LIMIT ?`)
  params.push(input.limit)
  if(input.offset !== 0){
    sql = sql.concat(` OFFSET ?`)
    params.push(input.offset)
  }
  return context.db.all<ReviewListReview>(sql,params);
}

export function getExtendedReviews(context:MyContext): Promise<ExtendedReview[]> {
  const sql = "SELECT * FROM review";
  return context.db.all<ExtendedReview>(sql);
}

export function getNumberOfReviewsOfUser(user_id:string,context:MyContext): Promise<number | null>{
  const sql = `SELECT COUNT(*) as totalCount FROM review WHERE user_id = ?`
  return context.db.get<number>(sql,[user_id])
}

export function getNumberOfReviewsOfMovie(movie_id:string,context:MyContext): Promise<number | null>{
  const sql = `SELECT COUNT(*) as totalCount FROM review WHERE movie_id = ?`
  return context.db.get<number>(sql,[movie_id])
}

export async function getReviewById(id: string, context: MyContext): Promise<Review|null> {
  const sql = `SELECT * FROM review WHERE review.id = ?`;
  const result = await context.db.get<Review>(sql, [id]);
  if(result === undefined) return null;
  return result
}

export async function getReviewsOfMovie(input:any,context:MyContext): Promise<Review[]> {
  let sql = `SELECT * FROM review WHERE movie_id = ? LIMIT ?`
  let params = [input.movie_id,input.limit]
  if(input.offset !==0 ){
    sql = sql.concat(` OFFSET ?`)
    params.push(input.offset)
  }
  return context.db.all<Review>(sql,params)
}

export async function getReviewsOfUser(input:any,context:MyContext): Promise<Review[]>{
  let sql = `SELECT * FROM review WHERE user_id = ? LIMIT ?`
  let params = [input.user_id,input.limit]
  if(input.offset !==0 ){
    sql = sql.concat(` OFFSET ?`)
    params.push(input.offset)
  }
  return context.db.all<Review>(sql,params)
}

export async function getExtendedReviewById(id: string, context: MyContext): Promise<ExtendedReview|null> {
  const sql = `SELECT * FROM review WHERE review.id = ?`;
  const result = await context.db.get<ExtendedReview>(sql, [id]);
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

export async function createReview(
  review: any,
  context: MyContext
): Promise<Review|null> {
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
  return await getExtendedReviewById(review.id,context)
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
    const review = await getReviewById(id, context);
    const sql = `DELETE FROM review WHERE review.id = ?`;
    context.db.run(sql,[id])
    return review
  }

  throw new GraphQLError(UNAUTHORIZED_MESSAGE,{extensions:{code:'UNAUTHORIZED'}})
}
