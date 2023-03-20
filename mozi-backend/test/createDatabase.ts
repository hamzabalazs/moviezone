import { ApolloServer } from "apollo-server";
import { Database } from "../common/sqlite-async-ts";
import { resolvers } from "../Schema/Resolvers";
import { typeDefs } from "../Schema/TypeDefs";
import {
  categoryData,
  movieData,
  reviewData,
  sessionData,
  userData,
} from "./mockedData";
const sqlite3 = require("sqlite3").verbose();

export async function createServer() {
  let db: Database;
  Database.open(":memory").then((_db: Database) => {
    db = _db;
    return {server,db}
  });

  let req = {
    headers: {
      "auth-token": "",
    },
  };
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async () => {
      return { db, req };
    },
  });
}

export function createDatabase() {
  const db = new sqlite3.Database(":memory:", (err: { message: any }) => {
    if (err) {
      return console.error(err.message);
    }
  });

  return db;
}
// export function createDatabase() {
//   Database.open(":memory:").then((_db:Database) => {
//     const db:Database = _db
//     return db;
//   })
//   return new Database()
// }

export async function fillDatabase(db: Database) {
  await createUserTable(db);
  await createMovieTable(db);
  await createCategoryTable(db);
  await createReviewTable(db);
  await createSessionTable(db);
  fillUserTable(db);
  fillMovieTable(db);
  fillCategoryTable(db);
  fillReviewTable(db);
  fillSessionTable(db);
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
        await db.run(sql);
  // return new Promise((resolve, reject) => {
  //   db.run(sql, (err: any, rows: any) => {
  //     if (err) {
  //       reject(err);
  //     }
  //     resolve(rows);
  //   });
  // });
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
      await db.run(sql);
  // return new Promise((resolve, reject) => {
  //   db.run(sql, (err: any, rows: any) => {
  //     if (err) {
  //       reject(err);
  //     }
  //     resolve(rows);
  //   });
  // });
}
async function createCategoryTable(db: Database) {
  const sql = `CREATE TABLE category (
        id text PRIMARY KEY,
        name text
      )`;
      await db.run(sql);
  // return new Promise((resolve, reject) => {
  //   db.run(sql, (err: any, rows: any) => {
  //     if (err) {
  //       reject(err);
  //     }
  //     resolve(rows);
  //   });
  // });
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
      await  db.run(sql);
  // return new Promise((resolve, reject) => {
  //   db.run(sql, (err: any, rows: any) => {
  //     if (err) {
  //       reject(err);
  //     }
  //     resolve(rows);
  //   });
  // });
}
async function createSessionTable(db: Database) {
  const sql = `CREATE TABLE "session" (
    "id"	INTEGER,
    "token"	text UNIQUE,
    "user_id"	text,
    "expiry"	TEXT,
    CONSTRAINT "token_unique" UNIQUE("token"),
    FOREIGN KEY("user_id") REFERENCES "user"("id"),
    PRIMARY KEY("id" AUTOINCREMENT)
  )`;
  await db.run(sql);
  // return new Promise((resolve, reject) => {
  //   db.run(sql, (err: any, rows: any) => {
  //     if (err) {
  //       reject(err);
  //     }
  //     resolve(rows);
  //   });
  // });
}
async function fillUserTable(db: Database) {
  const sql = `INSERT INTO user (id,first_name,last_name,email,password,role) VALUES 
  ("${userData[0].id}","${userData[0].first_name}","${userData[0].last_name}","${userData[0].email}","${userData[0].password}","${userData[0].role}"),
  ("${userData[1].id}","${userData[1].first_name}","${userData[1].last_name}","${userData[1].email}","${userData[1].password}","${userData[1].role}"),
  ("${userData[2].id}","${userData[2].first_name}","${userData[2].last_name}","${userData[2].email}","${userData[2].password}","${userData[2].role}"),
  ("${userData[3].id}","${userData[3].first_name}","${userData[3].last_name}","${userData[3].email}","${userData[3].password}","${userData[3].role}"),
  ("${userData[4].id}","${userData[4].first_name}","${userData[4].last_name}","${userData[4].email}","${userData[4].password}","${userData[4].role}")`;
  db.run(sql);
  // return new Promise((resolve, reject) => {
  //   db.run(sql, (err: any, rows: any) => {
  //     if (err) {
  //       reject(err);
  //     }
  //     resolve(rows);
  //   });
  // });
}
async function fillMovieTable(db: Database) {
  const sql = `INSERT INTO movie (id,title,description,poster,release_date,category_id) VALUES
  ("${movieData[0].id}","${movieData[0].title}","${movieData[0].description}","${movieData[0].poster}","${movieData[0].release_date}","${movieData[0].category_id}"),
  ("${movieData[1].id}","${movieData[1].title}","${movieData[1].description}","${movieData[1].poster}","${movieData[1].release_date}","${movieData[1].category_id}"),
  ("${movieData[2].id}","${movieData[2].title}","${movieData[2].description}","${movieData[2].poster}","${movieData[2].release_date}","${movieData[2].category_id}"),
  ("${movieData[3].id}","${movieData[3].title}","${movieData[3].description}","${movieData[3].poster}","${movieData[3].release_date}","${movieData[3].category_id}"),
  ("${movieData[4].id}","${movieData[4].title}","${movieData[4].description}","${movieData[4].poster}","${movieData[4].release_date}","${movieData[4].category_id}"),
  ("${movieData[5].id}","${movieData[5].title}","${movieData[5].description}","${movieData[5].poster}","${movieData[5].release_date}","${movieData[5].category_id}")`;
  db.run(sql);
  // return new Promise((resolve, reject) => {
  //   db.run(sql, (err: any, rows: any) => {
  //     if (err) {
  //       reject(err);
  //     }
  //     resolve(rows);
  //   });
  // });
}
async function fillCategoryTable(db: Database) {
  const sql = `INSERT INTO category (id,name) VALUES
  ("${categoryData[0].id}","${categoryData[0].name}"),
  ("${categoryData[1].id}","${categoryData[1].name}"),
  ("${categoryData[2].id}","${categoryData[2].name}")`;
  db.run(sql);
  // return new Promise((resolve, reject) => {
  //   db.run(sql, (err: any, rows: any) => {
  //     if (err) {
  //       reject(err);
  //     }
  //     resolve(rows);
  //   });
  // });
}
async function fillReviewTable(db: Database) {
  const sql = `INSERT INTO review (id,rating,description,movie_id,user_id) VALUES
  ("${reviewData[0].id}","${reviewData[0].rating}","${reviewData[0].description}","${reviewData[0].movie_id}","${reviewData[0].user_id}"),
  ("${reviewData[1].id}","${reviewData[1].rating}","${reviewData[1].description}","${reviewData[1].movie_id}","${reviewData[1].user_id}"),
  ("${reviewData[2].id}","${reviewData[2].rating}","${reviewData[2].description}","${reviewData[2].movie_id}","${reviewData[2].user_id}"),
  ("${reviewData[3].id}","${reviewData[3].rating}","${reviewData[3].description}","${reviewData[3].movie_id}","${reviewData[3].user_id}"),
  ("${reviewData[4].id}","${reviewData[4].rating}","${reviewData[4].description}","${reviewData[4].movie_id}","${reviewData[4].user_id}"),
  ("${reviewData[5].id}","${reviewData[5].rating}","${reviewData[5].description}","${reviewData[5].movie_id}","${reviewData[5].user_id}"),
  ("${reviewData[6].id}","${reviewData[6].rating}","${reviewData[6].description}","${reviewData[6].movie_id}","${reviewData[6].user_id}")`;
  db.run(sql);
  // return new Promise((resolve, reject) => {
  //   db.run(sql, (err: any, rows: any) => {
  //     if (err) {
  //       reject(err);
  //     }
  //     resolve(rows);
  //   });
  // });
}
async function fillSessionTable(db: Database) {
  const sql = `INSERT INTO session (id,token,user_id,expiry) VALUES
  ("${sessionData[0].id}","${sessionData[0].token}","${sessionData[0].user_id}","${sessionData[0].expiry}"),
  ("${sessionData[1].id}","${sessionData[1].token}","${sessionData[1].user_id}","${sessionData[1].expiry}"),
  ("${sessionData[2].id}","${sessionData[2].token}","${sessionData[2].user_id}","${sessionData[2].expiry}"),
  ("${sessionData[3].id}","${sessionData[3].token}","${sessionData[3].user_id}","${sessionData[3].expiry}"),
  ("${sessionData[4].id}","${sessionData[4].token}","${sessionData[4].user_id}","${sessionData[4].expiry}")`;
  db.run(sql);
  // return new Promise((resolve, reject) => {
  //   db.run(sql, (err: any, rows: any) => {
  //     if (err) {
  //       reject(err);
  //     }
  //     resolve(rows);
  //   });
  // });
}
