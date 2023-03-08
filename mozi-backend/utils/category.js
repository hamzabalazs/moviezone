const { v4: uuidv4 } = require("uuid");

function getCategories(_, context) {
    const sql = "SELECT * FROM category";
    return new Promise((resolve, reject) => {
      context.db.all(sql, [], (err, rows) => {
        if (err) {
          reject(err);
        }
        resolve(rows);
      });
    });
  }
  
  function getCategoryById(id, context) {
    const sql = `SELECT * FROM category WHERE category.id = ?`;
    return new Promise((resolve, reject) => {
      context.db.get(sql,[id], (err, rows) => {
        if (err) {
          reject(err);
        }
        resolve(rows);
      });
    });
  }

  function createCategory(category, context) {
    const newCategory = {
        id: uuidv4(),
        name:category.name
    }
    const sql = `INSERT INTO category (id,name) VALUES (?,?)`;
    return new Promise((resolve, reject) => {
      context.db.run(sql,[newCategory.id,newCategory.name], (err, rows) => {
        if (err) {
          reject(err);
        }
        resolve(newCategory);
      });
    });
  }
  
  function updateCategory(category, context) {
    const sql = `UPDATE category SET name = ? WHERE category.id = ?`;
    return new Promise((resolve, reject) => {
      context.db.run(sql,[category.name,category.id], err => {
        if (err) {
          reject(err);
        }
        resolve(category);
      });
    });
  }
  
  function deleteCategory(id, context) {
    const category = Promise.resolve(getCategoryById(id,context))
    const sql = `DELETE FROM category WHERE category.id = ?`;
    return new Promise((resolve, reject) => {
      context.db.run(sql,[id], err => {
        if (err) {
          reject(err);
        }
        resolve(category);
      });
    });
  }

  function checkForCategory(name,context){
    const sql = `SELECT * FROM category WHERE category.name = ?`
    return new Promise((resolve, reject) => {
        context.db.get(sql,[name], (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows);
        });
      });
  }
  

  module.exports = {getCategories,getCategoryById,deleteCategory,updateCategory,createCategory,checkForCategory}