import { GraphQLError } from "graphql/error";
import { NOT_VALID_MOVIE, NO_MOVIE_MESSAGE, UNAUTHORIZED_MESSAGE } from "../common/errorMessages";
import { createMovieSchema, movieSchema } from "../common/validation";
import { MyContext } from "../server";
import { CreateMovieType, Movie, MovieWithReviews, UpdateMovieInput } from "./types";

export function getMovies(_:any, context:MyContext):Promise<Movie[]> {
  const sql = "SELECT * FROM movie";
  return context.db.all<Movie>(sql)
}

export async function getMovieById(id:string, context:MyContext):Promise<Movie|null> {
  const sql = `SELECT * FROM movie WHERE id = ?`;
  const result = await context.db.get<Movie>(sql,[id])
  if(result === undefined) return null;
  return result
}

export function getMoviesByCategoryId(id:string,context:MyContext): Promise<Movie[]> {
  const sql = "SELECT * FROM movie WHERE category_id = ?";
  return context.db.all<Movie>(sql,[id])
}

export async function getMovieWithReviewsById(id:string,context:MyContext): Promise<MovieWithReviews | null>{
  const sql = `SELECT * FROM movie WHERE id = ?`
  const result = await context.db.get<MovieWithReviews>(sql,[id])
  if(result === undefined) return null
  return result
}

export async function createMovie(movie:CreateMovieType, context:MyContext):Promise<Movie|null> {
  if(context.user?.role.toString() === "viewer") throw new GraphQLError(UNAUTHORIZED_MESSAGE,{extensions:{code:'UNAUTHORIZED'}})
  const validation = await createMovieSchema.isValid(movie);
  if(!validation) throw new GraphQLError(NOT_VALID_MOVIE,{extensions:{code:'VALIDATION_FAILED'}})
  const sql = `INSERT INTO movie (id,title,description,poster,release_date,category_id) VALUES (?,?,?,?,?,?)`;
  context.db.run(sql,[movie.id,movie.title,movie.description,movie.poster,movie.release_date,movie.category.id])
  return getMovieById(movie.id,context)
}

export async function updateMovie(movie:UpdateMovieInput, context:MyContext):Promise<Movie|null> {
  const isMovie = await getMovieById(movie.id,context)
  if(!isMovie) throw new GraphQLError(NO_MOVIE_MESSAGE,{extensions:{code:'NOT_FOUND'}})
  const validation = await movieSchema.isValid(movie)
  if(!validation) throw new GraphQLError(NOT_VALID_MOVIE,{extensions:{code:'VALIDATION_FAILED'}})
  if(context.user?.role.toString() === "viewer") throw new GraphQLError(UNAUTHORIZED_MESSAGE,{extensions:{code:'UNAUTHORIZED'}})
  const sql = `UPDATE movie SET title = ?,
    description = ?,
    poster = ?, 
    release_date = ?, 
    category_id=? WHERE movie.id = ?`;
  context.db.run(sql,[movie.title,movie.description,movie.poster,movie.release_date,movie.category_id,movie.id])
  return getMovieById(movie.id,context)
}

export async function deleteMovie(id:string, context:MyContext):Promise<Movie|null> {
  if(context.user?.role.toString() === "viewer") throw new GraphQLError(UNAUTHORIZED_MESSAGE,{extensions:{code:'UNAUTHORIZED'}})
  const movie = await getMovieById(id, context);
  if(movie === null){
    throw new GraphQLError(NO_MOVIE_MESSAGE,{extensions:{code:'NOT_FOUND'}})
  }
  const sqlDelete = `DELETE FROM movie WHERE movie.id = ?`;
  const sqlReviewDelete = `DELETE FROM review WHERE review.movie_id = ?`
  context.db.run(sqlReviewDelete,[id])
  context.db.run(sqlDelete,[id])
  return movie
}

