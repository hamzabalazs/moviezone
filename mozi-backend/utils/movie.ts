import { GraphQLError } from "graphql/error";
import { NOT_VALID_MOVIE, NO_MOVIE_MESSAGE, UNAUTHORIZED_MESSAGE } from "../../mozi-frontend/src/common/errorMessages";
import { createMovieSchema, movieSchema } from "../common/validation";
import { MyContext } from "../server";
import { CreateMovieType, Movie, UpdateMovieInput } from "./types";

export function getMovies(input:any, context:MyContext):Promise<Movie[]> {
  let sql = "SELECT * FROM movie";
  let params = []
  if(input.searchField || input.category.length !== 0) sql = sql.concat(" WHERE")
  let categoryString = ""
  if(input.searchField){
    params.push(input.searchField)
    sql = sql.concat(` title LIKE '%' || ? || '%'`)
  }
  if(input.searchField && input.category.length !==0) sql = sql.concat(` AND`)
  if(input.category.length !== 0){
    const validator = /[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}/
    categoryString = " category_id IN ("
    input.category.forEach((x:string) => {
      if(x.match(validator)) categoryString = categoryString.concat(`"${x}"`,",")
    })
    categoryString = categoryString.substring(0,categoryString.length - 1)
    categoryString = categoryString.concat(")")
    sql = sql.concat(categoryString)
  }
  if(input.orderByCategory !== null && input.orderByTitle !== null) throw new Error("BOTH ORDERS")
  if(input.orderByCategory !== null){
    if(input.orderByCategory === true) sql = sql.concat(` ORDER BY category_id`)
    else sql = sql.concat(` ORDER BY category_id DESC`)
  }
  if(input.orderByTitle !== null){
    if(input.orderByTitle === true) sql = sql.concat(` ORDER BY title`)
    else sql = sql.concat(` ORDER BY title DESC`)
  }
  sql = sql.concat(` LIMIT ?`)
  params.push(input.limit)
  if(input.offset){
    sql = sql.concat(` OFFSET ?`)
    params.push(input.offset)
  }
  return context.db.all<Movie>(sql,params)
}

export function getNumberOfMovies(input:any,context:MyContext): Promise<number | null> {
  let sql = `SELECT COUNT(*) as totalCount FROM movie`
  if(input.searchField || input.category.length !== 0) sql = sql.concat(" WHERE")
  let searchFieldString = ""
  let categoryString = ""
  if(input.searchField){
    searchFieldString = ` title LIKE "%${input.searchField}%"`
    sql = sql.concat(searchFieldString)
  }
  if(input.searchField && input.category.length !==0) sql = sql.concat(` AND`)
  if(input.category.length !== 0){
    categoryString = " category_id IN ("
    input.category.forEach((x:string) => {
      categoryString = categoryString.concat(`"${x}"`,",")
    })
    categoryString = categoryString.substring(0,categoryString.length - 1)
    categoryString = categoryString.concat(")")
    sql = sql.concat(categoryString)
  }
  return context.db.get<number>(sql)
}

export async function getMovieById(id:string, context:MyContext):Promise<Movie|null> {
  const sql = `SELECT * FROM movie WHERE id = ?`;
  const result = await context.db.get<Movie>(sql,[id])
  if(result === undefined) return null;
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

