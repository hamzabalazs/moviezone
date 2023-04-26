import { ApolloServer } from "apollo-server";
import { resolvers } from "../Schema/Resolvers";
import { typeDefs } from "../Schema/TypeDefs";
import { Database } from "../common/sqlite-async-ts";
import {
  castData,
  categoryData,
  movieCastData,
  movieData,
  reviewData,
  sessionData,
  userData,
} from "./mockedData";

let db: Database;
export async function createServer(req: any) {
  await Database.open(":memory:").then((_db: Database) => {
    db = _db;
    return { db };
  });
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async () => {
      return { db, req };
    },
  });
  await fillDatabase(db);
  return { db, server };
}

export async function fillDatabase(db: Database) {
  await createUserTable(db);
  await createMovieTable(db);
  await createCategoryTable(db);
  await createReviewTable(db);
  await createSessionTable(db);
  await createCastTable(db);
  await createMovieCastTable(db);
  await fillUserTable(db);
  await fillMovieTable(db);
  await fillCategoryTable(db);
  await fillReviewTable(db);
  await fillSessionTable(db);
  await fillCastTable(db);
  await fillMovieCastTable(db);
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
}
async function createCategoryTable(db: Database) {
  const sql = `CREATE TABLE category (
    id text PRIMARY KEY,
    name text
  )`;
await db.run(sql);
}
async function createReviewTable(db: Database) {
  const sql = `CREATE TABLE review (
    id text PRIMARY KEY,
    rating text,
    description text,
    movie_id text,
    user_id text,
    timestamp text,
    FOREIGN KEY(movie_id) REFERENCES movie(id)
    FOREIGN KEY(user_id) REFERENCES user(id)
  )`;
await db.run(sql);
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
}
async function createCastTable(db: Database) {
  const sql = `CREATE TABLE "cast" (
    "id"	text PRIMARY KEY,
    "name" text,
    "photo" blob,
    "description" text
  )`;
  await db.run(sql);
}
async function createMovieCastTable(db: Database) {
  const sql = `CREATE TABLE "movie_cast" (
    "movie_id" text,
    "cast_id" text,
    FOREIGN KEY(movie_id) REFERENCES movie(id)
    FOREIGN KEY(cast_id) REFERENCES cast(id)
    
  )`;
  await db.run(sql);
}
async function fillUserTable(db: Database) {
  const sql = `INSERT INTO user (id,first_name,last_name,email,password,role) VALUES 
  ("${userData[0].id}","${userData[0].first_name}","${userData[0].last_name}","${userData[0].email}","${userData[0].password}","${userData[0].role}"),
  ("${userData[1].id}","${userData[1].first_name}","${userData[1].last_name}","${userData[1].email}","${userData[1].password}","${userData[1].role}"),
  ("${userData[2].id}","${userData[2].first_name}","${userData[2].last_name}","${userData[2].email}","${userData[2].password}","${userData[2].role}"),
  ("${userData[3].id}","${userData[3].first_name}","${userData[3].last_name}","${userData[3].email}","${userData[3].password}","${userData[3].role}"),
  ("${userData[4].id}","${userData[4].first_name}","${userData[4].last_name}","${userData[4].email}","${userData[4].password}","${userData[4].role}")`;
  await db.run(sql);
}
async function fillMovieTable(db: Database) {
  const sql = `INSERT INTO movie (id,title,description,poster,release_date,category_id) VALUES
  ("${movieData[0].id}","${movieData[0].title}","${movieData[0].description}","${movieData[0].poster}","${movieData[0].release_date}","${movieData[0].category_id}"),
  ("${movieData[1].id}","${movieData[1].title}","${movieData[1].description}","${movieData[1].poster}","${movieData[1].release_date}","${movieData[1].category_id}"),
  ("${movieData[2].id}","${movieData[2].title}","${movieData[2].description}","${movieData[2].poster}","${movieData[2].release_date}","${movieData[2].category_id}"),
  ("${movieData[3].id}","${movieData[3].title}","${movieData[3].description}","${movieData[3].poster}","${movieData[3].release_date}","${movieData[3].category_id}"),
  ("${movieData[4].id}","${movieData[4].title}","${movieData[4].description}","${movieData[4].poster}","${movieData[4].release_date}","${movieData[4].category_id}"),
  ("${movieData[5].id}","${movieData[5].title}","${movieData[5].description}","${movieData[5].poster}","${movieData[5].release_date}","${movieData[5].category_id}")`;
  await db.run(sql);
}
async function fillCategoryTable(db: Database) {
  const sql = `INSERT INTO category (id,name) VALUES
  ("${categoryData[0].id}","${categoryData[0].name}"),
  ("${categoryData[1].id}","${categoryData[1].name}"),
  ("${categoryData[2].id}","${categoryData[2].name}")`;
  await db.run(sql);
}
async function fillReviewTable(db: Database) {
  const sql = `INSERT INTO review (id,rating,description,movie_id,user_id,timestamp) VALUES
  ("${reviewData[0].id}","${reviewData[0].rating}","${reviewData[0].description}","${reviewData[0].movie.id}","${reviewData[0].user.id}","${reviewData[0].timestamp}"),
  ("${reviewData[1].id}","${reviewData[1].rating}","${reviewData[1].description}","${reviewData[1].movie.id}","${reviewData[1].user.id}","${reviewData[1].timestamp}"),
  ("${reviewData[2].id}","${reviewData[2].rating}","${reviewData[2].description}","${reviewData[2].movie.id}","${reviewData[2].user.id}","${reviewData[2].timestamp}"),
  ("${reviewData[3].id}","${reviewData[3].rating}","${reviewData[3].description}","${reviewData[3].movie.id}","${reviewData[3].user.id}","${reviewData[3].timestamp}"),
  ("${reviewData[4].id}","${reviewData[4].rating}","${reviewData[4].description}","${reviewData[4].movie.id}","${reviewData[4].user.id}","${reviewData[4].timestamp}"),
  ("${reviewData[5].id}","${reviewData[5].rating}","${reviewData[5].description}","${reviewData[5].movie.id}","${reviewData[5].user.id}","${reviewData[5].timestamp}"),
  ("${reviewData[6].id}","${reviewData[6].rating}","${reviewData[6].description}","${reviewData[6].movie.id}","${reviewData[6].user.id}","${reviewData[6].timestamp}")`;
  await db.run(sql);
}
async function fillSessionTable(db: Database) {
  const sql = `INSERT INTO session (id,token,user_id,expiry) VALUES
  ("${sessionData[0].id}","${sessionData[0].token}","${sessionData[0].user_id}","${sessionData[0].expiry}"),
  ("${sessionData[1].id}","${sessionData[1].token}","${sessionData[1].user_id}","${sessionData[1].expiry}"),
  ("${sessionData[2].id}","${sessionData[2].token}","${sessionData[2].user_id}","${sessionData[2].expiry}"),
  ("${sessionData[3].id}","${sessionData[3].token}","${sessionData[3].user_id}","${sessionData[3].expiry}"),
  ("${sessionData[4].id}","${sessionData[4].token}","${sessionData[4].user_id}","${sessionData[4].expiry}")`;
  await db.run(sql);
}
async function fillCastTable(db: Database) {
  const sql = `INSERT INTO cast (id,name,photo,description) VALUES
  ("${castData[0].id}","${castData[0].name}","${castData[0].photo}","${castData[0].description}"),
  ("${castData[1].id}","${castData[1].name}","${castData[1].photo}","${castData[1].description}"),
  ("${castData[2].id}","${castData[2].name}","${castData[2].photo}","${castData[2].description}"),
  ("${castData[3].id}","${castData[3].name}","${castData[3].photo}","${castData[3].description}"),
  ("${castData[4].id}","${castData[4].name}","${castData[4].photo}","${castData[4].description}")`;
  await db.run(sql);
}
async function fillMovieCastTable(db: Database) {
  const sql = `INSERT INTO movie_cast(movie_id,cast_id) VALUES
  ("${movieCastData[0].movie_id}","${movieCastData[0].cast_id}"),
  ("${movieCastData[1].movie_id}","${movieCastData[1].cast_id}"),
  ("${movieCastData[2].movie_id}","${movieCastData[2].cast_id}")`
  await db.run(sql)
}
