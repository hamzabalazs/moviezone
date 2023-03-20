import { NO_MOVIE_MESSAGE, UNAUTHORIZED_MESSAGE } from "../common/errorMessages";
import { MyContext } from "../server";
import { Movie, UpdateMovieInput } from "./types";

export function getMovies(_:any, context:MyContext):Promise<Movie[]> {
  const sql = "SELECT * FROM movie";
  return context.db.all<Movie>(sql)
}

export function getMovieById(id:string, context:MyContext):Promise<Movie> {
  const sql = `SELECT * FROM movie WHERE id = ?`;
  return context.db.get<Movie>(sql,[id])
}

export function getMoviesByCategoryId(id:string,context:MyContext): Promise<Movie[]> {
  const sql = "SELECT * FROM movie WHERE category_id = ?";
  return context.db.all<Movie>(sql,[id])
}

export async function createMovie(movie:Movie, context:MyContext):Promise<Movie> {
  if(context.user?.role.toString() === "viewer") throw new Error(UNAUTHORIZED_MESSAGE)
  const sql = `INSERT INTO movie (id,title,description,poster,release_date,category_id) VALUES (?,?,?,?,?,?)`;
  await context.db.run(sql,[movie.id,movie.title,movie.description,movie.poster,movie.release_date,movie.category.id])
  return await getMovieById(movie.id,context)
}

export async function updateMovie(movie:UpdateMovieInput, context:MyContext):Promise<Movie> {
  const isMovie = await getMovieById(movie.id,context)
      if(!isMovie) throw new Error(NO_MOVIE_MESSAGE)
  if(context.user?.role.toString() === "viewer") throw new Error(UNAUTHORIZED_MESSAGE)
  const sql = `UPDATE movie SET title = ?,
    description = ?,
    poster = ?, 
    release_date = ?, 
    category_id=? WHERE movie.id = ?`;
    context.db.run(sql,[movie.title,movie.description,movie.poster,movie.release_date,movie.category_id,movie.id])
    return getMovieById(movie.id,context)
}

export async function deleteMovie(id:string, context:MyContext):Promise<Movie> {
  if(context.user?.role.toString() === "viewer") throw new Error(UNAUTHORIZED_MESSAGE)
  const movie = getMovieById(id, context);
  if(movie === undefined){
    throw new Error(NO_MOVIE_MESSAGE)
  }
  const sqlDelete = `DELETE FROM movie WHERE movie.id = ?`;
  const sqlReviewDelete = `DELETE FROM review WHERE review.movie_id = ?`
  context.db.run(sqlReviewDelete,[id])
  context.db.run(sqlDelete,[id])
  return movie
}

