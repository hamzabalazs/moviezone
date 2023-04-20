import { ApolloServer } from "apollo-server";
import { resolvers } from "../Schema/Resolvers";
import { typeDefs } from "../Schema/TypeDefs";
import {
  castData,
  categoryData,
  movieCastData,
  movieData,
  reviewData,
  sessionData,
  userData,
} from "./mockedData";
const mysql = require('mysql2')

export async function createServer(req:any) {
  const db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:"jelszo1234",
    database:"moviezonetest"
  })
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async () => {
      return { db, req };
    },
  });
  fillDatabase(db)
  // await server.start();
  return {db,server}
}

export function fillDatabase(db: any) {
  createDatabase(db);
  createUserTable(db);
  createMovieTable(db);
  createCategoryTable(db);
  createReviewTable(db);
  createSessionTable(db);
  createCastTable(db);
  createMovieCastTable(db);
  fillUserTable(db);
  fillMovieTable(db);
  fillCategoryTable(db);
  fillReviewTable(db);
  fillSessionTable(db);
  fillCastTable(db);
  fillMovieCastTable(db);
}

function createDatabase(db:any){
  const sql = 'CREATE DATABASE IF NOT EXISTS moviezonetest;'
  db.query(sql)
}

export function emptyDatabase(db:any){
  dropTables(db);
}

