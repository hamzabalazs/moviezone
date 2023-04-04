import { GraphQLError } from "graphql/error";
import { v4 as uuidv4 } from "uuid";
import { NOT_VALID_CATEGORY, UNAUTHORIZED_MESSAGE } from "../../mozi-frontend/src/common/errorMessages";
import { categorySchema } from "../common/validation";
import { MyContext } from "../server";
import { Category } from "./types";

export function getCategories(_: any, context:MyContext):Promise<Category[]> {
  const sql = "SELECT * FROM category";
  return context.db.all<Category>(sql)
}

export async function getCategoryById(id: string, context:MyContext):Promise<Category|null>{
  const sql = `SELECT * FROM category WHERE category.id = ?`;
  const result = await context.db.get<Category>(sql,[id])
  if(result === undefined) return null;
  return result
}

export async function getNumberOfMoviesPerCategory(context:MyContext){
  const sql = `SELECT c.name as name,COUNT(m.id) as totalCount FROM movie m JOIN category c ON m.category_id = c.id GROUP BY c.id ORDER BY COUNT(m.id)`
  const result = await context.db.all(sql)
  return result
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
    context.db.run(sql,[newCategory.id,newCategory.name])
    return newCategory
  }
  throw new GraphQLError(UNAUTHORIZED_MESSAGE,{extensions:{code:'UNAUTHORIZED'}})
}

export async function updateCategory(category: Category, context:MyContext):Promise<Category|null> {
  if(context.user!.role.toString() !== "viewer"){
    const validation = await categorySchema.isValid(category)
    if(!validation) throw new GraphQLError(NOT_VALID_CATEGORY,{extensions:{code:'VALIDATION_FAILED'}})
    const sql = `UPDATE category SET name = ? WHERE category.id = ?`;
    context.db.run(sql,[category.name,category.id])
    return getCategoryById(category.id,context)
  }
  throw new GraphQLError(UNAUTHORIZED_MESSAGE,{extensions:{code:'UNAUTHORIZED'}})
}

export async function deleteCategory(id: string, context:MyContext):Promise<Category|null> {
  if(context.user!.role.toString() !== "viewer"){
    const sqlDelete = `DELETE FROM category WHERE category.id = ?`;
    const sqlUpdate = `UPDATE movie SET category_id = "removedID" WHERE category_id = ?` ;
    const category = getCategoryById(id,context)
    context.db.run(sqlUpdate,[id])
    context.db.run(sqlDelete,[id])
    return category
  }
  throw new GraphQLError(UNAUTHORIZED_MESSAGE,{extensions:{code:'UNAUTHORIZED'}})
}

export async function checkForCategory(name: string, context:MyContext):Promise<Category|null> {
  const sql = `SELECT * FROM category WHERE category.name = ?`;
  const result = await context.db.get<Category>(sql,[name])
  if(result === undefined) return null;
  return result
}
