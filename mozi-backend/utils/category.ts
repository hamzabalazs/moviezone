import { v4 as uuidv4 } from "uuid";
import { MyContext } from "../server";
import { Category } from "./types";

export function getCategories(_: any, context:MyContext):Promise<Category[]> {
  const sql = "SELECT * FROM category";
  return context.db.all<Category>(sql)
}

export function getCategoryById(id: string, context:MyContext):Promise<Category|null>{
  const sql = `SELECT * FROM category WHERE category.id = ?`;
  return context.db.get<Category>(sql,[id])
}

export async function createCategory(name:string, context:MyContext):Promise<Category> {
  const newCategory = {
    id:uuidv4(),
    name:name
  }
  const sql = `INSERT INTO category (id,name) VALUES (?,?)`;
  context.db.run(sql,[newCategory.id,newCategory.name])
  return newCategory
}

export async function updateCategory(category: Category, context:MyContext):Promise<Category|null> {
  const sql = `UPDATE category SET name = ? WHERE category.id = ?`;
  context.db.run(sql,[category.name,category.id])
  return getCategoryById(category.id,context)
}

export async function deleteCategory(id: string, context:MyContext):Promise<Category|null> {
  const sqlDelete = `DELETE FROM category WHERE category.id = ?`;
  const sqlUpdate = `UPDATE movie SET category_id = "removedID" WHERE category_id = ?` ;
  const category = getCategoryById(id,context)
  context.db.run(sqlUpdate,[id])
  context.db.run(sqlDelete,[id])
  return category
}

export function checkForCategory(name: string, context:MyContext):Promise<Category|null> {
  const sql = `SELECT * FROM category WHERE category.name = ?`;
  return context.db.get<Category>(sql,[name])
}
