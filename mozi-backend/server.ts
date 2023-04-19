import { ApolloServer } from "apollo-server-express";
import { typeDefs } from "./Schema/TypeDefs";
import { resolvers } from "./Schema/Resolvers";
import express from "express";
import { DocumentNode } from "graphql";
import { CurrentUser } from "./utils/types";
const expressGraphQL = require("express-graphql").graphqlHTTP;
const mysql = require('mysql2')
const db = mysql.createPool({
  host:'mysql-service',
  user:'root',
  password:"jelszo1234",
  database:"moviezone"
})

// const db = mysql.createPool({
//   host:'localhost',
//   user:'root',
//   password:"jelszo1234",
//   database:"moviezone"
// })

db.query('SELECT * FROM category',(err:any,res:any) => {
  if(err) console.log(err)
  else console.log(res)
})


export interface MyContext {
  db:any;
  req: express.Request;
  user?: CurrentUser;
}

async function startApolloServer(typeDefs: DocumentNode, resolvers: any) {
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
