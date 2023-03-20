import { typeDefs } from "../Schema/TypeDefs";
import { resolvers } from "../Schema/Resolvers";
import { createServer, fillDatabase } from "../test/createDatabase";
import { ApolloServer } from "apollo-server";
import { LOGIN } from "../test/Query_Auth";
import { existingTestUser, newTestUser } from "./auth.mocks";
import { NO_USER_MESSAGE } from "../common/errorMessages";
import { Database } from "../common/sqlite-async-ts";

let db:Database
let req = {
  headers: {
    "auth-token": "",
  },
};
let server:ApolloServer

test("Should not login, if user does not exist", async () => {
  await Database.open(":memory:").then((_db:Database) => {
    db = _db
  })
  server = new ApolloServer({
    typeDefs,
    resolvers,
    context:async() => {
      return {db,req}
    }
  })
  await fillDatabase(db)
  const result = await server.executeOperation({
    query: LOGIN,
    variables: {
      input: {
        email: newTestUser.email,
        password: newTestUser.password,
      },
    },
  });
  expect(result.errors?.[0]?.message).toEqual(NO_USER_MESSAGE);
  expect(result.data?.logIn).toBeUndefined();
});
test("Should login, if user exists and login details match",async() => {
    const result = await server.executeOperation({
        query: LOGIN,
        variables: {
          input: {
            email: existingTestUser.email,
            password: existingTestUser.password,
          },
        },
      });
      expect(result.errors).toBeUndefined();
      expect(result.data?.logIn.email).toEqual(existingTestUser.email);
})
