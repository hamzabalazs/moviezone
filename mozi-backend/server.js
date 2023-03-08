const { ApolloServer } = require("apollo-server-express");
const sqlite3 = require("sqlite3").verbose();
const { typeDefs } = require("./Schema/TypeDefs");
const { resolvers } = require("./Schema/Resolvers");
const express = require("express");
const expressGraphQL = require("express-graphql").graphqlHTTP;

async function startApolloServer(typeDefs, resolvers) {
  const db = new sqlite3.Database("db.sqlite", (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log("Connected to database!");
  });
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context({req}) {
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
