import { GraphQLError } from "graphql/error";
import { v4 as uuidv4 } from "uuid";
import { NOT_VALID_CATEGORY, UNAUTHORIZED_MESSAGE } from "../common/errorMessages";
import { categorySchema } from "../common/validation";
import { MyContext } from "../server";
import { Category } from "./types";

export function getCategories(_: any, context:MyContext):Promise<Category[]> {
  const sql = "SELECT * FROM category";
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

export async function getCategoryById(id: string, context:MyContext):Promise<Category|undefined>{
  const sql = `SELECT * FROM category WHERE category.id = ?`;
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

export async function getNumberOfMoviesPerCategory(context:MyContext): Promise<number[]>{
  const sql = `SELECT c.name as name,COUNT(m.id) as totalCount FROM movie m JOIN category c ON m.category_id = c.id GROUP BY c.id ORDER BY COUNT(m.id)`
  return new Promise((resolve,reject) => {
    context.db.query(sql,(err:any,res:any) => {
      if(err){
        reject(err)
      }
      resolve(res)
    })
  });
}

export async function getAverageRatingOfCategories(context:MyContext): Promise<number[]>{
  const sql =`SELECT name, ROUND(AVG(average),2) as average FROM (SELECT c.name,AVG(r.rating) AS average FROM review r JOIN movie m ON m.id = r.movie_id JOIN category c ON c.id = m.category_id GROUP BY m.id) as T GROUP BY name;`
  return new Promise((resolve,reject) => {
    context.db.query(sql,(err:any,res:any) => {
      if(err){
        reject(err)
      }
      resolve(res)
    })
  });
}

export async function createCategory(name:string, context:MyContext):Promise<Category|null> {
  const newCategory = {
    id:uuidv4(),
    name:name
  }
  if(context.user!.role.toString() !== "viewer"){
    const validation = await categorySchema.isValid(newCategory)
    if(!validation) throw new GraphQLError(NOT_VALID_CATEGORY,{extensions:{code:'VALIDATION_FAILED'}})
    const sql = `INSERT INTO category (id,name) VALUES (?,?)`;
    context.db.query(sql,[newCategory.id,newCategory.name])
    return newCategory
  }
  throw new GraphQLError(UNAUTHORIZED_MESSAGE,{extensions:{code:'UNAUTHORIZED'}})
}

export async function updateCategory(category: Category, context:MyContext):Promise<Category|null> {
  if(context.user!.role.toString() !== "viewer"){
    const validation = await categorySchema.isValid(category)
    if(!validation) throw new GraphQLError(NOT_VALID_CATEGORY,{extensions:{code:'VALIDATION_FAILED'}})
    const sql = `UPDATE category SET name = ? WHERE category.id = ?`;
    context.db.query(sql,[category.name,category.id])
    return {
      id:category.id,
      name:category.name
    }
  }
  throw new GraphQLError(UNAUTHORIZED_MESSAGE,{extensions:{code:'UNAUTHORIZED'}})
}

export async function deleteCategory(id: string, context:MyContext):Promise<Category|undefined> {
  if(context.user!.role.toString() !== "viewer"){
    const sqlDelete = `DELETE FROM category WHERE category.id = ?`;
    const sqlUpdate = `UPDATE movie SET category_id = "removedID" WHERE category_id = ?` ;
    const category = getCategoryById(id,context)
    context.db.query(sqlUpdate,[id])
    context.db.query(sqlDelete,[id])
    return category
  }
  throw new GraphQLError(UNAUTHORIZED_MESSAGE,{extensions:{code:'UNAUTHORIZED'}})
}

export async function checkForCategory(name: string, context:MyContext):Promise<Category|null> {
  const sql = `SELECT * FROM category WHERE category.name = ?`;
  // return result
  return new Promise((resolve,reject) => {
    context.db.query(sql,[name],(err:any,res:any) => {
      if(err){
        reject(err)
      }
      resolve(res[0])
    })
  });
}
