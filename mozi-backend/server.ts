import { ApolloServer } from "apollo-server-express";
const sqlite3 = require("sqlite3").verbose();
import {Database} from "sqlite3"
import { typeDefs } from "./Schema/TypeDefs";
import { resolvers } from "./Schema/Resolvers";
import express from "express";
import { DocumentNode } from "graphql";
const expressGraphQL = require("express-graphql").graphqlHTTP;

export interface MyContext{
  db:Database,
  req:express.Request
}

async function startApolloServer(typeDefs:DocumentNode, resolvers:any) {
  const db:Database = new sqlite3.Database("db.sqlite", (err: { message: any; }) => {
    if (err) {
      return console.error(err.message);
    }
    console.log("Connected to database!");
  });
  const server = new ApolloServer<MyContext>({
    typeDefs,
    resolvers,
    context:async({req}) => {
      return { db,req };
    },
  });
  const app = express();
  await server.start();
  server.applyMiddleware({ app });

  app.use(
    "/graphql",
    expressGraphQL({
      graphiql: true,
    })
  );
  app.listen(5000, () => console.log("Server started"));
}

startApolloServer(typeDefs, resolvers);
