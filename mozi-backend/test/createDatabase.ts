import { ApolloServer } from "apollo-server";
import { resolvers } from "../Schema/Resolvers";
import { typeDefs } from "../Schema/TypeDefs";
import {
  categoryData,
  movieData,
  reviewData,
  sessionData,
  userData,
} from "./mockedData";
const mysql = require('mysql2')

export async function createServer() {
  const db = mysql.createPool({
    host:'localhost',
    user:'root',
    password:"jelszo1234",
    database:"moviezone_test"
  })

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

export function fillDatabase(db: any) {
  createUserTable(db);
  createMovieTable(db);
  createCategoryTable(db);
  createReviewTable(db);
  createSessionTable(db);
  fillUserTable(db);
  fillMovieTable(db);
  fillCategoryTable(db);
  fillReviewTable(db);
  fillSessionTable(db);
}
async function createUserTable(db: any) {
  const sql = 'CREATE TABLE "user" ("id" varchar(255) NOT NULL,`first_name` varchar(255) DEFAULT NULL,`last_name` varchar(255) DEFAULT NULL,\n`role` varchar(255) DEFAULT NULL,`email` varchar(255) DEFAULT NULL,`password` varchar(255) DEFAULT NULL,PRIMARY KEY (`id`),UNIQUE KEY `email` (`email`),UNIQUE KEY `email_unique` (`email`)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;'
  db.query(sql);
}
async function createMovieTable(db: any) {
  const sql = 'CREATE TABLE `movie` (`id` varchar(255) NOT NULL,`title` varchar(255) DEFAULT NULL,`description` text,`poster` longtext,`release_date` varchar(255) DEFAULT NULL,`category_id` varchar(255) DEFAULT NULL,PRIMARY KEY (`id`),KEY `category_id` (`category_id`),CONSTRAINT `movie_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;';
  db.run(sql);
}
async function createCategoryTable(db: any) {
  const sql = "CREATE TABLE `category` (`id` varchar(255) NOT NULL,`name` varchar(255) DEFAULT NULL,PRIMARY KEY (`id`)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;";
  db.run(sql);
}
async function createReviewTable(db: any) {
  const sql = "CREATE TABLE `review` (`id` varchar(255) NOT NULL,`rating` varchar(255) DEFAULT NULL,`description` varchar(255) DEFAULT NULL,`user_id` varchar(255) DEFAULT NULL,`movie_id` varchar(255) DEFAULT NULL,`timestamp` varchar(255) DEFAULT NULL,PRIMARY KEY (`id`),KEY `user_id` (`user_id`),KEY `movie_id` (`movie_id`),CONSTRAINT `review_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),CONSTRAINT `review_ibfk_2` FOREIGN KEY (`movie_id`) REFERENCES `movie` (`id`)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;";
  db.run(sql);
}
async function createSessionTable(db: any) {
  const sql = "CREATE TABLE `session` (`id` int NOT NULL AUTO_INCREMENT,`token` varchar(255) DEFAULT NULL,`user_id` varchar(255) DEFAULT NULL,`expiry` varchar(255) DEFAULT NULL,PRIMARY KEY (`id`),UNIQUE KEY `token` (`token`),UNIQUE KEY `token_unique` (`token`),KEY `user_id` (`user_id`),CONSTRAINT `session_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)) ENGINE=InnoDB AUTO_INCREMENT=299 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;";
  db.run(sql);
}
async function fillUserTable(db: any) {
  const sql = `INSERT INTO user (id,first_name,last_name,email,password,role) VALUES 
  ("${userData[0].id}","${userData[0].first_name}","${userData[0].last_name}","${userData[0].email}","${userData[0].password}","${userData[0].role}"),
  ("${userData[1].id}","${userData[1].first_name}","${userData[1].last_name}","${userData[1].email}","${userData[1].password}","${userData[1].role}"),
  ("${userData[2].id}","${userData[2].first_name}","${userData[2].last_name}","${userData[2].email}","${userData[2].password}","${userData[2].role}"),
  ("${userData[3].id}","${userData[3].first_name}","${userData[3].last_name}","${userData[3].email}","${userData[3].password}","${userData[3].role}"),
  ("${userData[4].id}","${userData[4].first_name}","${userData[4].last_name}","${userData[4].email}","${userData[4].password}","${userData[4].role}")`;
  db.query(sql);

}
async function fillMovieTable(db: any) {
  const sql = `INSERT INTO movie (id,title,description,poster,release_date,category_id) VALUES
  ("${movieData[0].id}","${movieData[0].title}","${movieData[0].description}","${movieData[0].poster}","${movieData[0].release_date}","${movieData[0].category_id}"),
  ("${movieData[1].id}","${movieData[1].title}","${movieData[1].description}","${movieData[1].poster}","${movieData[1].release_date}","${movieData[1].category_id}"),
  ("${movieData[2].id}","${movieData[2].title}","${movieData[2].description}","${movieData[2].poster}","${movieData[2].release_date}","${movieData[2].category_id}"),
  ("${movieData[3].id}","${movieData[3].title}","${movieData[3].description}","${movieData[3].poster}","${movieData[3].release_date}","${movieData[3].category_id}"),
  ("${movieData[4].id}","${movieData[4].title}","${movieData[4].description}","${movieData[4].poster}","${movieData[4].release_date}","${movieData[4].category_id}"),
  ("${movieData[5].id}","${movieData[5].title}","${movieData[5].description}","${movieData[5].poster}","${movieData[5].release_date}","${movieData[5].category_id}")`;
  db.query(sql);
}
async function fillCategoryTable(db: any) {
  const sql = `INSERT INTO category (id,name) VALUES
  ("${categoryData[0].id}","${categoryData[0].name}"),
  ("${categoryData[1].id}","${categoryData[1].name}"),
  ("${categoryData[2].id}","${categoryData[2].name}")`;
  db.query(sql);
}
async function fillReviewTable(db: any) {
  const sql = `INSERT INTO review (id,rating,description,movie_id,user_id,timestamp) VALUES
  ("${reviewData[0].id}","${reviewData[0].rating}","${reviewData[0].description}","${reviewData[0].movie_id}","${reviewData[0].user_id}","${reviewData[0].timestamp}"),
  ("${reviewData[1].id}","${reviewData[1].rating}","${reviewData[1].description}","${reviewData[1].movie_id}","${reviewData[1].user_id}","${reviewData[1].timestamp}"),
  ("${reviewData[2].id}","${reviewData[2].rating}","${reviewData[2].description}","${reviewData[2].movie_id}","${reviewData[2].user_id}","${reviewData[2].timestamp}"),
  ("${reviewData[3].id}","${reviewData[3].rating}","${reviewData[3].description}","${reviewData[3].movie_id}","${reviewData[3].user_id}","${reviewData[3].timestamp}"),
  ("${reviewData[4].id}","${reviewData[4].rating}","${reviewData[4].description}","${reviewData[4].movie_id}","${reviewData[4].user_id}","${reviewData[4].timestamp}"),
  ("${reviewData[5].id}","${reviewData[5].rating}","${reviewData[5].description}","${reviewData[5].movie_id}","${reviewData[5].user_id}","${reviewData[5].timestamp}"),
  ("${reviewData[6].id}","${reviewData[6].rating}","${reviewData[6].description}","${reviewData[6].movie_id}","${reviewData[6].user_id}","${reviewData[6].timestamp}")`;
  db.query(sql);
}
async function fillSessionTable(db: any) {
  const sql = `INSERT INTO session (id,token,user_id,expiry) VALUES
  ("${sessionData[0].id}","${sessionData[0].token}","${sessionData[0].user_id}","${sessionData[0].expiry}"),
  ("${sessionData[1].id}","${sessionData[1].token}","${sessionData[1].user_id}","${sessionData[1].expiry}"),
  ("${sessionData[2].id}","${sessionData[2].token}","${sessionData[2].user_id}","${sessionData[2].expiry}"),
  ("${sessionData[3].id}","${sessionData[3].token}","${sessionData[3].user_id}","${sessionData[3].expiry}"),
  ("${sessionData[4].id}","${sessionData[4].token}","${sessionData[4].user_id}","${sessionData[4].expiry}")`;
  db.query(sql);
}