function dropTables(db:any){
  const sql = 'DROP TABLE category,session,review,movie,user,cast,movie_cast'
  db.query(sql)
}
async function createUserTable(db: any) {
  const sql = 'CREATE TABLE IF NOT EXISTS `user` (`id` varchar(255) NOT NULL,`first_name` varchar(255) DEFAULT NULL,`last_name` varchar(255) DEFAULT NULL,`role` varchar(255) DEFAULT NULL,`email` varchar(255) DEFAULT NULL,`password` varchar(255) DEFAULT NULL,PRIMARY KEY (`id`),UNIQUE KEY `email` (`email`),UNIQUE KEY `email_unique` (`email`)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ENGINE=MEMORY;'
  db.query(sql);
}
async function createMovieTable(db: any) {
  const sql = 'CREATE TABLE IF NOT EXISTS `movie` (`id` varchar(255) NOT NULL,`title` varchar(255) DEFAULT NULL,`description` varchar(255),`poster` varchar(255),`release_date` varchar(255) DEFAULT NULL,`category_id` varchar(255) DEFAULT NULL,PRIMARY KEY (`id`),KEY `category_id` (`category_id`),CONSTRAINT `movie_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ENGINE=MEMORY;';
  db.query(sql);
}
async function createCategoryTable(db: any) {
  const sql = "CREATE TABLE IF NOT EXISTS `category` (`id` varchar(255) NOT NULL,`name` varchar(255) DEFAULT NULL,PRIMARY KEY (`id`)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ENGINE=MEMORY;";
  db.query(sql);
}
async function createReviewTable(db: any) {
  const sql = "CREATE TABLE IF NOT EXISTS `review` (`id` varchar(255) NOT NULL,`rating` varchar(255) DEFAULT NULL,`description` varchar(255) DEFAULT NULL,`user_id` varchar(255) DEFAULT NULL,`movie_id` varchar(255) DEFAULT NULL,`timestamp` varchar(255) DEFAULT NULL,PRIMARY KEY (`id`),KEY `user_id` (`user_id`),KEY `movie_id` (`movie_id`),CONSTRAINT `review_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),CONSTRAINT `review_ibfk_2` FOREIGN KEY (`movie_id`) REFERENCES `movie` (`id`)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ENGINE=MEMORY;";
  db.query(sql);
}
async function createSessionTable(db: any) {
  const sql = "CREATE TABLE IF NOT EXISTS `session` (`id` int NOT NULL AUTO_INCREMENT,`token` varchar(255) DEFAULT NULL,`user_id` varchar(255) DEFAULT NULL,`expiry` varchar(255) DEFAULT NULL,PRIMARY KEY (`id`),UNIQUE KEY `token` (`token`),UNIQUE KEY `token_unique` (`token`),KEY `user_id` (`user_id`),CONSTRAINT `session_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)) ENGINE=InnoDB AUTO_INCREMENT=299 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ENGINE=MEMORY;";
  db.query(sql);
}
async function createCastTable(db:any){
  const sql = "CREATE TABLE IF NOT EXISTS `cast` (`id` varchar(255) NOT NULL,`name` varchar(255) DEFAULT NULL,`photo` varchar(255),`description` varchar(255),PRIMARY KEY (`id`)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ENGINE=MEMORY;"
  db.query(sql);
}
async function createMovieCastTable(db:any){
  const sql = "CREATE TABLE IF NOT EXISTS `movie_cast` (`movie_id` varchar(255) NOT NULL,`cast_id` varchar(255) NOT NULL,PRIMARY KEY (`movie_id`,`cast_id`),KEY `cast_id` (`cast_id`),CONSTRAINT `movie_cast_ibfk_1` FOREIGN KEY (`cast_id`) REFERENCES `cast` (`id`),CONSTRAINT `movie_cast_ibfk_2` FOREIGN KEY (`movie_id`) REFERENCES `movie` (`id`)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ENGINE=MEMORY;"
  db.query(sql)
}
async function fillUserTable(db: any) {
  const sql = `INSERT INTO user (id,first_name,last_name,email,password,role)
  SELECT * FROM (SELECT "${userData[0].id}","${userData[0].first_name}","${userData[0].last_name}","${userData[0].email}","${userData[0].password}","${userData[0].role}"
  UNION ALL
  SELECT "${userData[1].id}","${userData[1].first_name}","${userData[1].last_name}","${userData[1].email}","${userData[1].password}","${userData[1].role}"
  UNION ALL
  SELECT "${userData[2].id}","${userData[2].first_name}","${userData[2].last_name}","${userData[2].email}","${userData[2].password}","${userData[2].role}"
  UNION ALL
  SELECT "${userData[3].id}","${userData[3].first_name}","${userData[3].last_name}","${userData[3].email}","${userData[3].password}","${userData[3].role}"
  UNION ALL
  SELECT "${userData[4].id}","${userData[4].first_name}","${userData[4].last_name}","${userData[4].email}","${userData[4].password}","${userData[4].role}") AS data
  WHERE NOT EXISTS (SELECT * FROM user)`
  db.query(sql);

}
async function fillMovieTable(db: any) {
  const sql = `INSERT INTO movie (id,title,description,poster,release_date,category_id)
  SELECT * FROM (SELECT "${movieData[0].id}","${movieData[0].title}","${movieData[0].description}","${movieData[0].poster}","${movieData[0].release_date}","${movieData[0].category_id}"
  UNION ALL
  SELECT "${movieData[1].id}","${movieData[1].title}","${movieData[1].description}","${movieData[1].poster}","${movieData[1].release_date}","${movieData[1].category_id}"
  UNION ALL
  SELECT "${movieData[2].id}","${movieData[2].title}","${movieData[2].description}","${movieData[2].poster}","${movieData[2].release_date}","${movieData[2].category_id}"
  UNION ALL
  SELECT "${movieData[3].id}","${movieData[3].title}","${movieData[3].description}","${movieData[3].poster}","${movieData[3].release_date}","${movieData[3].category_id}"
  UNION ALL
  SELECT "${movieData[4].id}","${movieData[4].title}","${movieData[4].description}","${movieData[4].poster}","${movieData[4].release_date}","${movieData[4].category_id}"
  UNION ALL
  SELECT "${movieData[5].id}","${movieData[5].title}","${movieData[5].description}","${movieData[5].poster}","${movieData[5].release_date}","${movieData[5].category_id}") AS data
  WHERE NOT EXISTS (SELECT * FROM movie)`
  db.query(sql);
}
async function fillCategoryTable(db: any) {
  const sql = `INSERT INTO category (id,name)
  SELECT * FROM (SELECT "${categoryData[0].id}","${categoryData[0].name}"
  UNION ALL
  SELECT "${categoryData[1].id}","${categoryData[1].name}"
  UNION ALL
  SELECT "${categoryData[2].id}","${categoryData[2].name}") AS data
  WHERE NOT EXISTS (SELECT * FROM category)`
  db.query(sql);
}
async function fillReviewTable(db: any) {
  const sql = `INSERT INTO review (id,rating,description,movie_id,user_id,timestamp)
  SELECT * FROM(SELECT "${reviewData[0].id}","${reviewData[0].rating}","${reviewData[0].description}","${reviewData[0].movie_id}","${reviewData[0].user_id}","${reviewData[0].timestamp}"
  UNION ALL
  SELECT "${reviewData[1].id}","${reviewData[1].rating}","${reviewData[1].description}","${reviewData[1].movie_id}","${reviewData[1].user_id}","${reviewData[1].timestamp}"
  UNION ALL
  SELECT "${reviewData[2].id}","${reviewData[2].rating}","${reviewData[2].description}","${reviewData[2].movie_id}","${reviewData[2].user_id}","${reviewData[2].timestamp}"
  UNION ALL
  SELECT "${reviewData[3].id}","${reviewData[3].rating}","${reviewData[3].description}","${reviewData[3].movie_id}","${reviewData[3].user_id}","${reviewData[3].timestamp}"
  UNION ALL
  SELECT "${reviewData[4].id}","${reviewData[4].rating}","${reviewData[4].description}","${reviewData[4].movie_id}","${reviewData[4].user_id}","${reviewData[4].timestamp}"
  UNION ALL
  SELECT "${reviewData[5].id}","${reviewData[5].rating}","${reviewData[5].description}","${reviewData[5].movie_id}","${reviewData[5].user_id}","${reviewData[5].timestamp}"
  UNION ALL
  SELECT "${reviewData[6].id}","${reviewData[6].rating}","${reviewData[6].description}","${reviewData[6].movie_id}","${reviewData[6].user_id}","${reviewData[6].timestamp}") AS data
  WHERE NOT EXISTS (SELECT * FROM review)`
  db.query(sql);
}
async function fillSessionTable(db: any) {
  const sql = `INSERT INTO session (id,token,user_id,expiry)
  SELECT * FROM(SELECT "${sessionData[0].id}","${sessionData[0].token}","${sessionData[0].user_id}","${sessionData[0].expiry}"
  UNION ALL
  SELECT "${sessionData[1].id}","${sessionData[1].token}","${sessionData[1].user_id}","${sessionData[1].expiry}"
  UNION ALL
  SELECT "${sessionData[2].id}","${sessionData[2].token}","${sessionData[2].user_id}","${sessionData[2].expiry}"
  UNION ALL
  SELECT "${sessionData[3].id}","${sessionData[3].token}","${sessionData[3].user_id}","${sessionData[3].expiry}"
  UNION ALL
  SELECT "${sessionData[4].id}","${sessionData[4].token}","${sessionData[4].user_id}","${sessionData[4].expiry}") AS data
  WHERE NOT EXISTS (SELECT * FROM session)`
  db.query(sql);
}
async function fillCastTable(db:any){
  const sql = `INSERT INTO \`cast\` (id,name,photo,description) 
  SELECT * FROM(SELECT "${castData[0].id}","${castData[0].name}","${castData[0].photo}","${castData[0].description}"
  UNION ALL 
  SELECT "${castData[1].id}","${castData[1].name}","${castData[1].photo}","${castData[1].description}" 
  UNION ALL 
  SELECT "${castData[2].id}","${castData[2].name}","${castData[2].photo}","${castData[2].description}" 
  UNION ALL 
  SELECT "${castData[3].id}","${castData[3].name}","${castData[3].photo}","${castData[3].description}" 
  UNION ALL 
  SELECT "${castData[4].id}","${castData[4].name}","${castData[4].photo}","${castData[4].description}") AS data 
  WHERE NOT EXISTS (SELECT * FROM cast)`
  db.query(sql)
}
async function fillMovieCastTable(db:any){
  const sql = `INSERT INTO movie_cast (movie_id,cast_id)
  SELECT * FROM(SELECT "${movieCastData[0].movie_id}","${movieCastData[0].cast_id}"
  UNION ALL
  SELECT "${movieCastData[1].movie_id}","${movieCastData[1].cast_id}"
  UNION ALL
  SELECT "${movieCastData[2].movie_id}","${movieCastData[2].cast_id}") AS data
  WHERE NOT EXISTS (SELECT * FROM movie_cast)`
  db.query(sql)
}
