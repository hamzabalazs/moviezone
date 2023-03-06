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
    const sql = `SELECT * FROM category WHERE category.id = "${id}"`;
    return new Promise((resolve, reject) => {
      context.db.get(sql, (err, rows) => {
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
    const sql = `INSERT INTO category (id,name) VALUES ("${newCategory.id}","${newCategory.name}")`;
    return new Promise((resolve, reject) => {
      context.db.run(sql, (err, rows) => {
        if (err) {
          reject(err);
        }
        resolve(newCategory);
      });
    });
  }
  
  function updateCategory(category, context) {
    const sql = `UPDATE category SET name = "${category.name}" WHERE category.id = "${category.id}"`;
    return new Promise((resolve, reject) => {
      context.db.run(sql, (err, rows) => {
        if (err) {
          reject(err);
        }
        resolve(category);
      });
    });
  }
  
  function deleteCategory(id, context) {
    const category = Promise.resolve(getCategoryById(id,context))
    const sql = `DELETE FROM category WHERE category.id = "${id}"`;
    return new Promise((resolve, reject) => {
      context.db.run(sql, (err, rows) => {
        if (err) {
          reject(err);
        }
        resolve(category);
      });
    });
  }

  function checkForCategory(name,context){
    const sql = `SELECT * FROM category WHERE category.name = "${name}"`
    return new Promise((resolve, reject) => {
        context.db.get(sql, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows);
        });
      });
  }
  

  module.exports = {getCategories,getCategoryById,deleteCategory,updateCategory,createCategory,checkForCategory}