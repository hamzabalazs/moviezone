import { GraphQLError } from "graphql/error";
import { NOT_VALID_MOVIE, NO_CATEGORY_MESSAGE, NO_MOVIE_MESSAGE, UNAUTHORIZED_MESSAGE } from "../common/errorMessages";
import { createMovieSchema, movieSchema } from "../common/validation";
import { MyContext } from "../server";
import { CreateMovieType, DbMovie, Movie, UpdateMovieInput } from "./types";
import { getCategoryById } from "./category";

export function getAllMovies(context:MyContext):Promise<any[]> {
  const sql = 'SELECT id,title FROM movie'
  // return context.db.query(sql)
  return new Promise((resolve,reject) => {
    context.db.query(sql,(err:any,res:any) => {
      if(err){
        reject(err)
      }
      resolve(res)
    })
  });
}

export function getMovies(input:any, context:MyContext):Promise<Movie[]> {
  let sql = "SELECT * FROM movie";
  let params:any[] = []
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
  // return context.db.query(sql,params)
  return new Promise((resolve,reject) => {
    context.db.query(sql,params,(err:any,res:any) => {
      if(err){
        reject(err)
      }
      resolve(res)
    })
  });
}

export function getNumberOfMovies(input:any,context:MyContext): Promise<number | undefined> {
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
  // return context.db.query(sql)
  return new Promise((resolve,reject) => {
    context.db.query(sql,(err:any,res:any) => {
      if(err){
        reject(err)
      }
      resolve(res[0])
    })
  });
}

export async function getMovieById(id:string, context:MyContext):Promise<Movie|undefined> {
  const sql = `SELECT * FROM movie WHERE id = ?`;
  // return result
  return new Promise((resolve,reject) => {
    context.db.query(sql,[id],(err:any,res:any) => {
      if(err){
        reject(err)
      }
      resolve(res[0])
    })
  });
}

export async function getNumberOfMoviesPerYear(context:MyContext): Promise<any[]>{
  const sql = `SELECT COUNT(*) as totalCount,YEAR(release_date) as year from movie WHERE YEAR(release_date) > "1999" GROUP BY YEAR(release_date)`
  return new Promise((resolve,reject) => {
    context.db.query(sql,(err:any,res:any) => {
      if(err){
        reject(err)
      }
      resolve(res)
    })
  });
}

export async function createMovie(movie:CreateMovieType, context:MyContext):Promise<DbMovie|undefined> {
  if(context.user?.role.toString() === "viewer") throw new GraphQLError(UNAUTHORIZED_MESSAGE,{extensions:{code:'UNAUTHORIZED'}})
  const validation = await createMovieSchema.isValid(movie);
  if(!validation) throw new GraphQLError(NOT_VALID_MOVIE,{extensions:{code:'VALIDATION_FAILED'}})
  const sql = `INSERT INTO movie (id,title,description,poster,release_date,category_id) VALUES (?,?,?,?,?,?)`;
  context.db.query(sql,[movie.id,movie.title,movie.description,movie.poster,movie.release_date,movie.category.id])
  return {
    id:movie.id,
    title:movie.title,
    description:movie.description,
    poster:movie.poster,
    release_date:movie.release_date,
    category_id:movie.category.id,
  }
}

export async function updateMovie(movie:UpdateMovieInput, context:MyContext):Promise<DbMovie|undefined> {
  const isMovie = await getMovieById(movie.id,context)
  if(isMovie === undefined) throw new GraphQLError(NO_MOVIE_MESSAGE,{extensions:{code:'NOT_FOUND'}})
  const validation = await movieSchema.isValid(movie)
  if(!validation) throw new GraphQLError(NOT_VALID_MOVIE,{extensions:{code:'VALIDATION_FAILED'}})
  if(context.user?.role.toString() === "viewer") throw new GraphQLError(UNAUTHORIZED_MESSAGE,{extensions:{code:'UNAUTHORIZED'}})
  const sql = `UPDATE movie SET title = ?,
    description = ?,
    poster = ?, 
    release_date = ?, 
    category_id=? WHERE movie.id = ?`;
  context.db.query(sql,[movie.title,movie.description,movie.poster,movie.release_date,movie.category_id,movie.id])
  const category = await getCategoryById(movie.category_id,context);
  console.log(category)
  if(category === undefined) throw new GraphQLError(NO_CATEGORY_MESSAGE,{extensions:{code:"NOT_FOUND"}})
  const resmovie:DbMovie = {
    id:movie.id,
    title:movie.title,
    description:movie.description,
    poster:movie.poster,
    release_date:movie.release_date,
    category_id:movie.category_id,
  }
  console.log(resmovie)
  return resmovie
}

export async function deleteMovie(id:string, context:MyContext):Promise<Movie|undefined> {
  if(context.user?.role.toString() === "viewer") throw new GraphQLError(UNAUTHORIZED_MESSAGE,{extensions:{code:'UNAUTHORIZED'}})
  const movie = await getMovieById(id, context);
  if(movie === undefined){
    throw new GraphQLError(NO_MOVIE_MESSAGE,{extensions:{code:'NOT_FOUND'}})
  }
  const sqlDelete = `DELETE FROM movie WHERE movie.id = ?`;
  const sqlReviewDelete = `DELETE FROM review WHERE review.movie_id = ?`
  const sqlCastDelete = `DELETE FROM movie_cast WHERE movie_id = ?`
  context.db.query(sqlReviewDelete,[id])
  context.db.query(sqlDelete,[id])
  context.db.query(sqlCastDelete,[id])
  return movie
}

