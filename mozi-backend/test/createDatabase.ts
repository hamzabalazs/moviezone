import { Database } from "sqlite3";
const sqlite3 = require("sqlite3").verbose();
const expressGraphQL = require("express-graphql").graphqlHTTP;

export function createDatabase() {
  const db: Database = new sqlite3.Database(
    ":memory:",
    (err: { message: any }) => {
      if (err) {
        return console.error(err.message);
      }
    }
  );

  return db;
}
export async function fillDatabase(db: Database) {
  await createUserTable(db);
  await createMovieTable(db);
  await createCategoryTable(db);
  await createReviewTable(db);
  await createSessionTable(db);
  await fillUserTable(db);
  await fillMovieTable(db);
  await fillCategoryTable(db);
  await fillReviewTable(db);
  await fillSessionTable(db);
}
async function createUserTable(db: Database) {
  const sql = `CREATE TABLE user (
        id text PRIMARY KEY,
        first_name text,
        last_name text,
        role text,
        email text UNIQUE, 
        password text, 
        CONSTRAINT email_unique UNIQUE (email)
        )`;
  return new Promise((resolve, reject) => {
    db.run(sql, (err: any, rows: any) => {
      if (err) {
        reject(err);
      }
      resolve(rows);
    });
  });
}
async function createMovieTable(db: Database) {
  const sql = `CREATE TABLE movie (
        id text PRIMARY KEY,
        title text,
        description text,
        poster blob,
        release_date text,
        category_id text,
        FOREIGN KEY(category_id) REFERENCES category(id)
      )`;
  return new Promise((resolve, reject) => {
    db.run(sql, (err: any, rows: any) => {
      if (err) {
        reject(err);
      }
      resolve(rows);
    });
  });
}
async function createCategoryTable(db: Database) {
  const sql = `CREATE TABLE category (
        id text PRIMARY KEY,
        name text
      )`;
  return new Promise((resolve, reject) => {
    db.run(sql, (err: any, rows: any) => {
      if (err) {
        reject(err);
      }
      resolve(rows);
    });
  });
}
async function createReviewTable(db: Database) {
  const sql = `CREATE TABLE review (
        id text PRIMARY KEY,
        rating text,
        description text,
        movie_id text,
        user_id text,
        FOREIGN KEY(movie_id) REFERENCES movie(id)
        FOREIGN KEY(user_id) REFERENCES user(id)
      )`;

  return new Promise((resolve, reject) => {
    db.run(sql, (err: any, rows: any) => {
      if (err) {
        reject(err);
      }
      resolve(rows);
    });
  });
}
async function createSessionTable(db: Database) {
  const sql = `CREATE TABLE session (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        token text UNIQUE,
        user_id text,
        CONSTRAINT token_unique UNIQUE (token)
        FOREIGN KEY(user_id) REFERENCES user(id)
        )`;
  return new Promise((resolve, reject) => {
    db.run(sql, (err: any, rows: any) => {
      if (err) {
        reject(err);
      }
      resolve(rows);
    });
  });
}
async function fillUserTable(db: Database) {
  const sql = `INSERT INTO user (id,first_name,last_name,email,password,role) VALUES 
  ("idU1","Test","User1","testuser1@gmail.com","testtest1","viewer"),
  ("idU2","Test","User2","testuser2@gmail.com","testtest2","editor"),
  ("idU3","Test","User3","testuser3@gmail.com","testtest3","admin"),
  ("idU4","Test","User4","testuser4@gmail.com","testtest4","viewer")`;

  return new Promise((resolve, reject) => {
    db.run(sql, (err: any, rows: any) => {
      if (err) {
        reject(err);
      }
      resolve(rows);
    });
  });
}
async function fillMovieTable(db: Database) {
  const sql = `INSERT INTO movie (id,title,description,poster,release_date,category_id) VALUES
  ("idM1","title1","description1","poster1","20/12/2020","idC2"),
  ("idM2","title2","description2","poster2","30/06/2015","idC1"),
  ("idM3","title3","description3","poster3","25/09/2000","idC1"),
  ("idM4","title4","description4","poster4","02/01/2001","idC2"),
  ("idM5","title5","description5","poster5","01/11/1998","idC3"),
  ("idM6","title6","description6","poster6","11/03/2003","idC1")`;
  return new Promise((resolve, reject) => {
    db.run(sql, (err: any, rows: any) => {
      if (err) {
        reject(err);
      }
      resolve(rows);
    });
  });
}
async function fillCategoryTable(db: Database) {
  const sql = `INSERT INTO category (id,name) VALUES
  ("idC1","name1"),
  ("idC2","name2"),
  ("idC3","name3")`;

  return new Promise((resolve, reject) => {
    db.run(sql, (err: any, rows: any) => {
      if (err) {
        reject(err);
      }
      resolve(rows);
    });
  });
}
async function fillReviewTable(db: Database) {
  const sql = `INSERT INTO review (id,rating,description,movie_id,user_id) VALUES
  ("idR1","5","Looked good","idM1","idU1"),
  ("idR2","3","Was alright","idM3","idU1"),
  ("idR3","1","Didnt like","idM2","idU2"),
  ("idR4","5","Best","idM1","idU2"),
  ("idR5","4","I mean its alright","idM4","idU2"),
  ("idR6","4","IT WAS PERFECT","idM3","idU4"),
  ("idR7","1","badbad","idM2","idU1")`;

  return new Promise((resolve, reject) => {
    db.run(sql, (err: any, rows: any) => {
      if (err) {
        reject(err);
      }
      resolve(rows);
    });
  });
}
async function fillSessionTable(db: Database) {
  const sql = `INSERT INTO session (id,token,user_id) VALUES
  (1,"viewertoken1234","idU1"),
  (2,"editortoken4321","idU2"),
  (3,"admintoken1423","idU3"),
  (4,"tokenviewer4321","idU4")`;

  return new Promise((resolve, reject) => {
    db.run(sql, (err: any, rows: any) => {
      if (err) {
        reject(err);
      }
      resolve(rows);
    });
  });
}
