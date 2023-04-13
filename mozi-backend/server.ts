import { ApolloServer } from "apollo-server-express";
import {Database} from './common/sqlite-async-ts'
import { typeDefs } from "./Schema/TypeDefs";
import { resolvers } from "./Schema/Resolvers";
import express from "express";
import { DocumentNode } from "graphql";
import { CurrentUser } from "./utils/types";
const expressGraphQL = require("express-graphql").graphqlHTTP;

export interface MyContext {
  db: Database;
  req: express.Request;
  user?: CurrentUser;
}

async function startApolloServer(typeDefs: DocumentNode, resolvers: any) {
  let db:Database;
  Database.open('common/db/db.sqlite').then((_db:Database) => {
    db=_db
    console.log("Connected to database!")
  })
  const server = new ApolloServer<MyContext>({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      return { db, req };
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
