import { v4 as uuidv4 } from "uuid";
import { MyContext } from "../server";
import { Category } from "./types";

export function getCategories(_: any, context:MyContext):Promise<Category[]> {
  const sql = "SELECT * FROM category";
  return new Promise((resolve, reject) => {
    context.db.all(sql, [], (err: any, rows: Category[]) => {
      if (err) {
        reject(err);
      }
      resolve(rows);
    });
  });
}

export function getCategoryById(id: string, context:MyContext):Promise<Category>{
  if(id === "removedID"){
    return new Promise((resolve) => {
      const category:Category = {id:"removedID",name:"removedCategory"}
      resolve(category)
    })
  }
  const sql = `SELECT * FROM category WHERE category.id = ?`;
  return new Promise((resolve, reject) => {
    context.db.get(sql, [id], (err: any, rows: Category) => {
      if (err) {
        reject(err);
      }
      resolve(rows);
    });
  });
}

export function createCategory(name:string, context:MyContext):Promise<Category> {
  const newCategory:Category = {
    id: uuidv4(),
    name: name,
  };
  const sql = `INSERT INTO category (id,name) VALUES (?,?)`;
  return new Promise((resolve, reject) => {
    context.db.run(sql, [newCategory.id, newCategory.name], (err: any) => {
      if (err) {
        reject(err);
      }
      resolve(newCategory);
    });
  });
}

export function updateCategory(category: Category, context:MyContext):Promise<Category> {
  const sql = `UPDATE category SET name = ? WHERE category.id = ?`;
  return new Promise((resolve, reject) => {
    context.db.run(sql, [category.name, category.id], (err: any) => {
      if (err) {
        reject(err);
      }
      resolve(category);
    });
  });
}

export async function deleteCategory(id: string, context:MyContext):Promise<Category> {
  const category = await getCategoryById(id, context);
  const sqlDelete = `DELETE FROM category WHERE category.id = ?`;
  const sqlUpdate = `UPDATE movie SET category_id = "removedID" WHERE category_id = ?` ;
  return new Promise((resolve, reject) => {
    context.db.run(sqlUpdate, [id]);
    context.db.run(sqlDelete, [id], (err: any) => {
      if (err) {
        reject(err);
      }
      resolve(category);
    });
  });
}

export function checkForCategory(name: string, context:MyContext):Promise<Category> {
  const sql = `SELECT * FROM category WHERE category.name = ?`;
  return new Promise((resolve, reject) => {
    context.db.get(sql, [name], (err: any, row: Category) => {
      if (err) {
        reject(err);
      }
      resolve(row);
    });
  });
}
