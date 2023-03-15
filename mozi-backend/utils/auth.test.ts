import { typeDefs } from "../Schema/TypeDefs";
import { resolvers } from "../Schema/Resolvers";
import { createDatabase, fillDatabase } from "../test/createDatabase";
import { ApolloServer } from "apollo-server";
import { LOGIN } from "../test/Query_Auth";
import { existingTestUser, newTestUser } from "./auth.mocks";
import { NO_USER_MESSAGE } from "../test/mockedData";

const db = createDatabase();
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



test("Should not login, if user does not exist", async () => {
  await fillDatabase(db);
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
  expect(result.data?.logIn).toBeNull();
});
test("Should login, if user exists and login details match",async() => {
  console.log(existingTestUser.email)
  console.log(existingTestUser.password)
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
