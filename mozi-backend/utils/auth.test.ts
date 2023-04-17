import { typeDefs } from "../Schema/TypeDefs";
import { resolvers } from "../Schema/Resolvers";
import { fillDatabase } from "../test/createDatabase";
import { ApolloServer, gql } from "apollo-server";
import { existingTestUser, newTestUser } from "./auth.mocks";
import { NO_USER_MESSAGE } from "../common/errorMessages";
import { Database } from "../common/sqlite-async-ts";
const mysql = require('mysql2')

const LOGIN = gql`
  mutation LogIn($input: LoginInput!) {
    logIn(input: $input) {
      id
      first_name
      last_name
      role
      email
      token
    }
  }
`;

let db:Database
let req = {
  headers: {
    "auth-token": "",
  },
};
let server:ApolloServer

test("Should not login, if user does not exist", async () => {
  const db = mysql.createPool({
    host:'localhost',
    user:'root',
    password:"jelszo1234",
    database:"moviezone_test"
  })
  server = new ApolloServer({
    typeDefs,
    resolvers,
    context:async() => {
      return {db,req}
    }
  })
  fillDatabase(db)
  expect(db).not.toBeUndefined()
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
